import React, { useState } from 'react';
import { X, Copy, Check } from 'lucide-react';
import { generateWorkoutAIExportPrompt, generateDietAIExportPrompt } from '../utils/storage';

export default function AiExportModal({
  isOpen,
  onClose,
  workoutLogs,
  dietLogs,
  profile,
  measurementLogs,
  showToast
}) {
  const [copiedType, setCopiedType] = useState(null);
  const [activeTab, setActiveTab] = useState('workout');

  if (!isOpen) return null;

  const workoutPrompt = generateWorkoutAIExportPrompt(workoutLogs, profile, measurementLogs);
  const dietPrompt = generateDietAIExportPrompt(dietLogs, profile, measurementLogs);

  const handleCopy = (type, text) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    showToast(`Copied ${type === 'workout' ? 'Workout' : 'Diet'} prompt to clipboard.`);

    setTimeout(() => {
      setCopiedType(null);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden flex flex-col max-h-[88vh] shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-200 dark:border-zinc-900 bg-zinc-50/60 dark:bg-zinc-950">
          <div>
            <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">AI Feedback Export</h3>
            <p className="text-[11px] text-zinc-500">Copy pre-formatted prompt for your AI coach</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex p-1.5 gap-1.5 bg-zinc-100 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-900">
          <button
            onClick={() => setActiveTab('workout')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium transition ${
              activeTab === 'workout'
                ? 'bg-white text-zinc-900 shadow-xs dark:bg-zinc-800 dark:text-zinc-100'
                : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            Workout Progression (2 Wks)
          </button>
          <button
            onClick={() => setActiveTab('diet')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium transition ${
              activeTab === 'diet'
                ? 'bg-white text-zinc-900 shadow-xs dark:bg-zinc-800 dark:text-zinc-100'
                : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            Diet Log (7 Days)
          </button>
        </div>

        {/* Prompt content */}
        <div className="p-5 overflow-y-auto space-y-3.5 flex-1">
          <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono">
            <span>PROMPT PREVIEW:</span>
            <span>{activeTab === 'workout' ? '14 Days Logged' : '7 Days Logged'}</span>
          </div>

          <div className="p-3.5 bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-900 rounded-lg font-mono text-xs text-zinc-800 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed max-h-56 overflow-y-auto select-all">
            {activeTab === 'workout' ? workoutPrompt : dietPrompt}
          </div>

          <button
            onClick={() =>
              handleCopy(
                activeTab,
                activeTab === 'workout' ? workoutPrompt : dietPrompt
              )
            }
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-950 font-medium rounded-lg text-xs transition"
          >
            {copiedType === activeTab ? (
              <>
                <Check className="w-3.5 h-3.5" /> Copied to Clipboard
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" /> Copy Prompt
              </>
            )}
          </button>

          <p className="text-[11px] text-zinc-500 leading-relaxed text-center">
            Paste this directly into ChatGPT, Claude, or Gemini. Once the AI returns an updated JSON, click <strong>JSON</strong> in the header to sync.
          </p>
        </div>
      </div>
    </div>
  );
}
