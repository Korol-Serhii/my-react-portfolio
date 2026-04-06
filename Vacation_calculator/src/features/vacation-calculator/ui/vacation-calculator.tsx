import { useMemo, useState } from 'react';
import { Calculator, Calendar, Globe, Info, Plus, Shield, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../../shared/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../../shared/ui/card';
import { Input } from '../../../shared/ui/input';

type AnnualRecord = {
  id: number;
  year: number;
  limit: number;
  used: number;
  remaining: number;
};

export function VacationCalculator() {
  const { t, i18n } = useTranslation('common');

  const currentYear = new Date().getFullYear();
  const [annualRecords, setAnnualRecords] = useState<AnnualRecord[]>([]);
  const [annualYear, setAnnualYear] = useState<number>(currentYear);
  const [annualLimit, setAnnualLimit] = useState<number>(30);
  const [annualUsed, setAnnualUsed] = useState<number>(0);
  const [ubdStart, setUbdStart] = useState<number>(2020);
  const [ubdEnd, setUbdEnd] = useState<number>(currentYear);
  const [ubdUsedManual, setUbdUsedManual] = useState<number>(0);

  const addAnnualRecord = () => {
    const limit = Math.max(0, annualLimit);
    const used = Math.max(0, annualUsed);
    const remaining = Math.max(0, limit - used);

    const nextRecord: AnnualRecord = {
      id: Date.now(),
      year: annualYear,
      limit,
      used,
      remaining
    };

    setAnnualRecords((prev) => [...prev, nextRecord]);
    setAnnualYear((prev) => prev + 1);
    setAnnualUsed(0);
  };

  const removeAnnualRecord = (id: number) => {
    setAnnualRecords((prev) => prev.filter((record) => record.id !== id));
  };

  const totalAnnualRemaining = useMemo(
    () => annualRecords.reduce((acc, record) => acc + record.remaining, 0),
    [annualRecords]
  );

  const ubdYearsCount = useMemo(() => Math.max(0, ubdEnd - ubdStart), [ubdEnd, ubdStart]);
  const ubdTotalEntitlement = ubdYearsCount * 14;
  const ubdRemaining = Math.max(0, ubdTotalEntitlement - ubdUsedManual);
  const grandTotal = totalAnnualRemaining + ubdRemaining;

  const setLanguage = (lng: 'uk' | 'en') => {
    void i18n.changeLanguage(lng);
  };

  return (
    <main className="min-h-screen bg-slate-50 px-3 py-4 sm:px-4 md:px-8">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <header className="rounded-2xl border-b-4 border-blue-600 bg-white p-4 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">{t('app.title')}</h1>
              <p className="mt-1 text-sm text-slate-500 sm:text-base">{t('app.subtitle')}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setLanguage('uk')}>
                <Globe className="mr-1 h-4 w-4" />
                UA
              </Button>
              <Button variant="outline" size="sm" onClick={() => setLanguage('en')}>
                <Globe className="mr-1 h-4 w-4" />
                EN
              </Button>
              <Calculator className="hidden h-9 w-9 text-blue-600 md:block" />
            </div>
          </div>
        </header>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader className="bg-blue-50">
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <Calendar className="h-5 w-5 text-blue-600" />
                {t('annual.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2 rounded-lg border border-blue-100 bg-blue-50/60 p-3 text-sm text-blue-700">
                <Info className="mt-0.5 h-4 w-4 shrink-0" />
                <p>{t('annual.info')}</p>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <label className="space-y-1">
                  <span className="text-xs font-semibold uppercase text-slate-500">{t('annual.year')}</span>
                  <Input type="number" value={annualYear} onChange={(e) => setAnnualYear(Number(e.target.value))} />
                </label>
                <label className="space-y-1">
                  <span className="text-xs font-semibold uppercase text-slate-500">{t('annual.limit')}</span>
                  <Input
                    type="number"
                    min={0}
                    value={annualLimit}
                    onChange={(e) => setAnnualLimit(Number(e.target.value))}
                  />
                </label>
                <label className="space-y-1">
                  <span className="text-xs font-semibold uppercase text-slate-500">{t('annual.used')}</span>
                  <Input type="number" min={0} value={annualUsed} onChange={(e) => setAnnualUsed(Number(e.target.value))} />
                </label>
              </div>

              <Button onClick={addAnnualRecord} className="w-full">
                <Plus className="mr-1 h-4 w-4" />
                {t('annual.add')}
              </Button>

              {annualRecords.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-slate-700">{t('annual.addedPeriods')}</h3>
                  <div className="h-40 space-y-2 overflow-y-auto pr-1">
                    {annualRecords.map((record) => (
                      <div
                        key={record.id}
                        className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3"
                      >
                        <div>
                          <p className="font-semibold text-slate-800">
                            {record.year} {t('annual.yearLabel')}
                          </p>
                          <p className="text-xs text-slate-500">
                            {record.limit} - {record.used} = <span className="font-bold text-green-600">{record.remaining}</span>
                          </p>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => removeAnnualRecord(record.id)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <div className="flex w-full items-center justify-between">
                <span className="font-medium text-slate-600">{t('annual.total')}</span>
                <span className="text-xl font-bold text-blue-700">
                  {totalAnnualRemaining} {t('common.days')}
                </span>
              </div>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="bg-indigo-50">
              <CardTitle className="flex items-center gap-2 text-indigo-800">
                <Shield className="h-5 w-5 text-indigo-600" />
                {t('ubd.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2 rounded-lg border border-indigo-100 bg-indigo-50/60 p-3 text-sm text-indigo-700">
                <Info className="mt-0.5 h-4 w-4 shrink-0" />
                <p>{t('ubd.info')}</p>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="space-y-1">
                  <span className="text-xs font-semibold uppercase text-slate-500">{t('ubd.from')}</span>
                  <Input type="number" value={ubdStart} onChange={(e) => setUbdStart(Number(e.target.value))} />
                </label>
                <label className="space-y-1">
                  <span className="text-xs font-semibold uppercase text-slate-500">{t('ubd.to')}</span>
                  <Input type="number" value={ubdEnd} onChange={(e) => setUbdEnd(Number(e.target.value))} />
                </label>
              </div>

              <div className="space-y-2 rounded-lg border border-indigo-100 bg-indigo-50 p-3 text-sm">
                <div className="flex justify-between">
                  <span>{t('ubd.periodYears')}</span>
                  <strong>{ubdYearsCount}</strong>
                </div>
                <div className="flex justify-between">
                  <span>{t('ubd.formula')}</span>
                  <strong>{ubdYearsCount} x 14</strong>
                </div>
                <div className="flex justify-between border-t border-indigo-200 pt-2 text-indigo-700">
                  <span>{t('ubd.accrued')}</span>
                  <strong>{ubdTotalEntitlement}</strong>
                </div>
              </div>

              <label className="space-y-1">
                <span className="text-xs font-semibold uppercase text-slate-500">{t('ubd.used')}</span>
                <Input type="number" min={0} value={ubdUsedManual} onChange={(e) => setUbdUsedManual(Number(e.target.value))} />
                <p className="text-xs text-slate-400">{t('ubd.hint')}</p>
              </label>
            </CardContent>
            <CardFooter>
              <div className="flex w-full items-center justify-between">
                <span className="font-medium text-slate-600">{t('ubd.total')}</span>
                <span className="text-xl font-bold text-indigo-700">
                  {ubdRemaining} {t('common.days')}
                </span>
              </div>
            </CardFooter>
          </Card>
        </section>

        <section className="rounded-2xl bg-slate-800 p-5 text-white shadow-lg md:p-6">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-bold">{t('result.title')}</h2>
              <p className="text-sm text-slate-300">{t('result.subtitle')}</p>
            </div>
            <div className="text-left md:text-right">
              <p className="text-4xl font-extrabold leading-none text-green-400">{grandTotal}</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-green-200">{t('result.daysTotal')}</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
