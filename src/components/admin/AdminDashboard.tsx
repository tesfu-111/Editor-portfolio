import React, { useState, useEffect } from 'react';
import type {
  PortfolioProject,
  ServiceItem,
  SiteSettings,
  AboutData,
  ContactSettings,
  ContactInquiry,
  MediaAsset,
  ProjectCategory,
  VideoSourceType,
} from '../../types/portfolio.ts';
import { ALL_CATEGORIES } from '../../types/portfolio.ts';
import { formatBytes } from '../../utils/videoUtils.ts';
import {
  LayoutDashboard,
  Film,
  Image as ImageIcon,
  Home,
  User,
  Briefcase,
  Mail,
  Settings,
  LogOut,
  Plus,
  Trash2,
  Edit2,
  Eye,
  Check,
  Copy,
  Upload,
  AlertCircle,
  Loader2,
  Save,
  Clock,
  ExternalLink,
  Sliders,
  Sparkles,
  Layers,
  KeyRound,
  FileText,
  Video,
  X,
} from 'lucide-react';

interface AdminDashboardProps {
  token: string;
  onLogout: () => void;
  onNavigatePublic: () => void;
  onDataRefresh: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  token,
  onLogout,
  onNavigatePublic,
  onDataRefresh,
}) => {
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'projects'
    | 'media'
    | 'homepage'
    | 'about'
    | 'services'
    | 'contact'
    | 'inquiries'
    | 'settings'
  >('overview');

  const [isLoading, setIsLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Data states
  const [overview, setOverview] = useState<any>(null);
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [about, setAbout] = useState<AboutData | null>(null);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [contactSettings, setContactSettings] = useState<ContactSettings | null>(null);
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);

  // Project Editor Modal State
  const [editingProject, setEditingProject] = useState<Partial<PortfolioProject> | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  // Service Editor Modal State
  const [editingService, setEditingService] = useState<Partial<ServiceItem> | null>(null);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);

  // Upload state
  const [isUploading, setIsUploading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  // Password change state
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordMsg, setPasswordMsg] = useState<{ text: string; isError: boolean } | null>(null);

  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  // Fetch initial admin data
  const fetchAllData = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const [ovRes, prRes, mdRes, stRes, abRes, srRes, ctRes, inqRes] = await Promise.all([
        fetch('/api/admin/overview', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/admin/projects', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/admin/media', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/admin/settings', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/admin/about', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/admin/services', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/admin/contact', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/admin/inquiries', { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      if (!ovRes.ok) throw new Error('Failed to load overview data.');

      setOverview(await ovRes.json());
      setProjects(await prRes.json());
      setMediaAssets(await mdRes.json());
      setSettings(await stRes.json());
      setAbout(await abRes.json());
      setServices(await srRes.json());
      setContactSettings(await ctRes.json());
      setInquiries(await inqRes.json());
    } catch (err: any) {
      setErrorMessage(err.message || 'Error loading dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [token]);

  const showToast = (msg: string) => {
    setSaveStatus(msg);
    setTimeout(() => setSaveStatus(null), 3500);
  };

  // 1. Projects handlers
  const handleSaveProject = async () => {
    if (!editingProject?.title || !editingProject.category || !editingProject.videoUrl) {
      alert('Title, Category, and Video URL are required.');
      return;
    }

    try {
      const isNew = !editingProject.id;
      const url = isNew ? '/api/admin/projects' : `/api/admin/projects/${editingProject.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: authHeaders,
        body: JSON.stringify(editingProject),
      });

      if (!res.ok) throw new Error('Failed to save project.');
      setIsProjectModalOpen(false);
      setEditingProject(null);
      await fetchAllData();
      onDataRefresh();
      showToast('Project saved successfully!');
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) return;
    try {
      const res = await fetch(`/api/admin/projects/${id}`, { method: 'DELETE', headers: authHeaders });
      if (!res.ok) throw new Error('Delete failed');
      await fetchAllData();
      onDataRefresh();
      showToast('Project removed.');
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleTogglePublish = async (project: PortfolioProject) => {
    try {
      await fetch(`/api/admin/projects/${project.id}`, {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify({ isPublished: !project.isPublished }),
      });
      await fetchAllData();
      onDataRefresh();
    } catch (e) {
      console.error(e);
    }
  };

  // 2. Media Upload handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 100 * 1024 * 1024) {
      alert('File exceeds 100MB limit.');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed.');

      await fetchAllData();
      showToast(`Uploaded ${file.name} successfully! URL: ${data.fileUrl}`);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleDeleteMedia = async (id: string) => {
    if (!confirm('Delete this media asset from disk?')) return;
    try {
      const res = await fetch(`/api/admin/media/${id}`, { method: 'DELETE', headers: authHeaders });
      if (!res.ok) throw new Error('Failed to delete media asset');
      await fetchAllData();
      showToast('Media file deleted.');
    } catch (e: any) {
      alert(e.message);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUrl(text);
    setTimeout(() => setCopiedUrl(null), 2500);
  };

  // 3. Homepage settings save
  const handleSaveSettings = async () => {
    if (!settings) return;
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error('Save failed');
      onDataRefresh();
      showToast('Homepage and site settings updated!');
    } catch (e: any) {
      alert(e.message);
    }
  };

  // 4. About save
  const handleSaveAbout = async () => {
    if (!about) return;
    try {
      const res = await fetch('/api/admin/about', {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify(about),
      });
      if (!res.ok) throw new Error('Save failed');
      onDataRefresh();
      showToast('About Me profile updated!');
    } catch (e: any) {
      alert(e.message);
    }
  };

  // 5. Services handlers
  const handleSaveService = async () => {
    if (!editingService?.title || !editingService.shortDescription) {
      alert('Title and description are required.');
      return;
    }
    try {
      const isNew = !editingService.id;
      const url = isNew ? '/api/admin/services' : `/api/admin/services/${editingService.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: authHeaders,
        body: JSON.stringify(editingService),
      });
      if (!res.ok) throw new Error('Failed to save service');
      setIsServiceModalOpen(false);
      setEditingService(null);
      await fetchAllData();
      onDataRefresh();
      showToast('Service saved!');
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm('Delete this service card?')) return;
    try {
      const res = await fetch(`/api/admin/services/${id}`, { method: 'DELETE', headers: authHeaders });
      if (!res.ok) throw new Error('Failed to delete service');
      await fetchAllData();
      onDataRefresh();
      showToast('Service removed.');
    } catch (e: any) {
      alert(e.message);
    }
  };

  // 6. Contact Settings save
  const handleSaveContactSettings = async () => {
    if (!contactSettings) return;
    try {
      const res = await fetch('/api/admin/contact', {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify(contactSettings),
      });
      if (!res.ok) throw new Error('Failed to save contact settings');
      onDataRefresh();
      showToast('Contact channels updated!');
    } catch (e: any) {
      alert(e.message);
    }
  };

  // 7. Inquiries handlers
  const handleUpdateInquiryStatus = async (id: string, status: 'new' | 'reviewed' | 'archived') => {
    try {
      await fetch(`/api/admin/inquiries/${id}`, {
        method: 'PATCH',
        headers: authHeaders,
        body: JSON.stringify({ status }),
      });
      await fetchAllData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    if (!confirm('Delete this inquiry record from database?')) return;
    try {
      await fetch(`/api/admin/inquiries/${id}`, { method: 'DELETE', headers: authHeaders });
      await fetchAllData();
      showToast('Inquiry deleted.');
    } catch (e: any) {
      alert(e.message);
    }
  };

  // 8. Password change
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMsg({ text: 'New passwords do not match.', isError: true });
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      setPasswordMsg({ text: 'New password must be at least 8 characters.', isError: true });
      return;
    }

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update password');

      setPasswordMsg({ text: 'Password changed successfully! Keep note of your new credentials.', isError: false });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      setPasswordMsg({ text: err.message, isError: true });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B0B0D] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-[#FF6A2B] animate-spin" />
          <span className="font-mono-tag text-xs text-[#A5A5AA]">Loading Studio Console...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0B0D] text-[#F5F5F5] flex flex-col md:flex-row">
      {/* Toast Notification */}
      {saveStatus && (
        <div className="fixed top-6 right-6 z-50 px-4 py-3 rounded-xl bg-[#171719] border border-[#FF6A2B] text-xs font-mono-tag text-[#F5F5F5] shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
          <Check className="w-4 h-4 text-[#FF6A2B]" />
          <span>{saveStatus}</span>
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#171719] border-r border-[#26262B] flex flex-col justify-between shrink-0">
        <div>
          {/* Logo / Header */}
          <div className="p-6 border-b border-[#26262B]">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF6A2B]" />
              <span className="font-display font-extrabold text-lg text-white uppercase tracking-wider">
                {settings?.brandName || 'AURA CUTS'}
              </span>
            </div>
            <span className="text-[10px] font-mono-tag uppercase tracking-widest text-[#FF6A2B] block">
              Studio Admin Console
            </span>
          </div>

          {/* Nav links */}
          <nav className="p-4 space-y-1">
            {[
              { id: 'overview', label: 'Overview', icon: LayoutDashboard },
              { id: 'projects', label: 'Projects & Reels', icon: Film, badge: projects.length },
              { id: 'media', label: 'Media Library', icon: ImageIcon, badge: mediaAssets.length },
              { id: 'homepage', label: 'Homepage Mode', icon: Home },
              { id: 'about', label: 'About Me', icon: User },
              { id: 'services', label: 'Services', icon: Briefcase, badge: services.length },
              { id: 'contact', label: 'Contact Settings', icon: Mail },
              {
                id: 'inquiries',
                label: 'Inquiries',
                icon: FileText,
                badge: inquiries.filter((i) => i.status === 'new').length,
                badgeColor: 'bg-[#FF6A2B] text-black font-bold',
              },
              { id: 'settings', label: 'Website Settings', icon: Settings },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-mono-tag uppercase tracking-wider transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#FF6A2B] text-[#0B0B0D] font-bold shadow-md shadow-[#FF6A2B]/10'
                      : 'text-[#A5A5AA] hover:text-white hover:bg-[#0B0B0D]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`px-1.5 py-0.2 rounded text-[10px] ${
                        isActive
                          ? 'bg-[#0B0B0D] text-white'
                          : item.badgeColor || 'bg-[#26262B] text-[#A5A5AA]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer: Public site & Logout */}
        <div className="p-4 border-t border-[#26262B] space-y-2">
          <button
            onClick={onNavigatePublic}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#0B0B0D] border border-[#26262B] hover:border-[#FF6A2B] text-xs font-mono-tag text-[#F5F5F5] transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-[#FF6A2B]" />
            <span>View Public Showcase</span>
          </button>

          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-mono-tag text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8 max-w-6xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#26262B] pb-6">
              <div>
                <h1 className="font-display font-extrabold text-2xl sm:text-3xl uppercase text-white">
                  Studio Operations
                </h1>
                <p className="text-xs text-[#A5A5AA]">
                  Current system metrics, published reels status, and client pipeline.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setEditingProject({
                      title: '',
                      category: 'Cinematic Edits',
                      videoSourceType: 'mp4',
                      videoUrl: '',
                      thumbnailUrl: '',
                      description: '',
                      editingSoftware: ['Premiere Pro', 'DaVinci Resolve'],
                      projectDate: new Date().toISOString().substring(0, 7),
                      isPublished: true,
                      isFeatured: false,
                      aspectRatio: '16:9',
                    });
                    setIsProjectModalOpen(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-[#FF6A2B] hover:bg-[#FF7F47] text-[#0B0B0D] font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Project Cut</span>
                </button>
              </div>
            </div>

            {/* Metric Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              <div className="p-5 rounded-2xl bg-[#171719] border border-[#26262B]">
                <span className="text-[11px] font-mono-tag uppercase text-[#A5A5AA] block mb-1">
                  Total Projects
                </span>
                <div className="text-3xl font-display font-extrabold text-white">
                  {overview?.metrics.totalProjects || 0}
                </div>
                <div className="text-[10px] font-mono-tag text-emerald-400 mt-2">
                  {overview?.metrics.publishedProjects || 0} Published &bull; {overview?.metrics.draftProjects || 0} Drafts
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#171719] border border-[#26262B]">
                <span className="text-[11px] font-mono-tag uppercase text-[#A5A5AA] block mb-1">
                  Client Inquiries
                </span>
                <div className="text-3xl font-display font-extrabold text-[#FF6A2B]">
                  {overview?.metrics.newInquiries || 0}
                </div>
                <div className="text-[10px] font-mono-tag text-[#A5A5AA] mt-2">
                  {overview?.metrics.totalInquiries || 0} Total in Database
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#171719] border border-[#26262B]">
                <span className="text-[11px] font-mono-tag uppercase text-[#A5A5AA] block mb-1">
                  Media Library
                </span>
                <div className="text-3xl font-display font-extrabold text-white">
                  {overview?.metrics.totalMediaAssets || 0}
                </div>
                <div className="text-[10px] font-mono-tag text-[#A5A5AA] mt-2">
                  Uploaded Clips &amp; Stills
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#171719] border border-[#26262B]">
                <span className="text-[11px] font-mono-tag uppercase text-[#A5A5AA] block mb-1">
                  Server Storage Used
                </span>
                <div className="text-xl font-display font-extrabold text-white truncate">
                  {formatBytes(overview?.metrics.storageUsedBytes || 0)}
                </div>
                <div className="text-[10px] font-mono-tag text-[#A5A5AA] mt-2">
                  of 1 GB Local Quota
                </div>
              </div>
            </div>

            {/* Recent Inquiries List */}
            <div className="p-6 rounded-2xl bg-[#171719] border border-[#26262B] space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-lg text-white">
                  Recent Client Project Briefs
                </h3>
                <button
                  onClick={() => setActiveTab('inquiries')}
                  className="text-xs font-mono-tag text-[#FF6A2B] hover:underline"
                >
                  View All ({inquiries.length}) &rarr;
                </button>
              </div>

              {inquiries.length === 0 ? (
                <p className="text-xs text-[#A5A5AA] py-4">No client inquiries received yet.</p>
              ) : (
                <div className="divide-y divide-[#26262B]">
                  {inquiries.slice(0, 5).map((inq) => (
                    <div key={inq.id} className="py-3 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-white flex items-center gap-2">
                          <span>{inq.fullName}</span>
                          {inq.company && <span className="text-[#A5A5AA]">({inq.company})</span>}
                          {inq.status === 'new' && (
                            <span className="px-1.5 py-0.5 rounded bg-[#FF6A2B] text-black font-bold text-[9px] uppercase">
                              New
                            </span>
                          )}
                        </div>
                        <div className="text-[#A5A5AA] text-[11px] mt-0.5">
                          {inq.requestedService} &bull; {inq.email}
                        </div>
                      </div>
                      <span className="font-mono text-[10px] text-[#A5A5AA]">
                        {new Date(inq.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: PROJECTS MANAGEMENT */}
        {activeTab === 'projects' && (
          <div className="space-y-6 max-w-6xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#26262B] pb-6">
              <div>
                <h1 className="font-display font-extrabold text-2xl uppercase text-white">
                  Portfolio Projects &amp; Reels
                </h1>
                <p className="text-xs text-[#A5A5AA]">
                  Manage showcase cuts, video providers (direct MP4/WebM uploads or YouTube/Vimeo/Google Drive links), and publishing status.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingProject({
                    title: '',
                    category: 'Cinematic Edits',
                    videoSourceType: 'mp4',
                    videoUrl: '',
                    thumbnailUrl: '',
                    description: '',
                    editingSoftware: ['Premiere Pro', 'DaVinci Resolve'],
                    projectDate: new Date().toISOString().substring(0, 7),
                    isPublished: true,
                    isFeatured: false,
                    aspectRatio: '16:9',
                  });
                  setIsProjectModalOpen(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-[#FF6A2B] hover:bg-[#FF7F47] text-[#0B0B0D] font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Add Project</span>
              </button>
            </div>

            {/* Projects Table */}
            <div className="bg-[#171719] border border-[#26262B] rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0B0B0D] border-b border-[#26262B] text-[#A5A5AA] font-mono-tag uppercase text-[10px]">
                    <tr>
                      <th className="p-4">Thumbnail</th>
                      <th className="p-4">Title &amp; Category</th>
                      <th className="p-4">Source Type</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Featured</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#26262B]">
                    {projects.map((proj) => (
                      <tr key={proj.id} className="hover:bg-[#0B0B0D]/50 transition-colors">
                        <td className="p-4">
                          <img
                            src={proj.thumbnailUrl || 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=200&q=80'}
                            alt={proj.title}
                            className="w-16 h-10 object-cover rounded bg-black border border-[#26262B]"
                          />
                        </td>
                        <td className="p-4">
                          <div className="font-bold text-white text-sm">{proj.title}</div>
                          <div className="text-[11px] text-[#FF6A2B] font-mono-tag">{proj.category}</div>
                          {proj.clientName && (
                            <div className="text-[10px] text-[#A5A5AA]">Client: {proj.clientName}</div>
                          )}
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded bg-[#0B0B0D] border border-[#26262B] font-mono uppercase text-[10px]">
                            {proj.videoSourceType}
                          </span>
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => handleTogglePublish(proj)}
                            className={`px-2 py-1 rounded text-[10px] font-mono-tag uppercase cursor-pointer ${
                              proj.isPublished
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30'
                            }`}
                          >
                            {proj.isPublished ? 'Published' : 'Draft'}
                          </button>
                        </td>
                        <td className="p-4">
                          <span className={`font-mono text-[10px] ${proj.isFeatured ? 'text-[#FF6A2B]' : 'text-[#A5A5AA]'}`}>
                            {proj.isFeatured ? '★ Featured' : 'Standard'}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => {
                              setEditingProject(proj);
                              setIsProjectModalOpen(true);
                            }}
                            className="p-1.5 rounded bg-[#0B0B0D] border border-[#26262B] text-[#A5A5AA] hover:text-white hover:border-[#FF6A2B]"
                            title="Edit Project"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(proj.id)}
                            className="p-1.5 rounded bg-[#0B0B0D] border border-[#26262B] text-red-400 hover:bg-red-500/10"
                            title="Delete Project"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: MEDIA LIBRARY */}
        {activeTab === 'media' && (
          <div className="space-y-6 max-w-6xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#26262B] pb-6">
              <div>
                <h1 className="font-display font-extrabold text-2xl uppercase text-white">
                  Media Library &amp; Video Storage
                </h1>
                <p className="text-xs text-[#A5A5AA]">
                  Direct file uploads (Method 1). Upload full video reels (.mp4, .webm), high-res thumbnails (.jpg, .png, .webp), and your resume (.pdf). Max 100MB per file.
                </p>
              </div>

              {/* Upload Button */}
              <label className="px-4 py-2.5 rounded-xl bg-[#FF6A2B] hover:bg-[#FF7F47] text-[#0B0B0D] font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md">
                <Upload className="w-4 h-4" />
                <span>{isUploading ? 'Uploading to Server...' : 'Upload Media File'}</span>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="hidden"
                  accept="video/mp4,video/webm,image/jpeg,image/png,image/webp,application/pdf"
                />
              </label>
            </div>

            {/* Media Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {mediaAssets.map((asset) => (
                <div
                  key={asset.id}
                  className="bg-[#171719] border border-[#26262B] rounded-xl overflow-hidden flex flex-col justify-between group hover:border-[#FF6A2B]"
                >
                  <div className="aspect-video bg-[#0B0B0D] relative overflow-hidden flex items-center justify-center">
                    {asset.category === 'video' ? (
                      <div className="flex flex-col items-center text-[#FF6A2B]">
                        <Video className="w-8 h-8 mb-1" />
                        <span className="text-[9px] font-mono uppercase">VIDEO CLIP</span>
                      </div>
                    ) : asset.category === 'document' ? (
                      <div className="flex flex-col items-center text-emerald-400">
                        <FileText className="w-8 h-8 mb-1" />
                        <span className="text-[9px] font-mono uppercase">PDF RESUME</span>
                      </div>
                    ) : (
                      <img
                        src={asset.fileUrl}
                        alt={asset.originalName}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  <div className="p-3">
                    <p className="text-xs font-bold text-white truncate mb-1" title={asset.originalName}>
                      {asset.originalName}
                    </p>
                    <div className="flex items-center justify-between text-[10px] font-mono text-[#A5A5AA] mb-3">
                      <span>{formatBytes(asset.sizeBytes)}</span>
                      <span className="uppercase">{asset.category}</span>
                    </div>

                    <div className="flex items-center justify-between gap-1 pt-2 border-t border-[#26262B]">
                      <button
                        onClick={() => copyToClipboard(asset.fileUrl)}
                        className="flex-1 py-1 px-2 rounded bg-[#0B0B0D] hover:bg-[#FF6A2B] hover:text-[#0B0B0D] border border-[#26262B] text-[10px] font-mono-tag transition-colors flex items-center justify-center gap-1"
                        title="Copy relative file URL for projects or settings"
                      >
                        {copiedUrl === asset.fileUrl ? (
                          <>
                            <Check className="w-3 h-3" /> Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" /> Copy URL
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleDeleteMedia(asset.id)}
                        className="p-1.5 rounded bg-[#0B0B0D] text-red-400 hover:bg-red-500/10 border border-[#26262B]"
                        title="Delete asset"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: HOMEPAGE BACKGROUND MODES & HERO */}
        {activeTab === 'homepage' && settings && (
          <div className="space-y-6 max-w-4xl">
            <div className="flex items-center justify-between border-b border-[#26262B] pb-6">
              <div>
                <h1 className="font-display font-extrabold text-2xl uppercase text-white">
                  Homepage &amp; Background Modes
                </h1>
                <p className="text-xs text-[#A5A5AA]">
                  Configure whether the hero uses a high-definition looping muted video background or a full-screen portrait photo.
                </p>
              </div>

              <button
                onClick={handleSaveSettings}
                className="px-5 py-2.5 rounded-xl bg-[#FF6A2B] hover:bg-[#FF7F47] text-[#0B0B0D] font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>

            <div className="p-6 rounded-2xl bg-[#171719] border border-[#26262B] space-y-6">
              {/* Background Mode Switcher */}
              <div>
                <label className="block text-xs font-mono-tag uppercase tracking-wider text-[#A5A5AA] mb-3">
                  Hero Background Mode (Switchable without code)
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setSettings({ ...settings, heroBackgroundMode: 'video' })}
                    className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                      settings.heroBackgroundMode === 'video'
                        ? 'border-[#FF6A2B] bg-[#FF6A2B]/10 text-white'
                        : 'border-[#26262B] bg-[#0B0B0D] text-[#A5A5AA]'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-display font-bold text-sm mb-1">
                      <Video className="w-4 h-4 text-[#FF6A2B]" />
                      <span>Mode 2: Looping Video</span>
                    </div>
                    <p className="text-xs text-[#A5A5AA]">
                      Muted, looping background video with automatic portrait fallback for mobile &amp; network issues.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSettings({ ...settings, heroBackgroundMode: 'image' })}
                    className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                      settings.heroBackgroundMode === 'image'
                        ? 'border-[#FF6A2B] bg-[#FF6A2B]/10 text-white'
                        : 'border-[#26262B] bg-[#0B0B0D] text-[#A5A5AA]'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-display font-bold text-sm mb-1">
                      <ImageIcon className="w-4 h-4 text-[#FF6A2B]" />
                      <span>Mode 1: Portrait / Photo</span>
                    </div>
                    <p className="text-xs text-[#A5A5AA]">
                      Full-screen editorial photograph or high-impact portrait with dark contrast overlays.
                    </p>
                  </button>
                </div>
              </div>

              {/* Hero Video URL */}
              <div>
                <label className="block text-xs font-mono-tag uppercase tracking-wider text-[#A5A5AA] mb-1.5">
                  Hero Video URL (.mp4 / direct stream or /uploads/...)
                </label>
                <input
                  type="text"
                  value={settings.heroVideoUrl}
                  onChange={(e) => setSettings({ ...settings, heroVideoUrl: e.target.value })}
                  placeholder="https://.../video.mp4 or /uploads/..."
                  className="w-full px-4 py-3 rounded-xl bg-[#0B0B0D] border border-[#26262B] focus:border-[#FF6A2B] text-sm text-white"
                />
              </div>

              {/* Hero Image URL */}
              <div>
                <label className="block text-xs font-mono-tag uppercase tracking-wider text-[#A5A5AA] mb-1.5">
                  Hero Image / Fallback Portrait URL
                </label>
                <input
                  type="text"
                  value={settings.heroImageUrl}
                  onChange={(e) => setSettings({ ...settings, heroImageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/... or /uploads/..."
                  className="w-full px-4 py-3 rounded-xl bg-[#0B0B0D] border border-[#26262B] focus:border-[#FF6A2B] text-sm text-white"
                />
              </div>

              {/* Headline */}
              <div>
                <label className="block text-xs font-mono-tag uppercase tracking-wider text-[#A5A5AA] mb-1.5">
                  Hero Main Headline
                </label>
                <input
                  type="text"
                  value={settings.heroHeadline}
                  onChange={(e) => setSettings({ ...settings, heroHeadline: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#0B0B0D] border border-[#26262B] focus:border-[#FF6A2B] text-sm text-white"
                />
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-xs font-mono-tag uppercase tracking-wider text-[#A5A5AA] mb-1.5">
                  Hero Subtitle
                </label>
                <input
                  type="text"
                  value={settings.heroSubtitle}
                  onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#0B0B0D] border border-[#26262B] focus:border-[#FF6A2B] text-sm text-white"
                />
              </div>

              {/* Buttons Text */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono-tag uppercase tracking-wider text-[#A5A5AA] mb-1.5">
                    Primary Button Label
                  </label>
                  <input
                    type="text"
                    value={settings.heroPrimaryCtaText}
                    onChange={(e) => setSettings({ ...settings, heroPrimaryCtaText: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#0B0B0D] border border-[#26262B] focus:border-[#FF6A2B] text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono-tag uppercase tracking-wider text-[#A5A5AA] mb-1.5">
                    Secondary Button Label
                  </label>
                  <input
                    type="text"
                    value={settings.heroSecondaryCtaText}
                    onChange={(e) => setSettings({ ...settings, heroSecondaryCtaText: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#0B0B0D] border border-[#26262B] focus:border-[#FF6A2B] text-sm text-white"
                  />
                </div>
              </div>

              {/* Showreel URL */}
              <div>
                <label className="block text-xs font-mono-tag uppercase tracking-wider text-[#A5A5AA] mb-1.5">
                  Showreel Video URL (YouTube, Vimeo, or direct MP4)
                </label>
                <input
                  type="text"
                  value={settings.showReelUrl}
                  onChange={(e) => setSettings({ ...settings, showReelUrl: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-4 py-3 rounded-xl bg-[#0B0B0D] border border-[#26262B] focus:border-[#FF6A2B] text-sm text-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: ABOUT ME */}
        {activeTab === 'about' && about && (
          <div className="space-y-6 max-w-4xl">
            <div className="flex items-center justify-between border-b border-[#26262B] pb-6">
              <div>
                <h1 className="font-display font-extrabold text-2xl uppercase text-white">
                  About Me Profile
                </h1>
                <p className="text-xs text-[#A5A5AA]">
                  Update your editor biography, portrait, career trajectory, software skills, and 5-phase workflow.
                </p>
              </div>

              <button
                onClick={handleSaveAbout}
                className="px-5 py-2.5 rounded-xl bg-[#FF6A2B] hover:bg-[#FF7F47] text-[#0B0B0D] font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile</span>
              </button>
            </div>

            <div className="p-6 rounded-2xl bg-[#171719] border border-[#26262B] space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono-tag uppercase tracking-wider text-[#A5A5AA] mb-1.5">
                    Editor Full Name
                  </label>
                  <input
                    type="text"
                    value={about.fullName}
                    onChange={(e) => setAbout({ ...about, fullName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#0B0B0D] border border-[#26262B] text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono-tag uppercase tracking-wider text-[#A5A5AA] mb-1.5">
                    Professional Role / Title
                  </label>
                  <input
                    type="text"
                    value={about.role}
                    onChange={(e) => setAbout({ ...about, role: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#0B0B0D] border border-[#26262B] text-sm text-white"
                  />
                </div>
              </div>

              {/* Portrait & Resume URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono-tag uppercase tracking-wider text-[#A5A5AA] mb-1.5">
                    Portrait Photograph URL
                  </label>
                  <input
                    type="text"
                    value={about.portraitUrl}
                    onChange={(e) => setAbout({ ...about, portraitUrl: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#0B0B0D] border border-[#26262B] text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono-tag uppercase tracking-wider text-[#A5A5AA] mb-1.5">
                    Resume / CV Download URL (.pdf)
                  </label>
                  <input
                    type="text"
                    value={about.resumeUrl || ''}
                    onChange={(e) => setAbout({ ...about, resumeUrl: e.target.value })}
                    placeholder="/uploads/resume.pdf"
                    className="w-full px-4 py-3 rounded-xl bg-[#0B0B0D] border border-[#26262B] text-sm text-white"
                  />
                </div>
              </div>

              {/* Location & Availability */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono-tag uppercase tracking-wider text-[#A5A5AA] mb-1.5">
                    Location / Work Style
                  </label>
                  <input
                    type="text"
                    value={about.location}
                    onChange={(e) => setAbout({ ...about, location: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#0B0B0D] border border-[#26262B] text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono-tag uppercase tracking-wider text-[#A5A5AA] mb-1.5">
                    Availability Status Note
                  </label>
                  <input
                    type="text"
                    value={about.availabilityStatus}
                    onChange={(e) => setAbout({ ...about, availabilityStatus: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#0B0B0D] border border-[#26262B] text-sm text-white"
                  />
                </div>
              </div>

              {/* Bio Paragraphs */}
              <div>
                <label className="block text-xs font-mono-tag uppercase tracking-wider text-[#A5A5AA] mb-1.5">
                  Professional Biography (Separate paragraphs with double enter)
                </label>
                <textarea
                  rows={5}
                  value={about.bio.join('\n\n')}
                  onChange={(e) => setAbout({ ...about, bio: e.target.value.split('\n\n').filter(Boolean) })}
                  className="w-full px-4 py-3 rounded-xl bg-[#0B0B0D] border border-[#26262B] text-sm text-white resize-y"
                />
              </div>

              {/* Career Goals */}
              <div>
                <label className="block text-xs font-mono-tag uppercase tracking-wider text-[#A5A5AA] mb-1.5">
                  Career Goals &amp; Trajectory
                </label>
                <textarea
                  rows={3}
                  value={about.careerGoals}
                  onChange={(e) => setAbout({ ...about, careerGoals: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#0B0B0D] border border-[#26262B] text-sm text-white resize-y"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: SERVICES */}
        {activeTab === 'services' && (
          <div className="space-y-6 max-w-6xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#26262B] pb-6">
              <div>
                <h1 className="font-display font-extrabold text-2xl uppercase text-white">
                  Services &amp; Packages
                </h1>
                <p className="text-xs text-[#A5A5AA]">
                  Manage service offerings, deliverables, turnaround periods, and optional rate cards.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingService({
                    title: '',
                    category: 'Post-Production',
                    shortDescription: '',
                    fullDescription: '',
                    deliverables: ['Master Export', 'Revisions'],
                    turnaroundTime: '48 Hours',
                    idealFor: 'Creators & Brands',
                    showPricing: false,
                    startingPrice: '$250',
                    iconName: 'Sparkles',
                  });
                  setIsServiceModalOpen(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-[#FF6A2B] hover:bg-[#FF7F47] text-[#0B0B0D] font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Add Service</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="p-5 rounded-2xl bg-[#171719] border border-[#26262B] flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-mono-tag uppercase text-[#FF6A2B]">
                        {service.category}
                      </span>
                      <span className="text-xs text-[#A5A5AA] font-mono">
                        {service.showPricing ? service.startingPrice : 'Custom Quote'}
                      </span>
                    </div>
                    <h3 className="font-display font-bold text-lg text-white mb-2">{service.title}</h3>
                    <p className="text-xs text-[#A5A5AA] line-clamp-3 mb-4">{service.shortDescription}</p>
                  </div>

                  <div className="pt-3 border-t border-[#26262B] flex items-center justify-end gap-2">
                    <button
                      onClick={() => {
                        setEditingService(service);
                        setIsServiceModalOpen(true);
                      }}
                      className="p-1.5 rounded bg-[#0B0B0D] border border-[#26262B] text-[#A5A5AA] hover:text-white"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteService(service.id)}
                      className="p-1.5 rounded bg-[#0B0B0D] border border-[#26262B] text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: CONTACT SETTINGS */}
        {activeTab === 'contact' && contactSettings && (
          <div className="space-y-6 max-w-4xl">
            <div className="flex items-center justify-between border-b border-[#26262B] pb-6">
              <div>
                <h1 className="font-display font-extrabold text-2xl uppercase text-white">
                  Contact Channels &amp; Links
                </h1>
                <p className="text-xs text-[#A5A5AA]">
                  Configure your verified social media profiles, email, and instant messaging accounts.
                </p>
              </div>

              <button
                onClick={handleSaveContactSettings}
                className="px-5 py-2.5 rounded-xl bg-[#FF6A2B] hover:bg-[#FF7F47] text-[#0B0B0D] font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Save className="w-4 h-4" />
                <span>Save Channels</span>
              </button>
            </div>

            <div className="p-6 rounded-2xl bg-[#171719] border border-[#26262B] space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono-tag uppercase tracking-wider text-[#A5A5AA] mb-1.5">
                    Direct Email
                  </label>
                  <input
                    type="email"
                    value={contactSettings.email}
                    onChange={(e) => setContactSettings({ ...contactSettings, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#0B0B0D] border border-[#26262B] text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono-tag uppercase tracking-wider text-[#A5A5AA] mb-1.5">
                    WhatsApp Chat Link
                  </label>
                  <input
                    type="text"
                    value={contactSettings.whatsapp || ''}
                    onChange={(e) => setContactSettings({ ...contactSettings, whatsapp: e.target.value })}
                    placeholder="https://wa.me/..."
                    className="w-full px-4 py-3 rounded-xl bg-[#0B0B0D] border border-[#26262B] text-sm text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono-tag uppercase tracking-wider text-[#A5A5AA] mb-1.5">
                    Telegram Channel / User Link
                  </label>
                  <input
                    type="text"
                    value={contactSettings.telegram || ''}
                    onChange={(e) => setContactSettings({ ...contactSettings, telegram: e.target.value })}
                    placeholder="https://t.me/..."
                    className="w-full px-4 py-3 rounded-xl bg-[#0B0B0D] border border-[#26262B] text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono-tag uppercase tracking-wider text-[#A5A5AA] mb-1.5">
                    YouTube Channel Link
                  </label>
                  <input
                    type="text"
                    value={contactSettings.youtube || ''}
                    onChange={(e) => setContactSettings({ ...contactSettings, youtube: e.target.value })}
                    placeholder="https://youtube.com/@..."
                    className="w-full px-4 py-3 rounded-xl bg-[#0B0B0D] border border-[#26262B] text-sm text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono-tag uppercase tracking-wider text-[#A5A5AA] mb-1.5">
                    Instagram Profile Link
                  </label>
                  <input
                    type="text"
                    value={contactSettings.instagram || ''}
                    onChange={(e) => setContactSettings({ ...contactSettings, instagram: e.target.value })}
                    placeholder="https://instagram.com/..."
                    className="w-full px-4 py-3 rounded-xl bg-[#0B0B0D] border border-[#26262B] text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono-tag uppercase tracking-wider text-[#A5A5AA] mb-1.5">
                    TikTok Profile Link
                  </label>
                  <input
                    type="text"
                    value={contactSettings.tiktok || ''}
                    onChange={(e) => setContactSettings({ ...contactSettings, tiktok: e.target.value })}
                    placeholder="https://tiktok.com/@..."
                    className="w-full px-4 py-3 rounded-xl bg-[#0B0B0D] border border-[#26262B] text-sm text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono-tag uppercase tracking-wider text-[#A5A5AA] mb-1.5">
                  Availability Note / Booking Notice
                </label>
                <input
                  type="text"
                  value={contactSettings.availabilityNote}
                  onChange={(e) => setContactSettings({ ...contactSettings, availabilityNote: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#0B0B0D] border border-[#26262B] text-sm text-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: INQUIRIES */}
        {activeTab === 'inquiries' && (
          <div className="space-y-6 max-w-6xl">
            <div className="border-b border-[#26262B] pb-6">
              <h1 className="font-display font-extrabold text-2xl uppercase text-white">
                Client Project Inquiries ({inquiries.length})
              </h1>
              <p className="text-xs text-[#A5A5AA]">
                Live database submissions from potential clients, brand directors, and content creators.
              </p>
            </div>

            {inquiries.length === 0 ? (
              <div className="p-12 text-center bg-[#171719] border border-[#26262B] rounded-2xl text-[#A5A5AA] text-xs">
                No inquiries submitted yet.
              </div>
            ) : (
              <div className="space-y-4">
                {inquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className="p-6 rounded-2xl bg-[#171719] border border-[#26262B] space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#26262B] pb-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="font-display font-bold text-lg text-white">{inq.fullName}</h3>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono-tag uppercase ${
                              inq.status === 'new'
                                ? 'bg-[#FF6A2B] text-black font-bold'
                                : inq.status === 'reviewed'
                                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                : 'bg-[#26262B] text-[#A5A5AA]'
                            }`}
                          >
                            {inq.status}
                          </span>
                        </div>
                        <div className="text-xs text-[#A5A5AA] mt-1">
                          Email: <a href={`mailto:${inq.email}`} className="text-[#FF6A2B] underline">{inq.email}</a>
                          {inq.company && ` • Company: ${inq.company}`}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={inq.status}
                          onChange={(e) => handleUpdateInquiryStatus(inq.id, e.target.value as any)}
                          className="px-3 py-1.5 rounded-lg bg-[#0B0B0D] border border-[#26262B] text-xs text-white"
                        >
                          <option value="new">Mark as New</option>
                          <option value="reviewed">Mark as Reviewed</option>
                          <option value="archived">Archive</option>
                        </select>
                        <button
                          onClick={() => handleDeleteInquiry(inq.id)}
                          className="p-1.5 rounded bg-[#0B0B0D] border border-[#26262B] text-red-400 hover:bg-red-500/10"
                          title="Delete inquiry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono-tag text-[#A5A5AA]">
                      <div>
                        <span className="block text-[10px] text-[#A5A5AA]/70 uppercase">Service</span>
                        <span className="text-white">{inq.requestedService}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-[#A5A5AA]/70 uppercase">Budget</span>
                        <span className="text-white">{inq.budget || 'Not specified'}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-[#A5A5AA]/70 uppercase">Deadline</span>
                        <span className="text-white">{inq.deadline || 'Flexible'}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-[#A5A5AA]/70 uppercase">Received</span>
                        <span className="text-white">{new Date(inq.createdAt).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-[#0B0B0D] border border-[#26262B] text-xs text-[#F5F5F5] leading-relaxed whitespace-pre-line">
                      {inq.description}
                    </div>

                    {inq.referenceLink && (
                      <div className="text-xs text-[#A5A5AA]">
                        Footage / Reference Link:{' '}
                        <a
                          href={inq.referenceLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#FF6A2B] underline"
                        >
                          {inq.referenceLink}
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 9: WEBSITE SETTINGS & PASSWORD */}
        {activeTab === 'settings' && settings && (
          <div className="space-y-8 max-w-4xl">
            <div className="flex items-center justify-between border-b border-[#26262B] pb-6">
              <div>
                <h1 className="font-display font-extrabold text-2xl uppercase text-white">
                  Website Settings &amp; Security
                </h1>
                <p className="text-xs text-[#A5A5AA]">
                  Configure branding, SEO tags, and rotate administrative security keys.
                </p>
              </div>

              <button
                onClick={handleSaveSettings}
                className="px-5 py-2.5 rounded-xl bg-[#FF6A2B] hover:bg-[#FF7F47] text-[#0B0B0D] font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Save className="w-4 h-4" />
                <span>Save Settings</span>
              </button>
            </div>

            {/* General Site Config */}
            <div className="p-6 rounded-2xl bg-[#171719] border border-[#26262B] space-y-4">
              <h3 className="font-display font-bold text-lg text-white">Brand &amp; SEO Metadata</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono-tag uppercase tracking-wider text-[#A5A5AA] mb-1.5">
                    Brand Name
                  </label>
                  <input
                    type="text"
                    value={settings.brandName}
                    onChange={(e) => setSettings({ ...settings, brandName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#0B0B0D] border border-[#26262B] text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono-tag uppercase tracking-wider text-[#A5A5AA] mb-1.5">
                    Logo / Wordmark Text
                  </label>
                  <input
                    type="text"
                    value={settings.brandLogoText}
                    onChange={(e) => setSettings({ ...settings, brandLogoText: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#0B0B0D] border border-[#26262B] text-sm text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono-tag uppercase tracking-wider text-[#A5A5AA] mb-1.5">
                  SEO Title
                </label>
                <input
                  type="text"
                  value={settings.seoTitle}
                  onChange={(e) => setSettings({ ...settings, seoTitle: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#0B0B0D] border border-[#26262B] text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono-tag uppercase tracking-wider text-[#A5A5AA] mb-1.5">
                  SEO Description
                </label>
                <textarea
                  rows={2}
                  value={settings.seoDescription}
                  onChange={(e) => setSettings({ ...settings, seoDescription: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#0B0B0D] border border-[#26262B] text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono-tag uppercase tracking-wider text-[#A5A5AA] mb-1.5">
                  Footer Copyright Text
                </label>
                <input
                  type="text"
                  value={settings.footerCopyright}
                  onChange={(e) => setSettings({ ...settings, footerCopyright: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#0B0B0D] border border-[#26262B] text-sm text-white"
                />
              </div>
            </div>

            {/* Change Admin Password */}
            <div className="p-6 rounded-2xl bg-[#171719] border border-[#26262B] space-y-4">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-[#FF6A2B]" />
                <h3 className="font-display font-bold text-lg text-white">Change Administrator Password</h3>
              </div>
              <p className="text-xs text-[#A5A5AA]">
                Rotate the administrative master password. Passwords are securely hashed with PBKDF2 (SHA-512) and 100,000 rounds.
              </p>

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono-tag uppercase tracking-wider text-[#A5A5AA] mb-1.5">
                    Current Master Password
                  </label>
                  <input
                    type="password"
                    required
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#0B0B0D] border border-[#26262B] text-sm text-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono-tag uppercase tracking-wider text-[#A5A5AA] mb-1.5">
                      New Password (Min 8 Chars)
                    </label>
                    <input
                      type="password"
                      required
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#0B0B0D] border border-[#26262B] text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono-tag uppercase tracking-wider text-[#A5A5AA] mb-1.5">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      required
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#0B0B0D] border border-[#26262B] text-sm text-white"
                    />
                  </div>
                </div>

                {passwordMsg && (
                  <div
                    className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
                      passwordMsg.isError
                        ? 'bg-red-500/10 border border-red-500/30 text-red-400'
                        : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                    }`}
                  >
                    <span>{passwordMsg.text}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-[#0B0B0D] hover:bg-[#FF6A2B] hover:text-[#0B0B0D] border border-[#26262B] hover:border-[#FF6A2B] text-xs font-mono-tag uppercase tracking-wider text-white transition-colors cursor-pointer"
                >
                  Update Admin Password
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* PROJECT CREATE / EDIT MODAL */}
      {isProjectModalOpen && editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B0B0D]/90 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[#171719] border border-[#26262B] rounded-2xl p-6 sm:p-8 space-y-6 my-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#26262B] pb-4">
              <h2 className="font-display font-extrabold text-xl text-white">
                {editingProject.id ? 'Edit Project Cut' : 'Add New Portfolio Project'}
              </h2>
              <button
                onClick={() => setIsProjectModalOpen(false)}
                className="p-1 rounded bg-[#0B0B0D] text-[#A5A5AA] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-mono-tag uppercase text-[#A5A5AA] mb-1">Project Title *</label>
                <input
                  type="text"
                  required
                  value={editingProject.title || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                  placeholder="e.g. Apex Drift Commercial"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0B0B0D] border border-[#26262B] text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono-tag uppercase text-[#A5A5AA] mb-1">Category *</label>
                  <select
                    value={editingProject.category || 'Cinematic Edits'}
                    onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value as any })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0B0B0D] border border-[#26262B] text-white"
                  >
                    {ALL_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-mono-tag uppercase text-[#A5A5AA] mb-1">Video Source Type *</label>
                  <select
                    value={editingProject.videoSourceType || 'mp4'}
                    onChange={(e) => setEditingProject({ ...editingProject, videoSourceType: e.target.value as any })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0B0B0D] border border-[#26262B] text-white"
                  >
                    <option value="mp4">Direct MP4/WebM File (or /uploads/...)</option>
                    <option value="youtube">YouTube (URL or ID)</option>
                    <option value="vimeo">Vimeo (URL or ID)</option>
                    <option value="gdrive">Google Drive Link</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-mono-tag uppercase text-[#A5A5AA] mb-1">
                  Video URL / File Source *
                </label>
                <input
                  type="text"
                  required
                  value={editingProject.videoUrl || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, videoUrl: e.target.value })}
                  placeholder="e.g. /uploads/video_123.mp4 or https://youtube.com/watch?v=..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0B0B0D] border border-[#26262B] text-white"
                />
              </div>

              <div>
                <label className="block font-mono-tag uppercase text-[#A5A5AA] mb-1">Thumbnail Image URL</label>
                <input
                  type="text"
                  value={editingProject.thumbnailUrl || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, thumbnailUrl: e.target.value })}
                  placeholder="e.g. /uploads/thumb_123.jpg or https://images.unsplash.com/..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0B0B0D] border border-[#26262B] text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono-tag uppercase text-[#A5A5AA] mb-1">Client Name (Optional)</label>
                  <input
                    type="text"
                    value={editingProject.clientName || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, clientName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0B0B0D] border border-[#26262B] text-white"
                  />
                </div>
                <div>
                  <label className="block font-mono-tag uppercase text-[#A5A5AA] mb-1">Completion Date</label>
                  <input
                    type="text"
                    value={editingProject.projectDate || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, projectDate: e.target.value })}
                    placeholder="2026-03"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0B0B0D] border border-[#26262B] text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono-tag uppercase text-[#A5A5AA] mb-1">Aspect Ratio</label>
                  <select
                    value={editingProject.aspectRatio || '16:9'}
                    onChange={(e) => setEditingProject({ ...editingProject, aspectRatio: e.target.value as any })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0B0B0D] border border-[#26262B] text-white"
                  >
                    <option value="16:9">16:9 (Standard Widescreen)</option>
                    <option value="9:16">9:16 (Vertical Reels / TikTok)</option>
                    <option value="2.39:1">2.39:1 (Anamorphic Cinema)</option>
                    <option value="1:1">1:1 (Square)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono-tag uppercase text-[#A5A5AA] mb-1">Duration</label>
                  <input
                    type="text"
                    value={editingProject.duration || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, duration: e.target.value })}
                    placeholder="e.g. 01:45"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0B0B0D] border border-[#26262B] text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono-tag uppercase text-[#A5A5AA] mb-1">
                  Editing Software (Comma separated)
                </label>
                <input
                  type="text"
                  value={(editingProject.editingSoftware || []).join(', ')}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      editingSoftware: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                    })
                  }
                  placeholder="Premiere Pro, DaVinci Resolve, After Effects"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0B0B0D] border border-[#26262B] text-white"
                />
              </div>

              <div>
                <label className="block font-mono-tag uppercase text-[#A5A5AA] mb-1">Project Description</label>
                <textarea
                  rows={3}
                  value={editingProject.description || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0B0B0D] border border-[#26262B] text-white"
                />
              </div>

              {/* Color Grading Comparison Before/After URLs */}
              <div className="grid grid-cols-2 gap-4 p-3 rounded-xl bg-[#0B0B0D] border border-[#26262B]">
                <div>
                  <label className="block font-mono-tag uppercase text-[#A5A5AA] mb-1">
                    Color Grade Before Image (LOG)
                  </label>
                  <input
                    type="text"
                    value={editingProject.colorGradingBeforeUrl || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, colorGradingBeforeUrl: e.target.value })}
                    placeholder="URL of flat/raw still"
                    className="w-full px-3 py-1.5 rounded bg-[#171719] border border-[#26262B] text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block font-mono-tag uppercase text-[#A5A5AA] mb-1">
                    Color Grade After Image (Final)
                  </label>
                  <input
                    type="text"
                    value={editingProject.colorGradingAfterUrl || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, colorGradingAfterUrl: e.target.value })}
                    placeholder="URL of graded still"
                    className="w-full px-3 py-1.5 rounded bg-[#171719] border border-[#26262B] text-white text-xs"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProject.isPublished !== false}
                    onChange={(e) => setEditingProject({ ...editingProject, isPublished: e.target.checked })}
                    className="accent-[#FF6A2B]"
                  />
                  <span>Published on Public Site</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(editingProject.isFeatured)}
                    onChange={(e) => setEditingProject({ ...editingProject, isFeatured: e.target.checked })}
                    className="accent-[#FF6A2B]"
                  />
                  <span>Featured Project</span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#26262B]">
              <button
                onClick={() => setIsProjectModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-[#0B0B0D] border border-[#26262B] text-xs font-mono-tag uppercase text-[#A5A5AA] hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProject}
                className="px-6 py-2.5 rounded-xl bg-[#FF6A2B] hover:bg-[#FF7F47] text-[#0B0B0D] font-display font-bold text-xs uppercase tracking-wider"
              >
                Save Project
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SERVICE CREATE / EDIT MODAL */}
      {isServiceModalOpen && editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B0B0D]/90 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-lg bg-[#171719] border border-[#26262B] rounded-2xl p-6 sm:p-8 space-y-4 my-8 shadow-2xl text-xs">
            <div className="flex items-center justify-between border-b border-[#26262B] pb-4">
              <h2 className="font-display font-extrabold text-xl text-white">
                {editingService.id ? 'Edit Service Card' : 'Create Service Card'}
              </h2>
              <button onClick={() => setIsServiceModalOpen(false)} className="p-1 text-[#A5A5AA] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block font-mono-tag uppercase text-[#A5A5AA] mb-1">Service Title *</label>
              <input
                type="text"
                value={editingService.title || ''}
                onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#0B0B0D] border border-[#26262B] text-white"
              />
            </div>

            <div>
              <label className="block font-mono-tag uppercase text-[#A5A5AA] mb-1">Category</label>
              <input
                type="text"
                value={editingService.category || ''}
                onChange={(e) => setEditingService({ ...editingService, category: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#0B0B0D] border border-[#26262B] text-white"
              />
            </div>

            <div>
              <label className="block font-mono-tag uppercase text-[#A5A5AA] mb-1">Short Description</label>
              <textarea
                rows={2}
                value={editingService.shortDescription || ''}
                onChange={(e) => setEditingService({ ...editingService, shortDescription: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#0B0B0D] border border-[#26262B] text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-mono-tag uppercase text-[#A5A5AA] mb-1">Turnaround Time</label>
                <input
                  type="text"
                  value={editingService.turnaroundTime || ''}
                  onChange={(e) => setEditingService({ ...editingService, turnaroundTime: e.target.value })}
                  placeholder="24-48 Hours"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0B0B0D] border border-[#26262B] text-white"
                />
              </div>

              <div>
                <label className="block font-mono-tag uppercase text-[#A5A5AA] mb-1">Starting Rate</label>
                <input
                  type="text"
                  value={editingService.startingPrice || ''}
                  onChange={(e) => setEditingService({ ...editingService, startingPrice: e.target.value })}
                  placeholder="$250 / Video"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0B0B0D] border border-[#26262B] text-white"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="showPricingToggle"
                checked={Boolean(editingService.showPricing)}
                onChange={(e) => setEditingService({ ...editingService, showPricing: e.target.checked })}
                className="accent-[#FF6A2B]"
              />
              <label htmlFor="showPricingToggle" className="cursor-pointer">
                Display Pricing on Card (Uncheck to show "Custom Quote")
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#26262B]">
              <button
                onClick={() => setIsServiceModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-[#0B0B0D] border border-[#26262B] text-[#A5A5AA]"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveService}
                className="px-6 py-2 rounded-xl bg-[#FF6A2B] text-[#0B0B0D] font-display font-bold uppercase"
              >
                Save Service
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
