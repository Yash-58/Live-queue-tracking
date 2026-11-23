import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { PatientDashboard } from './pages/patient/PatientDashboard';
import { DoctorDashboard } from './pages/doctor/DoctorDashboard';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { SuperAdminDashboard } from './pages/superadmin/SuperAdminDashboard';
import { SuperAdminLoginPage } from './pages/auth/SuperAdminLoginPage';
import { AdminAuthPage } from './pages/auth/AdminAuthPage';
import { DoctorLoginPage } from './pages/auth/DoctorLoginPage';
import { PatientAuthPage } from './pages/auth/PatientAuthPage';
import { ToastContainer } from './components/common/Toast';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6 text-center">
          <div className="max-w-md bg-slate-800 border border-slate-700 p-8 rounded-3xl shadow-2xl space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/20 text-rose-400 mx-auto flex items-center justify-center text-2xl font-bold">
              ⚠️
            </div>
            <h2 className="text-xl font-bold text-white">Something went wrong</h2>
            <p className="text-xs text-slate-400">
              {this.state.error?.message || 'An unexpected rendering error occurred.'}
            </p>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.href = '/';
              }}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md transition-all"
            >
              Reset Data & Reload Home
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export const App = () => {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          
          {/* Dedicated Auth Routes */}
          <Route path="/super-admin/login" element={<SuperAdminLoginPage />} />
          <Route path="/admin/login" element={<AdminAuthPage isRegister={false} />} />
          <Route path="/admin/register" element={<AdminAuthPage isRegister={true} />} />
          <Route path="/doctor/login" element={<DoctorLoginPage />} />
          <Route path="/patient/login" element={<PatientAuthPage isRegister={false} />} />
          <Route path="/patient/register" element={<PatientAuthPage isRegister={true} />} />

          {/* Dashboards */}
          <Route path="/patient" element={<PatientDashboard />} />
          <Route path="/doctor" element={<DoctorDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/super-admin" element={<SuperAdminDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <ToastContainer />
      </div>
    </ErrorBoundary>
  );
};
