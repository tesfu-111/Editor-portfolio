import React, { useState, useMemo } from 'react';
import {
  ALL_CATEGORIES,
  type PortfolioProject,
  type ProjectCategory,
} from '../types/portfolio.ts';
import { Play, ArrowRight, Video } from 'lucide-react';

interface PortfolioGalleryProps {
  projects: PortfolioProject[];
  onSelectProject: (project: PortfolioProject) => void;
  onOpenDirectDetail?: (project: PortfolioProject) => void;
}

export const PortfolioGallery: React.FC<PortfolioGalleryProps> = ({
  projects,
  onSelectProject,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesCategory =
        selectedCategory === 'all' || project.category === selectedCategory;
      const matchesSearch =
        !searchQuery.trim() ||
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (project.clientName && project.clientName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        project.editingSoftware.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [projects, selectedCategory, searchQuery]);

  return (
    <section id="work" className="py-24 bg-[#0B0B0D] relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header with clean editorial typography */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 border-b border-[#26262B] pb-8">
          <div>
            <div className="text-xs font-mono-tag uppercase tracking-widest text-[#FF6A2B] mb-2">
              Selected Works &amp; Timelines
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-5xl uppercase tracking-tight text-[#F5F5F5]">
              Featured Cuts &amp; Repertoire
            </h2>
          </div>
          <p className="text-sm text-[#A5A5AA] max-w-md">
            Scrub through commercial spots, viral short-form retention architectures, narrative shorts, and color grading breakdowns.
          </p>
        </div>

        {/* Category Segmented Controls (Functional buttons, clean styling) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-4 mb-10 no-scrollbar">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-lg text-xs font-mono-tag uppercase tracking-wider transition-all whitespace-nowrap shrink-0 cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#FF6A2B] text-[#0B0B0D] font-bold shadow-md shadow-[#FF6A2B]/15'
                : 'bg-[#171719] border border-[#26262B] text-[#A5A5AA] hover:text-[#F5F5F5] hover:border-[#3D3D45]'
            }`}
          >
            All Works ({projects.length})
          </button>
          {ALL_CATEGORIES.map((category) => {
            const count = projects.filter((p) => p.category === category).length;
            const isSelected = selectedCategory === category;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-xs font-mono-tag uppercase tracking-wider transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-[#FF6A2B] text-[#0B0B0D] font-bold shadow-md shadow-[#FF6A2B]/15'
                    : 'bg-[#171719] border border-[#26262B] text-[#A5A5AA] hover:text-[#F5F5F5] hover:border-[#3D3D45]'
                }`}
              >
                {category} {count > 0 && <span className="opacity-70 ml-1">({count})</span>}
              </button>
            );
          })}
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="py-20 text-center rounded-2xl bg-[#171719]/40 border border-[#26262B] p-8">
            <Video className="w-12 h-12 text-[#A5A5AA] mx-auto mb-3 opacity-40" />
            <h3 className="font-display text-lg text-white mb-1">No Projects in this Category</h3>
            <p className="text-xs text-[#A5A5AA] mb-4">
              Switch category or add your own project reels via the Admin Dashboard.
            </p>
            <button
              onClick={() => setSelectedCategory('all')}
              className="text-xs text-[#FF6A2B] underline hover:text-[#FF7F47] cursor-pointer"
            >
              Reset Category Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => {
              const isPlaceholder = project.title.toLowerCase().includes('placeholder');
              return (
                <article
                  key={project.id}
                  onClick={() => onSelectProject(project)}
                  className="group relative flex flex-col bg-[#171719] border border-[#26262B] rounded-2xl overflow-hidden hover:border-[#FF6A2B]/60 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-2xl hover:shadow-[#FF6A2B]/10 hover:-translate-y-1"
                >
                  {/* Thumbnail Container */}
                  <div className="relative aspect-video w-full bg-[#0B0B0D] overflow-hidden">
                    <img
                      src={project.thumbnailUrl || '/src/assets/images/color_grade_cinematic_still_1793157693927.jpg'}
                      alt={project.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#171719] via-transparent to-black/40 group-hover:opacity-90 transition-opacity" />

                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-12 h-12 rounded-full bg-[#0B0B0D]/85 border border-[#FF6A2B] group-hover:bg-[#FF6A2B] group-hover:border-[#FF6A2B] text-[#FF6A2B] group-hover:text-[#0B0B0D] flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-xl">
                        <Play className="w-5 h-5 fill-current translate-x-0.5" />
                      </div>
                    </div>

                    {/* Duration & Aspect Ratio (Unboxed clean metadata) */}
                    <div className="absolute bottom-3 right-3 text-[10px] font-mono-tag tracking-wider text-white bg-[#0B0B0D]/80 backdrop-blur-md px-2 py-0.5 rounded border border-[#26262B]">
                      {project.duration || '02:00'} · {project.aspectRatio || '16:9'}
                    </div>

                    {isPlaceholder && (
                      <div className="absolute top-3 right-3 text-[10px] font-mono-tag tracking-wider text-yellow-300 bg-[#0B0B0D]/80 backdrop-blur-md px-2 py-0.5 rounded border border-yellow-500/40">
                        Sample Reel
                      </div>
                    )}
                  </div>

                  {/* Content Breakdown with Zero-Pill unboxed metadata */}
                  <div className="p-6 flex flex-col flex-1 justify-between">
                    <div>
                      {/* Clean Unboxed Metadata with separators */}
                      <div className="flex items-center gap-2 text-xs font-mono-tag text-[#FF6A2B] mb-2">
                        <span>{project.category}</span>
                        <span aria-hidden="true" className="text-[#A5A5AA]">·</span>
                        <span className="text-[#A5A5AA]">{project.projectDate}</span>
                        {project.clientName && (
                          <>
                            <span aria-hidden="true" className="text-[#A5A5AA]">·</span>
                            <span className="text-[#A5A5AA] truncate">{project.clientName}</span>
                          </>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="font-display font-bold text-xl text-[#F5F5F5] group-hover:text-[#FF6A2B] transition-colors leading-snug mb-2.5">
                        {project.title}
                      </h3>

                      {/* Description */}
                      <p className="text-xs text-[#A5A5AA] line-clamp-2 leading-relaxed mb-6">
                        {project.description}
                      </p>
                    </div>

                    {/* Software tags & Action Footer */}
                    <div className="pt-4 border-t border-[#26262B] flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[11px] font-mono-tag text-[#A5A5AA]">
                        {project.editingSoftware.slice(0, 2).join(' · ')}
                      </div>

                      <div className="flex items-center gap-1 text-xs font-mono-tag text-[#FF6A2B] group-hover:translate-x-1 transition-transform">
                        <span>Watch Cut</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
