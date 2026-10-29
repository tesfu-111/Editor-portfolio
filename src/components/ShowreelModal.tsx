import React, { useEffect } from 'react';
import { VideoPlayer } from './VideoPlayer.tsx';
import { X, Sparkles } from 'lucide-react';

interface ShowreelModalProps {
  url: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ShowreelModal: React.FC<ShowreelModalProps> = ({
  url,
  isOpen,
  onClose,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-[#0B0B0D]/95 backdrop-blur-xl animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-5xl bg-[#171719] border border-[#26262B] rounded-2xl overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-[#26262B] bg-[#0B0B0D]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FF6A2B] animate-pulse" />
            <span className="font-display font-bold text-sm text-white uppercase tracking-wider">
              2026 Master Showreel
            </span>
          </div>

          <button
            onClick={onClose}
            aria-label="Close Showreel"
            className="p-1.5 rounded-lg bg-[#171719] border border-[#26262B] text-[#A5A5AA] hover:text-white hover:border-[#FF6A2B] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 bg-[#0B0B0D]">
          <VideoPlayer
            url={url}
            title="AURA CUTS 2026 Showreel"
            aspectRatio="16:9"
            autoPlay={true}
            muted={false}
          />
        </div>
      </div>
    </div>
  );
};
