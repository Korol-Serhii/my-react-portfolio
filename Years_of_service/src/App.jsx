import React, { useState, useMemo } from 'react';
import { FileDown, Plus, Trash2, Calculator, Calendar, Info } from 'lucide-react';

// Розрахунок різниці дат за методикою "30 днів у місяці"
const calculateDateDifference = (startStr, endStr) => {
  if (!startStr || !endStr) return null;

  const start = new Date(startStr);
  const end = new Date(endStr);

  if (start > end) return { error: "Дата початку пізніше дати кінця" };

  let d1 = start.getDate();
  let m1 = start.getMonth() + 1;
  let y1 = start.getFullYear();

  let d2 = end.getDate();
  let m2 = end.getMonth() + 1;
  let y2 = end.getFullYear();

  let days = d2 - d1;
  let months = m2 - m1;
  let years = y2 - y1;

  if (days < 0) {
    days += 30;
    months -= 1;
  }

  if (months < 0) {
    months += 12;
    years -= 1;
  }

  return { y: years, m: months, d: days };
};

// Переведення років/місяців/днів в дні (1 рік = 360 днів, 1 місяць = 30 днів)
const normalizeToDays = (y, m, d) => {
  return (y * 360) + (m * 30) + d;
};

// Переведення днів назад у роки/місяці/дні
const denormalizeFromDays = (totalDays) => {
  const y = Math.floor(totalDays / 360);
  const remainder = totalDays % 360;
  const m = Math.floor(remainder / 30);
  const d = Math.round(remainder % 30);
  return { y, m, d };
};

// Компонент відображення тривалості
const DurationDisplay = ({ duration, className = "text-gray-700" }) => {
  if (!duration) return <span className="text-gray-300">-</span>;
  if (duration.error) return <span className="text-red-400 text-xs">{duration.error}</span>;

  return (
    <div className={className}>
      <span className="font-bold">{duration.y}</span> р,{' '}
      <span className="font-bold">{duration.m}</span> м,{' '}
      <span className="font-bold">{duration.d}</span> д
    </div>
  );
};

// Компонент відображення загальної вислуги
const TotalBlock = ({ title, total, colorClass, valueClass }) => (
  <div className={`bg-slate-700 rounded p-4 border border-slate-600 ${colorClass}`}>
    <h3 className="text-lg font-medium mb-2 text-slate-300 border-b border-slate-600 pb-2 flex items-center gap-2">
      {title}
    </h3>
    <div className="grid grid-cols-3 gap-2 text-center">
      <div>
        <div className={`text-3xl font-bold ${valueClass}`}>{total.y}</div>
        <div className="text-xs uppercase tracking-wider opacity-70">Років</div>
      </div>
      <div>
        <div className={`text-3xl font-bold ${valueClass}`}>{total.m}</div>
        <div className="text-xs uppercase tracking-wider opacity-70">Місяців</div>
      </div>
      <div>
        <div className={`text-3xl font-bold ${valueClass}`}>{total.d}</div>
        <div className="text-xs uppercase tracking-wider opacity-70">Днів</div>
      </div>
    </div>
  </div>
);

export default function App() {
  const [personalInfo, setPersonalInfo] = useState({ name: '', rank: '', dob: '' });
  const [rows, setRows] = useState([
    { id: 1, start: '', end: '', ratio: '1' }
  ]);

  const addRow = () => {
    const newId = rows.length > 0 ? Math.max(...rows.map(r => r.id)) + 1 : 1;
    setRows([...rows, { id: newId, start: '', end: '', ratio: '1' }]);
  };

  const removeRow = (id) => {
    if (rows.length > 1) {
      setRows(rows.filter(r => r.id !== id));
    }
  };

  const updateRow = (id, field, value) => {
    setRows(rows.map(r => (r.id === id ? { ...r, [field]: value } : r)));
  };

  const totals = useMemo(() => {
    let totalCalDays = 0;
    let totalPrefDays = 0;

    rows.forEach(row => {
      const dur = calculateDateDifference(row.start, row.end);
      if (dur && !dur.error) {
        const rowDays = normalizeToDays(dur.y, dur.m, dur.d);
        const ratio = parseFloat(row.ratio);
        totalCalDays += rowDays;
        totalPrefDays += (rowDays * ratio);
      }
    });

    return {
      calendar: denormalizeFromDays(totalCalDays),
      preferential: denormalizeFromDays(totalPrefDays)
    };
  }, [rows]);

  const exportToCSV = () => {
    const bom = "\uFEFF";
    let csvContent = bom;
    
    csvContent += `ПІБ / Звання;${personalInfo.name || '-'}\n`;
    csvContent += `Дата народження;${personalInfo.dob || '-'}\n`;
    csvContent += `Методика розрахунку;30 днів у місяці\n\n`;

    csvContent += `№;Початок періоду;Кінець періоду;Коефіцієнт;Календарна (Років);Календарна (Місяців);Календарна (Днів);Пільгова (Років);Пільгова (Місяців);Пільгова (Днів)\n`;

    rows.forEach((row, index) => {
      const duration = calculateDateDifference(row.start, row.end);
      let calY = '-', calM = '-', calD = '-';
      let prefY = '-', prefM = '-', prefD = '-';

      if (duration && !duration.error) {
        calY = duration.y;
        calM = duration.m;
        calD = duration.d;

        const days = normalizeToDays(duration.y, duration.m, duration.d);
        const prefDays = days * parseFloat(row.ratio);
        const prefDur = denormalizeFromDays(prefDays);
        
        prefY = prefDur.y;
        prefM = prefDur.m;
        prefD = prefDur.d;
      }

      let ratioText = row.ratio;
      if (row.ratio === '0.5') ratioText = "1 : 0.5 (Рік за 6 міс)";
      if (row.ratio === '1') ratioText = "1 : 1 (Календарна)";
      if (row.ratio === '1.5') ratioText = "1 : 1.5 (Рік за півтора)";
      if (row.ratio === '2') ratioText = "1 : 2 (Рік за два)";
      if (row.ratio === '3') ratioText = "1 : 3 (Рік за три)";

      csvContent += `${index + 1};${row.start};${row.end};${ratioText};${calY};${calM};${calD};${prefY};${prefM};${prefD}\n`;
    });

    csvContent += `\n`;
    csvContent += `ЗАГАЛОМ;;;;${totals.calendar.y};${totals.calendar.m};${totals.calendar.d};${totals.preferential.y};${totals.preferential.m};${totals.preferential.d}\n`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    const filename = personalInfo.name 
      ? `Вислуга_${personalInfo.name.replace(/\s+/g, '_')}.csv` 
      : "Вислуга_років.csv";
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 p-4 font-sans">
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden">
        
        <header className="bg-slate-800 text-white p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-700 rounded-lg">
              <Calculator size={32} className="text-yellow-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold uppercase tracking-wide">Розрахунок вислуги років</h1>
              <p className="text-sm text-slate-400">Методика: 30 днів у місяці</p>
            </div>
          </div>
          <button 
            onClick={exportToCSV} 
            className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-medium py-2 px-4 rounded-lg transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <FileDown size={18} />
            <span>Експорт в Excel</span>
          </button>
        </header>

        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ПІБ військовослужбовця / Звання</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={personalInfo.name}
                  onChange={(e) => setPersonalInfo({...personalInfo, name: e.target.value})}
                  placeholder="напр. сержант Король Сергій Володимирович" 
                  className="w-full pl-10 border-gray-300 rounded-lg shadow-sm border p-2.5 focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none transition"
                />
                <div className="absolute left-3 top-3 text-gray-400">
                  <span className="text-lg">👤</span>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Дата народження</label>
              <div className="relative">
                <input 
                  type="date" 
                  value={personalInfo.dob}
                  onChange={(e) => setPersonalInfo({...personalInfo, dob: e.target.value})}
                  className="w-full pl-10 border-gray-300 rounded-lg shadow-sm border p-2.5 focus:ring-2 focus:ring-slate-500 focus:border-slate-500 outline-none transition"
                />
                <Calendar className="absolute left-3 top-3 text-gray-400" size={18} />
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 overflow-x-auto">
          <table className="w-full min-w-[800px] border-collapse text-sm">
            <thead>
              <tr className="bg-slate-100 text-slate-700 uppercase tracking-wider text-xs border-b-2 border-slate-200">
                <th className="p-3 text-center w-12 rounded-tl-lg">#</th>
                <th className="p-3 text-left w-48">Початок періоду</th>
                <th className="p-3 text-left w-48">Кінець періоду</th>
                <th className="p-3 text-left w-56">Коефіцієнт</th>
                <th className="p-3 text-left w-40">Календарна</th>
                <th className="p-3 text-left w-40 bg-slate-50">Пільгова</th>
                <th className="p-3 text-center w-16 rounded-tr-lg">Дії</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((row, index) => {
                const duration = calculateDateDifference(row.start, row.end);
                
                let prefDisplay = null;
                if (duration && !duration.error) {
                    const days = normalizeToDays(duration.y, duration.m, duration.d);
                    const prefDays = days * parseFloat(row.ratio);
                    prefDisplay = denormalizeFromDays(prefDays);
                }

                return (
                  <tr key={row.id} className="hover:bg-blue-50/50 transition group">
                    <td className="p-3 text-center text-gray-400 font-mono">{index + 1}</td>
                    <td className="p-3">
                      <input 
                        type="date" 
                        value={row.start} 
                        onChange={(e) => updateRow(row.id, 'start', e.target.value)}
                        className="w-full border border-gray-300 rounded px-2 py-1.5 focus:border-blue-500 outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </td>
                    <td className="p-3">
                      <input 
                        type="date" 
                        value={row.end} 
                        onChange={(e) => updateRow(row.id, 'end', e.target.value)}
                        className="w-full border border-gray-300 rounded px-2 py-1.5 focus:border-blue-500 outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </td>
                    <td className="p-3">
                      <select 
                        value={row.ratio} 
                        onChange={(e) => updateRow(row.id, 'ratio', e.target.value)}
                        className="w-full border border-gray-300 rounded px-2 py-1.5 bg-white focus:border-blue-500 outline-none"
                      >
                        <optgroup label="Календарна вислуга">
                            <option value="0.5">1 : 0.5 (Рік за 6 міс)</option>
                            <option value="1">1 : 1 (Календарна)</option>
                        </optgroup>
                        <optgroup label="Пільгова вислуга">
                            <option value="1.5">1 : 1.5 (Рік за півтора)</option>
                            <option value="2">1 : 2 (Рік за два)</option>
                            <option value="3">1 : 3 (Рік за три)</option>
                        </optgroup>
                      </select>
                    </td>
                    <td className="p-3">
                      <DurationDisplay duration={duration} className="text-slate-700" />
                    </td>
                    <td className="p-3 bg-slate-50 group-hover:bg-blue-50/50">
                      <DurationDisplay duration={prefDisplay} className={parseFloat(row.ratio) < 1 ? "text-red-700" : "text-green-700"} />
                    </td>
                    <td className="p-3 text-center">
                      <button 
                        onClick={() => removeRow(row.id)}
                        className="text-gray-300 hover:text-red-500 transition p-1 rounded-full hover:bg-red-50"
                        title="Видалити рядок"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="7" className="p-4">
                  <button 
                    onClick={addRow}
                    className="w-full py-3 border-2 border-dashed border-slate-300 text-slate-500 hover:border-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-lg font-medium transition flex items-center justify-center gap-2"
                  >
                    <Plus size={20} />
                    Додати період служби
                  </button>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="bg-slate-800 text-white p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <TotalBlock 
                title="Загальна календарна вислуга" 
                total={totals.calendar} 
                colorClass=""
                valueClass="text-yellow-400"
              />
            </div>
            <div>
              <div className="relative">
                <TotalBlock 
                  title="Загальна пільгова вислуга" 
                  total={totals.preferential} 
                  colorClass=""
                  valueClass="text-green-400"
                />
                 <div className="absolute top-0 right-0 bg-yellow-500 text-slate-900 text-xs font-bold px-2 py-1 rounded-bl shadow-lg">
                  Всього
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 text-xs text-slate-400 text-center flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              <Info size={14} />
              <span>Розрахунок базується на фіксованій тривалості місяця (30 днів).</span>
            </div>
            <div>Файл експорту адаптовано для відкриття в Excel (роздільник - крапка з комою).</div>
          </div>
        </div>
      </div>
    </div>
  );
}
