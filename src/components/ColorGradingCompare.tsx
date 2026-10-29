import React, { useState, useRef, useCallback } from 'react';

interface ColorGradingCompareProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
}

export const ColorGradingCompare: React.FC<ColorGradingCompareProps> = ({
  beforeImage,
  afterImage,
  beforeLabel = 'Log / Rec.709 Flat',
  afterLabel = 'Final Film Grade',
  className = '',
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
    setSliderPosition(percent);
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={() => setIsDragging(true)}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      className={`relative select-none overflow-hidden rounded-lg border border-[#26262B] bg-[#0B0B0D] aspect-video cursor-ew-resize group ${className}`}
    >
      {/* After Image (Background) */}
      <img
        src={afterImage}
        alt={afterLabel}
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
      />
      <div className="absolute top-3 right-3 px-2 py-1 rounded bg-[#0B0B0D]/80 backdrop-blur-md border border-[#26262B] text-[10px] font-mono uppercase tracking-wider text-[#FF6A2B] z-10 pointer-events-none">
        {afterLabel}
      </div>

      {/* Before Image (Clipped Overlay) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${sliderPosition}%` }}
      >
        <img
          src={beforeImage}
          alt={beforeLabel}
          className="absolute inset-0 w-full h-full object-cover max-w-none"
          style={{ width: containerRef.current ? `${containerRef.current.offsetWidth}px` : '100%' }}
          loading="lazy"
        />
        <div className="absolute top-3 left-3 px-2 py-1 rounded bg-[#0B0B0D]/80 backdrop-blur-md border border-[#26262B] text-[10px] font-mono uppercase tracking-wider text-[#A5A5AA] z-10 pointer-events-none">
          {beforeLabel}
        </div>
      </div>

      {/* Divider Bar */}
      <div
        className="absolute top-0 bottom-0 w-[2px] bg-[#FF6A2B] z-20 pointer-events-none"
        style={{ left: `${sliderPosition}%` }}
      >
        {/* Handle Knob */}
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#171719] border-2 border-[#FF6A2B] shadow-lg flex items-center justify-center text-white text-[10px] pointer-events-none">
          <span className="font-mono text-[#FF6A2B]">&#8644;</span>
        </div>
      </div>
    </div>
  );
};
