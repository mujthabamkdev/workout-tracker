import React from 'react';
import { X, ExternalLink } from 'lucide-react';
import { getYouTubeEmbedUrl } from '../utils/storage';

export default function YouTubeModal({ isOpen, onClose, exerciseName, youtubeLink }) {
  if (!isOpen) return null;

  const embedUrl = getYouTubeEmbedUrl(youtubeLink);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-900 bg-zinc-950">
          <h3 className="font-medium text-sm text-zinc-100 truncate pr-2">
            {exerciseName || 'Exercise Video'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-500 hover:text-zinc-200 rounded-lg hover:bg-zinc-900 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video Frame */}
        <div className="relative w-full aspect-video bg-black flex items-center justify-center">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title={exerciseName}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <div className="text-center p-6 text-zinc-500 text-xs">
              <p className="mb-3">Cannot embed this video format directly.</p>
              <a
                href={youtubeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 text-zinc-900 rounded-md font-medium text-xs transition"
              >
                Watch on YouTube <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-zinc-950 flex items-center justify-between border-t border-zinc-900 text-[11px] text-zinc-500 font-mono">
          <span className="truncate pr-2">{youtubeLink}</span>
          <a
            href={youtubeLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-zinc-400 hover:text-zinc-200 shrink-0"
          >
            Open <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
