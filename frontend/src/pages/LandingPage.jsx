import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Modal } from '../components/common/Modal';
import {
  User,
  Stethoscope,
  Shield,
  ArrowRight,
  Radio,
  Clock,
  Ticket,
  AlertTriangle,
  BellRing,
  Lock,
  Smartphone,
  HeartPulse,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  LogIn,
  Hospital,
  Activity,
  Layers,
  ExternalLink,
  Crown,
  Building2,
  UserCheck,
  ShieldCheck,
  Network,
  Database
} from 'lucide-react';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { switchRole, loginAs } = useApp();

  const [activePreviewRole, setActivePreviewRole] = useState('super_admin');
  const [authModal, setAuthModal] = useState({ isOpen: false, role: 'patient', isLogin: true });
  const [authFormData, setAuthFormData] = useState({ name: '', email: '', password: '' });

  const handleQuickLogin = (role) => {
    switchRole(role);
    if (role === 'super_admin') {
      navigate('/super-admin');
    } else {
      navigate(`/${role}`);
    }
  };

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    loginAs(authModal.role, {
      name: authFormData.name || (
        authModal.role === 'super_admin' ? 'Dr. Alok Verma' :
        authModal.role === 'patient' ? 'Rahul Verma' :
        authModal.role === 'doctor' ? 'Dr. Arjun Sharma' :
        'Chief Admin Officer'
      ),
      email: authFormData.email || `${authModal.role}@citycare.com`
    });
    setAuthModal({ isOpen: false, role: 'patient', isLogin: true });
    if (authModal.role === 'super_admin') {
      navigate('/super-admin');
    } else {
      navigate(`/${authModal.role}`);
    }
  };

  // 7 Bottom Key Features
  const bottomKeyFeatures = [
    {
      id: 1,
      title: 'Real-time Updates',
      desc: 'Live Client Sync Engine',
      icon: Radio,
      color: 'text-blue-500 bg-blue-50 border-blue-200'
    },
    {
      id: 2,
      title: 'Estimated Waiting Time',
      desc: 'Smart 8 min/patient avg',
      icon: Clock,
      color: 'text-indigo-500 bg-indigo-50 border-indigo-200'
    },
    {
      id: 3,
      title: 'Digital Token System',
      desc: 'Unique sequential tokens',
      icon: Ticket,
      color: 'text-purple-500 bg-purple-50 border-purple-200'
    },
    {
      id: 4,
      title: 'Emergency Priority',
      desc: 'High priority triage handling',
      icon: AlertTriangle,
      color: 'text-amber-500 bg-amber-50 border-amber-200'
    },
    {
      id: 5,
      title: 'Appointment Reminders',
      desc: 'Push & alert notifications',
      icon: BellRing,
      color: 'text-emerald-500 bg-emerald-50 border-emerald-200'
    },
    {
      id: 6,
      title: 'Secure & Role Based',
      desc: 'Super Admin, Admin, Doctor, Patient',
      icon: Lock,
      color: 'text-teal-500 bg-teal-50 border-teal-200'
    },
    {
      id: 7,
      title: 'Responsive Design',
      desc: 'Works on all devices',
      icon: Smartphone,
      color: 'text-pink-500 bg-pink-50 border-pink-200'
    }
  ];

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950">

      {/* Top Navbar */}
      <header className="border-b border-slate-800/80 bg-[#0d1527]/90 backdrop-blur-md sticky top-0 z-40 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg shadow-amber-600/30">
              <Crown className="w-6 h-6 animate-pulse text-slate-950" />
            </div>
            <div>
              <span className="font-extrabold text-xl text-white tracking-tight flex items-center">
                Medi<span className="text-amber-400">Queue</span>
              </span>
              <p className="text-[10px] text-slate-400 tracking-wider uppercase font-semibold">
                Multi-Hospital Queue Management
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/super-admin/login"
              className="text-xs font-bold px-3 py-1.5 rounded-xl text-amber-300 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>Super Admin Login</span>
            </Link>
            <Link
              to="/admin/login"
              className="text-xs font-semibold px-3 py-1.5 rounded-xl text-purple-300 bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 transition-colors hidden md:flex items-center gap-1"
            >
              <span>Hospital Admin</span>
            </Link>
            <Link
              to="/doctor/login"
              className="text-xs font-semibold px-3 py-1.5 rounded-xl text-blue-300 bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/30 transition-colors hidden md:flex items-center gap-1"
            >
              <span>Doctor Login</span>
            </Link>
            <Link
              to="/patient/login"
              className="text-xs font-semibold px-3 py-1.5 rounded-xl text-emerald-300 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 transition-colors hidden sm:flex items-center gap-1"
            >
              <span>Patient Login</span>
            </Link>
            <Link
              to="/patient/register"
              className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 text-xs font-black rounded-xl shadow-lg shadow-emerald-950/40 transition-all flex items-center gap-1.5"
            >
              <LogIn className="w-4 h-4" />
              <span>Register</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Hero Header Section */}
      <section className="pt-8 pb-6 px-6 max-w-7xl mx-auto w-full">
        <div className="space-y-4 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Super Admin & Multi-Hospital Governance Enabled</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Smart Hospital <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-300 to-emerald-400">
              Queue Management System
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 font-medium max-w-2xl leading-relaxed">
            Skip the long wait. Book, track & get treated smarter with centralized Super Admin hospital verification and strict 1-to-1 administrative governance.
          </p>

          <div className="pt-1 text-xs text-slate-400 flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1.5 text-amber-400">
              <Crown className="w-4 h-4" /> Central Super Admin
            </span>
            <span className="flex items-center gap-1.5 text-purple-400">
              <CheckCircle2 className="w-4 h-4" /> Strict 1-to-1 Mapping
            </span>
            <span className="flex items-center gap-1.5 text-blue-400">
              <CheckCircle2 className="w-4 h-4" /> Verification Queue
            </span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" /> Live OPD Tokens
            </span>
          </div>
        </div>

        {/* 4 Role Feature Cards (Super Admin + Patient + Doctor + Hospital Admin) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          {/* 1. Super Admin Card (Gold/Amber) */}
          <div className="bg-[#0e172a] hover:bg-[#131f3b] border-2 border-amber-500/50 rounded-3xl p-5 transition-all duration-300 shadow-xl shadow-amber-950/30 flex flex-col justify-between group relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-20 h-20 bg-amber-500/10 rounded-full blur-xl pointer-events-none"></div>
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500 text-slate-950 flex items-center gap-1">
                  <Crown className="w-3 h-3" />
                  <span>Super Admin</span>
                </span>
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>

              <h3 className="font-bold text-white text-sm mb-1">National Health Authority</h3>
              <p className="text-xs text-slate-300 font-medium leading-relaxed">
                View all hospitals, verify/approve new Hospital Admins, and enforce strict 1-to-1 relationships.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 space-y-2">
              <Link
                to="/super-admin/login"
                className="w-full py-2.5 px-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md shadow-amber-900/40"
              >
                <Crown className="w-3.5 h-3.5 text-slate-950" />
                <span>Super Admin Login</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={() => handleQuickLogin('super_admin')}
                className="w-full text-center text-[10px] font-bold text-amber-400/80 hover:text-amber-300 transition-colors py-1"
              >
                ⭐ Direct Central Portal Demo →
              </button>
            </div>
          </div>

          {/* 2. Hospital Admin Card (Purple) */}
          <div className="bg-[#0e172a] hover:bg-[#121d36] border border-purple-500/30 rounded-3xl p-5 transition-all duration-300 shadow-xl shadow-purple-950/20 flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-purple-500 text-white">
                  Hospital Admin
                </span>
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                  <Shield className="w-4 h-4" />
                </div>
              </div>

              <h3 className="font-bold text-white text-sm mb-1">Hospital OPD Management</h3>
              <p className="text-xs text-slate-300 font-medium leading-relaxed">
                Manage single hospital doctors, departments, and queue analytics. Requires Super Admin verification!
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 space-y-2">
              <Link
                to="/admin/login"
                className="w-full py-2 px-3 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md shadow-purple-900/30"
              >
                <span>Hospital Admin Login</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/admin/register"
                className="w-full py-1.5 px-3 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1"
              >
                <span>+ Register New Admin</span>
              </Link>
            </div>
          </div>

          {/* 3. Doctor Card (Blue) */}
          <div className="bg-[#0e172a] hover:bg-[#121d36] border border-blue-500/30 rounded-3xl p-5 transition-all duration-300 shadow-xl shadow-blue-950/20 flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-blue-500 text-white">
                  Doctor
                </span>
                <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                  <Stethoscope className="w-4 h-4" />
                </div>
              </div>

              <h3 className="font-bold text-white text-sm mb-1">Doctor Consultation Desk</h3>
              <p className="text-xs text-slate-300 font-medium leading-relaxed">
                Manage patient queues, start consultations, call tokens, and access patient medical records.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 space-y-2">
              <Link
                to="/doctor/login"
                className="w-full py-2.5 px-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md shadow-blue-900/30"
              >
                <span>Doctor Sign In</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <span className="block text-center text-[10px] text-slate-400">
                Created by Hospital Admin Desk
              </span>
            </div>
          </div>

          {/* 4. Patient / User Card (Green) */}
          <div className="bg-[#0e172a] hover:bg-[#121d36] border border-emerald-500/30 rounded-3xl p-5 transition-all duration-300 shadow-xl shadow-emerald-950/20 flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500 text-slate-950">
                  Patient / User
                </span>
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
              </div>

              <h3 className="font-bold text-white text-sm mb-1">Patient Waiting Lounge</h3>
              <p className="text-xs text-slate-300 font-medium leading-relaxed">
                Book appointments, get digital tokens (A-24), track live queues, and check real-time estimated wait times.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 space-y-2">
              <Link
                to="/patient/login"
                className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md shadow-emerald-900/30"
              >
                <span>Patient Sign In</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/patient/register"
                className="w-full py-1.5 px-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1"
              >
                <span>+ Register as Patient</span>
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* Interactive Showcase Preview Area */}
      <section className="py-6 px-6 max-w-7xl mx-auto w-full flex-1">
        <div className="bg-[#0d1527] rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6">

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-400" />
                <h3 className="text-xl font-bold text-white">Interactive Multi-Dashboard Showcase</h3>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Explore the complete role hierarchy. Click any portal to preview its live features.
              </p>
            </div>

            {/* Role Filter Tabs */}
            <div className="flex items-center gap-2 bg-[#070b14] p-1.5 rounded-2xl border border-slate-800 text-xs font-bold overflow-x-auto">
              <button
                onClick={() => setActivePreviewRole('super_admin')}
                className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activePreviewRole === 'super_admin'
                    ? 'bg-amber-600 text-slate-950 font-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Crown className="w-3.5 h-3.5" />
                <span>Super Admin</span>
              </button>

              <button
                onClick={() => setActivePreviewRole('admin')}
                className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activePreviewRole === 'admin'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Hospital Admin</span>
              </button>

              <button
                onClick={() => setActivePreviewRole('doctor')}
                className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activePreviewRole === 'doctor'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Stethoscope className="w-3.5 h-3.5" />
                <span>Doctor</span>
              </button>

              <button
                onClick={() => setActivePreviewRole('patient')}
                className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activePreviewRole === 'patient'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Patient</span>
              </button>
            </div>
          </div>

          {/* Feature Showcase Banner */}
          <div className="flex items-center justify-between">
            <span
              className={`px-4 py-1.5 rounded-xl text-xs font-extrabold uppercase tracking-wider text-white shadow-md ${
                activePreviewRole === 'super_admin' ? 'bg-amber-600 text-slate-950 font-black' :
                activePreviewRole === 'patient' ? 'bg-emerald-600' :
                activePreviewRole === 'doctor' ? 'bg-blue-600' : 'bg-purple-600'
              }`}
            >
              {activePreviewRole === 'super_admin' && 'SUPER ADMIN GOVERNANCE MODULES (Central Authority)'}
              {activePreviewRole === 'admin' && 'HOSPITAL ADMIN FEATURES (Requires Super Admin Verification)'}
              {activePreviewRole === 'doctor' && 'DOCTOR CLINICAL MODULES'}
              {activePreviewRole === 'patient' && 'PATIENT OPD & LIVE QUEUE MODULES'}
            </span>

            <button
              onClick={() => handleQuickLogin(activePreviewRole)}
              className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              <span>Open {activePreviewRole.replace('_', ' ').toUpperCase()} Dashboard</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activePreviewRole === 'super_admin' && [
              { num: '1', title: 'Hospitals Directory', desc: 'Central registry of all hospitals nationwide with city, bed capacity, assigned administrator, and contact information.', tag: 'Registry' },
              { num: '2', title: 'Admin Verification Queue', desc: 'Review newly registered Hospital Admins. One-click Approve/Verify or Reject with reason note.', tag: 'Approval System' },
              { num: '3', title: 'Strict 1-to-1 Mapping', desc: 'Enforce exactly one admin per hospital. Interactive matrix prevents dual assignments or cross-hospital mapping.', tag: '1-to-1 Engine' },
              { num: '4', title: 'Verification Gatekeeper', desc: 'Unverified or rejected hospital admins are strictly blocked from accessing hospital OPD controls until approved.', tag: 'Security Guard' },
              { num: '5', title: 'Schema & Backend Architecture', desc: 'Comprehensive Mongoose schemas, unique relational indexes, and JWT middleware specs for college submission.', tag: 'Technical Specs' },
              { num: '6', title: 'Global Health Governance', desc: 'Configure nationwide queue benchmarks, auto token reset schedules, and emergency triage policies.', tag: 'Authority' },
            ].map(card => (
              <div
                key={card.num}
                onClick={() => handleQuickLogin('super_admin')}
                className="bg-[#111c33] hover:bg-[#162340] border border-amber-500/30 hover:border-amber-500/70 p-5 rounded-2xl cursor-pointer transition-all duration-200 group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-extrabold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/30">
                    {card.num}. {card.title}
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold">{card.tag}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-normal">{card.desc}</p>
                <div className="mt-4 flex items-center justify-between text-xs text-amber-400 font-semibold group-hover:translate-x-1 transition-transform">
                  <span>Launch Screen</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))}

            {activePreviewRole === 'admin' && [
              { num: '1', title: 'Admin Dashboard', desc: 'Hospital Overview: Total Patients (250), Doctors (25), Appointments (180), Waiting (40) with Recharts trends.', tag: 'Analytics' },
              { num: '2', title: 'Manage Doctors', desc: 'Doctor management table with Name, Department, Phone, Edit/Delete, and + Add Doctor modal dialog.', tag: 'Staff CRUD' },
              { num: '3', title: 'Manage Departments', desc: 'Cardiology, Neurology, Orthopedics, General Medicine, Dental, Physiotherapy with add/edit actions.', tag: 'Units' },
              { num: '4', title: 'Appointments Management', desc: 'Filter by All, Upcoming, Completed, Cancelled with Token, Patient, Doctor, Time, and Status search.', tag: 'OPD Registry' },
              { num: '5', title: 'Patients List', desc: 'Directory with Search patients input, Name, Phone number, Total Appointments, and record modal.', tag: 'Directory' },
              { num: '6', title: 'Verification Gate Test', desc: 'Demonstrate how a Pending or Rejected Hospital Admin is restricted from accessing OPD features.', tag: 'Access Gate' },
            ].map(card => (
              <div
                key={card.num}
                onClick={() => handleQuickLogin('admin')}
                className="bg-[#111c33] hover:bg-[#162340] border border-purple-500/20 hover:border-purple-500/50 p-5 rounded-2xl cursor-pointer transition-all duration-200 group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-extrabold text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-lg border border-purple-500/20">
                    {card.num}. {card.title}
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold">{card.tag}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-normal">{card.desc}</p>
                <div className="mt-4 flex items-center justify-between text-xs text-purple-400 font-semibold group-hover:translate-x-1 transition-transform">
                  <span>Open Screen</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))}

            {activePreviewRole === 'doctor' && [
              { num: '1', title: 'Doctor Dashboard', desc: 'Welcome Dr. Arjun Sharma stats: Total Patients 25, Completed 12, Waiting 13, Avg Time 8 mins. Serving A-12 Rahul Verma.', tag: 'OPD Stats' },
              { num: '2', title: "Today's Queue", desc: 'Patient tokens list (A-12, A-13, A-14, A-15, A-16) with consultation badges and queue caller.', tag: 'Queue Desk' },
              { num: '3', title: 'Patient Details', desc: 'Rahul Verma, 28 Yrs Male, Cardiology, Chest pain & discomfort, allergies, BP history, and notes.', tag: 'Clinical EHR' },
              { num: '4', title: 'Consultation Actions', desc: 'Complete Consultation, Skip Patient (move back), Cancel Appointment, and clinical notes recorder.', tag: 'Workflow' },
              { num: '5', title: 'Doctor Availability', desc: 'Monday to Sunday working hours table with availability toggles (09:00 AM - 05:00 PM) and save button.', tag: 'Roster' },
              { num: '6', title: 'Appointments', desc: 'Upcoming and Completed schedule tabs with token, patient name, date, time, and status filters.', tag: 'Schedule' },
            ].map(card => (
              <div
                key={card.num}
                onClick={() => handleQuickLogin('doctor')}
                className="bg-[#111c33] hover:bg-[#162340] border border-blue-500/20 hover:border-blue-500/50 p-5 rounded-2xl cursor-pointer transition-all duration-200 group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-extrabold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/20">
                    {card.num}. {card.title}
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold">{card.tag}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-normal">{card.desc}</p>
                <div className="mt-4 flex items-center justify-between text-xs text-blue-400 font-semibold group-hover:translate-x-1 transition-transform">
                  <span>Open Screen</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))}

            {activePreviewRole === 'patient' && [
              { num: '1', title: 'Patient Dashboard', desc: 'Hello, Rahul! upcoming appointment, Dr. Arjun Sharma, Token A-24, Current Token A-19, estimated wait 32 mins.', tag: 'Waiting Lounge' },
              { num: '2', title: 'Book Appointment', desc: 'Select department (Cardiology), doctor, date picker, interactive time slot selection, and digital token creation.', tag: 'Online OPD' },
              { num: '3', title: 'Live Queue Tracking', desc: 'Currently Serving card (A-19 Amit Verma), Your Token (A-24), people ahead count, and live waiting list.', tag: 'Real-Time Sync' },
              { num: '4', title: 'My Appointments', desc: 'Upcoming, Completed, and Cancelled tabs with token status badges, doctor details, and booking cancellation.', tag: 'History' },
              { num: '5', title: 'Notifications', desc: 'Real-time alerts for token generated, now being served, appointment confirmed, reminder, and mark read.', tag: 'Instant Alerts' },
              { num: '6', title: 'Profile', desc: 'Patient name, email, phone, personal information, blood group, address, and payment methods.', tag: 'Security' },
            ].map(card => (
              <div
                key={card.num}
                onClick={() => handleQuickLogin('patient')}
                className="bg-[#111c33] hover:bg-[#162340] border border-emerald-500/20 hover:border-emerald-500/50 p-5 rounded-2xl cursor-pointer transition-all duration-200 group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-extrabold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                    {card.num}. {card.title}
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold">{card.tag}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-normal">{card.desc}</p>
                <div className="mt-4 flex items-center justify-between text-xs text-emerald-400 font-semibold group-hover:translate-x-1 transition-transform">
                  <span>Open Screen</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION: Horizontal Feature Strip */}
      <footer className="mt-auto bg-[#0d1527] border-t border-slate-800/80 py-6 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 bg-[#070b14] px-3 py-1 rounded-lg border border-slate-800">
              OTHER KEY FEATURES
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
            {bottomKeyFeatures.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.id}
                  className="bg-[#070b14] border border-slate-800/90 rounded-2xl p-3 flex flex-col justify-between hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-xl bg-slate-800 flex items-center justify-center text-amber-400">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div>
                    <h5 className="text-[11px] font-bold text-white leading-tight">
                      {feat.id}. {feat.title}
                    </h5>
                    <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">
                      {feat.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
            <p>© 2026 MediQueue - Multi-Hospital Queue Management System with Super Admin Governance.</p>
            <p className="mt-2 sm:mt-0 font-medium">Built with React, Tailwind CSS, Lucide React & Recharts</p>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <Modal
        isOpen={authModal.isOpen}
        onClose={() => setAuthModal({ ...authModal, isOpen: false })}
        title={`${authModal.isLogin ? 'Sign In to' : 'Create Account on'} MediQueue`}
      >
        <form onSubmit={handleAuthSubmit} className="space-y-4">
          <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 rounded-2xl mb-4 text-[11px]">
            {['super_admin', 'admin', 'doctor', 'patient'].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setAuthModal({ ...authModal, role: r })}
                className={`py-2 px-1 font-bold rounded-xl capitalize transition-all truncate ${
                  authModal.role === r
                    ? r === 'super_admin' ? 'bg-amber-600 text-slate-950 font-black shadow-sm'
                    : r === 'patient' ? 'bg-emerald-600 text-white shadow-sm'
                    : r === 'doctor' ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {r === 'super_admin' ? 'Super Admin' : r}
              </button>
            ))}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Your Full Name</label>
            <input
              type="text"
              value={authFormData.name}
              onChange={(e) => setAuthFormData({ ...authFormData, name: e.target.value })}
              placeholder={
                authModal.role === 'super_admin' ? 'Dr. Alok Verma' :
                authModal.role === 'patient' ? 'Rahul Verma' :
                authModal.role === 'doctor' ? 'Dr. Arjun Sharma' :
                'Chief Admin Officer'
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-500 text-slate-900 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email Address</label>
            <input
              type="email"
              value={authFormData.email}
              onChange={(e) => setAuthFormData({ ...authFormData, email: e.target.value })}
              placeholder={
                authModal.role === 'super_admin' ? 'superadmin@mediqueue.gov.in' :
                authModal.role === 'patient' ? 'rahulverma@gmail.com' :
                authModal.role === 'doctor' ? 'arjun.sharma@citycare.com' :
                'admin@citycare.com'
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-500 text-slate-900 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              defaultValue="password123"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-500 text-slate-900 bg-white"
            />
          </div>

          <button
            type="submit"
            className={`w-full py-3 text-white rounded-xl text-xs font-bold transition-all shadow-md mt-2 ${
              authModal.role === 'super_admin' ? 'bg-amber-600 hover:bg-amber-700 text-slate-950 font-black' :
              authModal.role === 'patient' ? 'bg-emerald-600 hover:bg-emerald-700' :
              authModal.role === 'doctor' ? 'bg-blue-600 hover:bg-blue-700' :
              'bg-purple-600 hover:bg-purple-700'
            }`}
          >
            {authModal.isLogin ? `Sign In as ${authModal.role.toUpperCase().replace('_', ' ')}` : 'Register Account'}
          </button>

          <p className="text-center text-[11px] text-slate-400">
            Demo credentials are pre-filled for immediate testing.
          </p>
        </form>
      </Modal>

    </div>
  );
};
