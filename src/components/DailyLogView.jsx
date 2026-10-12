import React, { useState } from 'react';
import { Calendar, Clock, Check, Trash2 } from 'lucide-react';
import { calculateBodyFat } from '../utils/storage';

export default function DailyLogView({
  measurementLogs = [],
  profile,
  onAddMeasurementLog,
  onDeleteMeasurementLog,
  showToast
}) {
  const now = new Date();
  const todayDate = now.toISOString().split('T')[0];
  const currentTime = now.toTimeString().slice(0, 5);

  const [date, setDate] = useState(todayDate);
  const [time, setTime] = useState(currentTime);
  const [weight, setWeight] = useState(profile?.weight || '');
  const [neck, setNeck] = useState(profile?.neck || '');
  const [waist, setWaist] = useState(profile?.waist || '');

  const height = profile?.height || 178;
  const liveBodyFat = calculateBodyFat(waist, neck, height);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!weight) {
      showToast('Please enter your weight.');
      return;
    }

    const wNum = parseFloat(weight);
    const nNum = parseFloat(neck) || profile?.neck || 38.5;
    const waistNum = parseFloat(waist) || profile?.waist || 83.0;
    const calculatedBF = calculateBodyFat(waistNum, nNum, height) || 14.5;

    const newEntry = {
      id: `m_${Date.now()}`,
      date,
      time,
      weight: wNum,
      neck: nNum,
      waist: waistNum,
      bodyFat: calculatedBF
    };

    onAddMeasurementLog(newEntry);
    showToast('Measurement logged.');
  };

  const sortedLogs = [...measurementLogs].sort((a, b) => {
    return b.date.localeCompare(a.date) || b.time.localeCompare(a.time);
  });

  return (
    <div className="space-y-5 pb-24 md:pb-12 max-w-6xl mx-auto">
      {/* Log Form */}
      <div className="border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-900/30 rounded-xl p-4 sm:p-5 shadow-xs">
        <div className="pb-4 border-b border-zinc-200 dark:border-zinc-900">
          <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Physical Measurements
          </span>
          <h2 className="text-lg sm:text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            Log Body Metrics
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="pt-4 space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="bg-zinc-50 dark:bg-zinc-900/50 p-3 rounded-lg border border-zinc-200 dark:border-zinc-900">
              <label className="text-[11px] text-zinc-500 block mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-transparent text-xs font-medium text-zinc-900 dark:text-zinc-200 outline-none"
                required
              />
            </div>

            <div className="bg-zinc-50 dark:bg-zinc-900/50 p-3 rounded-lg border border-zinc-200 dark:border-zinc-900">
              <label className="text-[11px] text-zinc-500 block mb-1">Time</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-transparent text-xs font-medium text-zinc-900 dark:text-zinc-200 outline-none"
                required
              />
            </div>

            <div className="bg-zinc-50 dark:bg-zinc-900/50 p-3 rounded-lg border border-zinc-200 dark:border-zinc-900">
              <label className="text-[11px] text-zinc-500 block mb-1">Weight (kg) *</label>
              <input
                type="number"
                step="0.1"
                placeholder="76.5"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full bg-transparent text-sm font-semibold text-zinc-900 dark:text-zinc-100 outline-none"
                required
              />
            </div>

            <div className="bg-zinc-50 dark:bg-zinc-900/50 p-3 rounded-lg border border-zinc-200 dark:border-zinc-900">
              <label className="text-[11px] text-zinc-500 block mb-1">Neck (cm)</label>
              <input
                type="number"
                step="0.5"
                placeholder="38.5"
                value={neck}
                onChange={(e) => setNeck(e.target.value)}
                className="w-full bg-transparent text-sm font-semibold text-zinc-900 dark:text-zinc-100 outline-none"
              />
            </div>

            <div className="bg-zinc-50 dark:bg-zinc-900/50 p-3 rounded-lg border border-zinc-200 dark:border-zinc-900">
              <label className="text-[11px] text-zinc-500 block mb-1">Waist (cm)</label>
              <input
                type="number"
                step="0.5"
                placeholder="83.0"
                value={waist}
                onChange={(e) => setWaist(e.target.value)}
                className="w-full bg-transparent text-sm font-semibold text-zinc-900 dark:text-zinc-100 outline-none"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="text-xs text-zinc-500 font-mono">
              Navy Body Fat Calc:{' '}
              {liveBodyFat !== null ? (
                <span className="text-zinc-900 dark:text-zinc-200 font-semibold">{liveBodyFat}%</span>
              ) : (
                <span className="text-zinc-400 dark:text-zinc-600">Enter waist & neck</span>
              )}
            </div>

            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-900 font-medium rounded-lg text-xs transition"
            >
              <Check className="w-3.5 h-3.5" /> Save Measurement
            </button>
          </div>
        </form>
      </div>

      {/* Measurement History */}
      <div className="border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-900/30 rounded-xl p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-900">
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-200">History Log</h3>
            <p className="text-xs text-zinc-500">Persistent timeline in local storage</p>
          </div>
          <span className="text-xs text-zinc-400 dark:text-zinc-500 font-mono">
            {sortedLogs.length} entries
          </span>
        </div>

        {sortedLogs.length === 0 ? (
          <div className="p-6 text-center text-xs text-zinc-400 dark:text-zinc-500">
            No measurements recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto pt-2">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-zinc-400 dark:text-zinc-500 border-b border-zinc-200 dark:border-zinc-900 text-[10px] uppercase font-mono tracking-wider">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Time</th>
                  <th className="py-2.5 px-3">Weight</th>
                  <th className="py-2.5 px-3">Neck</th>
                  <th className="py-2.5 px-3">Waist</th>
                  <th className="py-2.5 px-3">Body Fat</th>
                  <th className="py-2.5 px-2 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-900/60 font-mono">
                {sortedLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/30 transition">
                    <td className="py-2.5 px-3 text-zinc-900 dark:text-zinc-200">{log.date}</td>
                    <td className="py-2.5 px-3 text-zinc-500">{log.time || '--:--'}</td>
                    <td className="py-2.5 px-3 text-zinc-900 dark:text-zinc-200 font-medium">{log.weight} kg</td>
                    <td className="py-2.5 px-3 text-zinc-600 dark:text-zinc-400">{log.neck ? `${log.neck} cm` : '-'}</td>
                    <td className="py-2.5 px-3 text-zinc-600 dark:text-zinc-400">{log.waist ? `${log.waist} cm` : '-'}</td>
                    <td className="py-2.5 px-3 text-zinc-900 dark:text-zinc-200 font-semibold">{log.bodyFat}%</td>
                    <td className="py-2.5 px-2 text-right">
                      <button
                        onClick={() => onDeleteMeasurementLog(log.id)}
                        className="p-1 text-zinc-400 hover:text-zinc-700 dark:text-zinc-600 dark:hover:text-zinc-300 transition"
                        title="Delete log"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
