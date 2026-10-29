import React from 'react';
import type { ServiceItem } from '../types/portfolio.ts';
import {
  Smartphone,
  PlayCircle,
  Share2,
  Film,
  Sliders,
  Volume2,
  Layers,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
  Tag,
} from 'lucide-react';

interface ServicesSectionProps {
  services: ServiceItem[];
  onSelectServiceForInquiry: (service: ServiceItem) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  services,
  onSelectServiceForInquiry,
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Smartphone':
        return <Smartphone className="w-6 h-6 text-[#FF6A2B]" />;
      case 'PlayCircle':
        return <PlayCircle className="w-6 h-6 text-[#FF6A2B]" />;
      case 'Share2':
        return <Share2 className="w-6 h-6 text-[#FF6A2B]" />;
      case 'Film':
        return <Film className="w-6 h-6 text-[#FF6A2B]" />;
      case 'Sliders':
        return <Sliders className="w-6 h-6 text-[#FF6A2B]" />;
      case 'Volume2':
        return <Volume2 className="w-6 h-6 text-[#FF6A2B]" />;
      case 'Layers':
        return <Layers className="w-6 h-6 text-[#FF6A2B]" />;
      case 'Sparkles':
      default:
        return <Sparkles className="w-6 h-6 text-[#FF6A2B]" />;
    }
  };

  return (
    <section id="services" className="py-24 bg-[#0B0B0D] relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 border-b border-[#26262B] pb-8">
          <div>
            <div className="text-xs font-mono-tag uppercase tracking-widest text-[#FF6A2B] mb-2">
              Full-Stack Post-Production
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-5xl uppercase tracking-tight text-[#F5F5F5]">
              Services &amp; Capabilities
            </h2>
          </div>
          <p className="text-sm text-[#A5A5AA] max-w-md">
            From viral short-form retention architectures to high-end ACES color grading and commercial master exports. Every package is tailored to your release timeline.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="group flex flex-col justify-between bg-[#171719] border border-[#26262B] rounded-2xl p-6 hover:border-[#FF6A2B]/60 transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-xl hover:shadow-[#FF6A2B]/5"
            >
              <div>
                {/* Icon & Category */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-[#0B0B0D] border border-[#26262B] group-hover:border-[#FF6A2B] flex items-center justify-center transition-colors">
                    {getIcon(service.iconName)}
                  </div>
                  <span className="text-[11px] font-mono-tag uppercase tracking-wider text-[#A5A5AA]">
                    {service.category}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-display font-bold text-xl text-[#F5F5F5] group-hover:text-[#FF6A2B] transition-colors mb-3 leading-snug">
                  {service.title}
                </h3>

                {/* Short Description */}
                <p className="text-xs text-[#A5A5AA] leading-relaxed mb-6">
                  {service.shortDescription}
                </p>

                {/* Deliverables List */}
                <div className="space-y-2 mb-6">
                  <span className="text-[10px] font-mono-tag uppercase tracking-wider text-[#A5A5AA] block">
                    Deliverables:
                  </span>
                  {service.deliverables.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-[#F5F5F5]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#FF6A2B] shrink-0 mt-0.5" />
                      <span className="text-[11px] text-[#D4D4D8] leading-tight">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                {/* Meta details: Turnaround & Optional Pricing */}
                <div className="pt-4 border-t border-[#26262B] mb-5 space-y-2 text-xs font-mono-tag text-[#A5A5AA]">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-[11px]">
                      <Clock className="w-3.5 h-3.5 text-[#FF6A2B]" /> Turnaround:
                    </span>
                    <span className="text-[#F5F5F5] text-[11px]">{service.turnaroundTime}</span>
                  </div>

                  {service.showPricing && service.startingPrice ? (
                    <div className="flex items-center justify-between pt-1">
                      <span className="flex items-center gap-1.5 text-[11px]">
                        <Tag className="w-3.5 h-3.5 text-[#FF6A2B]" /> Rate:
                      </span>
                      <span className="text-[#FF6A2B] font-bold text-[11px]">{service.startingPrice}</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px]">Pricing:</span>
                      <span className="text-[#A5A5AA] text-[11px]">Custom Quote</span>
                    </div>
                  )}
                </div>

                {/* Action button: Preselects service in contact form */}
                <button
                  onClick={() => onSelectServiceForInquiry(service)}
                  className="w-full py-3 px-4 rounded-xl bg-[#0B0B0D] group-hover:bg-[#FF6A2B] border border-[#26262B] group-hover:border-[#FF6A2B] text-xs font-display font-bold uppercase tracking-wider text-[#F5F5F5] group-hover:text-[#0B0B0D] flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer"
                >
                  <span>Book This Service</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
