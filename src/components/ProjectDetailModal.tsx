import React, { useEffect } from 'react';
import type { PortfolioProject } from '../types/portfolio.ts';
import { VideoPlayer } from './VideoPlayer.tsx';
import { ColorGradingCompare } from './ColorGradingCompare.tsx';
import { X, Calendar, User, Film, MonitorPlay, ArrowRight, Layers, Sliders } from 'lucide-react';

interface ProjectDetailModalProps {
  project: PortfolioProject | null;
  onClose: () => void;
  onInquireSimilar: (project: PortfolioProject) => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  onClose,
  onInquireSimilar,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (project) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  const hasColorGrade = Boolean(project.colorGradingBeforeUrl && project.colorGradingAfterUrl);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-[#0B0B0D]/95 backdrop-blur-xl overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-5xl bg-[#171719] border border-[#26262B] rounded-2xl overflow-hidden shadow-2xl my-auto">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-[#26262B] bg-[#0B0B0D]">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-[#FF6A2B]/10 border border-[#FF6A2B]/30 text-xs font-mono-tag uppercase tracking-wider text-[#FF6A2B]">
              {project.category}
            </span>
            <span className="text-xs font-mono-tag text-[#A5A5AA] hidden sm:inline">
              Source: {project.videoSourceType.toUpperCase()}
            </span>
          </div>

          <button
            onClick={onClose}
            aria-label="Close Project Modal"
            className="p-2 rounded-lg bg-[#171719] border border-[#26262B] text-[#A5A5AA] hover:text-[#F5F5F5] hover:border-[#FF6A2B] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player Section */}
        <div className="p-4 sm:p-6 bg-[#0B0B0D]">
          <VideoPlayer
            url={project.videoUrl}
            poster={project.thumbnailUrl}
            title={project.title}
            aspectRatio={project.aspectRatio || '16:9'}
            autoPlay={true}
            muted={false}
          />
        </div>

        {/* Project Details Body */}
        <div className="p-6 sm:p-8 space-y-8">
          {/* Title & Client Headline */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 border-b border-[#26262B] pb-6">
            <div>
              <h2 id="project-title" className="font-display font-extrabold text-2xl sm:text-4xl text-[#F5F5F5] mb-2">
                {project.title}
              </h2>
              <div className="flex flex-wrap items-center gap-4 text-xs font-mono-tag text-[#A5A5AA]">
                {project.clientName && (
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#FF6A2B]" />
                    <span>Client: {project.clientName}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#FF6A2B]" />
                  <span>Completed: {project.projectDate}</span>
                </div>
                {project.duration && (
                  <div className="flex items-center gap-1.5">
                    <Film className="w-3.5 h-3.5 text-[#FF6A2B]" />
                    <span>Run Time: {project.duration}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Inquire Button */}
            <button
              onClick={() => onInquireSimilar(project)}
              className="px-6 py-3 rounded bg-[#FF6A2B] hover:bg-[#FF7F47] text-[#0B0B0D] font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap shadow-md shadow-[#FF6A2B]/20"
            >
              <span>Book Similar Edit</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Description & Software Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <h3 className="font-display font-bold text-lg text-white">Project Creative Brief &amp; Execution</h3>
              <p className="text-sm text-[#A5A5AA] leading-relaxed">
                {project.description}
              </p>

              {project.projectNotes && (
                <div className="mt-4 p-4 rounded-lg bg-[#0B0B0D] border border-[#26262B]">
                  <h4 className="text-xs font-mono-tag uppercase tracking-wider text-[#FF6A2B] mb-1">
                    Timeline Notes &amp; Technical Approach
                  </h4>
                  <p className="text-xs text-[#A5A5AA] leading-relaxed">
                    {project.projectNotes}
                  </p>
                </div>
              )}
            </div>

            {/* Software & Specs Sidebar */}
            <div className="bg-[#0B0B0D] p-5 rounded-xl border border-[#26262B] space-y-4">
              <div>
                <span className="text-[11px] font-mono-tag uppercase tracking-wider text-[#A5A5AA] block mb-2">
                  Post-Production Suite
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {project.editingSoftware.map((software) => (
                    <span
                      key={software}
                      className="px-2.5 py-1 rounded bg-[#171719] border border-[#26262B] text-xs font-mono-tag text-[#F5F5F5]"
                    >
                      {software}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-[#26262B] text-xs font-mono-tag text-[#A5A5AA] space-y-1.5">
                <div>Aspect Ratio: <span className="text-white">{project.aspectRatio || '16:9'}</span></div>
                <div>Status: <span className="text-emerald-400">Published Master</span></div>
              </div>
            </div>
          </div>

          {/* Interactive Color Grading Before / After comparison if present */}
          {hasColorGrade && (
            <div className="pt-6 border-t border-[#26262B] space-y-4">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#FF6A2B]" />
                <h3 className="font-display font-bold text-lg text-white">
                  Color Grading Pass (Log vs Graded Look)
                </h3>
              </div>
              <p className="text-xs text-[#A5A5AA]">
                Drag the slider left and right to inspect the raw exposure vs our custom film emulation grade.
              </p>
              <ColorGradingCompare
                beforeImage={project.colorGradingBeforeUrl!}
                afterImage={project.colorGradingAfterUrl!}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
