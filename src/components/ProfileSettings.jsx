import React, { useState } from 'react';
import { Check, Scale } from 'lucide-react';
import { calculateBodyFat } from '../utils/storage';

export default function ProfileSettings({
  profile,
  onSaveProfile,
  onRecordMeasurement,
  showToast
}) {
  const [formData, setFormData] = useState({
    weight: profile?.weight ?? 76.5,
    height: profile?.height ?? 178,
    neck: profile?.neck ?? 38.5,
    waist: profile?.waist ?? 83.0,
    goalBodyFat: profile?.goalBodyFat ?? 12.0,
    bodyType: profile?.bodyType ?? 'Mesomorph',
    trainingDays: profile?.trainingDays ?? 4
  });

  const calculatedBF = calculateBodyFat(formData.waist, formData.neck, formData.height);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveProfile(formData);
    showToast('Profile updated.');
  };

  const handleRecordAsMeasurement = () => {
    if (!calculatedBF) {
      showToast('Please check your waist and neck measurements.');
      return;
    }
    const now = new Date();
    onRecordMeasurement({
      id: `m_${Date.now()}`,
      date: now.toISOString().split('T')[0],
      time: now.toTimeString().slice(0, 5),
      weight: parseFloat(formData.weight),
      neck: parseFloat(formData.neck),
      waist: parseFloat(formData.waist),
      bodyFat: calculatedBF
    });
    showToast('Recorded to timeline.');
  };

  return (
    <div className="space-y-5 pb-24 md:pb-12 max-w-4xl mx-auto">
      {/* Top Banner */}
      <div className="border border-zinc-900 bg-zinc-900/30 rounded-xl p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">
              US Navy Formula
            </span>
            <h2 className="text-lg sm:text-xl font-semibold text-zinc-100">
              Profile & Goals
            </h2>
            <p className="text-xs text-zinc-500">
              Circumference measurements calculate your body fat % without calipers.
            </p>
          </div>

          <div className="border border-zinc-900 bg-zinc-900/60 rounded-lg p-3 text-center min-w-[150px]">
            <span className="text-[10px] text-zinc-500 uppercase font-mono block">Current BF</span>
            <div className="text-2xl font-semibold text-zinc-100 mt-0.5">
              {calculatedBF !== null ? `${calculatedBF}%` : '--'}
            </div>
            <span className="text-[11px] text-zinc-500 font-mono">
              Target: {formData.goalBodyFat}%
            </span>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="border border-zinc-900 bg-zinc-900/30 rounded-xl p-4 sm:p-5 space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-zinc-200">Body Measurements</h3>
          <p className="text-xs text-zinc-500">Used for body fat calculations and AI exports</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-zinc-900/50 p-3 rounded-lg border border-zinc-900">
            <label className="text-xs text-zinc-400 block mb-1">Current Weight (kg)</label>
            <input
              type="number"
              step="0.1"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) || '' })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-1.5 text-zinc-100 font-semibold text-sm outline-none focus:border-zinc-500"
              required
            />
          </div>

          <div className="bg-zinc-900/50 p-3 rounded-lg border border-zinc-900">
            <label className="text-xs text-zinc-400 block mb-1">Height (cm)</label>
            <input
              type="number"
              step="0.5"
              value={formData.height}
              onChange={(e) => setFormData({ ...formData, height: parseFloat(e.target.value) || '' })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-1.5 text-zinc-100 font-semibold text-sm outline-none focus:border-zinc-500"
              required
            />
          </div>

          <div className="bg-zinc-900/50 p-3 rounded-lg border border-zinc-900">
            <label className="text-xs text-zinc-400 block mb-1">Neck Circumference (cm)</label>
            <input
              type="number"
              step="0.5"
              value={formData.neck}
              onChange={(e) => setFormData({ ...formData, neck: parseFloat(e.target.value) || '' })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-1.5 text-zinc-100 font-semibold text-sm outline-none focus:border-zinc-500"
              required
            />
          </div>

          <div className="bg-zinc-900/50 p-3 rounded-lg border border-zinc-900">
            <label className="text-xs text-zinc-400 block mb-1">Waist Circumference (cm)</label>
            <input
              type="number"
              step="0.5"
              value={formData.waist}
              onChange={(e) => setFormData({ ...formData, waist: parseFloat(e.target.value) || '' })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-1.5 text-zinc-100 font-semibold text-sm outline-none focus:border-zinc-500"
              required
            />
          </div>
        </div>

        <div className="pt-2">
          <h3 className="text-sm font-semibold text-zinc-200">Goals & Preferences</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-zinc-900/50 p-3 rounded-lg border border-zinc-900">
            <label className="text-xs text-zinc-400 block mb-1">Goal Body Fat %</label>
            <input
              type="number"
              step="0.5"
              value={formData.goalBodyFat}
              onChange={(e) => setFormData({ ...formData, goalBodyFat: parseFloat(e.target.value) || '' })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-1.5 text-zinc-100 font-semibold text-sm outline-none focus:border-zinc-500"
              required
            />
          </div>

          <div className="bg-zinc-900/50 p-3 rounded-lg border border-zinc-900">
            <label className="text-xs text-zinc-400 block mb-1">Body Type</label>
            <select
              value={formData.bodyType}
              onChange={(e) => setFormData({ ...formData, bodyType: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-1.5 text-zinc-200 text-xs outline-none focus:border-zinc-500"
            >
              <option value="Ectomorph">Ectomorph (Lean/Hardgainer)</option>
              <option value="Mesomorph">Mesomorph (Athletic)</option>
              <option value="Endomorph">Endomorph (Carries mass)</option>
            </select>
          </div>

          <div className="bg-zinc-900/50 p-3 rounded-lg border border-zinc-900">
            <label className="text-xs text-zinc-400 block mb-1">Training Days / Week</label>
            <select
              value={formData.trainingDays}
              onChange={(e) => setFormData({ ...formData, trainingDays: parseInt(e.target.value) || 4 })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-1.5 text-zinc-200 text-xs outline-none focus:border-zinc-500"
            >
              <option value={3}>3 Days (Full Body)</option>
              <option value={4}>4 Days (Upper / Lower)</option>
              <option value={5}>5 Days (PPL + Upper/Lower)</option>
              <option value={6}>6 Days (PPL 2x)</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-zinc-900">
          <button
            type="button"
            onClick={handleRecordAsMeasurement}
            className="w-full sm:w-auto px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 rounded-lg text-xs transition flex items-center justify-center gap-1.5"
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Record as Entry</span>
          </button>

          <button
            type="submit"
            className="w-full sm:w-auto px-4 py-2 bg-zinc-100 hover:bg-white text-zinc-900 font-medium rounded-lg text-xs transition flex items-center justify-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" /> Save Profile
          </button>
        </div>
      </form>
    </div>
  );
}
