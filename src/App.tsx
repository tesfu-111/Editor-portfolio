/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import type {
  PublicSiteData,
  PortfolioProject,
  ServiceItem,
} from './types/portfolio.ts';
import { Navbar } from './components/Navbar.tsx';
import { Hero } from './components/Hero.tsx';
import { PortfolioGallery } from './components/PortfolioGallery.tsx';
import { ProjectDetailModal } from './components/ProjectDetailModal.tsx';
import { ShowreelModal } from './components/ShowreelModal.tsx';
import { AboutSection } from './components/AboutSection.tsx';
import { ServicesSection } from './components/ServicesSection.tsx';
import { ContactSection } from './components/ContactSection.tsx';
import { Footer } from './components/Footer.tsx';
import { PrivacyPolicy } from './components/PrivacyPolicy.tsx';
import { NotFound } from './components/NotFound.tsx';
import { AdminLogin } from './components/admin/AdminLogin.tsx';
import { AdminDashboard } from './components/admin/AdminDashboard.tsx';
import { Loader2 } from 'lucide-react';

export default function App() {
  const [activePage, setActivePage] = useState<string>('home');
  const [siteData, setSiteData] = useState<PublicSiteData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Admin Auth State
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    return localStorage.getItem('auracuts_admin_token');
  });
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // Active Selected Project for Modal
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);
  // Showreel Modal State
  const [isShowreelOpen, setIsShowreelOpen] = useState(false);

  // Contact Form Preselection State
  const [preselectedService, setPreselectedService] = useState<string | undefined>(undefined);
  const [preselectedProjectNote, setPreselectedProjectNote] = useState<string | undefined>(undefined);

  // Fetch Public Site Data
  const loadPublicData = async () => {
    try {
      const res = await fetch('/api/public/data');
      if (res.ok) {
        const data = await res.json();
        setSiteData(data);
      }
    } catch (err) {
      console.error('Failed to load public data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Check Admin Authentication on Boot
  const verifyAdminAuth = async (token: string | null) => {
    if (!token) {
      setIsAdminLoggedIn(false);
      return;
    }
    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setIsAdminLoggedIn(true);
      } else {
        setIsAdminLoggedIn(false);
        localStorage.removeItem('auracuts_admin_token');
        setAdminToken(null);
      }
    } catch (e) {
      setIsAdminLoggedIn(false);
    }
  };

  useEffect(() => {
    loadPublicData();
    verifyAdminAuth(adminToken);
  }, []);

  const handleAdminLoginSuccess = (token: string) => {
    setAdminToken(token);
    setIsAdminLoggedIn(true);
    setActivePage('admin-dashboard');
  };

  const handleAdminLogout = async () => {
    if (adminToken) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${adminToken}` },
        });
      } catch (e) {
        console.error(e);
      }
    }
    localStorage.removeItem('auracuts_admin_token');
    setAdminToken(null);
    setIsAdminLoggedIn(false);
    setActivePage('home');
  };

  // Navigation router handler
  const handleNavigate = (page: string) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Service Booking trigger
  const handleSelectServiceForInquiry = (service: ServiceItem) => {
    setPreselectedService(service.title);
    setPreselectedProjectNote(undefined);
    setActivePage('contact');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Project Booking trigger
  const handleInquireSimilarProject = (project: PortfolioProject) => {
    setSelectedProject(null);
    setPreselectedService(project.category);
    setPreselectedProjectNote(`${project.title} (${project.category})`);
    setActivePage('contact');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading || !siteData) {
    return (
      <div className="min-h-screen bg-[#0B0B0D] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-[#FF6A2B] animate-spin" />
          <span className="font-mono-tag text-xs text-[#A5A5AA] tracking-widest uppercase">
            Loading Cinematic Portfolio...
          </span>
        </div>
      </div>
    );
  }

  // 1. Admin Login View
  if (activePage === 'admin-login') {
    return (
      <div className="min-h-screen bg-[#0B0B0D]">
        <div className="film-grain" />
        <AdminLogin
          onLoginSuccess={handleAdminLoginSuccess}
          onBackToSite={() => handleNavigate('home')}
        />
      </div>
    );
  }

  // 2. Admin Dashboard View
  if (activePage === 'admin-dashboard') {
    if (!isAdminLoggedIn || !adminToken) {
      return (
        <div className="min-h-screen bg-[#0B0B0D]">
          <div className="film-grain" />
          <AdminLogin
            onLoginSuccess={handleAdminLoginSuccess}
            onBackToSite={() => handleNavigate('home')}
          />
        </div>
      );
    }
    return (
      <div className="min-h-screen bg-[#0B0B0D]">
        <div className="film-grain" />
        <AdminDashboard
          token={adminToken}
          onLogout={handleAdminLogout}
          onNavigatePublic={() => handleNavigate('home')}
          onDataRefresh={loadPublicData}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0B0D] text-[#F5F5F5] flex flex-col selection:bg-[#FF6A2B] selection:text-[#0B0B0D] relative">
      {/* Film grain layer */}
      <div className="film-grain" />

      {/* Navigation Bar */}
      <Navbar
        settings={siteData.settings}
        activePage={activePage}
        onNavigate={handleNavigate}
        isAdminLoggedIn={isAdminLoggedIn}
      />

      {/* Main Pages Router */}
      <main className="flex-1">
        {/* PAGE: HOME */}
        {activePage === 'home' && (
          <>
            <Hero
              settings={siteData.settings}
              onExploreWork={() => handleNavigate('work')}
              onWorkTogether={() => handleNavigate('contact')}
              onOpenReelModal={() => setIsShowreelOpen(true)}
            />

            {/* Featured Work Snapshot */}
            <PortfolioGallery
              projects={siteData.projects}
              onSelectProject={(project) => setSelectedProject(project)}
            />

            {/* Services Snapshot */}
            <ServicesSection
              services={siteData.services}
              onSelectServiceForInquiry={handleSelectServiceForInquiry}
            />

            {/* About Teaser */}
            <AboutSection
              about={siteData.about}
              onNavigateContact={() => handleNavigate('contact')}
            />

            {/* Contact Form */}
            <ContactSection
              contactSettings={siteData.contactSettings}
              services={siteData.services}
              preselectedService={preselectedService}
              preselectedReferenceNote={preselectedProjectNote}
            />
          </>
        )}

        {/* PAGE: WORK */}
        {activePage === 'work' && (
          <div className="pt-24">
            <PortfolioGallery
              projects={siteData.projects}
              onSelectProject={(project) => setSelectedProject(project)}
            />
          </div>
        )}

        {/* PAGE: ABOUT ME */}
        {activePage === 'about' && (
          <div className="pt-24">
            <AboutSection
              about={siteData.about}
              onNavigateContact={() => handleNavigate('contact')}
            />
          </div>
        )}

        {/* PAGE: SERVICES */}
        {activePage === 'services' && (
          <div className="pt-24">
            <ServicesSection
              services={siteData.services}
              onSelectServiceForInquiry={handleSelectServiceForInquiry}
            />
          </div>
        )}

        {/* PAGE: CONTACT */}
        {activePage === 'contact' && (
          <div className="pt-24">
            <ContactSection
              contactSettings={siteData.contactSettings}
              services={siteData.services}
              preselectedService={preselectedService}
              preselectedReferenceNote={preselectedProjectNote}
            />
          </div>
        )}

        {/* PAGE: PRIVACY POLICY */}
        {activePage === 'privacy' && (
          <PrivacyPolicy onBack={() => handleNavigate('home')} />
        )}

        {/* PAGE: 404 NOT FOUND */}
        {activePage === 'not-found' && (
          <NotFound onGoHome={() => handleNavigate('home')} />
        )}
      </main>

      {/* Footer */}
      <Footer
        settings={siteData.settings}
        contactSettings={siteData.contactSettings}
        onNavigate={handleNavigate}
        isAdminLoggedIn={isAdminLoggedIn}
      />

      {/* Project Detail Modal with Video Player & Color Grading Slider */}
      <ProjectDetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onInquireSimilar={handleInquireSimilarProject}
      />

      {/* Showreel Fullscreen Modal */}
      <ShowreelModal
        url={siteData.settings.showReelUrl}
        isOpen={isShowreelOpen}
        onClose={() => setIsShowreelOpen(false)}
      />
    </div>
  );
}
