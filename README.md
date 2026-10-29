# AURA CUTS — Premium Cinematic Video Editor Portfolio

A full-stack, cinematic web portfolio and client acquisition platform engineered for freelance video editors, colorists, and post-production studios.

---

## 1. Visual Brand & Styling

- **Near-Black Background**: `#0B0B0D`
- **Charcoal Surfaces**: `#171719`
- **Accent Orange**: `#FF6A2B` (with `#FF7F47` hover highlights)
- **Muted Gray Text**: `#A5A5AA`
- **High-Contrast Text**: `#F5F5F5`
- **Typography**:
  - Headings & Wordmark: `Syne`
  - Metrics & Badges: `Space Grotesk`
  - Body & UI: `Plus Jakarta Sans`
- **Atmosphere**: Subtle 35mm film grain overlay, delicate radial glows, zero-pill discipline, smooth spring transitions.

---

## 2. Core Architecture & Features

### A. Dynamic Hero with Two Background Modes (Switchable in Admin)
- **Mode 1 (Portrait / Photo)**: Displays an editorial portrait or photograph with dark gradient overlays.
- **Mode 2 (Looping Video)**: High-definition muted, looping background video with automatic portrait image fallback for mobile browsers, slow networks, or when reduced-motion preferences are detected.
- **Editable Content**: Full control over Headline, Subtitle, Primary CTA, Secondary CTA, and Showreel video URL directly from the Admin Dashboard.

### B. Video Playback Engine (Two Methods Supported)
- **Method 1 — Direct File Uploads**: Upload raw video reels (.mp4, .webm) up to 100MB directly to cloud/server storage. Custom HTML5 player includes seek scrubbing, volume/mute toggles, aspect ratio preservation (16:9, 9:16 vertical, 2.39:1 anamorphic, 1:1 square), buffering indicators, and full-screen controls.
- **Method 2 — External Video Links**: Automatically detects and cleanly embeds:
  - **YouTube** (standard, shorts, embed URLs via privacy-conscious `youtube-nocookie.com`)
  - **Vimeo** (clean video player embeds)
  - **Google Drive** (preview player embeds)
  - **Direct MP4/WebM URLs**
- **Color Grading Comparison**: Interactive Before/After slider allowing prospective clients to scrub between flat LOG camera footage and final film emulation grades.

### C. Services & Instant Booking Pipeline
- 8 Editable Service Categories: Short-Form Video Editing, YouTube Editing, Social Media Content, Cinematic Storytelling, Color Correction & Grading, Sound Design, Motion Graphics, and Promotional Video Editing.
- Deliverables checklist, turnaround time, and optional pricing toggle (choose between displayed rate or "Custom Quote").
- Clicking **"Book This Service"** or **"Book Similar Edit"** from any project automatically routes to the Contact form with preselected service tags and project reference notes.

### D. About Me & Post-Production Protocol
- Editorial biography, career trajectory, experience counter, and live availability badge.
- Interactive software proficiency matrix (DaVinci Resolve, Premiere Pro, After Effects, Audition, Blender).
- The 5-Phase Editing Protocol (Ingest & Alignment -> Narrative Assembly -> Sound Design & Foley -> Color Grading & Motion Graphics -> Master Delivery).
- Downloadable CV / Resume (.pdf).

### E. Working Contact Form & Anti-Spam
- Validates all inputs (Name, Email, Service, Description, Budget, Deadline, Reference Link).
- Silent Honeypot anti-spam defense.
- Direct channels: Email, WhatsApp, Telegram, YouTube, Instagram, TikTok, and LinkedIn.

### F. Protected Admin Dashboard & Security
- **Authentication**: PBKDF2 with SHA-512 and 100,000 hashing rounds + salt. Secure session tokens with 7-day expiration.
- **Admin Sections**:
  1. **Overview**: Key metrics, draft/published projects count, unread inquiries count, disk quota progress bar.
  2. **Projects**: Add, edit, publish/draft toggle, feature toggle, reorder, delete.
  3. **Media Library**: Upload media, copy direct URLs for projects/backgrounds, delete files.
  4. **Homepage Mode**: Switch between Looping Video Mode and Image Mode, update headlines and CTAs.
  5. **About Me**: Edit biography, portrait URL, software skills, 5-phase workflow, and resume URL.
  6. **Services**: Create, update, toggle rates, and delete service cards.
  7. **Contact Settings**: Update direct email, WhatsApp, Telegram, and social profiles.
  8. **Inquiries**: Review incoming briefs, change status (New / Reviewed / Archived), delete messages.
  9. **Website Settings**: Site name, logo text, SEO tags, and rotate admin master password.

---

## 3. Initial Administrator Credentials

- **Username**: `admin`
- **Default Password**: `admin-auracuts-2026!`
- **Access**: Click the lock icon in the navigation bar or footer, or navigate to `/admin-login`.
- **Password Rotation**: Once logged in, open **Website Settings** in the dashboard to rotate the password.

---

## 4. Persistent Storage & Database Configuration

1. **Current Server-Side Storage Adapter**:
   - Database records (settings, projects, services, inquiries, media metadata, hashed admin credentials) are stored persistently in `data/db.json`.
   - Uploaded media files (videos, thumbnails, PDFs) are saved in `public/uploads/` and served with HTTP streaming and caching headers.
2. **Firebase Option**:
   - If you later choose to connect Google Cloud Firestore and Firebase Storage, the intermediate blueprint schemas in `src/types/portfolio.ts` map 1-to-1 to Firestore collections (`siteSettings`, `portfolioProjects`, `services`, `contactInquiries`, `mediaAssets`).
   - Run Firebase setup in the AI Studio panel and add your project configuration to `firebase-applet-config.json`.

---

## 5. Scripts

- `npm run dev`: Runs the full-stack development server with Express API middleware on port 3000.
- `npm run build`: Compiles production frontend bundle.
- `npm run start`: Starts the standalone Express production server on port 3000.
- `npm run lint`: Verifies TypeScript types with zero errors.
