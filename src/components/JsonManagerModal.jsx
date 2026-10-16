import React, { useState } from 'react';
import { X, Check, Copy, RotateCcw } from 'lucide-react';
import { DEFAULT_WORKOUT_PLAN, DEFAULT_DIET_PLAN, DEFAULT_PROFILE, normalizeWorkoutPlan } from '../utils/storage';

export default function JsonManagerModal({
  isOpen,
  onClose,
  profile,
  workoutPlan,
  dietPlan,
  onUpdatePlan,
  showToast
}) {
  const [jsonInput, setJsonInput] = useState('');
  const [validationError, setValidationError] = useState(null);
  const [validationSuccess, setValidationSuccess] = useState(false);

  if (!isOpen) return null;

  const currentPlanJson = JSON.stringify(
    {
      profile: profile || DEFAULT_PROFILE,
      workoutPlan: workoutPlan || DEFAULT_WORKOUT_PLAN,
      dietPlan: dietPlan || DEFAULT_DIET_PLAN
    },
    null,
    2
  );

  const handleCopyCurrent = () => {
    navigator.clipboard.writeText(currentPlanJson);
    showToast('Current JSON copied to clipboard.');
  };

  const handleLoadSample = () => {
    const sample = JSON.stringify(
      {
        profile: {
          weight: 76.5,
          height: 178,
          neck: 38.5,
          waist: 83.0,
          goalBodyFat: 12.0,
          bodyType: "Mesomorph",
          trainingDays: 4
        },
        workoutPlan: DEFAULT_WORKOUT_PLAN,
        dietPlan: DEFAULT_DIET_PLAN
      },
      null,
      2
    );
    setJsonInput(sample);
    setValidationError(null);
    setValidationSuccess(true);
  };

  const handleValidateAndApply = () => {
    setValidationError(null);
    setValidationSuccess(false);

    if (!jsonInput.trim()) {
      setValidationError('Please paste your AI-generated JSON before applying.');
      return;
    }

    try {
      const parsed = JSON.parse(jsonInput);

      if (!parsed || typeof parsed !== 'object') {
        throw new Error('Root JSON must be an object.');
      }

      if (!parsed.profile && !parsed.workoutPlan && !parsed.dietPlan) {
        throw new Error('JSON must contain at least "profile", "workoutPlan", or "dietPlan".');
      }

      if (parsed.profile && typeof parsed.profile !== 'object') {
        throw new Error('"profile" must be an object.');
      }

      if (parsed.workoutPlan && !Array.isArray(parsed.workoutPlan)) {
        throw new Error('"workoutPlan" must be an array of days.');
      }

      if (parsed.dietPlan && typeof parsed.dietPlan !== 'object') {
        throw new Error('"dietPlan" must be an object.');
      }

      const normalizedWorkout = parsed.workoutPlan ? normalizeWorkoutPlan(parsed.workoutPlan) : null;

      onUpdatePlan({
        newProfile: parsed.profile || null,
        newWorkoutPlan: normalizedWorkout,
        newDietPlan: parsed.dietPlan || null
      });

      setValidationSuccess(true);
      showToast('Plan & profile updated. Historical logs preserved.');
      setTimeout(() => {
        onClose();
      }, 700);
    } catch (err) {
      setValidationError(err.message || 'Invalid JSON format.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden flex flex-col max-h-[88vh] shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-200 dark:border-zinc-900 bg-zinc-50/60 dark:bg-zinc-950">
          <div>
            <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">Sync Plan & Profile JSON</h3>
            <p className="text-[11px] text-zinc-500">Updates profile stats, routine & diet without modifying logs</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="px-5 py-2.5 bg-zinc-50 dark:bg-zinc-900/40 border-b border-zinc-200 dark:border-zinc-900 flex items-center justify-between text-xs">
          <span className="text-[11px] text-zinc-500 font-mono">Logs remain intact</span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyCurrent}
              className="px-2.5 py-1 bg-white hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 rounded text-xs transition flex items-center gap-1"
            >
              <Copy className="w-3 h-3 text-zinc-500 dark:text-zinc-400" /> Copy Current
            </button>
            <button
              onClick={handleLoadSample}
              className="px-2.5 py-1 bg-white hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 border border-zinc-200 dark:border-zinc-800 rounded text-xs transition flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3 text-zinc-500 dark:text-zinc-400" /> Sample
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 flex-1 flex flex-col space-y-3 overflow-y-auto">
          <textarea
            value={jsonInput}
            onChange={(e) => {
              setJsonInput(e.target.value);
              setValidationError(null);
              setValidationSuccess(false);
            }}
            placeholder={`{\n  "profile": {\n    "weight": 76.5,\n    "height": 178,\n    "neck": 38.5,\n    "waist": 83.0,\n    "goalBodyFat": 12,\n    "bodyType": "Mesomorph",\n    "trainingDays": 4\n  },\n  "workoutPlan": [ ... ],\n  "dietPlan": { ... }\n}`}
            className="w-full flex-1 min-h-[220px] bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-lg p-3 font-mono text-xs text-zinc-900 dark:text-zinc-200 outline-none focus:border-zinc-400 dark:focus:border-zinc-500 resize-none"
          />

          {validationError && (
            <p className="text-xs text-red-600 dark:text-red-400 font-mono">{validationError}</p>
          )}

          {validationSuccess && (
            <p className="text-xs text-emerald-600 dark:text-zinc-300 font-mono">✓ Successfully applied to profile & plans</p>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-zinc-50/60 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-900 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white text-xs transition"
          >
            Cancel
          </button>
          <button
            onClick={handleValidateAndApply}
            className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-900 font-medium rounded-lg text-xs transition"
          >
            Apply Plan & Profile
          </button>
        </div>
      </div>
    </div>
  );
}
