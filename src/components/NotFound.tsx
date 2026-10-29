import React from 'react';
import { Film, Home, ArrowLeft } from 'lucide-react';

interface NotFoundProps {
  onGoHome: () => void;
}

export const NotFound: React.FC<NotFoundProps> = ({ onGoHome }) => {
  return (
    <div className="min-h-screen bg-[#0B0B0D] flex items-center justify-center px-6 py-24 text-center">
      <div className="max-w-md mx-auto space-y-6">
        <div className="w-20 h-20 rounded-2xl bg-[#171719] border border-[#26262B] flex items-center justify-center mx-auto text-[#FF6A2B] shadow-2xl">
          <Film className="w-10 h-10 animate-pulse" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono-tag uppercase tracking-widest text-[#FF6A2B]">
            404 // Cut Not Found
          </span>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl uppercase tracking-tight text-white">
            Left On The Cutting Room Floor
          </h1>
          <p className="text-sm text-[#A5A5AA] leading-relaxed">
            The reel or frame you are attempting to scrub does not exist or has been archived from this timeline.
          </p>
        </div>

        <button
          onClick={onGoHome}
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#FF6A2B] hover:bg-[#FF7F47] text-[#0B0B0D] font-display font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-[#FF6A2B]/20"
        >
          <Home className="w-4 h-4" />
          <span>Return To Timeline</span>
        </button>
      </div>
    </div>
  );
};
