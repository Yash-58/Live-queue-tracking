import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Shield,
  Building2,
  Lock,
  Mail,
  User,
  Phone,
  FileCheck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  XCircle,
  ArrowRight,
  ChevronLeft,
  Sparkles,
  MapPin,
  Bed,
  BadgeAlert
} from 'lucide-react';

export const AdminAuthPage = ({ isRegister: initialIsRegister = false }) => {
  const navigate = useNavigate();
  const { loginWithCredentials, registerHospitalAdminFromPortal, hospitals } = useApp();

  const [isRegister, setIsRegister] = useState(initialIsRegister);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [authError, setAuthError] = useState({ message: '', status: '' });
  const [isLoading, setIsLoading] = useState(false);

  // Registration form state
  const [regForm, setRegForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    licenseNumber: '',
    hospitalName: '',
    hospitalCode: '',
    city: 'New Delhi',
    beds: 200,
    address: ''
  });

  const [registrationSubmitted, setRegistrationSubmitted] = useState(null);

  // Demo helper buttons
  const handleFillDemo = (type) => {
    setAuthError({ message: '', status: '' });
    if (type === 'verified') {
      setLoginEmail('admin@citycare.com');
      setLoginPassword('Admin@123');
    } else if (type === 'pending') {
      setLoginEmail('vikram.admin@metrolife.com');
      setLoginPassword('Admin@123');
    } else if (type === 'rejected') {
      setLoginEmail('suresh@apexcare.com');
      setLoginPassword('Admin@123');
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setAuthError({ message: '', status: '' });
    setIsLoading(true);

    setTimeout(() => {
      const res = loginWithCredentials('admin', loginEmail, loginPassword);
      setIsLoading(false);

      if (res.success) {
        navigate('/admin');
      } else {
        setAuthError({ message: res.message, status: res.status || 'error' });
      }
    }, 400);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setAuthError({ message: '', status: '' });
    setIsLoading(true);

    setTimeout(() => {
      const res = registerHospitalAdminFromPortal(regForm);
      setIsLoading(false);

      if (res.success) {
        setRegistrationSubmitted(res.admin);
      } else {
        setAuthError({ message: res.message, status: 'error' });
      }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col justify-between selection:bg-purple-500 selection:text-white relative overflow-hidden">
      {/* Background ambient accents */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[350px] bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[400px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="border-b border-slate-800 bg-[#0d1424]/80 backdrop-blur-md px-6 py-4 relative z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-900/30">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-xl text-white tracking-tight flex items-center">
                Medi<span className="text-purple-400">Queue</span>
              </span>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                Hospital Administration Portal
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
        <div className="w-full max-w-xl">
          <div className="bg-[#0e172a] border border-purple-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-purple-950/30 backdrop-blur-xl">

            {/* Registration Submitted Confirmation Screen */}
            {registrationSubmitted ? (
              <div className="text-center space-y-4 py-4">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center animate-bounce">
                  <Clock className="w-8 h-8" />
                </div>

                <div className="space-y-1">
                  <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-amber-500 text-slate-950">
                    Status: Pending Verification
                  </span>
                  <h2 className="text-2xl font-black text-white pt-2">
                    Application Sent to Super Admin
                  </h2>
                  <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                    Thank you, <strong>{registrationSubmitted.name}</strong>. Your hospital administration registration for <strong>{registrationSubmitted.hospitalName}</strong> has been received with status <span className="text-amber-400 font-bold">Pending</span>.
                  </p>
                </div>

                {/* Info Card */}
                <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-700/80 text-left text-xs space-y-2 max-w-md mx-auto">
                  <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-800">
                    <span>License / ID</span>
                    <span className="font-mono text-purple-400 font-bold">{registrationSubmitted.licenseNumber}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-800">
                    <span>Assigned Hospital</span>
                    <span className="text-white font-medium">{registrationSubmitted.hospitalName}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Verification Gate</span>
                    <span className="text-amber-400 font-bold">Awaiting Super Admin</span>
                  </div>
                </div>

                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-[11px] text-amber-300 max-w-md mx-auto">
                  🔒 <strong>Strict Rule:</strong> You cannot log in to your hospital dashboard until the Super Admin approves your verification application from the Central Authority desk.
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      setRegistrationSubmitted(null);
                      setIsRegister(false);
                      setLoginEmail(registrationSubmitted.email);
                    }}
                    className="w-full sm:w-auto px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl transition-all shadow-md"
                  >
                    Go to Admin Login
                  </button>
                  <Link
                    to="/super-admin/login"
                    className="w-full sm:w-auto px-6 py-2.5 bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/40 text-amber-300 text-xs font-bold rounded-xl transition-all"
                  >
                    Log in as Super Admin to Approve →
                  </Link>
                </div>
              </div>
            ) : (
              <>
                {/* Header Switcher Tabs */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-5 mb-6">
                  <div>
                    <h1 className="text-xl sm:text-2xl font-black text-white">
                      Hospital Administrator
                    </h1>
                    <p className="text-xs text-slate-400">
                      {isRegister
                        ? 'Register as Hospital Admin (Strict 1-to-1 Mapping)'
                        : 'Sign in to manage OPD queues & hospital departments'}
                    </p>
                  </div>

                  <div className="flex p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => { setIsRegister(false); setAuthError({ message: '', status: '' }); }}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        !isRegister ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Login
                    </button>
                    <button
                      type="button"
                      onClick={() => { setIsRegister(true); setAuthError({ message: '', status: '' }); }}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        isRegister ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Register
                    </button>
                  </div>
                </div>

                {/* Error Banner (Handles Pending & Rejected alert requirements) */}
                {authError.message && (
                  <div className={`mb-6 p-4 rounded-2xl border text-xs space-y-1 ${
                    authError.status === 'Pending'
                      ? 'bg-amber-500/15 border-amber-500/40 text-amber-200'
                      : authError.status === 'Rejected'
                      ? 'bg-rose-500/15 border-rose-500/40 text-rose-200'
                      : 'bg-rose-500/15 border-rose-500/40 text-rose-200'
                  }`}>
                    <div className="flex items-center gap-2 font-black">
                      {authError.status === 'Pending' ? (
                        <>
                          <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
                          <span className="uppercase tracking-wider">Account Awaiting Super Admin Approval</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-4 h-4 text-rose-400" />
                          <span className="uppercase tracking-wider">Access Blocked</span>
                        </>
                      )}
                    </div>
                    <p className="text-xs leading-relaxed">{authError.message}</p>

                    {authError.status === 'Pending' && (
                      <div className="pt-2">
                        <Link
                          to="/super-admin/login"
                          className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-400 hover:underline"
                        >
                          <span>Open Super Admin Portal to Approve This Admin →</span>
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                {/* 1. SIGN IN FORM */}
                {!isRegister ? (
                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Administrator Email
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3.5 top-3 text-purple-400" />
                        <input
                          type="email"
                          required
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          placeholder="admin@hospital.org"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-medium placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                        <span>Password</span>
                        <span className="text-[10px] text-slate-500 normal-case">Default: Admin@123</span>
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 absolute left-3.5 top-3 text-purple-400" />
                        <input
                          type="password"
                          required
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-medium placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-mono"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-purple-900/30 flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
                    >
                      {isLoading ? <span>Verifying Access Rights...</span> : (
                        <>
                          <Shield className="w-4 h-4" />
                          <span>Login to Hospital Admin Dashboard</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    {/* Interactive Demo Test Buttons */}
                    <div className="mt-6 pt-5 border-t border-slate-800 space-y-2">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center mb-2">
                        🧪 Interactive Verification Demonstration:
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => handleFillDemo('verified')}
                          className="p-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold text-left transition-all"
                        >
                          <span className="block font-black text-xs text-white">✅ Verified Admin</span>
                          <span className="text-[10px] text-emerald-300">Dr. Rajesh Gupta (Will login)</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleFillDemo('pending')}
                          className="p-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-[11px] font-bold text-left transition-all"
                        >
                          <span className="block font-black text-xs text-white">⏳ Pending Admin</span>
                          <span className="text-[10px] text-amber-300">Dr. Vikram (Will block login)</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleFillDemo('rejected')}
                          className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-[11px] font-bold text-left transition-all"
                        >
                          <span className="block font-black text-xs text-white">❌ Rejected Admin</span>
                          <span className="text-[10px] text-rose-300">Suresh (Will block login)</span>
                        </button>
                      </div>
                    </div>
                  </form>
                ) : (
                  /* 2. REGISTRATION FORM (Auto-assigns status: Pending) */
                  <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                    <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-2xl text-[11px] text-purple-300 flex items-start gap-2">
                      <Clock className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                      <span>
                        <strong>Verification Policy:</strong> When you register, your profile is assigned status <strong>Pending</strong>. You must be approved by the Super Admin before gaining login access.
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                          Administrator Full Name
                        </label>
                        <div className="relative">
                          <User className="w-4 h-4 absolute left-3 top-2.5 text-purple-400" />
                          <input
                            type="text"
                            required
                            value={regForm.name}
                            onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                            placeholder="e.g. Dr. Kavita Sharma"
                            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-medium focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                          Official Email Address
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 absolute left-3 top-2.5 text-purple-400" />
                          <input
                            type="email"
                            required
                            value={regForm.email}
                            onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                            placeholder="admin@newhospital.org"
                            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-medium focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                          Password
                        </label>
                        <div className="relative">
                          <Lock className="w-4 h-4 absolute left-3 top-2.5 text-purple-400" />
                          <input
                            type="password"
                            required
                            value={regForm.password}
                            onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                            placeholder="Create password"
                            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-medium focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                          Phone Number
                        </label>
                        <div className="relative">
                          <Phone className="w-4 h-4 absolute left-3 top-2.5 text-purple-400" />
                          <input
                            type="text"
                            required
                            value={regForm.phone}
                            onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                            placeholder="+91 98000 11223"
                            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-medium focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                          Hospital Name
                        </label>
                        <div className="relative">
                          <Building2 className="w-4 h-4 absolute left-3 top-2.5 text-purple-400" />
                          <input
                            type="text"
                            required
                            value={regForm.hospitalName}
                            onChange={(e) => setRegForm({ ...regForm, hospitalName: e.target.value })}
                            placeholder="e.g. Max Life Hospital"
                            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-medium focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                          Hospital Code (Unique)
                        </label>
                        <input
                          type="text"
                          required
                          value={regForm.hospitalCode}
                          onChange={(e) => setRegForm({ ...regForm, hospitalCode: e.target.value })}
                          placeholder="e.g. MLH-09"
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-medium uppercase focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          required
                          value={regForm.city}
                          onChange={(e) => setRegForm({ ...regForm, city: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-medium focus:ring-2 focus:ring-purple-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                          Bed Capacity
                        </label>
                        <input
                          type="number"
                          min="10"
                          value={regForm.beds}
                          onChange={(e) => setRegForm({ ...regForm, beds: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-medium focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                        Medical License / Admin Registration ID
                      </label>
                      <input
                        type="text"
                        value={regForm.licenseNumber}
                        onChange={(e) => setRegForm({ ...regForm, licenseNumber: e.target.value })}
                        placeholder="e.g. HA-DEL-2026-8812"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-medium focus:ring-2 focus:ring-purple-500 font-mono"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-purple-900/30 flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
                    >
                      {isLoading ? <span>Validating 1-to-1 Mapping & Submitting...</span> : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Submit Hospital Registration for Super Admin Approval</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </>
            )}

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 py-4 px-6 text-center text-[11px] text-slate-500">
        MediQueue Hospital Management Network • Strict 1-to-1 Hospital Governance Enabled
      </footer>
    </div>
  );
};
