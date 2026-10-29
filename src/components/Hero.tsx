import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Play, Volume2, Film } from 'lucide-react';
import type { SiteSettings } from '../types/portfolio.ts';

interface HeroProps {
  settings: SiteSettings;
  onExploreWork: () => void;
  onWorkTogether: () => void;
  onOpenReelModal: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  settings,
  onExploreWork,
  onWorkTogether,
  onOpenReelModal,
}) => {
  const [videoFailed, setVideoFailed] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [timecode, setTimecode] = useState('00:04:18:12');
  const videoRef = useRef<HTMLVideoElement>(null);

  // Timecode frame ticker
  useEffect(() => {
    let frame = 12;
    let sec = 18;
    const interval = setInterval(() => {
      frame = (frame + 1) % 24;
      if (frame === 0) sec = (sec + 1) % 60;
      const sStr = sec < 10 ? `0${sec}` : `${sec}`;
      const fStr = frame < 10 ? `0${frame}` : `${frame}`;
      setTimecode(`00:04:${sStr}:${fStr}`);
    }, 41); // ~24 FPS
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const shouldRenderVideo =
    settings.heroBackgroundMode === 'video' &&
    Boolean(settings.heroVideoUrl) &&
    !videoFailed &&
    !prefersReducedMotion;

  return (
    <div className="relative w-full bg-[#0B0B0D]">
      {/* Viewport Frame */}
      <section className="relative w-full min-h-[90vh] lg:min-h-screen flex flex-col justify-between overflow-hidden pt-28 pb-12">
        {/* Background Layer: Video Mode with Fallback */}
        {shouldRenderVideo ? (
          <video
            ref={videoRef}
            src={settings.heroVideoUrl}
            poster={settings.heroImageUrl}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            onError={() => setVideoFailed(true)}
            className="absolute inset-0 w-full h-full object-cover scale-105 filter brightness-70 contrast-110 pointer-events-none"
          />
        ) : (
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center transition-all duration-700 filter brightness-65 pointer-events-none"
            style={{
              backgroundImage: `url("${settings.heroImageUrl || '/src/assets/images/hero_cinematic_director_1793157693542.jpg'}")`,
            }}
          />
        )}

        {/* Cinematic Scrims & Vignettes */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0D] via-[#0B0B0D]/60 to-[#0B0B0D]/80 pointer-events-none" />
        <div className="absolute inset-0 bg-radial-at-c from-transparent via-[#0B0B0D]/40 to-[#0B0B0D]/90 pointer-events-none" />

        {/* Top Hud Bar: Live Studio Telemetry (Clean unboxed text, no static pills) */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 w-full flex items-center justify-between text-xs font-mono-tag text-[#A5A5AA] border-b border-[#26262B]/60 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-[#FF6A2B] font-bold tracking-wider">REC</span>
            <span className="tabular-nums tracking-widest text-white">{timecode}</span>
            <span className="hidden sm:inline" aria-hidden="true">·</span>
            <span className="hidden sm:inline">23.976 FPS</span>
            <span className="hidden sm:inline" aria-hidden="true">·</span>
            <span className="hidden md:inline">4K DCI · PRORES 4444</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Animated Audio Waveform Bars */}
            <div className="hidden sm:flex items-end gap-0.5 h-3">
              <div className="w-0.5 bg-[#FF6A2B] h-2 animate-pulse" />
              <div className="w-0.5 bg-[#FF6A2B] h-3 animate-pulse delay-75" />
              <div className="w-0.5 bg-[#FF6A2B] h-1.5 animate-pulse delay-150" />
              <div className="w-0.5 bg-[#FF6A2B] h-2.5 animate-pulse delay-100" />
              <div className="w-0.5 bg-[#FF6A2B] h-1 animate-pulse delay-200" />
            </div>
            <span className="text-[11px] uppercase tracking-wider text-[#D4D4D8]">
              {settings.brandTagline || 'Cinematic Post-Production'}
            </span>
          </div>
        </div>

        {/* Central Hero Core */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8 text-center my-auto py-12 flex flex-col items-center">
          {/* Natural human editorial kicker without pills */}
          <div className="text-xs sm:text-sm font-mono-tag uppercase tracking-widest text-[#FF6A2B] mb-5">
            {settings.heroSubtitle || 'Video Editor · Cinematic Storytelling · Motion Graphics'}
          </div>

          {/* Headline with text-balance to eradicate orphans */}
          <h1 className="font-display font-extrabold text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-[#F5F5F5] uppercase leading-[1.02] max-w-4xl mb-6 text-balance">
            {settings.heroHeadline || 'I Turn Raw Footage Into Powerful Stories.'}
          </h1>

          {/* Subtitle / Lead */}
          <p className="text-base sm:text-lg md:text-xl text-[#A5A5AA] font-normal max-w-2xl leading-relaxed mb-10 text-balance">
            High-impact narrative editing, high-end ACES color grading, and dynamic retention-driven pacing for commercial campaigns, music videos, and visionary creators.
          </p>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <button
              onClick={onExploreWork}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#FF6A2B] hover:bg-[#FF7F47] text-[#0B0B0D] font-display font-bold text-xs uppercase tracking-wider transition-all duration-200 transform hover:-translate-y-0.5 shadow-xl shadow-[#FF6A2B]/20 flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
            >
              <span>{settings.heroPrimaryCtaText || 'Explore My Work'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onWorkTogether}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#171719]/90 hover:bg-[#1D1D21] border border-[#26262B] hover:border-[#FF6A2B]/60 text-[#F5F5F5] font-display font-semibold text-xs uppercase tracking-wider transition-all duration-200 backdrop-blur-sm cursor-pointer whitespace-nowrap"
            >
              <span>{settings.heroSecondaryCtaText || "Let's Work Together"}</span>
            </button>

            {/* Showreel quick trigger */}
            {settings.showReelUrl && (
              <button
                onClick={onOpenReelModal}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-[#0B0B0D]/80 hover:bg-[#171719] border border-[#26262B] hover:border-[#FF6A2B] text-xs font-mono-tag uppercase tracking-wider text-white transition-all cursor-pointer group whitespace-nowrap"
              >
                <div className="w-5 h-5 rounded-full bg-[#FF6A2B] text-[#0B0B0D] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play className="w-2.5 h-2.5 fill-current translate-x-0.5" />
                </div>
                <span>Play 2026 Showreel</span>
              </button>
            )}
          </div>
        </div>

        {/* Bottom subtle scroll prompt */}
        <div className="relative z-10 text-center">
          <button
            onClick={onExploreWork}
            className="inline-flex items-center gap-2 text-xs font-mono-tag text-[#A5A5AA] hover:text-[#FF6A2B] transition-colors cursor-pointer"
          >
            <span className="tracking-widest uppercase">Scrub Timeline</span>
            <span className="text-[#FF6A2B]">&darr;</span>
          </button>
        </div>
      </section>

      {/* 4-Column KPI Proof Strip (Claim-to-Proof Placement right below hero) */}
      <div className="border-y border-[#26262B] bg-[#171719]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          <div>
            <div className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight tabular-nums">
              120M<span className="text-[#FF6A2B]">+</span>
            </div>
            <div className="text-xs font-mono-tag text-[#A5A5AA] mt-1 uppercase tracking-wider">
              Organic Audience Impressions
            </div>
          </div>

          <div>
            <div className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight tabular-nums">
              850<span className="text-[#FF6A2B]">+</span>
            </div>
            <div className="text-xs font-mono-tag text-[#A5A5AA] mt-1 uppercase tracking-wider">
              Hours in DaVinci &amp; Premiere
            </div>
          </div>

          <div>
            <div className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight tabular-nums">
              48<span className="text-[#FF6A2B]">HR</span>
            </div>
            <div className="text-xs font-mono-tag text-[#A5A5AA] mt-1 uppercase tracking-wider">
              Express Delivery Turnaround
            </div>
          </div>

          <div>
            <div className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight tabular-nums">
              100<span className="text-[#FF6A2B]">%</span>
            </div>
            <div className="text-xs font-mono-tag text-[#A5A5AA] mt-1 uppercase tracking-wider">
              On-Time Delivery Milestone Record
            </div>
          </div>
        </div>
      </div>

      {/* Infinite Marquee Ribbon Divider */}
      <div className="py-3 bg-[#0B0B0D] overflow-hidden whitespace-nowrap border-b border-[#26262B] text-xs font-mono-tag uppercase tracking-widest text-[#A5A5AA]/80 select-none">
        <div className="inline-block animate-marquee">
          <span>SELECTED WORKS · ACES COLOR SCIENCE · HIGH-RETENTION ARCHITECTURE · EDITORIAL PACING · MOTION GRAPHICS · DIRECTORIAL CUTS · SOUND DESIGN · FOLEY LAYERING · </span>
          <span>SELECTED WORKS · ACES COLOR SCIENCE · HIGH-RETENTION ARCHITECTURE · EDITORIAL PACING · MOTION GRAPHICS · DIRECTORIAL CUTS · SOUND DESIGN · FOLEY LAYERING · </span>
        </div>
      </div>
    </div>
  );
};
