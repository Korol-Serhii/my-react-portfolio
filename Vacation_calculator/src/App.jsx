import React, { useState } from 'react';
import { Plus, Trash2, Calendar, Shield, Calculator, Info } from 'lucide-react';

export default function App() {
  // --- State для Щорічної відпустки ---
  const [annualRecords, setAnnualRecords] = useState([]);
  const [annualYear, setAnnualYear] = useState(new Date().getFullYear());
  const [annualLimit, setAnnualLimit] = useState(30);
  const [annualUsed, setAnnualUsed] = useState(0);

  // --- State для УБД ---
  const [ubdStart, setUbdStart] = useState(2020);
  const [ubdEnd, setUbdEnd] = useState(2026);
  const [ubdUsedManual, setUbdUsedManual] = useState(0);

  // --- Логіка Щорічної відпустки ---
  const addAnnualRecord = () => {
    const limit = Number(annualLimit); 
    const used = Number(annualUsed);
    const remaining = limit - used;
    
    const newRecord = {
      id: Date.now(),
      year: annualYear,
      limit: limit,
      used: used,
      remaining: remaining
    };

    setAnnualRecords([...annualRecords, newRecord]);
    setAnnualYear(prev => prev + 1);
    setAnnualUsed(0);
  };

  const removeAnnualRecord = (id) => {
    setAnnualRecords(annualRecords.filter(r => r.id !== id));
  };

  const totalAnnualRemaining = annualRecords.reduce((acc, curr) => acc + curr.remaining, 0);

  // --- Логіка УБД ---
  const ubdYearsCount = Math.max(0, ubdEnd - ubdStart);
  const ubdTotalEntitlement = ubdYearsCount * 14;
  const ubdRemaining = Math.max(0, ubdTotalEntitlement - ubdUsedManual);

  // --- Загальний підсумок ---
  const grandTotal = totalAnnualRemaining + ubdRemaining;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-800">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <header className="bg-white rounded-2xl shadow-sm p-6 flex items-center justify-between border-b-4 border-blue-600">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Калькулятор Відпусток</h1>
            <p className="text-slate-500 mt-1">Гнучкий розрахунок залишків відпусток</p>
          </div>
          <Calculator className="w-10 h-10 text-blue-600 hidden md:block" />
        </header>

        {/* Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          
          {/* --- КОЛОНКА 1: Щорічна відпустка --- */}
          <div className="h-full">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
              {/* Card Header */}
              <div className="bg-blue-50 p-4 border-b border-blue-100 flex items-center gap-2 flex-shrink-0">
                <Calendar className="w-5 h-5 text-blue-600" />
                <h2 className="font-bold text-lg text-blue-800">Щорічна основна</h2>
              </div>
              
              {/* Card Body */}
              <div className="p-5 space-y-4">
                <div className="bg-blue-50/50 p-3 rounded-lg text-sm text-blue-700 mb-4 border border-blue-100 flex gap-2 flex-shrink-0">
                  <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <p>Вкажіть рік, норму днів та використану кількість.</p>
                </div>

                <div className="grid grid-cols-3 gap-2 flex-shrink-0">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Рік</label>
                    <input 
                      type="number" 
                      value={annualYear}
                      onChange={(e) => setAnnualYear(Number(e.target.value))}
                      className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Норма</label>
                    <input 
                      type="number" 
                      min="0"
                      value={annualLimit}
                      onChange={(e) => setAnnualLimit(Number(e.target.value))}
                      className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Використано</label>
                    <input 
                      type="number" 
                      min="0"
                      value={annualUsed}
                      onChange={(e) => setAnnualUsed(Number(e.target.value))}
                      className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <button 
                  onClick={addAnnualRecord}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors flex-shrink-0"
                >
                  <Plus className="w-4 h-4" /> Додати рік у розрахунок
                </button>

                {annualRecords.length > 0 && (
                  <div className="mt-4 space-y-2 flex-shrink-0">
                    <h3 className="text-sm font-semibold text-slate-700">Додані періоди:</h3>
                    <div className="h-36 overflow-y-auto space-y-2 pr-1">
                      {annualRecords.map(record => (
                        <div key={record.id} className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200">
                          <div>
                            <span className="font-bold text-slate-800">{record.year} рік</span>
                            <div className="text-xs text-slate-500 mt-0.5">
                              {record.limit} - {record.used} вик. = <span className="text-green-600 font-bold">{record.remaining} зал.</span>
                            </div>
                          </div>
                          <button 
                            onClick={() => removeAnnualRecord(record.id)}
                            className="text-red-400 hover:text-red-600 p-1 hover:bg-red-50 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Card Footer (fixed at bottom) */}
              <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-between items-center flex-shrink-0">
                <span className="text-slate-600 font-medium">Всього щорічної:</span>
                <span className="text-xl font-bold text-blue-700">{totalAnnualRemaining} днів</span>
              </div>
            </div>
          </div>

          {/* --- КОЛОНКА 2: Відпустка УБД --- */}
          <div className="h-full">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
              {/* Card Header */}
              <div className="bg-indigo-50 p-4 border-b border-indigo-100 flex items-center gap-2 flex-shrink-0">
                <Shield className="w-5 h-5 text-indigo-600" />
                <h2 className="font-bold text-lg text-indigo-800">Відпустка УБД</h2>
              </div>

              {/* Card Body (grows to fill space) */}
              <div className="p-5 space-y-4 flex-1">
                 <div className="bg-indigo-50/50 p-3 rounded-lg text-sm text-indigo-700 mb-4 border border-indigo-100 flex gap-2">
                  <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <p>Норма: 14 днів на рік. Розрахунок за загальний період.</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">З (Рік)</label>
                    <input 
                      type="number" 
                      value={ubdStart}
                      onChange={(e) => setUbdStart(Number(e.target.value))}
                      className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">По (Рік)</label>
                    <input 
                      type="number" 
                      value={ubdEnd}
                      onChange={(e) => setUbdEnd(Number(e.target.value))}
                      className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-indigo-900">Період (років):</span>
                    <span className="font-bold">{ubdYearsCount}</span>
                  </div>
                   <div className="flex justify-between text-sm mb-1">
                    <span className="text-indigo-900">Формула:</span>
                    <span>{ubdYearsCount} × 14</span>
                  </div>
                  <div className="border-t border-indigo-200 my-2"></div>
                   <div className="flex justify-between font-bold text-indigo-700">
                    <span>Нараховано днів:</span>
                    <span>{ubdTotalEntitlement}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                    Використано днів УБД (якщо були):
                  </label>
                  <input 
                    type="number" 
                    min="0"
                    value={ubdUsedManual}
                    onChange={(e) => setUbdUsedManual(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="0"
                  />
                  <p className="text-xs text-slate-400 mt-1">Залиште 0, якщо не ходили у відпустку УБД.</p>
                </div>
              </div>

              {/* Card Footer (fixed at bottom) */}
              <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-between items-center flex-shrink-0">
                <span className="text-slate-600 font-medium">Всього УБД:</span>
                <span className="text-xl font-bold text-indigo-700">{ubdRemaining} днів</span>
              </div>
            </div>
          </div>

        </div>

        {/* --- ПІДСУМОК --- */}
        <div className="bg-slate-800 text-white p-6 rounded-2xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-slate-100">Загальний підсумок</h3>
            <p className="text-slate-400 text-sm">Сума невикористаних днів (Щорічна + УБД)</p>
          </div>
          <div className="text-center md:text-right">
            <div className="text-4xl font-extrabold text-green-400 leading-none">{grandTotal}</div>
            <div className="text-xs text-green-200 uppercase tracking-wider font-semibold mt-1">днів всього</div>
          </div>
        </div>

      </div>
    </div>
  );
}

