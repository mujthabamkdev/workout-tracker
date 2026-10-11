import React from 'react';
import { Code, Download, Flame } from 'lucide-react';

export default function Header({
  onOpenAiExport,
  onOpenJsonManager,
  installPrompt,
  onInstallApp,
  currentStreak = 0
}) {
  return (
    <header className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-900 px-4 sm:px-6 py-3 transition-colors">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-100">
            A
          </div>
          <span className="font-semibold text-base tracking-tight text-zinc-100">
            AegisFit
          </span>
          <span className="hidden sm:inline-block text-[11px] text-zinc-500 font-mono pl-1">
            v1.0
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Subtle Streak */}
          {currentStreak > 0 && (
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-900/60 border border-zinc-800/80 text-xs text-zinc-400">
              <Flame className="w-3.5 h-3.5 text-zinc-400" />
              <span>{currentStreak}d streak</span>
            </div>
          )}

          {/* PWA Install */}
          {installPrompt && (
            <button
              onClick={onInstallApp}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 rounded-lg text-xs font-medium transition"
              title="Install App"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Install</span>
            </button>
          )}

          {/* Sync JSON */}
          <button
            onClick={onOpenJsonManager}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 rounded-lg text-xs font-medium transition"
            title="Import or paste plan JSON"
          >
            <Code className="w-3.5 h-3.5 text-zinc-400" />
            <span>JSON</span>
          </button>

          {/* Export */}
          <button
            onClick={onOpenAiExport}
            className="px-3 py-1.5 bg-zinc-100 hover:bg-white text-zinc-900 font-medium rounded-lg text-xs transition"
            title="Export progression"
          >
            Export
          </button>
        </div>
      </div>
    </header>
  );
}
