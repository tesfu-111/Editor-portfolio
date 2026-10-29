import { Router, type Request, type Response, type NextFunction } from 'express';
import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import { store, hashPassword } from './dataStore.ts';

const apiRouter = Router();

// Configure Multer storage
const uploadsDir = path.resolve(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const sanitizedBase = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueSuffix = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    cb(null, `${sanitizedBase}_${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit for video & high-res media
  },
  fileFilter: (_req, file, cb) => {
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'image/svg+xml',
      'video/mp4',
      'video/webm',
      'video/quicktime',
      'application/pdf',
    ];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported file type: ${file.mimetype}. Allowed: images, MP4/WebM videos, and PDF resumes.`));
    }
  },
});

// Middleware for Admin authentication
export function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  let token = '';

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  } else if (req.headers.cookie) {
    const match = req.headers.cookie.match(/auracuts_token=([^;]+)/);
    if (match) token = match[1];
  }

  if (!token || !store.validateSession(token)) {
    return res.status(401).json({
      error: 'Unauthorized: Valid administrator session required.',
    });
  }

  next();
}

/* ==========================================================================
   PUBLIC ROUTES
   ========================================================================== */

// 1. Get all public data in one call
apiRouter.get('/public/data', (_req: Request, res: Response) => {
  try {
    const publicData = store.getPublicData();
    res.json(publicData);
  } catch (err) {
    console.error('Error fetching public data:', err);
    res.status(500).json({ error: 'Failed to retrieve public portfolio data' });
  }
});

// 2. Submit Contact Inquiry
apiRouter.post('/inquiries', (req: Request, res: Response) => {
  try {
    const { fullName, email, company, requestedService, budget, deadline, description, referenceLink, hp } = req.body;

    // Honeypot spam defense
    if (hp) {
      return res.status(200).json({ success: true, message: 'Inquiry received' });
    }

    if (!fullName || typeof fullName !== 'string' || fullName.trim().length === 0) {
      return res.status(400).json({ error: 'Full name is required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({ error: 'A valid email address is required.' });
    }

    if (!description || typeof description !== 'string' || description.trim().length < 5) {
      return res.status(400).json({ error: 'Please include a brief description of your project (min 5 characters).' });
    }

    const newInquiry = store.createInquiry({
      fullName: fullName.trim(),
      email: email.trim(),
      company: company ? String(company).trim() : undefined,
      requestedService: requestedService ? String(requestedService).trim() : 'General Inquiry',
      budget: budget ? String(budget).trim() : undefined,
      deadline: deadline ? String(deadline).trim() : undefined,
      description: description.trim(),
      referenceLink: referenceLink ? String(referenceLink).trim() : undefined,
    });

    res.status(201).json({
      success: true,
      message: 'Thank you! Your inquiry has been submitted directly to Alex Vance.',
      inquiryId: newInquiry.id,
    });
  } catch (err) {
    console.error('Error creating inquiry:', err);
    res.status(500).json({ error: 'Failed to submit inquiry. Please try again or reach out directly.' });
  }
});

/* ==========================================================================
   AUTHENTICATION ROUTES
   ========================================================================== */

apiRouter.post('/auth/login', (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required.' });
    }

    const admin = store.getAdmin();
    if (username !== admin.username) {
      return res.status(401).json({ error: 'Invalid administrator credentials.' });
    }

    const computedHash = hashPassword(password, admin.salt);
    if (computedHash !== admin.passwordHash) {
      return res.status(401).json({ error: 'Invalid administrator credentials.' });
    }

    const token = store.createSession(admin.id);

    // Set secure cookie as well as returning JSON
    res.setHeader('Set-Cookie', `auracuts_token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`);
    res.json({
      success: true,
      token,
      user: {
        id: admin.id,
        username: admin.username,
        role: admin.role,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Authentication failed due to server error.' });
  }
});

apiRouter.get('/auth/me', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  let token = '';

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  } else if (req.headers.cookie) {
    const match = req.headers.cookie.match(/auracuts_token=([^;]+)/);
    if (match) token = match[1];
  }

  if (!token || !store.validateSession(token)) {
    return res.status(401).json({ authenticated: false });
  }

  const admin = store.getAdmin();
  res.json({
    authenticated: true,
    user: {
      id: admin.id,
      username: admin.username,
      role: admin.role,
    },
  });
});

apiRouter.post('/auth/logout', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  let token = '';
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  } else if (req.headers.cookie) {
    const match = req.headers.cookie.match(/auracuts_token=([^;]+)/);
    if (match) token = match[1];
  }
  if (token) {
    store.destroySession(token);
  }
  res.setHeader('Set-Cookie', 'auracuts_token=; Path=/; HttpOnly; Max-Age=0');
  res.json({ success: true, message: 'Logged out successfully.' });
});

apiRouter.post('/auth/change-password', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Both current and new passwords are required.' });
    }

    if (typeof newPassword !== 'string' || newPassword.length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters long.' });
    }

    const admin = store.getAdmin();
    const currentHash = hashPassword(currentPassword, admin.salt);
    if (currentHash !== admin.passwordHash) {
      return res.status(400).json({ error: 'Current password does not match.' });
    }

    store.updateAdminPassword(newPassword);
    // Create new session for this admin after password rotation
    const newToken = store.createSession(admin.id);
    res.setHeader('Set-Cookie', `auracuts_token=${newToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`);

    res.json({
      success: true,
      token: newToken,
      message: 'Password successfully updated.',
    });
  } catch (err) {
    console.error('Error changing password:', err);
    res.status(500).json({ error: 'Failed to update password.' });
  }
});

/* ==========================================================================
   ADMIN MANAGEMENT ROUTES
   ========================================================================== */

// Overview metrics
apiRouter.get('/admin/overview', requireAdminAuth, (_req: Request, res: Response) => {
  const projects = store.getAllProjects();
  const inquiries = store.getInquiries();
  const media = store.getMediaAssets();

  const totalBytes = media.reduce((acc, m) => acc + (m.sizeBytes || 0), 0);

  res.json({
    metrics: {
      totalProjects: projects.length,
      publishedProjects: projects.filter((p) => p.isPublished).length,
      draftProjects: projects.filter((p) => !p.isPublished).length,
      featuredProjects: projects.filter((p) => p.isFeatured).length,
      totalInquiries: inquiries.length,
      newInquiries: inquiries.filter((i) => i.status === 'new').length,
      totalMediaAssets: media.length,
      storageUsedBytes: totalBytes,
      storageQuotaBytes: 1024 * 1024 * 1024, // 1 GB simulated quota
    },
    recentInquiries: inquiries.slice(0, 5),
    recentProjects: projects.slice(0, 5),
  });
});

// Settings
apiRouter.get('/admin/settings', requireAdminAuth, (_req: Request, res: Response) => {
  res.json(store.getSettings());
});

apiRouter.put('/admin/settings', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const updated = store.updateSettings(req.body);
    res.json({ success: true, settings: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update site settings' });
  }
});

// About
apiRouter.get('/admin/about', requireAdminAuth, (_req: Request, res: Response) => {
  res.json(store.getAbout());
});

apiRouter.put('/admin/about', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const updated = store.updateAbout(req.body);
    res.json({ success: true, about: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update about data' });
  }
});

// Contact settings
apiRouter.get('/admin/contact', requireAdminAuth, (_req: Request, res: Response) => {
  res.json(store.getContactSettings());
});

apiRouter.put('/admin/contact', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const updated = store.updateContactSettings(req.body);
    res.json({ success: true, contactSettings: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update contact settings' });
  }
});

// Projects CRUD
apiRouter.get('/admin/projects', requireAdminAuth, (_req: Request, res: Response) => {
  res.json(store.getAllProjects());
});

apiRouter.post('/admin/projects', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const project = store.createProject(req.body);
    res.status(201).json({ success: true, project });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create project' });
  }
});

apiRouter.put('/admin/projects/:id', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const updated = store.updateProject(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Project not found' });
    res.json({ success: true, project: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update project' });
  }
});

apiRouter.delete('/admin/projects/:id', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const deleted = store.deleteProject(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Project not found' });
    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// Services CRUD
apiRouter.get('/admin/services', requireAdminAuth, (_req: Request, res: Response) => {
  res.json(store.getServices());
});

apiRouter.post('/admin/services', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const service = store.createService(req.body);
    res.status(201).json({ success: true, service });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create service' });
  }
});

apiRouter.put('/admin/services/:id', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const updated = store.updateService(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Service not found' });
    res.json({ success: true, service: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update service' });
  }
});

apiRouter.delete('/admin/services/:id', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const deleted = store.deleteService(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Service not found' });
    res.json({ success: true, message: 'Service deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete service' });
  }
});

// Inquiries Management
apiRouter.get('/admin/inquiries', requireAdminAuth, (_req: Request, res: Response) => {
  res.json(store.getInquiries());
});

apiRouter.patch('/admin/inquiries/:id', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const updated = store.updateInquiry(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Inquiry not found' });
    res.json({ success: true, inquiry: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update inquiry' });
  }
});

apiRouter.delete('/admin/inquiries/:id', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const deleted = store.deleteInquiry(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Inquiry not found' });
    res.json({ success: true, message: 'Inquiry deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete inquiry' });
  }
});

// Media Library and File Upload
apiRouter.get('/admin/media', requireAdminAuth, (_req: Request, res: Response) => {
  res.json(store.getMediaAssets());
});

apiRouter.post(
  '/admin/upload',
  requireAdminAuth,
  upload.single('file'),
  (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file was provided in upload request.' });
      }

      let category: 'image' | 'video' | 'document' = 'image';
      if (req.file.mimetype.startsWith('video/')) {
        category = 'video';
      } else if (req.file.mimetype === 'application/pdf') {
        category = 'document';
      }

      const fileUrl = `/uploads/${req.file.filename}`;

      const asset = store.addMediaAsset({
        fileName: req.file.filename,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        sizeBytes: req.file.size,
        fileUrl,
        category,
      });

      res.status(201).json({
        success: true,
        asset,
        fileUrl,
      });
    } catch (err) {
      console.error('File upload error:', err);
      res.status(500).json({ error: 'File upload processing failed.' });
    }
  }
);

apiRouter.delete('/admin/media/:id', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const deleted = store.deleteMediaAsset(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Media asset not found.' });
    res.json({ success: true, message: 'Media asset removed.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete media asset.' });
  }
});

export default apiRouter;
