import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { calculateBodyFat } from '../utils/storage';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function ProgressCharts({ measurementLogs = [], profile, theme = 'dark' }) {
  const isDark = theme === 'dark';
  const sortedLogs = [...measurementLogs].sort((a, b) => a.date.localeCompare(b.date));
  const goalBodyFat = profile?.goalBodyFat ? parseFloat(profile.goalBodyFat) : null;

  const latestEntry = sortedLogs.length > 0 ? sortedLogs[sortedLogs.length - 1] : null;
  const firstEntry = sortedLogs.length > 0 ? sortedLogs[0] : null;

  const currentBF = latestEntry?.bodyFat ?? (profile?.waist && profile?.neck && profile?.height ? calculateBodyFat(profile.waist, profile.neck, profile.height) : null);
  const currentWeight = latestEntry?.weight ?? (profile?.weight ? profile.weight : null);
  const startWeight = firstEntry?.weight ?? currentWeight;
  const weightDiff = (currentWeight !== null && startWeight !== null)
    ? (currentWeight - startWeight).toFixed(1)
    : '0.0';
  const bfToGoal = (currentBF !== null && goalBodyFat !== null)
    ? (currentBF - goalBodyFat).toFixed(1)
    : null;

  const labels = sortedLogs.map((l) => {
    const parts = l.date.split('-');
    return parts.length === 3 ? `${parts[1]}/${parts[2]}` : l.date;
  });

  const datasets = [
    {
      label: 'Calculated Body Fat %',
      data: sortedLogs.map((l) => l.bodyFat),
      borderColor: isDark ? '#f4f4f5' : '#18181b',
      backgroundColor: 'transparent',
      tension: 0.2,
      pointBackgroundColor: isDark ? '#f4f4f5' : '#18181b',
      pointBorderColor: isDark ? '#09090b' : '#ffffff',
      pointBorderWidth: 1.5,
      pointRadius: 3,
      pointHoverRadius: 5,
      borderWidth: 2
    }
  ];

  if (goalBodyFat !== null) {
    datasets.push({
      label: `Goal Target (${goalBodyFat}%)`,
      data: sortedLogs.map(() => goalBodyFat),
      borderColor: isDark ? '#71717a' : '#a1a1aa',
      borderDash: [5, 5],
      pointRadius: 0,
      borderWidth: 1.5
    });
  }

  const bodyFatChartData = {
    labels: labels.length > 0 ? labels : ['No Logs'],
    datasets
  };

  const weightChartData = {
    labels: labels.length > 0 ? labels : ['No Logs'],
    datasets: [
      {
        label: 'Body Weight (kg)',
        data: sortedLogs.map((l) => l.weight),
        borderColor: isDark ? '#e4e4e7' : '#27272a',
        backgroundColor: 'transparent',
        tension: 0.2,
        pointBackgroundColor: isDark ? '#e4e4e7' : '#27272a',
        pointBorderColor: isDark ? '#09090b' : '#ffffff',
        pointBorderWidth: 1.5,
        pointRadius: 3,
        pointHoverRadius: 5,
        borderWidth: 2
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: isDark ? '#a1a1aa' : '#52525b',
          boxWidth: 12,
          font: { size: 11 }
        }
      },
      tooltip: {
        backgroundColor: isDark ? '#18181b' : '#ffffff',
        borderColor: isDark ? '#27272a' : '#e4e4e7',
        borderWidth: 1,
        titleColor: isDark ? '#fafafa' : '#09090b',
        bodyColor: isDark ? '#a1a1aa' : '#52525b',
        padding: 8
      }
    },
    scales: {
      x: {
        grid: { color: isDark ? 'rgba(39, 39, 42, 0.4)' : 'rgba(228, 228, 231, 0.7)' },
        ticks: { color: '#71717a', font: { size: 11 } }
      },
      y: {
        grid: { color: isDark ? 'rgba(39, 39, 42, 0.4)' : 'rgba(228, 228, 231, 0.7)' },
        ticks: { color: '#71717a', font: { size: 11 } }
      }
    }
  };

  return (
    <div className="space-y-5 pb-24 md:pb-12 max-w-6xl mx-auto">
      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-900/30 rounded-xl p-4 shadow-xs">
          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase font-mono">Current BF</span>
          <div className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mt-1">
            {currentBF !== null ? `${currentBF}%` : '--'}
          </div>
          <span className="text-[11px] text-zinc-400 dark:text-zinc-500 font-mono">US Navy Formula</span>
        </div>

        <div className="border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-900/30 rounded-xl p-4 shadow-xs">
          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase font-mono">Goal Target</span>
          <div className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mt-1">
            {goalBodyFat !== null ? `${goalBodyFat}%` : '--'}
          </div>
          <span className="text-[11px] text-zinc-400 dark:text-zinc-500 font-mono">
            {bfToGoal !== null ? (parseFloat(bfToGoal) > 0 ? `${bfToGoal}% to target` : 'Achieved') : 'Not set'}
          </span>
        </div>

        <div className="border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-900/30 rounded-xl p-4 shadow-xs">
          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase font-mono">Current Weight</span>
          <div className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mt-1">
            {currentWeight !== null ? `${currentWeight} kg` : '--'}
          </div>
          <span className="text-[11px] text-zinc-400 dark:text-zinc-500 font-mono">
            {profile?.height ? `Height: ${profile.height}cm` : 'Height not set'}
          </span>
        </div>

        <div className="border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-900/30 rounded-xl p-4 shadow-xs">
          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase font-mono">Net Delta</span>
          <div className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mt-1">
            {weightDiff !== '0.0' ? (parseFloat(weightDiff) > 0 ? `+${weightDiff} kg` : `${weightDiff} kg`) : '0.0 kg'}
          </div>
          <span className="text-[11px] text-zinc-400 dark:text-zinc-500 font-mono">{sortedLogs.length} data points</span>
        </div>
      </div>

      {/* Chart 1: Body Fat % vs Goal Line */}
      <div className="border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-900/30 rounded-xl p-4 sm:p-5 shadow-xs">
        <div className="pb-3 border-b border-zinc-200 dark:border-zinc-900 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-200">Body Fat % Progression</h3>
            <p className="text-xs text-zinc-500">Calculated trend vs target line</p>
          </div>
        </div>

        <div className="h-64 sm:h-72 w-full pt-3">
          {sortedLogs.length === 0 ? (
            <div className="h-full flex items-center justify-center text-zinc-400 dark:text-zinc-600 text-xs">
              No measurements recorded yet.
            </div>
          ) : (
            <Line data={bodyFatChartData} options={chartOptions} />
          )}
        </div>
      </div>

      {/* Chart 2: Weight Progression */}
      <div className="border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-900/30 rounded-xl p-4 sm:p-5 shadow-xs">
        <div className="pb-3 border-b border-zinc-200 dark:border-zinc-900 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-200">Weight Progression (kg)</h3>
            <p className="text-xs text-zinc-500">Scale recordings over time</p>
          </div>
        </div>

        <div className="h-64 sm:h-72 w-full pt-3">
          {sortedLogs.length === 0 ? (
            <div className="h-full flex items-center justify-center text-zinc-400 dark:text-zinc-600 text-xs">
              No measurements recorded yet.
            </div>
          ) : (
            <Line data={weightChartData} options={chartOptions} />
          )}
        </div>
      </div>
    </div>
  );
}
