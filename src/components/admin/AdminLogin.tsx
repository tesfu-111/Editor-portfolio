import React, { useState } from 'react';
import { Lock, ArrowLeft, Loader2, AlertCircle, CheckCircle2, ShieldCheck, KeyRound } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: (token: string, user: any) => void;
  onBackToSite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  onLoginSuccess,
  onBackToSite,
}) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed. Please verify credentials.');
      }

      // Store token in localStorage for persistence across page refreshes
      localStorage.setItem('auracuts_admin_token', data.token);
      onLoginSuccess(data.token, data.user);
    } catch (err: any) {
      setErrorMessage(err.message || 'Login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0D] flex items-center justify-center p-6 relative">
      <button
        onClick={onBackToSite}
        className="absolute top-8 left-8 inline-flex items-center gap-2 text-xs font-mono-tag uppercase tracking-wider text-[#A5A5AA] hover:text-[#FF6A2B] transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Portfolio</span>
      </button>

      <div className="w-full max-w-md bg-[#171719] border border-[#26262B] rounded-2xl p-8 sm:p-10 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-xl bg-[#0B0B0D] border border-[#26262B] flex items-center justify-center mx-auto text-[#FF6A2B] shadow-inner mb-3">
            <Lock className="w-7 h-7" />
          </div>
          <span className="text-xs font-mono-tag uppercase tracking-widest text-[#FF6A2B]">
            Privileged Access
          </span>
          <h1 className="font-display font-extrabold text-2xl uppercase text-white">
            Editor Studio Portal
          </h1>
          <p className="text-xs text-[#A5A5AA]">
            Sign in to manage projects, upload high-res video reels, update homepage modes, and inspect client briefs.
          </p>
        </div>

        {/* Initial Credentials Hint Box */}
        <div className="p-3.5 rounded-xl bg-[#0B0B0D] border border-[#26262B] text-xs space-y-1">
          <div className="flex items-center gap-1.5 text-[#FF6A2B] font-mono-tag text-[11px] uppercase tracking-wider font-semibold">
            <KeyRound className="w-3.5 h-3.5" /> Initial Admin Credentials
          </div>
          <p className="text-[11px] text-[#A5A5AA]">
            Username: <span className="text-white font-mono">admin</span> &bull; Default Password: <span className="text-white font-mono">admin-auracuts-2026!</span>
          </p>
          <p className="text-[10px] text-[#A5A5AA]/70">
            You can change this password at any time in Website Settings.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-mono-tag uppercase tracking-wider text-[#A5A5AA] mb-1.5">
              Admin Username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#0B0B0D] border border-[#26262B] focus:border-[#FF6A2B] focus:outline-none text-sm text-white transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-mono-tag uppercase tracking-wider text-[#A5A5AA] mb-1.5">
              Secure Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#0B0B0D] border border-[#26262B] focus:border-[#FF6A2B] focus:outline-none text-sm text-white transition-colors"
            />
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl bg-[#FF6A2B] hover:bg-[#FF7F47] disabled:opacity-50 text-[#0B0B0D] font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#FF6A2B]/20"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying Cryptographic Session...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Authorize &amp; Enter Dashboard</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
