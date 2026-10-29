export type ProjectCategory =
  | 'Short-Form Content'
  | 'YouTube Editing'
  | 'Reels and TikTok'
  | 'Music Videos'
  | 'Cinematic Edits'
  | 'Promotional Videos'
  | 'Motion Graphics'
  | 'Color Grading';

export const ALL_CATEGORIES: ProjectCategory[] = [
  'Short-Form Content',
  'YouTube Editing',
  'Reels and TikTok',
  'Music Videos',
  'Cinematic Edits',
  'Promotional Videos',
  'Motion Graphics',
  'Color Grading',
];

export type VideoSourceType = 'direct' | 'youtube' | 'vimeo' | 'gdrive' | 'mp4';

export interface PortfolioProject {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: ProjectCategory;
  thumbnailUrl: string;
  previewVideoUrl?: string;
  videoSourceType: VideoSourceType;
  videoUrl: string;
  clientName?: string;
  editingSoftware: string[];
  projectDate: string;
  isPublished: boolean;
  isFeatured: boolean;
  order: number;
  aspectRatio?: '16:9' | '9:16' | '1:1' | '2.39:1';
  duration?: string;
  colorGradingBeforeUrl?: string;
  colorGradingAfterUrl?: string;
  projectNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  deliverables: string[];
  turnaroundTime: string;
  idealFor: string;
  showPricing: boolean;
  startingPrice?: string;
  order: number;
  iconName: string;
}

export interface AboutData {
  fullName: string;
  role: string;
  portraitUrl: string;
  bio: string[];
  careerGoals: string;
  experienceYears: number;
  location: string;
  availabilityStatus: string;
  specialties: string[];
  softwareSkills: Array<{
    name: string;
    category: string;
    proficiency: number;
  }>;
  creativeProcess: Array<{
    step: number;
    title: string;
    subtitle: string;
    description: string;
  }>;
  resumeUrl?: string;
}

export interface SiteSettings {
  brandName: string;
  brandTagline: string;
  brandLogoText: string;
  heroBackgroundMode: 'image' | 'video';
  heroImageUrl: string;
  heroVideoUrl: string;
  heroHeadline: string;
  heroSubtitle: string;
  heroPrimaryCtaText: string;
  heroSecondaryCtaText: string;
  showReelUrl: string;
  accentColor: string;
  seoTitle: string;
  seoDescription: string;
  footerCopyright: string;
}

export interface ContactSettings {
  email: string;
  phone?: string;
  whatsapp?: string;
  telegram?: string;
  instagram?: string;
  tiktok?: string;
  youtube?: string;
  linkedin?: string;
  availabilityNote: string;
}

export interface ContactInquiry {
  id: string;
  fullName: string;
  email: string;
  company?: string;
  requestedService: string;
  budget?: string;
  deadline?: string;
  description: string;
  referenceLink?: string;
  status: 'new' | 'reviewed' | 'archived';
  internalNotes?: string;
  createdAt: string;
}

export interface MediaAsset {
  id: string;
  fileName: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  fileUrl: string;
  category: 'image' | 'video' | 'document';
  uploadedAt: string;
}

export interface AdminUser {
  id: string;
  username: string;
  role: 'superadmin' | 'editor';
}

export interface PublicSiteData {
  settings: SiteSettings;
  projects: PortfolioProject[];
  services: ServiceItem[];
  about: AboutData;
  contactSettings: ContactSettings;
}
