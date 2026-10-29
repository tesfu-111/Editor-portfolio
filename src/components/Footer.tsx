import React from 'react';
import type { SiteSettings, ContactSettings } from '../types/portfolio.ts';
import { ArrowUp, Lock } from 'lucide-react';

interface FooterProps {
  settings: SiteSettings;
  contactSettings: ContactSettings;
  onNavigate: (page: string) => void;
  isAdminLoggedIn?: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  contactSettings,
  onNavigate,
  isAdminLoggedIn = false,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0B0B0D] border-t border-[#26262B] pt-16 pb-12 relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div>
              <span className="font-display font-extrabold text-xl text-white uppercase tracking-wider">
                {settings.brandLogoText || settings.brandName || 'AURA // CUTS'}
              </span>
            </div>
            <p className="text-xs text-[#A5A5AA] max-w-sm leading-relaxed">
              {settings.brandTagline ||
                'Cinematic post-production, precision pacing, and emotional storytelling for global creators and commercial campaigns.'}
            </p>
            <div className="text-xs font-mono-tag text-[#FF6A2B]">
              Direct Inquiry: {contactSettings.email}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <span className="text-xs font-mono-tag uppercase tracking-wider text-[#A5A5AA] block">
              Explore
            </span>
            <ul className="space-y-2 text-xs font-medium text-[#D4D4D8]">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-[#FF6A2B] transition-colors cursor-pointer"
                >
                  Home Showcase
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('work')}
                  className="hover:text-[#FF6A2B] transition-colors cursor-pointer"
                >
                  Portfolio Gallery
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-[#FF6A2B] transition-colors cursor-pointer"
                >
                  About Tesfa
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('services')}
                  className="hover:text-[#FF6A2B] transition-colors cursor-pointer"
                >
                  Services &amp; Rates
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-[#FF6A2B] transition-colors cursor-pointer"
                >
                  Contact &amp; Booking
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Portal Links */}
          <div className="space-y-3">
            <span className="text-xs font-mono-tag uppercase tracking-wider text-[#A5A5AA] block">
              Governance &amp; Studio
            </span>
            <ul className="space-y-2 text-xs font-medium text-[#D4D4D8]">
              <li>
                <button
                  onClick={() => onNavigate('privacy')}
                  className="hover:text-[#FF6A2B] transition-colors cursor-pointer"
                >
                  Privacy Policy &amp; Terms
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate(isAdminLoggedIn ? 'admin-dashboard' : 'admin-login')}
                  className="hover:text-[#FF6A2B] transition-colors cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Lock className="w-3 h-3 text-[#A5A5AA]" />
                  <span>{isAdminLoggedIn ? 'Admin Dashboard' : 'Admin Portal Login'}</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-[#26262B] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono-tag text-[#A5A5AA]">
          <p>{settings.footerCopyright || '© 2026 AURA CUTS. All rights reserved.'}</p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 hover:text-[#FF6A2B] transition-colors cursor-pointer"
          >
            <span>BACK TO TOP</span>
            <div className="w-6 h-6 rounded-full bg-[#171719] border border-[#26262B] flex items-center justify-center">
              <ArrowUp className="w-3 h-3 text-[#FF6A2B]" />
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
};
