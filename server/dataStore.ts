import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import type {
  SiteSettings,
  AboutData,
  PortfolioProject,
  ServiceItem,
  ContactInquiry,
  ContactSettings,
  MediaAsset,
} from '../src/types/portfolio.ts';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');
const UPLOADS_DIR = path.resolve(process.cwd(), 'public', 'uploads');

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

export interface AdminCredentials {
  id: string;
  username: string;
  salt: string;
  passwordHash: string;
  role: 'superadmin';
  updatedAt: string;
}

export interface DatabaseSchema {
  siteSettings: SiteSettings;
  about: AboutData;
  portfolioProjects: PortfolioProject[];
  services: ServiceItem[];
  contactInquiries: ContactInquiry[];
  contactSettings: ContactSettings;
  mediaAssets: MediaAsset[];
  admin: AdminCredentials;
  sessions: Record<string, { adminId: string; expiresAt: number }>;
}

export function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
}

export function generateSalt(): string {
  return crypto.randomBytes(16).toString('hex');
}

export function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

const defaultSalt = generateSalt();
const initialDefaultPassword = 'admin-auracuts-2026!'; // initial default, admin is prompted to customize
const initialPasswordHash = hashPassword(initialDefaultPassword, defaultSalt);

const initialDatabase: DatabaseSchema = {
  admin: {
    id: 'admin_primary_001',
    username: 'admin',
    salt: defaultSalt,
    passwordHash: initialPasswordHash,
    role: 'superadmin',
    updatedAt: new Date().toISOString(),
  },
  sessions: {},
  siteSettings: {
    brandName: 'AURA CUTS',
    brandTagline: 'Cinematic Post-Production & Storytelling',
    brandLogoText: 'AURA // CUTS',
    heroBackgroundMode: 'video',
    heroImageUrl: '/src/assets/images/hero_cinematic_director_1793157693542.jpg',
    heroVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    heroHeadline: 'I Turn Raw Footage Into Powerful Stories.',
    heroSubtitle: 'Video Editor | Cinematic Storytelling | Motion Graphics.',
    heroPrimaryCtaText: 'Explore My Work',
    heroSecondaryCtaText: "Let's Work Together",
    showReelUrl: 'https://www.youtube.com/watch?v=LXb3EKWsInQ',
    accentColor: '#FF6A2B',
    seoTitle: 'AURA CUTS - Video Editor | Cinematic Storytelling | Motion Graphics',
    seoDescription: 'Award-winning video editing, high-end color grading, sound design, and motion graphics for creators, commercial brands, and musicians.',
    footerCopyright: '© 2026 AURA CUTS. All rights reserved. Crafted for visual impact.',
  },
  about: {
    fullName: 'Alex Vance',
    role: 'Lead Video Editor & Colorist',
    portraitUrl: '/src/assets/images/director_portrait_monochrome_1793157695050.jpg',
    bio: [
      'I am a freelance video editor and colorist with over 7 years of dedicated experience shaping visual stories for modern creators, music directors, and commercial campaigns.',
      'My philosophy centers on pacing, rhythm, and emotional resonance. Great editing is not merely cutting clips to music; it is curating an unspoken dialogue between tension and release that captivates an audience from the first frame to the final fade.',
      'Whether crafting punchy high-retention short-form edits or pacing a feature-style documentary cut, I bring precision, advanced color grading, and meticulous sound design to every timeline.'
    ],
    careerGoals: 'Advancing boundary-pushing cinematic narratives in commercial advertising and short cinema, while helping ambitious brands dominate high-converting short-form formats.',
    experienceYears: 7,
    location: 'Available Globally (Remote / Worldwide Delivery)',
    availabilityStatus: 'Available for Select Projects & Monthly Retainers',
    specialties: [
      'Narrative & Commercial Pacing',
      'Advanced ACES Color Grading',
      'Dynamic Sound Design & Foley',
      'Kinetic Motion Typography',
      'High-Retention YouTube & TikTok Architecture'
    ],
    softwareSkills: [
      { name: 'DaVinci Resolve Studio', category: 'Color & Finishing', proficiency: 98 },
      { name: 'Adobe Premiere Pro', category: 'NLE Assembly & Cut', proficiency: 95 },
      { name: 'Adobe After Effects', category: 'VFX & Motion Graphics', proficiency: 88 },
      { name: 'Adobe Audition', category: 'Audio Cleanup & Mix', proficiency: 85 },
      { name: 'Blender 3D', category: '3D Camera Tracking', proficiency: 75 }
    ],
    creativeProcess: [
      {
        step: 1,
        title: 'Ingest & Creative Alignment',
        subtitle: 'Briefing, Footage Review & Script Breakout',
        description: 'Organize raw footage, establish proxy workflows, sync multi-camera audio, and align on rhythm, target duration, and emotional arc.'
      },
      {
        step: 2,
        title: 'The Narrative Assembly (Rough Cut)',
        subtitle: 'Story Structure & Core Pacing',
        description: 'Shape the narrative foundation. Identify golden moments, cull filler, and lock the timing before introducing heavy styling.'
      },
      {
        step: 3,
        title: 'Sound Design & Atmosphere',
        subtitle: 'Foley, Risers, Bass Drops & Dialogue Cleanup',
        description: 'Audio is 50% of the cinematic experience. Layer bespoke sound effects, adjust volume automations, and clean dialogue.'
      },
      {
        step: 4,
        title: 'Color Grading & Motion Graphics',
        subtitle: 'Look Development, ACES & Typography',
        description: 'Grade footage to establish mood and tonal continuity across shots. Integrate custom motion graphics, lower-thirds, and visual flares.'
      },
      {
        step: 5,
        title: 'Master Delivery & Format Optimization',
        subtitle: 'Multi-Aspect Ratio Export & Quality Control',
        description: 'Deliver pristine master exports optimized for web (YouTube, Instagram 9:16, ProRes archive) along with organized project archives.'
      }
    ],
    resumeUrl: ''
  },
  portfolioProjects: [
    {
      id: 'proj_placeholder_001',
      title: 'Neon Odyssey [Placeholder Sample]',
      slug: 'neon-odyssey-sample',
      description: 'High-energy cyberpunk narrative edit showcasing dynamic whip transitions, color grade contrast, and custom foley sound design.',
      category: 'Cinematic Edits',
      thumbnailUrl: '/src/assets/images/color_grade_cinematic_still_1793157693927.jpg',
      videoSourceType: 'mp4',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      clientName: 'Placeholder Creative Studio',
      editingSoftware: ['DaVinci Resolve Studio', 'After Effects', 'Audition'],
      projectDate: '2026-03',
      isPublished: true,
      isFeatured: true,
      order: 1,
      aspectRatio: '2.39:1',
      duration: '02:45',
      colorGradingBeforeUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=40&sat=-80',
      colorGradingAfterUrl: '/src/assets/images/color_grade_cinematic_still_1793157693927.jpg',
      projectNotes: 'This is a sample showcase placeholder project. Replace with your actual project video, thumbnail, and client breakdown via the Admin Dashboard.',
      createdAt: '2026-03-01T10:00:00.000Z',
      updatedAt: '2026-03-01T10:00:00.000Z',
    },
    {
      id: 'proj_placeholder_002',
      title: 'Velocity Apex [Placeholder Sample]',
      slug: 'velocity-apex-sample',
      description: 'Ultra fast-paced commercial promo designed for maximum screen retention, featuring speed ramps and kinetic typography.',
      category: 'Promotional Videos',
      thumbnailUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
      videoSourceType: 'mp4',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      clientName: 'Placeholder Automotive Brand',
      editingSoftware: ['Premiere Pro', 'After Effects'],
      projectDate: '2026-02',
      isPublished: true,
      isFeatured: true,
      order: 2,
      aspectRatio: '16:9',
      duration: '00:60',
      colorGradingBeforeUrl: '',
      colorGradingAfterUrl: '',
      projectNotes: 'Edit or replace this placeholder in the Admin Dashboard.',
      createdAt: '2026-02-15T10:00:00.000Z',
      updatedAt: '2026-02-15T10:00:00.000Z',
    },
    {
      id: 'proj_placeholder_003',
      title: 'Echoes in the Mist [Placeholder Sample]',
      slug: 'echoes-in-the-mist-sample',
      description: 'Atmospheric music video edit featuring seamless match cuts, film stock grain emulations, and dreamy light leaks.',
      category: 'Music Videos',
      thumbnailUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
      videoSourceType: 'mp4',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      clientName: 'Placeholder Music Artist',
      editingSoftware: ['Premiere Pro', 'DaVinci Resolve'],
      projectDate: '2026-01',
      isPublished: true,
      isFeatured: true,
      order: 3,
      aspectRatio: '16:9',
      duration: '03:30',
      colorGradingBeforeUrl: '',
      colorGradingAfterUrl: '',
      projectNotes: 'Edit or replace this placeholder in the Admin Dashboard.',
      createdAt: '2026-01-20T10:00:00.000Z',
      updatedAt: '2026-01-20T10:00:00.000Z',
    },
    {
      id: 'proj_placeholder_004',
      title: 'Viral Hook Masterclass [Placeholder Sample]',
      slug: 'viral-hook-sample',
      description: '9:16 vertical short-form edit built specifically for TikTok, Reels, and Shorts. Engineered with 2-second visual pattern interrupts and auto-captions.',
      category: 'Short-Form Content',
      thumbnailUrl: 'https://images.unsplash.com/photo-1616469829941-c7200edec809?auto=format&fit=crop&w=800&q=80',
      videoSourceType: 'mp4',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      clientName: 'Placeholder Creator Channel',
      editingSoftware: ['Premiere Pro', 'After Effects'],
      projectDate: '2026-04',
      isPublished: true,
      isFeatured: false,
      order: 4,
      aspectRatio: '9:16',
      duration: '00:35',
      colorGradingBeforeUrl: '',
      colorGradingAfterUrl: '',
      projectNotes: 'Edit or replace this placeholder in the Admin Dashboard.',
      createdAt: '2026-04-05T10:00:00.000Z',
      updatedAt: '2026-04-05T10:00:00.000Z',
    },
    {
      id: 'proj_placeholder_005',
      title: 'Deep Horizon [Color Grading Breakdown]',
      slug: 'deep-horizon-grade',
      description: 'Film emulation and shot balancing for a natural history documentary piece, converting flat log to rich kodak-inspired tones.',
      category: 'Color Grading',
      thumbnailUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      videoSourceType: 'mp4',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
      clientName: 'Placeholder Nature Media',
      editingSoftware: ['DaVinci Resolve Studio'],
      projectDate: '2026-03',
      isPublished: true,
      isFeatured: false,
      order: 5,
      aspectRatio: '16:9',
      duration: '01:20',
      colorGradingBeforeUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=30&sat=-90',
      colorGradingAfterUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=85',
      projectNotes: 'Edit or replace this placeholder in the Admin Dashboard.',
      createdAt: '2026-03-12T10:00:00.000Z',
      updatedAt: '2026-03-12T10:00:00.000Z',
    }
  ],
  services: [
    {
      id: 'srv_001',
      title: 'Short-Form Video Editing',
      slug: 'short-form-video-editing',
      category: 'Social Media & Growth',
      shortDescription: 'High-octane vertical edits (Reels, TikTok, Shorts) crafted with snappy visual hooks, kinetic text, and retention-maximizing audio.',
      fullDescription: 'Designed for high-growth brands and creators looking to scale organic reach. I dissect your long-form video or raw phone recordings to pinpoint viral concepts, add subtitles, dynamic zooms, memes/b-roll, and custom sound design.',
      deliverables: ['9:16 Vertical Video (4K/1080p)', 'Kinetic Dynamic Subtitles', 'Sound Effects & Pop-ins', 'Thumbnail Cover Frame', '2 Revision Rounds'],
      turnaroundTime: '24-48 Hours',
      idealFor: 'Content Creators, Personal Brands, E-commerce Founders',
      showPricing: false,
      startingPrice: '$150 / Video',
      order: 1,
      iconName: 'Smartphone'
    },
    {
      id: 'srv_002',
      title: 'YouTube Editing',
      slug: 'youtube-editing',
      category: 'Long-Form & Retention',
      shortDescription: 'Strategic pacing, intro retention hooks, B-roll overlays, and narrative editing that drives watch time and algorithmic performance.',
      fullDescription: 'Turn your raw A-roll and multi-cam recordings into polished episodes. Includes audio leveling, custom graphics, smooth chaptering, soundscape balancing, and retention graphs optimization.',
      deliverables: ['16:9 Master Edit (4K UHD)', 'Chapter Markers & Cards', 'B-Roll & Graphic Overlays', 'Full Audio Mastering', 'YouTube CTR Thumb Consultation'],
      turnaroundTime: '3-5 Days',
      idealFor: 'Full-time YouTubers, Tech Reviewers, Video Essayists',
      showPricing: false,
      startingPrice: '$400 / Video',
      order: 2,
      iconName: 'PlayCircle'
    },
    {
      id: 'srv_003',
      title: 'Social Media Content Packages',
      slug: 'social-media-content',
      category: 'Content Scaling',
      shortDescription: 'Multi-platform content repurposing turning long-form podcasts, webinars, or keynotes into 15-30 modular social clips.',
      fullDescription: 'Maximize your production ROI. Send one long recording, receive a calendar of multi-aspect assets ready to schedule across Instagram, LinkedIn, YouTube, and X.',
      deliverables: ['15-30 Micro-Assets', 'Cross-Platform Formatting (1:1, 9:16, 16:9)', 'Consistent Brand Styling', 'Organized Google Drive Folder'],
      turnaroundTime: 'Weekly / Bi-Weekly Retainer',
      idealFor: 'Podcasters, CEOs, Thought Leaders, SaaS Marketing Teams',
      showPricing: false,
      startingPrice: '$1,200 / Month',
      order: 3,
      iconName: 'Share2'
    },
    {
      id: 'srv_004',
      title: 'Cinematic Storytelling',
      slug: 'cinematic-storytelling',
      category: 'Narrative & Documentary',
      shortDescription: 'Artful pacing, emotional arc construction, seamless transitions, and documentary-grade immersion.',
      fullDescription: 'For narrative short films, brand origin documentaries, and high-production case studies. Focuses on character pacing, emotional beats, voice-over interplay, and dramatic tension.',
      deliverables: ['DCI 2K / 4K Master', 'Stereo & 5.1 Stems Mix', 'Custom Letterboxing (2.39:1)', 'Subtitle SRT Files', 'Color Profile Deliverables'],
      turnaroundTime: '1-2 Weeks',
      idealFor: 'Film Directors, Boutique Agencies, Luxury Brands',
      showPricing: false,
      startingPrice: 'Custom Quote',
      order: 4,
      iconName: 'Film'
    },
    {
      id: 'srv_005',
      title: 'Color Correction & Grading',
      slug: 'color-correction-grading',
      category: 'Color & Finishing',
      shortDescription: 'Precision shot balancing, color gamut matching, ACES color management, and cinematic look development in DaVinci Resolve.',
      fullDescription: 'Transform flat, dull LOG footage into striking filmic imagery. Fix exposure discrepancies between different cameras, skin tone isolation, sky enhancements, and customized film grain/halation profiles.',
      deliverables: ['Color Graded Master (Apple ProRes 422HQ/4444)', 'Show LUT (.cube) for client future use', 'Before/After Stills Portfolio Pack'],
      turnaroundTime: '2-4 Days',
      idealFor: 'Commercial DPs, Indie Filmmakers, Music Video Directors',
      showPricing: false,
      startingPrice: '$350 / Project',
      order: 5,
      iconName: 'Sliders'
    },
    {
      id: 'srv_006',
      title: 'Sound Design & Audio Finishing',
      slug: 'sound-design',
      category: 'Audio Engineering',
      shortDescription: 'Multi-layered foley, spatial sound effects, dialogue denoising, impactful risers, and broadcast loudness compliance.',
      fullDescription: 'Sound is what makes visual edits feel tactile and real. I build custom atmospheres, crisp mechanical foley, bass impacts, and clean dialogue with spectral repair.',
      deliverables: ['Stereo Master Mix (-14 LUFS web standard)', 'Dialogue, SFX & Music Stems', 'Custom SFX Library Integration'],
      turnaroundTime: '2-3 Days',
      idealFor: 'Trailers, High-end Commercials, Action Reels',
      showPricing: false,
      startingPrice: '$250 / Project',
      order: 6,
      iconName: 'Volume2'
    },
    {
      id: 'srv_007',
      title: 'Motion Graphics & Text Animation',
      slug: 'motion-graphics',
      category: 'Motion Design',
      shortDescription: 'Custom lower thirds, kinetic typography, 2D infographic callouts, logo reveals, and UI screen simulations.',
      fullDescription: 'Give your video a slick, television-grade polish with custom After Effects animations that clarify complex ideas and reinforce brand identity.',
      deliverables: ['Transparent Alpha Render Clips (ProRes 4444)', 'Essential Graphics Templates (.mogrt)', 'Custom Vector Asset Animations'],
      turnaroundTime: '2-4 Days',
      idealFor: 'SaaS Explainers, Corporate Presentations, Tech Creators',
      showPricing: false,
      startingPrice: '$300 / Package',
      order: 7,
      iconName: 'Layers'
    },
    {
      id: 'srv_008',
      title: 'Promotional Video Editing',
      slug: 'promotional-video-editing',
      category: 'Commercial & Sales',
      shortDescription: 'High-conversion product promos, event teasers, Kickstarter campaign videos, and paid ad creatives.',
      fullDescription: 'Built with direct-response principles to capture attention within the first 3 seconds and drive viewers towards a clear call to action.',
      deliverables: ['Main Promo (16:9 + 9:16 + 1:1 Variations)', '3 Alternative Hook Variations for A/B Testing', 'Licensed Music Track Selection'],
      turnaroundTime: '3-5 Days',
      idealFor: 'Startups, E-commerce, Event Producers, Product Launches',
      showPricing: false,
      startingPrice: '$500 / Video',
      order: 8,
      iconName: 'Sparkles'
    }
  ],
  contactInquiries: [],
  contactSettings: {
    email: 'contact@auracuts.com',
    phone: '+1 (555) 382-9012',
    whatsapp: 'https://wa.me/15553829012',
    telegram: 'https://t.me/auracuts',
    instagram: 'https://instagram.com/auracuts',
    tiktok: 'https://tiktok.com/@auracuts',
    youtube: 'https://youtube.com/@auracuts',
    linkedin: 'https://linkedin.com/in/auracuts',
    availabilityNote: 'Currently accepting project commissions for Q2 and retainer partnerships.'
  },
  mediaAssets: []
};

export class DataStore {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.load();
  }

  private load(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        // Ensure required keys exist
        return {
          ...initialDatabase,
          ...parsed,
          siteSettings: { ...initialDatabase.siteSettings, ...(parsed.siteSettings || {}) },
          about: { ...initialDatabase.about, ...(parsed.about || {}) },
          contactSettings: { ...initialDatabase.contactSettings, ...(parsed.contactSettings || {}) },
          portfolioProjects: Array.isArray(parsed.portfolioProjects) ? parsed.portfolioProjects : initialDatabase.portfolioProjects,
          services: Array.isArray(parsed.services) ? parsed.services : initialDatabase.services,
          contactInquiries: Array.isArray(parsed.contactInquiries) ? parsed.contactInquiries : [],
          mediaAssets: Array.isArray(parsed.mediaAssets) ? parsed.mediaAssets : [],
          sessions: parsed.sessions || {},
          admin: parsed.admin || initialDatabase.admin,
        };
      }
    } catch (e) {
      console.error('Error loading database file, falling back to defaults:', e);
    }
    this.save(initialDatabase);
    return initialDatabase;
  }

  public save(dataToSave?: DatabaseSchema): void {
    try {
      const payload = dataToSave || this.data;
      fs.writeFileSync(DB_FILE, JSON.stringify(payload, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to save database file:', e);
    }
  }

  // Public Getters
  public getPublicData() {
    return {
      settings: this.data.siteSettings,
      projects: this.data.portfolioProjects.filter((p) => p.isPublished),
      services: this.data.services,
      about: this.data.about,
      contactSettings: this.data.contactSettings,
    };
  }

  // Admin and Auth operations
  public getAdmin() {
    return this.data.admin;
  }

  public updateAdminPassword(newPasswordPlain: string) {
    const newSalt = generateSalt();
    const newHash = hashPassword(newPasswordPlain, newSalt);
    this.data.admin.salt = newSalt;
    this.data.admin.passwordHash = newHash;
    this.data.admin.updatedAt = new Date().toISOString();
    // Invalidate old sessions
    this.data.sessions = {};
    this.save();
    return true;
  }

  public createSession(adminId: string): string {
    const token = generateToken();
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
    this.data.sessions[token] = { adminId, expiresAt };
    this.save();
    return token;
  }

  public validateSession(token: string): boolean {
    if (!token) return false;
    const session = this.data.sessions[token];
    if (!session) return false;
    if (session.expiresAt < Date.now()) {
      delete this.data.sessions[token];
      this.save();
      return false;
    }
    return true;
  }

  public destroySession(token: string) {
    if (this.data.sessions[token]) {
      delete this.data.sessions[token];
      this.save();
    }
  }

  // Settings
  public getSettings(): SiteSettings {
    return this.data.siteSettings;
  }

  public updateSettings(updates: Partial<SiteSettings>): SiteSettings {
    this.data.siteSettings = {
      ...this.data.siteSettings,
      ...updates,
    };
    this.save();
    return this.data.siteSettings;
  }

  // About
  public getAbout(): AboutData {
    return this.data.about;
  }

  public updateAbout(updates: Partial<AboutData>): AboutData {
    this.data.about = {
      ...this.data.about,
      ...updates,
    };
    this.save();
    return this.data.about;
  }

  // Contact Settings
  public getContactSettings(): ContactSettings {
    return this.data.contactSettings;
  }

  public updateContactSettings(updates: Partial<ContactSettings>): ContactSettings {
    this.data.contactSettings = {
      ...this.data.contactSettings,
      ...updates,
    };
    this.save();
    return this.data.contactSettings;
  }

  // Projects
  public getAllProjects(): PortfolioProject[] {
    return this.data.portfolioProjects.sort((a, b) => a.order - b.order);
  }

  public getProjectById(id: string): PortfolioProject | undefined {
    return this.data.portfolioProjects.find((p) => p.id === id);
  }

  public createProject(project: Omit<PortfolioProject, 'id' | 'createdAt' | 'updatedAt'>): PortfolioProject {
    const now = new Date().toISOString();
    const id = `proj_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newProject: PortfolioProject = {
      ...project,
      id,
      createdAt: now,
      updatedAt: now,
      order: project.order || this.data.portfolioProjects.length + 1,
    };
    this.data.portfolioProjects.push(newProject);
    this.save();
    return newProject;
  }

  public updateProject(id: string, updates: Partial<PortfolioProject>): PortfolioProject | null {
    const index = this.data.portfolioProjects.findIndex((p) => p.id === id);
    if (index === -1) return null;
    const existing = this.data.portfolioProjects[index];
    const updated: PortfolioProject = {
      ...existing,
      ...updates,
      id: existing.id,
      createdAt: existing.createdAt,
      updatedAt: new Date().toISOString(),
    };
    this.data.portfolioProjects[index] = updated;
    this.save();
    return updated;
  }

  public deleteProject(id: string): boolean {
    const beforeCount = this.data.portfolioProjects.length;
    this.data.portfolioProjects = this.data.portfolioProjects.filter((p) => p.id !== id);
    if (this.data.portfolioProjects.length !== beforeCount) {
      this.save();
      return true;
    }
    return false;
  }

  // Services
  public getServices(): ServiceItem[] {
    return this.data.services.sort((a, b) => a.order - b.order);
  }

  public createService(service: Omit<ServiceItem, 'id'>): ServiceItem {
    const id = `srv_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newService: ServiceItem = {
      ...service,
      id,
      order: service.order || this.data.services.length + 1,
    };
    this.data.services.push(newService);
    this.save();
    return newService;
  }

  public updateService(id: string, updates: Partial<ServiceItem>): ServiceItem | null {
    const idx = this.data.services.findIndex((s) => s.id === id);
    if (idx === -1) return null;
    this.data.services[idx] = {
      ...this.data.services[idx],
      ...updates,
      id,
    };
    this.save();
    return this.data.services[idx];
  }

  public deleteService(id: string): boolean {
    const initialLen = this.data.services.length;
    this.data.services = this.data.services.filter((s) => s.id !== id);
    if (this.data.services.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  // Inquiries
  public getInquiries(): ContactInquiry[] {
    return this.data.contactInquiries.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public createInquiry(
    inquiryData: Omit<ContactInquiry, 'id' | 'createdAt' | 'status' | 'internalNotes'>
  ): ContactInquiry {
    const id = `inq_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newInquiry: ContactInquiry = {
      ...inquiryData,
      id,
      status: 'new',
      createdAt: new Date().toISOString(),
    };
    this.data.contactInquiries.push(newInquiry);
    this.save();
    return newInquiry;
  }

  public updateInquiry(
    id: string,
    updates: Partial<Pick<ContactInquiry, 'status' | 'internalNotes'>>
  ): ContactInquiry | null {
    const idx = this.data.contactInquiries.findIndex((i) => i.id === id);
    if (idx === -1) return null;
    this.data.contactInquiries[idx] = {
      ...this.data.contactInquiries[idx],
      ...updates,
    };
    this.save();
    return this.data.contactInquiries[idx];
  }

  public deleteInquiry(id: string): boolean {
    const prev = this.data.contactInquiries.length;
    this.data.contactInquiries = this.data.contactInquiries.filter((i) => i.id !== id);
    if (this.data.contactInquiries.length !== prev) {
      this.save();
      return true;
    }
    return false;
  }

  // Media
  public getMediaAssets(): MediaAsset[] {
    return this.data.mediaAssets.sort(
      (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    );
  }

  public addMediaAsset(asset: Omit<MediaAsset, 'id' | 'uploadedAt'>): MediaAsset {
    const id = `media_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newAsset: MediaAsset = {
      ...asset,
      id,
      uploadedAt: new Date().toISOString(),
    };
    this.data.mediaAssets.push(newAsset);
    this.save();
    return newAsset;
  }

  public deleteMediaAsset(id: string): boolean {
    const asset = this.data.mediaAssets.find((m) => m.id === id);
    if (!asset) return false;

    // Delete file from disk if in uploads
    if (asset.fileUrl.startsWith('/uploads/')) {
      const localFilePath = path.join(process.cwd(), 'public', asset.fileUrl);
      if (fs.existsSync(localFilePath)) {
        try {
          fs.unlinkSync(localFilePath);
        } catch (e) {
          console.error('Failed to unlink asset file:', e);
        }
      }
    }

    this.data.mediaAssets = this.data.mediaAssets.filter((m) => m.id !== id);
    this.save();
    return true;
  }
}

export const store = new DataStore();
