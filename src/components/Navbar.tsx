import React, { useState, useEffect } from 'react';
import { Menu, X, Lock, ArrowUpRight } from 'lucide-react';
import type { SiteSettings } from '../types/portfolio.ts';

interface NavbarProps {
  settings: SiteSettings;
  activePage: string;
  onNavigate: (page: string) => void;
  isAdminLoggedIn?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  activePage,
  onNavigate,
  isAdminLoggedIn = false,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'work', label: 'My Work' },
    { id: 'about', label: 'About Me' },
    { id: 'services', label: 'Services' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleLinkClick = (pageId: string) => {
    onNavigate(pageId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#0B0B0D]/90 backdrop-blur-md border-b border-[#26262B] py-3.5 shadow-xl'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between">
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={() => handleLinkClick('home')}
            className="font-display font-bold text-lg sm:text-xl tracking-wider text-[#F5F5F5] uppercase hover:text-[#FF6A2B] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus:outline-none"
          >
            {settings.brandLogoText || settings.brandName || 'AURA // CUTS'}
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive = activePage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className={`text-sm font-medium tracking-wide transition-colors relative py-1 cursor-pointer focus:outline-none ${
                    isActive ? 'text-[#FF6A2B]' : 'text-[#A5A5AA] hover:text-[#F5F5F5]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#FF6A2B] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action: Let's Work Together & Admin */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => handleLinkClick('contact')}
              className="group flex items-center gap-1.5 px-4 py-2 rounded border border-[#FF6A2B]/40 bg-[#FF6A2B]/10 hover:bg-[#FF6A2B] text-xs font-semibold uppercase tracking-wider text-[#FF6A2B] hover:text-[#0B0B0D] transition-all duration-200 cursor-pointer shadow-sm hover:shadow-[#FF6A2B]/20"
            >
              <span>Let's Talk</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>

            <button
              onClick={() => handleLinkClick(isAdminLoggedIn ? 'admin-dashboard' : 'admin-login')}
              title={isAdminLoggedIn ? 'Admin Dashboard' : 'Admin Portal Login'}
              aria-label="Admin Portal"
              className={`p-2 rounded border transition-colors cursor-pointer ${
                isAdminLoggedIn
                  ? 'border-[#FF6A2B] text-[#FF6A2B] bg-[#FF6A2B]/10'
                  : 'border-[#26262B] text-[#A5A5AA] hover:text-[#F5F5F5] hover:border-[#3D3D45]'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-3">
            <button
              onClick={() => handleLinkClick(isAdminLoggedIn ? 'admin-dashboard' : 'admin-login')}
              aria-label="Admin Portal"
              className="p-2 rounded border border-[#26262B] text-[#A5A5AA]"
            >
              <Lock className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
              className="p-2 text-[#F5F5F5] hover:text-[#FF6A2B] transition-colors focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#0B0B0D]/98 backdrop-blur-xl md:hidden pt-24 px-8 flex flex-col justify-between pb-12 animate-in fade-in duration-200">
          <nav className="flex flex-col gap-6">
            <span className="text-xs uppercase tracking-widest text-[#A5A5AA] font-mono-tag">Menu Navigation</span>
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`text-left text-2xl font-display font-bold tracking-tight transition-colors ${
                  activePage === link.id ? 'text-[#FF6A2B]' : 'text-[#F5F5F5] hover:text-[#FF6A2B]'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="pt-8 border-t border-[#26262B] flex flex-col gap-4">
            <button
              onClick={() => handleLinkClick('contact')}
              className="w-full py-3.5 rounded bg-[#FF6A2B] text-[#0B0B0D] font-bold text-center uppercase tracking-wider text-sm flex items-center justify-center gap-2"
            >
              <span>Let's Work Together</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleLinkClick(isAdminLoggedIn ? 'admin-dashboard' : 'admin-login')}
              className="w-full py-2.5 rounded border border-[#26262B] text-xs font-mono-tag text-[#A5A5AA] hover:text-white flex items-center justify-center gap-2"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{isAdminLoggedIn ? 'Go to Admin Dashboard' : 'Admin Portal Login'}</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};
