import { FileDown, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { downloadTextFile } from "../../../lib/download-file";
import { SERVICE_RATIOS } from "../../../shared/constants/ratios";
import type { PersonalInfo, ServiceDurationWithError, ServiceRow } from "../../../shared/types/service";
import { calculateDateDifference, denormalizeFromDays, normalizeToDays } from "../model/service-utils";

const DurationBlock = ({ duration }: { duration: ServiceDurationWithError | null }) => {
  if (!duration) return <span className="text-slate-300">-</span>;
  if (duration.error) return <span className="text-xs text-red-500">{duration.error}</span>;

  return (
    <span className="font-medium text-slate-700">
      {duration.y} р / {duration.m} м / {duration.d} д
    </span>
  );
};

export const ServiceCalculator = () => {
  const { i18n, t } = useTranslation();
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({ name: "", rank: "", dob: "" });
  const [rows, setRows] = useState<ServiceRow[]>([{ id: 1, start: "", end: "", ratio: "1" }]);

  const addRow = () => {
    const nextId = rows.length ? Math.max(...rows.map((row) => row.id)) + 1 : 1;
    setRows((prev) => [...prev, { id: nextId, start: "", end: "", ratio: "1" }]);
  };

  const removeRow = (id: number) => {
    if (rows.length > 1) setRows((prev) => prev.filter((row) => row.id !== id));
  };

  const updateRow = (id: number, field: keyof ServiceRow, value: string) => {
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, [field]: value } : row)));
  };

  const totals = useMemo(() => {
    let totalCalDays = 0;
    let totalPrefDays = 0;

    rows.forEach((row) => {
      const duration = calculateDateDifference(row.start, row.end, t("home.errors.dateOrder"));
      if (!duration || duration.error) return;

      const rowDays = normalizeToDays(duration.y, duration.m, duration.d);
      totalCalDays += rowDays;
      totalPrefDays += rowDays * Number(row.ratio);
    });

    return {
      calendar: denormalizeFromDays(totalCalDays),
      preferential: denormalizeFromDays(totalPrefDays),
    };
  }, [rows, t]);

  const exportToCSV = () => {
    const bom = "\uFEFF";
    let csvContent = bom;
    csvContent += `ПІБ / Звання;${personalInfo.name || "-"}\n`;
    csvContent += `Дата народження;${personalInfo.dob || "-"}\n`;
    csvContent += "Методика розрахунку;30 днів у місяці\n\n";
    csvContent +=
      "№;Початок;Кінець;Коефіцієнт;Календарна(Р);Календарна(М);Календарна(Д);Пільгова(Р);Пільгова(М);Пільгова(Д)\n";

    rows.forEach((row, index) => {
      const duration = calculateDateDifference(row.start, row.end, t("home.errors.dateOrder"));
      let cal = { y: "-", m: "-", d: "-" };
      let pref = { y: "-", m: "-", d: "-" };

      if (duration && !duration.error) {
        cal = { y: String(duration.y), m: String(duration.m), d: String(duration.d) };
        const prefDuration = denormalizeFromDays(
          normalizeToDays(duration.y, duration.m, duration.d) * Number(row.ratio),
        );
        pref = { y: String(prefDuration.y), m: String(prefDuration.m), d: String(prefDuration.d) };
      }

      const ratio = SERVICE_RATIOS.find((item) => item.value === row.ratio);
      const ratioLabel = i18n.language.startsWith("uk") ? ratio?.labelUk : ratio?.labelEn;
      csvContent += `${index + 1};${row.start};${row.end};${ratioLabel ?? row.ratio};${cal.y};${cal.m};${cal.d};${pref.y};${pref.m};${pref.d}\n`;
    });

    csvContent += `\nЗАГАЛОМ;;;;${totals.calendar.y};${totals.calendar.m};${totals.calendar.d};${totals.preferential.y};${totals.preferential.m};${totals.preferential.d}\n`;

    const filename = personalInfo.name
      ? `service_${personalInfo.name.replace(/\s+/g, "_")}.csv`
      : "service_calculator.csv";
    downloadTextFile(csvContent, filename, "text/csv;charset=utf-8;");
  };

  return (
    <section className="space-y-5 rounded-2xl bg-white p-4 shadow-sm transition-all duration-300 sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">{t("home.title")}</h1>
          <p className="mt-1 text-sm text-slate-600">{t("home.subtitle")}</p>
        </div>
        <button
          type="button"
          onClick={exportToCSV}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:bg-emerald-500"
        >
          <FileDown size={16} />
          {t("home.export")}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="text-sm">
          <span className="mb-1 block font-medium text-slate-700">{t("home.name")}</span>
          <input
            value={personalInfo.name}
            onChange={(event) => setPersonalInfo((prev) => ({ ...prev, name: event.target.value }))}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 transition-all duration-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="напр. сержант Король Сергій"
          />
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-medium text-slate-700">{t("home.dob")}</span>
          <input
            type="date"
            value={personalInfo.dob}
            onChange={(event) => setPersonalInfo((prev) => ({ ...prev, dob: event.target.value }))}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 transition-all duration-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </label>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="min-w-[860px] w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 text-left text-xs uppercase text-slate-600">
              <th className="p-3">#</th>
              <th className="p-3">{t("home.table.start")}</th>
              <th className="p-3">{t("home.table.end")}</th>
              <th className="p-3">{t("home.table.ratio")}</th>
              <th className="p-3">{t("home.table.calendar")}</th>
              <th className="p-3">{t("home.table.preferential")}</th>
              <th className="p-3 text-center">{t("home.table.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => {
              const duration = calculateDateDifference(row.start, row.end, t("home.errors.dateOrder"));
              const preferentialDuration =
                duration && !duration.error
                  ? denormalizeFromDays(normalizeToDays(duration.y, duration.m, duration.d) * Number(row.ratio))
                  : null;
              return (
                <tr key={row.id} className="border-t border-slate-100 transition-all duration-300 hover:bg-slate-50">
                  <td className="p-3 text-slate-500">{index + 1}</td>
                  <td className="p-3">
                    <input
                      type="date"
                      value={row.start}
                      onChange={(event) => updateRow(row.id, "start", event.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-2 py-1.5 transition-all duration-300 focus:border-blue-500 focus:outline-none"
                    />
                  </td>
                  <td className="p-3">
                    <input
                      type="date"
                      value={row.end}
                      onChange={(event) => updateRow(row.id, "end", event.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-2 py-1.5 transition-all duration-300 focus:border-blue-500 focus:outline-none"
                    />
                  </td>
                  <td className="p-3">
                    <select
                      value={row.ratio}
                      onChange={(event) => updateRow(row.id, "ratio", event.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-2 py-1.5 transition-all duration-300 focus:border-blue-500 focus:outline-none"
                    >
                      {SERVICE_RATIOS.map((ratio) => (
                        <option key={ratio.value} value={ratio.value}>
                          {i18n.language.startsWith("uk") ? ratio.labelUk : ratio.labelEn}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-3">
                    <DurationBlock duration={duration} />
                  </td>
                  <td className="p-3">
                    <DurationBlock duration={preferentialDuration} />
                  </td>
                  <td className="p-3 text-center">
                    <button
                      type="button"
                      onClick={() => removeRow(row.id)}
                      className="rounded-lg p-2 text-slate-400 transition-all duration-300 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <button
        type="button"
        onClick={addRow}
        className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-300 px-4 py-3 text-sm font-medium text-slate-600 transition-all duration-300 hover:border-slate-500 hover:text-slate-900"
      >
        <Plus size={18} />
        {t("home.addRow")}
      </button>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl bg-slate-800 p-4 text-white transition-all duration-300">
          <p className="mb-3 text-sm text-slate-300">{t("home.totals.calendar")}</p>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-2xl font-bold text-amber-400">{totals.calendar.y}</p>
              <p className="text-xs text-slate-400">{t("home.totals.years")}</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-400">{totals.calendar.m}</p>
              <p className="text-xs text-slate-400">{t("home.totals.months")}</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-400">{totals.calendar.d}</p>
              <p className="text-xs text-slate-400">{t("home.totals.days")}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-slate-800 p-4 text-white transition-all duration-300">
          <p className="mb-3 text-sm text-slate-300">{t("home.totals.preferential")}</p>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-2xl font-bold text-emerald-400">{totals.preferential.y}</p>
              <p className="text-xs text-slate-400">{t("home.totals.years")}</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-400">{totals.preferential.m}</p>
              <p className="text-xs text-slate-400">{t("home.totals.months")}</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-400">{totals.preferential.d}</p>
              <p className="text-xs text-slate-400">{t("home.totals.days")}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
