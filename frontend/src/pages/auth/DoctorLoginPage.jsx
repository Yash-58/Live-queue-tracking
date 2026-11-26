import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Stethoscope,
  Lock,
  Mail,
  ArrowRight,
  AlertTriangle,
  ChevronLeft,
  Sparkles,
  Building2,
  CheckCircle2,
  Info
} from 'lucide-react';

export const DoctorLoginPage = () => {
  const navigate = useNavigate();
  const { loginWithCredentials, doctors } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleQuickFill = (doc) => {
    setEmail(doc.email);
    setPassword(doc.password || 'Doctor@123');
    setErrorMsg('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      const res = loginWithCredentials('doctor', email, password);
      setIsLoading(false);

      if (res.success) {
        navigate('/doctor');
      } else {
        setErrorMsg(res.message);
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#060c18] text-slate-100 flex flex-col justify-between selection:bg-blue-500 selection:text-white relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/3 w-[600px] h-[350px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="border-b border-slate-800 bg-[#0a1222]/80 backdrop-blur-md px-6 py-4 relative z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-blue-900/30">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-xl text-white tracking-tight flex items-center">
                Medi<span className="text-blue-400">Queue</span>
              </span>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                Doctor Consultation Portal
              </p>
            </div>
          </Link>

          <Link
            to="/"
            className="text-xs font-semibold text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 relative z-10 my-8">
        <div className="w-full max-w-md">
          <div className="bg-[#0c162c] border border-blue-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-blue-950/40 backdrop-blur-xl">

            <div className="text-center space-y-2 mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 text-[11px] font-black uppercase tracking-wider">
                <Stethoscope className="w-3.5 h-3.5 text-blue-400" />
                <span>Doctor Desk Access</span>
              </div>

              <h1 className="text-2xl font-black text-white tracking-tight">
                Doctor Portal Sign In
              </h1>
              <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                Log in to manage your OPD queue, call digital tokens, and complete patient consultations.
              </p>
            </div>

            {/* Note that doctors are registered by Admin */}
            <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-2xl text-[11px] text-blue-300 mb-5 flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <span>
                <strong>Notice for Doctors:</strong> Doctor accounts are created directly by your Hospital Admin. Use the email and password provided by your hospital desk.
              </span>
            </div>

            {/* Error Callout */}
            {errorMsg && (
              <div className="mb-5 p-3.5 bg-rose-500/15 border border-rose-500/30 rounded-2xl flex items-start gap-2.5 text-xs text-rose-300">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Doctor Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Doctor Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3 text-blue-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="doctor@hospital.org"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-medium placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>Assigned Password</span>
                  <span className="text-[10px] text-slate-500 normal-case">Default: Doctor@123</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3 text-blue-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-medium placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-blue-900/30 flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Signing in...</span>
                ) : (
                  <>
                    <Stethoscope className="w-4 h-4" />
                    <span>Enter Doctor Consultation Desk</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Fill Buttons across Different Hospitals */}
            <div className="mt-6 pt-5 border-t border-slate-800 space-y-2">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center mb-2">
                Quick Demo Accounts by Hospital (Click to auto-fill):
              </p>
              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {doctors.map((doc) => (
                  <button
                    key={doc.id}
                    type="button"
                    onClick={() => handleQuickFill(doc)}
                    className="w-full p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 hover:border-blue-500/50 flex items-center justify-between text-left transition-all text-xs group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img src={doc.avatar} alt={doc.name} className="w-8 h-8 rounded-full object-cover ring-1 ring-blue-500/30 flex-shrink-0" />
                      <div className="min-w-0">
                        <span className="font-bold text-white block text-xs truncate group-hover:text-blue-300 transition-colors">
                          {doc.name}
                        </span>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 truncate">
                          <span>{doc.department}</span>
                          <span>•</span>
                          <span className="font-semibold text-blue-400 truncate flex items-center gap-0.5">
                            <Building2 className="w-2.5 h-2.5 flex-shrink-0" />
                            <span>{doc.hospital}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-blue-400 flex-shrink-0 pl-2">Auto Fill →</span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 py-4 px-6 text-center text-[11px] text-slate-500">
        MediQueue Doctor Consultation Desk • Smart Hospital Queue Infrastructure
      </footer>
    </div>
  );
};
