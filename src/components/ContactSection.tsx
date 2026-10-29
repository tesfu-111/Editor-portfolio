import React, { useState, useEffect } from 'react';
import type { ContactSettings, ServiceItem } from '../types/portfolio.ts';
import {
  Mail,
  Send,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Phone,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';

interface ContactSectionProps {
  contactSettings: ContactSettings;
  services: ServiceItem[];
  preselectedService?: string;
  preselectedReferenceNote?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  contactSettings,
  services,
  preselectedService,
  preselectedReferenceNote,
}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    company: '',
    requestedService: preselectedService || 'General Inquiry',
    budget: '',
    deadline: '',
    description: preselectedReferenceNote ? `Regarding project: ${preselectedReferenceNote}\n\n` : '',
    referenceLink: '',
    hp: '', // spam honeypot
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (preselectedService) {
      setFormData((prev) => ({ ...prev, requestedService: preselectedService }));
    }
  }, [preselectedService]);

  useEffect(() => {
    if (preselectedReferenceNote) {
      setFormData((prev) => ({
        ...prev,
        description: `Regarding project: ${preselectedReferenceNote}\n\n${prev.description}`,
      }));
    }
  }, [preselectedReferenceNote]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Quick client-side checks
    if (!formData.fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMessage('Please provide a valid email address.');
      return;
    }
    if (formData.description.trim().length < 5) {
      setErrorMessage('Please write a brief summary of your project or editing request.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit inquiry.');
      }

      setSubmitSuccess(true);
      setFormData({
        fullName: '',
        email: '',
        company: '',
        requestedService: 'General Inquiry',
        budget: '',
        deadline: '',
        description: '',
        referenceLink: '',
        hp: '',
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-[#0B0B0D] relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 border-b border-[#26262B] pb-8">
          <div>
            <div className="text-xs font-mono-tag uppercase tracking-widest text-[#FF6A2B] mb-2">
              Direct Booking &amp; Inquiries
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-5xl uppercase tracking-tight text-[#F5F5F5]">
              Let's Build Your Cut
            </h2>
          </div>
          <p className="text-sm text-[#A5A5AA] max-w-md">
            {contactSettings.availabilityNote ||
              'Currently accepting project commissions and monthly creator retainers.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Direct Channels & Social Handles */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-[#171719] border border-[#26262B] rounded-2xl p-6 sm:p-8 space-y-6">
              <h3 className="font-display font-bold text-xl text-white">
                Direct Channels
              </h3>
              <p className="text-xs text-[#A5A5AA] leading-relaxed">
                Prefer direct messaging or have an urgent timeline? Reach out directly across any of the verified channels below.
              </p>

              {/* Direct Email */}
              {contactSettings.email && (
                <a
                  href={`mailto:${contactSettings.email}`}
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-[#0B0B0D] border border-[#26262B] hover:border-[#FF6A2B] group transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#171719] flex items-center justify-center text-[#FF6A2B] group-hover:scale-105 transition-transform">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-mono-tag uppercase tracking-wider text-[#A5A5AA] block">
                      Direct Email
                    </span>
                    <span className="text-sm font-medium text-white truncate block">
                      {contactSettings.email}
                    </span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-[#A5A5AA] group-hover:text-[#FF6A2B] transition-colors" />
                </a>
              )}

              {/* WhatsApp */}
              {contactSettings.whatsapp && (
                <a
                  href={contactSettings.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-[#0B0B0D] border border-[#26262B] hover:border-[#FF6A2B] group transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#171719] flex items-center justify-center text-[#FF6A2B] group-hover:scale-105 transition-transform">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-mono-tag uppercase tracking-wider text-[#A5A5AA] block">
                      WhatsApp Chat
                    </span>
                    <span className="text-sm font-medium text-white truncate block">
                      Instant Messaging &amp; Audio Notes
                    </span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-[#A5A5AA] group-hover:text-[#FF6A2B] transition-colors" />
                </a>
              )}

              {/* Telegram */}
              {contactSettings.telegram && (
                <a
                  href={contactSettings.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-[#0B0B0D] border border-[#26262B] hover:border-[#FF6A2B] group transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#171719] flex items-center justify-center text-[#FF6A2B] group-hover:scale-105 transition-transform">
                    <Send className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-mono-tag uppercase tracking-wider text-[#A5A5AA] block">
                      Telegram Channel
                    </span>
                    <span className="text-sm font-medium text-white truncate block">
                      Fast File Previews &amp; Chat
                    </span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-[#A5A5AA] group-hover:text-[#FF6A2B] transition-colors" />
                </a>
              )}
            </div>

            {/* Social Links */}
            <div className="bg-[#171719] border border-[#26262B] rounded-2xl p-6 sm:p-8 space-y-4">
              <span className="text-xs font-mono-tag uppercase tracking-wider text-[#A5A5AA] block">
                Social Feeds &amp; Master Works
              </span>
              <div className="grid grid-cols-2 gap-3">
                {contactSettings.youtube && (
                  <a
                    href={contactSettings.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-[#0B0B0D] border border-[#26262B] hover:border-[#FF6A2B] text-xs font-mono-tag text-white hover:text-[#FF6A2B] transition-colors flex items-center justify-between"
                  >
                    <span>YouTube</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                )}
                {contactSettings.instagram && (
                  <a
                    href={contactSettings.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-[#0B0B0D] border border-[#26262B] hover:border-[#FF6A2B] text-xs font-mono-tag text-white hover:text-[#FF6A2B] transition-colors flex items-center justify-between"
                  >
                    <span>Instagram</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                )}
                {contactSettings.tiktok && (
                  <a
                    href={contactSettings.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-[#0B0B0D] border border-[#26262B] hover:border-[#FF6A2B] text-xs font-mono-tag text-white hover:text-[#FF6A2B] transition-colors flex items-center justify-between"
                  >
                    <span>TikTok</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                )}
                {contactSettings.linkedin && (
                  <a
                    href={contactSettings.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-[#0B0B0D] border border-[#26262B] hover:border-[#FF6A2B] text-xs font-mono-tag text-white hover:text-[#FF6A2B] transition-colors flex items-center justify-between"
                  >
                    <span>LinkedIn</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Complete Working Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-[#171719] border border-[#26262B] rounded-2xl p-6 sm:p-10 shadow-2xl">
              {submitSuccess ? (
                <div className="py-12 text-center space-y-4 animate-in fade-in duration-300">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-display font-extrabold text-2xl text-white">
                    Inquiry Dispatched Successfully!
                  </h3>
                  <p className="text-sm text-[#A5A5AA] max-w-md mx-auto leading-relaxed">
                    Thank you for reaching out. Your project brief has been recorded directly to the database. I will review your footage specs and reply within 24 hours.
                  </p>
                  <button
                    onClick={() => setSubmitSuccess(false)}
                    className="mt-4 px-6 py-2.5 rounded-lg bg-[#0B0B0D] border border-[#26262B] hover:border-[#FF6A2B] text-xs font-mono-tag uppercase tracking-wider text-white hover:text-[#FF6A2B] transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Honeypot hidden input */}
                  <input
                    type="text"
                    name="hp"
                    value={formData.hp}
                    onChange={(e) => setFormData({ ...formData, hp: e.target.value })}
                    className="hidden"
                    tabIndex={-1}
                    autoComplete="off"
                  />

                  {/* Name & Email Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-mono-tag uppercase tracking-wider text-[#A5A5AA] mb-2">
                        Full Name <span className="text-[#FF6A2B]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Marcus Ray"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[#0B0B0D] border border-[#26262B] focus:border-[#FF6A2B] focus:outline-none text-sm text-white placeholder-[#52525B] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono-tag uppercase tracking-wider text-[#A5A5AA] mb-2">
                        Email Address <span className="text-[#FF6A2B]">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="name@studio.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[#0B0B0D] border border-[#26262B] focus:border-[#FF6A2B] focus:outline-none text-sm text-white placeholder-[#52525B] transition-colors"
                      />
                    </div>
                  </div>

                  {/* Company & Service Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-mono-tag uppercase tracking-wider text-[#A5A5AA] mb-2">
                        Company / Channel (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Apex Media or YouTube Channel"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[#0B0B0D] border border-[#26262B] focus:border-[#FF6A2B] focus:outline-none text-sm text-white placeholder-[#52525B] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono-tag uppercase tracking-wider text-[#A5A5AA] mb-2">
                        Requested Service <span className="text-[#FF6A2B]">*</span>
                      </label>
                      <select
                        value={formData.requestedService}
                        onChange={(e) => setFormData({ ...formData, requestedService: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[#0B0B0D] border border-[#26262B] focus:border-[#FF6A2B] focus:outline-none text-sm text-white transition-colors"
                      >
                        <option value="General Inquiry">General Project Inquiry</option>
                        {services.map((srv) => (
                          <option key={srv.id} value={srv.title}>
                            {srv.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Budget & Deadline Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-mono-tag uppercase tracking-wider text-[#A5A5AA] mb-2">
                        Estimated Budget (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. $1,000 - $3,000 or Retainer"
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[#0B0B0D] border border-[#26262B] focus:border-[#FF6A2B] focus:outline-none text-sm text-white placeholder-[#52525B] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono-tag uppercase tracking-wider text-[#A5A5AA] mb-2">
                        Target Deadline (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Within 2 weeks or ASAP"
                        value={formData.deadline}
                        onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[#0B0B0D] border border-[#26262B] focus:border-[#FF6A2B] focus:outline-none text-sm text-white placeholder-[#52525B] transition-colors"
                      />
                    </div>
                  </div>

                  {/* Reference Link */}
                  <div>
                    <label className="block text-xs font-mono-tag uppercase tracking-wider text-[#A5A5AA] mb-2">
                      Reference Link / Footage Drive (Optional)
                    </label>
                    <input
                      type="url"
                      placeholder="https://drive.google.com/... or YouTube reference"
                      value={formData.referenceLink}
                      onChange={(e) => setFormData({ ...formData, referenceLink: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#0B0B0D] border border-[#26262B] focus:border-[#FF6A2B] focus:outline-none text-sm text-white placeholder-[#52525B] transition-colors"
                    />
                  </div>

                  {/* Project Description */}
                  <div>
                    <label className="block text-xs font-mono-tag uppercase tracking-wider text-[#A5A5AA] mb-2">
                      Project Description &amp; Vision <span className="text-[#FF6A2B]">*</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Tell me about the footage volume, desired rhythm, style references, and release platform..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#0B0B0D] border border-[#26262B] focus:border-[#FF6A2B] focus:outline-none text-sm text-white placeholder-[#52525B] transition-colors resize-y"
                    />
                  </div>

                  {/* Error display */}
                  {errorMessage && (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl bg-[#FF6A2B] hover:bg-[#FF7F47] disabled:opacity-50 text-[#0B0B0D] font-display font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#FF6A2B]/20 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Sending Brief to Alex Vance...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Project Brief</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
