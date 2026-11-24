import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Crown,
  Shield,
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  KeyRound,
  AlertTriangle,
  Building2,
  ExternalLink,
  ChevronLeft
} from 'lucide-react';

export const SuperAdminLoginPage = () => {
  const navigate = useNavigate();
  const { loginWithCredentials } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [securityCode, setSecurityCode] = useState('NHA-7741');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleQuickDemoFill = () => {
    setEmail('superadmin@mediqueue.gov.in');
    setPassword('SuperAdmin@123');
    setErrorMsg('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      const res = loginWithCredentials('super_admin', email, password);
      setIsLoading(false);

      if (res.success) {
        navigate('/super-admin');
      } else {
        setErrorMsg(res.message);
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#060a12] text-slate-100 flex flex-col justify-between selection:bg-amber-500 selection:text-slate-950 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-amber-500/15 via-orange-600/5 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar */}
      <header className="border-b border-slate-800/80 bg-[#0a101d]/80 backdrop-blur-md px-6 py-4 relative z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-600/30">
              <Crown className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="font-extrabold text-xl text-white tracking-tight flex items-center">
                Medi<span className="text-amber-400">Queue</span>
              </span>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                National Health Registry
              </p>
            </div>
          </Link>

          <Link
            to="/"
            className="text-xs font-semibold text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Portal</span>
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 relative z-10 my-8">
        <div className="w-full max-w-md">
          {/* Central Authority Emblem Card */}
          <div className="bg-[#0b1324] border-2 border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-amber-950/40 relative overflow-hidden backdrop-blur-xl">
            {/* Top decorative glow */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600" />

            <div className="text-center space-y-2 mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px] font-black uppercase tracking-wider">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>Central Governance Access</span>
              </div>

              <h1 className="text-2xl font-black text-white tracking-tight">
                Super Admin Portal
              </h1>
              <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                National Hospital Registry, 1-to-1 Mapping Governance & Hospital Administrator Verification Desk
              </p>
            </div>

            {/* Error Message Callout */}
            {errorMsg && (
              <div className="mb-5 p-3.5 bg-rose-500/15 border border-rose-500/30 rounded-2xl flex items-start gap-2.5 text-xs text-rose-300">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Official Central Authority Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3 text-amber-400/80" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="superadmin@mediqueue.gov.in"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white text-xs font-medium placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>Master Administrative Password</span>
                  <span className="text-[10px] text-amber-400 font-mono normal-case">Strict Confidential</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3 text-amber-400/80" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white text-xs font-medium placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>Security Protocol Code</span>
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold normal-case">
                    {ShieldCheck ? <ShieldCheck className="w-3 h-3" /> : <Shield className="w-3 h-3" />} Hardware Verified
                  </span>
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3.5 top-3 text-amber-400/80" />
                  <input
                    type="text"
                    value={securityCode}
                    onChange={(e) => setSecurityCode(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-amber-400 text-xs font-mono font-bold tracking-wider focus:outline-none"
                    readOnly
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 text-xs font-black rounded-xl shadow-lg shadow-amber-600/30 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Authenticating Authority Credentials...</span>
                ) : (
                  <>
                    <Crown className="w-4 h-4 text-slate-950" />
                    <span>Authorize & Enter Super Admin Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Fill Helper */}
            <div className="mt-5 pt-4 border-t border-slate-800/80 space-y-2">
              <button
                type="button"
                onClick={handleQuickDemoFill}
                className="w-full py-2 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[11px] font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Auto-Fill Super Admin Credentials (Demo)</span>
              </button>

              <p className="text-[10px] text-center text-slate-500">
                Official Demo Account: <code>superadmin@mediqueue.gov.in</code> • <code>SuperAdmin@123</code>
              </p>
            </div>
          </div>

          {/* Bottom Security Disclaimer */}
          <div className="mt-4 p-3 bg-slate-900/50 rounded-2xl border border-slate-800/60 text-[11px] text-slate-400 text-center flex items-center justify-center gap-2">
            <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>256-Bit TLS Encryption • Authorized by Ministry of Health & Family Welfare</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 py-4 px-6 text-center text-[11px] text-slate-500">
        MediQueue Central Health Authority Management Network • Smart Hospital Queue Infrastructure
      </footer>
    </div>
  );
};
