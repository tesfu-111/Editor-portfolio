import React from 'react';
import { ArrowLeft, Shield } from 'lucide-react';

interface PrivacyPolicyProps {
  onBack: () => void;
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack }) => {
  return (
    <div className="pt-32 pb-24 bg-[#0B0B0D] min-h-screen text-[#F5F5F5]">
      <div className="max-w-4xl mx-auto px-6 sm:px-8">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-mono-tag uppercase tracking-wider text-[#A5A5AA] hover:text-[#FF6A2B] transition-colors mb-8 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Showcase</span>
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#171719] border border-[#26262B] flex items-center justify-center text-[#FF6A2B]">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-mono-tag uppercase tracking-wider text-[#FF6A2B]">Legal Disclosure</span>
            <h1 className="font-display font-extrabold text-3xl sm:text-5xl uppercase tracking-tight text-white">
              Privacy Policy &amp; Terms
            </h1>
          </div>
        </div>

        <div className="p-8 rounded-2xl bg-[#171719] border border-[#26262B] space-y-6 text-sm text-[#A5A5AA] leading-relaxed">
          <p className="font-mono-tag text-xs text-[#FF6A2B]">
            Effective Date: March 2026
          </p>

          <section className="space-y-2">
            <h2 className="font-display font-bold text-lg text-white">1. Information Collection</h2>
            <p>
              When you submit a project brief or inquiry through our contact form, we collect the contact details you provide (including your name, email address, optional company name, and project description). This information is solely used to evaluate your editing timeline and respond to your inquiry.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display font-bold text-lg text-white">2. Video Embeds &amp; External Media</h2>
            <p>
              Our portfolio displays video reels hosted via privacy-conscious embeds (YouTube-nocookie, Vimeo, Google Drive, and direct MP4 streams). Interactions with third-party players are subject to their respective privacy policies.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display font-bold text-lg text-white">3. Data Retention &amp; Security</h2>
            <p>
              Inquiry submissions are stored in an encrypted persistent server database. Privileged operations and administrative access are strictly gated via cryptographic authorization tokens and PBKDF2 hashed credentials. We never sell, rent, or distribute client briefs to third parties.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display font-bold text-lg text-white">4. Intellectual Property &amp; NDA Compliance</h2>
            <p>
              All video footage and raw media links submitted during consultations remain the exclusive intellectual property of the respective clients. We routinely execute Non-Disclosure Agreements (NDAs) prior to receiving unreleased commercial and narrative footage.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display font-bold text-lg text-white">5. Contact Information</h2>
            <p>
              For data access requests or privacy-related inquiries, reach out to contact@auracuts.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
