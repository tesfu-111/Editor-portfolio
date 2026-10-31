import React from 'react';
import type { AboutData } from '../types/portfolio.ts';
import {
  Download,
  MapPin,
  CheckCircle,
  ArrowRight,
  Cpu,
  Workflow,
} from 'lucide-react';

interface AboutSectionProps {
  about: AboutData;
  onNavigateContact: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  about,
  onNavigateContact,
}) => {
  return (
    <section id="about" className="py-24 bg-[#0B0B0D] relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-24">
        {/* Top Hero Grid: Portrait + Bio & Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Portrait Column (5 cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-[#26262B] bg-[#171719] shadow-2xl group">
              <img
                src={
                  about.portraitUrl ||
                  'src/assets/images/director_portrait_monochrome_1793157695050.jpg'
                }
                alt={about.fullName}
                className="w-full aspect-[4/5] object-cover filter contrast-105 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0D] via-transparent to-transparent opacity-80" />

              {/* Status & Location Line */}
              <div className="absolute bottom-6 inset-x-6 space-y-2">
                <div className="px-4 py-2 rounded-xl bg-[#0B0B0D]/90 backdrop-blur-md border border-[#26262B] text-xs font-mono-tag text-[#F5F5F5] flex items-center justify-between">
                  <span className="text-[#FF6A2B] uppercase tracking-wider">Status:</span>
                  <span>{about.availabilityStatus || 'Available for Select Projects'}</span>
                </div>
                {about.location && (
                  <div className="flex items-center gap-1.5 text-xs font-mono-tag text-[#A5A5AA] px-2">
                    <MapPin className="w-3.5 h-3.5 text-[#FF6A2B]" />
                    <span>{about.location}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick CV Download button if provided */}
            {about.resumeUrl && (
              <a
                href={about.resumeUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 w-full py-3 px-4 rounded-xl bg-[#171719] hover:bg-[#1D1D21] border border-[#26262B] hover:border-[#FF6A2B] text-xs font-mono-tag uppercase tracking-wider text-[#F5F5F5] flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4 text-[#FF6A2B]" />
                <span>Download Creative Resume (PDF)</span>
              </a>
            )}
          </div>

          {/* Bio & Philosophy Column (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-8">
            <div>
              <div className="text-xs font-mono-tag uppercase tracking-widest text-[#FF6A2B] mb-2">
                Behind The Edit
              </div>
              <h2 className="font-display font-extrabold text-3xl sm:text-5xl uppercase tracking-tight text-[#F5F5F5] mb-2">
                {about.fullName}
              </h2>
              <p className="text-sm text-[#FF6A2B] font-mono-tag uppercase tracking-wide mb-6">
                {about.role}
              </p>

              {/* Bio Paragraphs */}
              <div className="space-y-4 text-sm sm:text-base text-[#A5A5AA] leading-relaxed">
                {about.bio.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>

              {/* Career Goals & Vision with clean border (No thick left border) */}
              {about.careerGoals && (
                <div className="mt-6 p-5 rounded-xl bg-[#171719] border border-[#26262B]">
                  <h4 className="font-display font-bold text-sm text-[#F5F5F5] mb-1">
                    Creative Trajectory &amp; Narrative Standards
                  </h4>
                  <p className="text-xs text-[#A5A5AA] leading-relaxed">
                    {about.careerGoals}
                  </p>
                </div>
              )}
            </div>

            {/* Editing Specialties Badges */}
            <div>
              <h4 className="text-xs font-mono-tag uppercase tracking-wider text-[#A5A5AA] mb-3">
                Core Editing Disciplines:
              </h4>
              <div className="flex flex-wrap gap-2">
                {about.specialties.map((spec) => (
                  <div
                    key={spec}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#171719] border border-[#26262B] text-xs text-[#F5F5F5]"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-[#FF6A2B]" />
                    <span>{spec}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Call to action bar */}
            <div className="pt-6 border-t border-[#26262B] flex flex-wrap items-center gap-4">
              <button
                onClick={onNavigateContact}
                className="px-6 py-3.5 rounded-xl bg-[#FF6A2B] hover:bg-[#FF7F47] text-[#0B0B0D] font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all"
              >
                <span>Discuss Your Timeline</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-xs font-mono-tag text-[#A5A5AA]">
                {about.experienceYears}+ Years Crafting Visual Narratives
              </div>
            </div>
          </div>
        </div>

        {/* Software & Technical Proficiency Matrix */}
        <div className="pt-16 border-t border-[#26262B]">
          <div className="mb-10 text-center max-w-2xl mx-auto">
            <div className="text-xs font-mono-tag uppercase tracking-widest text-[#FF6A2B] mb-2">
              Technical Toolset
            </div>
            <h3 className="font-display font-extrabold text-2xl sm:text-4xl uppercase text-white">
              Software Mastery &amp; Systems
            </h3>
            <p className="text-xs text-[#A5A5AA] mt-2">
              Production-hardened workflow centered on professional Adobe post-production and motion systems.
            </p>
          </div>

          <div
            className={`grid grid-cols-1 ${
              about.softwareSkills.length <= 2
                ? 'md:grid-cols-2 max-w-4xl mx-auto'
                : 'md:grid-cols-2 lg:grid-cols-3'
            } gap-6`}
          >
            {about.softwareSkills.map((skill) => (
              <div
                key={skill.name}
                className="p-5 rounded-xl bg-[#171719] border border-[#26262B] hover:border-[#FF6A2B]/40 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-display font-bold text-sm text-[#F5F5F5]">
                    {skill.name}
                  </span>
                  <span className="text-xs font-mono-tag text-[#FF6A2B] tabular-nums">
                    {skill.proficiency}%
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#0B0B0D] overflow-hidden mb-2">
                  <div
                    className="h-full bg-[#FF6A2B] rounded-full transition-all duration-1000"
                    style={{ width: `${skill.proficiency}%` }}
                  />
                </div>
                <span className="text-[10px] font-mono-tag uppercase tracking-wider text-[#A5A5AA]">
                  {skill.category}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 5-Step Creative Workflow */}
        <div className="pt-16 border-t border-[#26262B]">
          <div className="mb-12 text-center max-w-2xl mx-auto">
            <div className="text-xs font-mono-tag uppercase tracking-widest text-[#FF6A2B] mb-2">
              From Raw Ingest to Final Master
            </div>
            <h3 className="font-display font-extrabold text-2xl sm:text-4xl uppercase text-white">
              The 5-Phase Editing Protocol
            </h3>
            <p className="text-xs text-[#A5A5AA] mt-2">
              A structured, transparent pipeline ensuring zero lost footage, razor-sharp pacing, and punctual deliverables.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {about.creativeProcess.map((step) => (
              <div
                key={step.step}
                className="relative p-6 rounded-2xl bg-[#171719] border border-[#26262B] hover:border-[#FF6A2B] transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="text-2xl font-mono-tag font-bold text-[#FF6A2B] mb-3 tabular-nums">
                    0{step.step}
                  </div>
                  <h4 className="font-display font-bold text-base text-white mb-1.5 leading-snug">
                    {step.title}
                  </h4>
                  <p className="text-[11px] font-mono-tag uppercase text-[#FF6A2B] mb-3">
                    {step.subtitle}
                  </p>
                  <p className="text-xs text-[#A5A5AA] leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
