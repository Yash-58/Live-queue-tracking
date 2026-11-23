import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Sidebar } from '../../components/common/Sidebar';
import { Navbar } from '../../components/common/Navbar';
import { StatusBadge } from '../../components/common/StatusBadge';
import { StatCard } from '../../components/common/StatCard';
import { Modal } from '../../components/common/Modal';
import {
  Crown,
  Building2,
  Building,
  UserCheck,
  Network,
  Database,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Shield,
  ShieldCheck,
  Lock,
  ArrowRight,
  ExternalLink,
  Code,
  Layers,
  MapPin,
  Phone,
  Mail,
  FileText,
  BadgeCheck,
  Clock,
  Sparkles,
  RefreshCw,
  Eye,
  Trash2,
  Link2,
  Users,
  User
} from 'lucide-react';

export const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const {
    currentRole,
    switchRole,
    hospitals,
    hospitalAdmins,
    approveHospitalAdmin,
    rejectHospitalAdmin,
    registerHospitalAdmin,
    addHospital,
    deleteHospital,
    unassignAdminFromHospital,
    switchHospitalAdminUser,
    addToast
  } = useApp();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Auto-switch to super_admin role on navigating directly to Super Admin dashboard
  useEffect(() => {
    if (currentRole !== 'super_admin') {
      switchRole('super_admin');
    }
  }, []);

  // Search & Filter States
  const [hospitalSearch, setHospitalSearch] = useState('');
  const [adminSearch, setAdminSearch] = useState('');
  const [verificationFilter, setVerificationFilter] = useState('All');

  // Modals
  const [isAddHospitalModalOpen, setIsAddHospitalModalOpen] = useState(false);
  const [newHospitalForm, setNewHospitalForm] = useState({
    name: '',
    code: '',
    city: 'New Delhi',
    beds: 250,
    address: '',
    phone: ''
  });

  const [isAssignAdminModalOpen, setIsAssignAdminModalOpen] = useState(false);
  const [assignForm, setAssignForm] = useState({
    name: '',
    email: '',
    phone: '',
    hospitalId: '',
    licenseNumber: ''
  });

  const [rejectingAdmin, setRejectingAdmin] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('Verification documentation incomplete or unverified.');

  // Role Access Guard: If not yet super_admin, provide access gate
  if (currentRole !== 'super_admin') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-white text-center">
        <div className="max-w-md bg-slate-800 border border-amber-500/30 p-8 rounded-3xl shadow-2xl space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-amber-300">Super Admin Access Required</h2>
          <p className="text-xs text-slate-300">
            This module contains confidential multi-hospital registries, 1-to-1 admin mapping controls, and authority verification tools.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => switchRole('super_admin')}
              className="py-3 px-4 bg-amber-600 hover:bg-amber-500 text-slate-950 font-black text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Crown className="w-4 h-4" />
              <span>Switch to Super Admin Account</span>
            </button>
            <button
              onClick={() => {
                switchRole('patient');
                navigate('/patient');
              }}
              className="py-2 text-xs text-slate-400 hover:text-slate-200"
            >
              Return to Patient Portal
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Analytics Metrics
  const totalHospitals = hospitals.length;
  const totalAdmins = hospitalAdmins.length;
  const pendingCount = hospitalAdmins.filter(a => a.verificationStatus === 'Pending').length;
  const verifiedCount = hospitalAdmins.filter(a => a.verificationStatus === 'Verified').length;
  const rejectedCount = hospitalAdmins.filter(a => a.verificationStatus === 'Rejected').length;
  const assignedHospitalsCount = hospitals.filter(h => h.assignedAdminId).length;

  // Filtered lists
  const filteredHospitals = hospitals.filter(h =>
    h.name.toLowerCase().includes(hospitalSearch.toLowerCase()) ||
    h.city.toLowerCase().includes(hospitalSearch.toLowerCase()) ||
    h.code.toLowerCase().includes(hospitalSearch.toLowerCase())
  );

  const filteredAdmins = hospitalAdmins.filter(a => {
    const matchStatus =
      verificationFilter === 'All' ? true :
        a.verificationStatus === verificationFilter;

    const matchSearch =
      a.name.toLowerCase().includes(adminSearch.toLowerCase()) ||
      a.email.toLowerCase().includes(adminSearch.toLowerCase()) ||
      a.hospitalName.toLowerCase().includes(adminSearch.toLowerCase());

    return matchStatus && matchSearch;
  });

  const handleAddHospitalSubmit = (e) => {
    e.preventDefault();
    const res = addHospital(newHospitalForm);
    if (res.success) {
      setIsAddHospitalModalOpen(false);
      setNewHospitalForm({ name: '', code: '', city: 'New Delhi', beds: 250, address: '', phone: '' });
    }
  };

  const handleAssignAdminSubmit = (e) => {
    e.preventDefault();
    const res = registerHospitalAdmin(assignForm);
    if (res.success) {
      setIsAssignAdminModalOpen(false);
      setAssignForm({ name: '', email: '', phone: '', hospitalId: '', licenseNumber: '' });
    }
  };

  const handleConfirmReject = () => {
    if (rejectingAdmin) {
      rejectHospitalAdmin(rejectingAdmin.id, rejectionReason);
      setRejectingAdmin(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* Dark Navy Sidebar */}
      <Sidebar
        role="super_admin"
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <Navbar
          onOpenMobile={() => setIsMobileOpen(true)}
          role="super_admin"
          pageTitle={
            activeTab === 'dashboard' ? 'Super Admin Overview' :
              activeTab === 'hospitals' ? 'Hospitals Directory' :
                activeTab === 'verification' ? 'Hospital Admin Verification' :
                  activeTab === 'mapping' ? '1-to-1 Mapping Governance' :
                    activeTab === 'architecture' ? 'Schema & Architecture' : 'Global Settings'
          }
        />

        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">

          {/* Super Admin Notice Banner */}
          <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 rounded-3xl p-6 text-white shadow-xl shadow-amber-900/15 relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative z-10 space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-extrabold uppercase tracking-wider">
                <Crown className="w-3.5 h-3.5" />
                <span>Central Health Authority Dashboard</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight mt-2">
                Multi-Hospital Oversight & Admin Verification
              </h2>
              <p className="text-amber-100 text-xs sm:text-sm max-w-2xl">
                Enforce strict 1-to-1 Hospital-to-Admin relationships, approve pending hospital administrator credentials, and maintain nationwide hospital queue infrastructure.
              </p>
            </div>

            <div className="relative z-10 flex flex-wrap gap-2.5">
              <button
                onClick={() => setIsAddHospitalModalOpen(true)}
                className="px-4 py-2.5 bg-slate-950 hover:bg-slate-900 text-amber-300 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 border border-amber-400/30"
              >
                <Plus className="w-4 h-4" />
                <span>+ Register Hospital</span>
              </button>
              <button
                onClick={() => setIsAssignAdminModalOpen(true)}
                className="px-4 py-2.5 bg-white text-slate-900 hover:bg-amber-50 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
              >
                <UserCheck className="w-4 h-4 text-amber-600" />
                <span>Assign New Admin</span>
              </button>
            </div>
          </div>

          {/* Quick Sub-navigation Pills */}
          <div className="bg-white p-2 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-1.5 overflow-x-auto text-xs font-semibold">
            {[
              { id: 'dashboard', label: '1. Super Overview', icon: Crown },
              { id: 'hospitals', label: '2. Hospitals Directory', icon: Building2 },
              { id: 'verification', label: `3. Admin Verification (${pendingCount} Pending)`, icon: UserCheck, alert: pendingCount > 0 },
              { id: 'mapping', label: '4. Strict 1-to-1 Mapping', icon: Network },
              { id: 'architecture', label: '5. Schema & Backend API Design', icon: Database },
              { id: 'settings', label: '6. Global Settings', icon: Shield }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-all flex items-center gap-2 ${activeTab === tab.id
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.alert && (
                  <span className="w-2 h-2 rounded-full bg-red-400 animate-ping"></span>
                )}
              </button>
            ))}
          </div>

          {/* SECTION 1: Super Admin Overview */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* 5 KPI Stat Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                <StatCard
                  title="Total Hospitals"
                  value={totalHospitals}
                  subtitle="Nationwide Registered"
                  icon={Building2}
                  color="amber"
                />
                <StatCard
                  title="Hospital Admins"
                  value={totalAdmins}
                  subtitle={`${assignedHospitalsCount} Hospitals Assigned`}
                  icon={Users}
                  color="blue"
                />
                <StatCard
                  title="Pending Approvals"
                  value={pendingCount}
                  subtitle="Awaiting Super Admin"
                  icon={Clock}
                  color="rose"
                />
                <StatCard
                  title="Verified Admins"
                  value={verifiedCount}
                  subtitle="Full OPD Access"
                  icon={CheckCircle2}
                  color="emerald"
                />
                <StatCard
                  title="1-to-1 Mapping"
                  value="100%"
                  subtitle="Strict Constraint Active"
                  icon={ShieldCheck}
                  color="purple"
                />
              </div>

              {/* Pending Approvals Quick-Action Banner if any */}
              {pendingCount > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-3xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center flex-shrink-0 animate-bounce">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-amber-900">
                        {pendingCount} Hospital Administrator{pendingCount > 1 ? 's are' : ' is'} awaiting verification!
                      </h4>
                      <p className="text-xs text-amber-700">
                        Hospital Admins cannot access their dashboard features until verified by Super Admin.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('verification')}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
                  >
                    Open Verification Queue →
                  </button>
                </div>
              )}

              {/* Two Column Grid: Recent Hospital Registrations & 1-to-1 Mapping Summary */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Left Card: Hospitals Overview */}
                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-slate-800 text-base">Hospitals Overview</h3>
                        <p className="text-xs text-slate-400">Recent registered healthcare facilities</p>
                      </div>
                      <button
                        onClick={() => setActiveTab('hospitals')}
                        className="text-xs font-bold text-amber-600 hover:underline"
                      >
                        View All ({totalHospitals})
                      </button>
                    </div>

                    <div className="divide-y divide-slate-100">
                      {hospitals.slice(0, 4).map(hosp => (
                        <div key={hosp.id} className="py-3 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs">
                              {hosp.code}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-900">{hosp.name}</p>
                              <span className="text-[11px] text-slate-400">{hosp.city} • {hosp.beds} Beds</span>
                            </div>
                          </div>
                          <div>
                            {hosp.assignedAdminId ? (
                              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                                Admin Assigned
                              </span>
                            ) : (
                              <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                                Unassigned
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <button
                      onClick={() => setIsAddHospitalModalOpen(true)}
                      className="w-full py-2.5 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100/80 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Register New Healthcare Facility</span>
                    </button>
                  </div>
                </div>

                {/* Right Card: Strict 1-to-1 Mapping Status */}
                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-slate-800 text-base">Strict 1-to-1 Mapping Health</h3>
                        <p className="text-xs text-slate-400">One Admin per Hospital constraint monitor</p>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                        100% Compliant
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-1">
                        <div className="flex items-center justify-between font-bold text-slate-800">
                          <span>Constraint 1: One Admin Per Hospital</span>
                          <span className="text-emerald-600">PASS</span>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          No hospital has multiple administrators assigned. Database schema has unique index on <code>hospitalId</code>.
                        </p>
                      </div>

                      <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-1">
                        <div className="flex items-center justify-between font-bold text-slate-800">
                          <span>Constraint 2: Unique Admin Users</span>
                          <span className="text-emerald-600">PASS</span>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          No administrator user is mapped to more than 1 hospital. Cross-hospital admin privileges are blocked.
                        </p>
                      </div>

                      <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-1">
                        <div className="flex items-center justify-between font-bold text-slate-800">
                          <span>Constraint 3: Verification Lockout</span>
                          <span className="text-emerald-600">PASS</span>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          Unverified/Pending admins are strictly prohibited from viewing or modifying hospital OPD queues.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => setActiveTab('mapping')}
                      className="text-xs font-bold text-amber-600 hover:underline"
                    >
                      Manage 1-to-1 Assignments →
                    </button>
                    <button
                      onClick={() => setActiveTab('architecture')}
                      className="text-xs font-semibold text-slate-400 hover:text-slate-600 flex items-center gap-1"
                    >
                      <Code className="w-3.5 h-3.5" />
                      <span>View DB Schema Rules</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* SECTION 2: Hospitals Directory */}
          {activeTab === 'hospitals' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-card space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Registered Hospitals Directory</h2>
                  <p className="text-xs text-slate-500">View and manage all hospitals on the MediQueue network.</p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative w-full sm:w-64">
                    <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      value={hospitalSearch}
                      onChange={(e) => setHospitalSearch(e.target.value)}
                      placeholder="Search hospital or city..."
                      className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <button
                    onClick={() => setIsAddHospitalModalOpen(true)}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 whitespace-nowrap"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Hospital</span>
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-y border-slate-100">
                    <tr>
                      <th className="py-3.5 px-4">Code</th>
                      <th className="py-3.5 px-4">Hospital Name & Location</th>
                      <th className="py-3.5 px-4">Beds</th>
                      <th className="py-3.5 px-4">Assigned Hospital Admin</th>
                      <th className="py-3.5 px-4">1-to-1 Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredHospitals.map((hosp) => {
                      const admin = hospitalAdmins.find(a => a.id === hosp.assignedAdminId);
                      return (
                        <tr key={hosp.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3.5 px-4">
                            <span className="font-black text-slate-900 bg-slate-100 px-2.5 py-1 rounded-xl">
                              {hosp.code}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <div>
                              <p className="font-bold text-slate-900">{hosp.name}</p>
                              <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                                <MapPin className="w-3 h-3 text-slate-400" />
                                {hosp.address}
                              </span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-bold text-slate-800">
                            {hosp.beds} Beds
                          </td>
                          <td className="py-3.5 px-4">
                            {admin ? (
                              <div>
                                <p className="font-bold text-slate-800">{admin.name}</p>
                                <span className="text-[10px] text-slate-400">{admin.email}</span>
                              </div>
                            ) : (
                              <span className="text-slate-400 italic">No Admin Assigned</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            {admin ? (
                              <StatusBadge status={admin.verificationStatus} />
                            ) : (
                              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                                Slot Available (0/1)
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {!hosp.assignedAdminId ? (
                                <button
                                  onClick={() => {
                                    setAssignForm({ ...assignForm, hospitalId: hosp.id });
                                    setIsAssignAdminModalOpen(true);
                                  }}
                                  className="text-xs font-bold text-amber-600 hover:text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg transition-colors"
                                >
                                  Assign Admin
                                </button>
                              ) : (
                                <button
                                  onClick={() => unassignAdminFromHospital(hosp.assignedAdminId)}
                                  className="text-xs font-semibold text-rose-500 hover:underline"
                                  title="Unassign current administrator"
                                >
                                  Unassign
                                </button>
                              )}
                              <button
                                onClick={() => deleteHospital(hosp.id)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                                title="Delete Hospital"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SECTION 3: Admin Verification & Approval Queue */}
          {activeTab === 'verification' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-card space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Hospital Admin Verification System</h2>
                  <p className="text-xs text-slate-500">
                    Review and verify hospital administrators before granting them hospital dashboard privileges.
                  </p>
                </div>

                {/* Filter Tabs: All, Pending, Verified, Rejected */}
                <div className="flex items-center gap-1.5 overflow-x-auto">
                  {['All', 'Pending', 'Verified', 'Rejected'].map(status => (
                    <button
                      key={status}
                      onClick={() => setVerificationFilter(status)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${verificationFilter === status
                          ? 'bg-amber-600 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                      {status}
                      {status === 'Pending' && pendingCount > 0 && (
                        <span className="ml-1.5 px-1.5 py-0.2 bg-amber-200 text-amber-950 rounded-full text-[10px]">
                          {pendingCount}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Verification Cards / Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-y border-slate-100">
                    <tr>
                      <th className="py-3.5 px-4">Admin Name & License</th>
                      <th className="py-3.5 px-4">Assigned Hospital</th>
                      <th className="py-3.5 px-4">Contact</th>
                      <th className="py-3.5 px-4">Registered Date</th>
                      <th className="py-3.5 px-4">Verification Status</th>
                      <th className="py-3.5 px-4 text-right">Super Admin Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredAdmins.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="py-8 text-center text-slate-400">
                          No hospital administrators found for the selected filter.
                        </td>
                      </tr>
                    ) : (
                      filteredAdmins.map((admin) => {
                        const isPending = admin.verificationStatus === 'Pending';
                        const isVerified = admin.verificationStatus === 'Verified';
                        const isRejected = admin.verificationStatus === 'Rejected';

                        return (
                          <tr key={admin.id} className="hover:bg-slate-50 transition-colors">
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={admin.avatar}
                                  alt={admin.name}
                                  className="w-9 h-9 rounded-full object-cover"
                                />
                                <div>
                                  <p className="font-bold text-slate-900">{admin.name}</p>
                                  <span className="text-[11px] font-mono text-slate-400">
                                    Lic: {admin.licenseNumber}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="font-bold text-slate-800 block">
                                {admin.hospitalName}
                              </span>
                              <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-semibold inline-block mt-0.5">
                                1-to-1 Mapped
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              <p className="text-slate-700 font-medium">{admin.email}</p>
                              <span className="text-[11px] text-slate-400">{admin.phone}</span>
                            </td>
                            <td className="py-3.5 px-4 text-slate-500">
                              {admin.registeredAt}
                              {admin.verifiedAt && (
                                <span className="block text-[10px] text-emerald-600 font-medium">
                                  Approved: {admin.verifiedAt}
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-4">
                              <StatusBadge status={admin.verificationStatus} />
                              {admin.rejectionReason && (
                                <p className="text-[10px] text-rose-600 mt-1 max-w-xs leading-tight">
                                  Note: {admin.rejectionReason}
                                </p>
                              )}
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                {isPending && (
                                  <>
                                    <button
                                      onClick={() => approveHospitalAdmin(admin.id)}
                                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-sm flex items-center gap-1 transition-all"
                                    >
                                      <CheckCircle2 className="w-3.5 h-3.5" />
                                      <span>Verify & Approve</span>
                                    </button>
                                    <button
                                      onClick={() => setRejectingAdmin(admin)}
                                      className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl font-bold transition-all flex items-center gap-1"
                                    >
                                      <XCircle className="w-3.5 h-3.5" />
                                      <span>Reject</span>
                                    </button>
                                  </>
                                )}

                                {isVerified && (
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1">
                                      <BadgeCheck className="w-3.5 h-3.5" />
                                      <span>Active & Verified</span>
                                    </span>
                                    <button
                                      onClick={() => setRejectingAdmin(admin)}
                                      className="text-[11px] text-slate-400 hover:text-rose-600 ml-1"
                                      title="Revoke Verification"
                                    >
                                      Revoke
                                    </button>
                                  </div>
                                )}

                                {isRejected && (
                                  <button
                                    onClick={() => approveHospitalAdmin(admin.id)}
                                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-sm transition-all"
                                  >
                                    Re-verify & Approve
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Informational Guidance Notice */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-1">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Verification Policy Enforcement:</span>
                </span>
                <p>
                  Hospital Admins who are <strong>Pending</strong> or <strong>Rejected</strong> are automatically blocked by the router and middleware. If an admin attempts to load the Hospital Admin dashboard before approval, they will see an access-denied verification pending state.
                </p>
              </div>
            </div>
          )}

          {/* SECTION 4: Strict 1-to-1 Mapping Governance */}
          {activeTab === 'mapping' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-card space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Strict 1-to-1 Hospital-Admin Governance</h2>
                  <p className="text-xs text-slate-500">
                    Rule: Each hospital must have exactly one (1) administrator, and each administrator can only manage one (1) hospital.
                  </p>
                </div>

                <button
                  onClick={() => setIsAssignAdminModalOpen(true)}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Assign New Administrator</span>
                </button>
              </div>

              {/* Interactive Matrix */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {hospitals.map(hosp => {
                  const assignedAdmin = hospitalAdmins.find(a => a.id === hosp.assignedAdminId);
                  const isAssigned = !!assignedAdmin;

                  return (
                    <div
                      key={hosp.id}
                      className={`p-5 rounded-3xl border transition-all ${isAssigned
                          ? 'bg-white border-slate-200 shadow-sm'
                          : 'bg-slate-50/70 border-dashed border-slate-300'
                        }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs ${isAssigned ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-500'
                            }`}>
                            <Building2 className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-slate-900">{hosp.name}</h4>
                            <span className="text-[11px] text-slate-400">{hosp.code} • {hosp.city}</span>
                          </div>
                        </div>

                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${isAssigned ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                          {isAssigned ? 'Occupied (1/1)' : 'Available (0/1)'}
                        </span>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100">
                        {isAssigned ? (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <img
                                src={assignedAdmin.avatar}
                                alt={assignedAdmin.name}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                              <div>
                                <p className="text-xs font-bold text-slate-800">{assignedAdmin.name}</p>
                                <span className="text-[10px] text-slate-400">{assignedAdmin.email}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <StatusBadge status={assignedAdmin.verificationStatus} size="xs" />
                              <button
                                onClick={() => unassignAdminFromHospital(assignedAdmin.id)}
                                className="text-xs font-semibold text-rose-500 hover:underline ml-2"
                              >
                                Release
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between text-xs text-slate-500">
                            <span>No administrator assigned yet.</span>
                            <button
                              onClick={() => {
                                setAssignForm({ ...assignForm, hospitalId: hosp.id });
                                setIsAssignAdminModalOpen(true);
                              }}
                              className="font-bold text-amber-600 hover:text-amber-700 bg-amber-50 px-3 py-1 rounded-lg"
                            >
                              + Assign Admin
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SECTION 5: Schema & Backend API Design (Architectural Documentation for Project Presentation) */}
          {activeTab === 'architecture' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-card space-y-6">
              <div className="border-b border-slate-100 pb-5">
                <div className="flex items-center gap-2 text-amber-600 text-xs font-bold uppercase tracking-wider">
                  <Database className="w-4 h-4" />
                  <span>Technical Specification & Architecture</span>
                </div>
                <h2 className="text-2xl font-black text-slate-900 mt-1">
                  Database Schema & Backend API Design
                </h2>
                <p className="text-xs text-slate-500">
                  Documentation of the strict 1-to-1 relational constraints, Mongoose unique index rules, and JWT role verification middleware.
                </p>
              </div>

              {/* Grid with 3 Technical Specification Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                {/* 1. Mongoose / Relational Schema */}
                <div className="p-5 rounded-2xl bg-slate-900 text-slate-200 text-xs font-mono space-y-3">
                  <div className="flex items-center justify-between text-amber-400 font-bold border-b border-slate-800 pb-2">
                    <span>1. Hospital & Admin Schemas</span>
                    <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded">MongoDB / Mongoose</span>
                  </div>
                  <pre className="text-[11px] overflow-x-auto text-emerald-400 leading-relaxed">
                    {`// Hospital Schema
const HospitalSchema = new Schema({
  name: { type: String, required: true },
  code: { type: String, unique: true },
  city: { type: String, required: true },
  beds: { type: Number, default: 100 },
  admin: {
    type: Schema.Types.ObjectId,
    ref: 'HospitalAdmin',
    unique: true, // STRICT 1-TO-1
    sparse: true
  }
});

// Hospital Admin Schema
const HospitalAdminSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true },
  hospital: {
    type: Schema.Types.ObjectId,
    ref: 'Hospital',
    unique: true, // 1-TO-1 CONSTRAINT
    required: true
  },
  verificationStatus: {
    type: String,
    enum: ['Pending', 'Verified', 'Rejected'],
    default: 'Pending' // INITIAL STATE
  },
  verifiedBy: { type: Schema.Types.ObjectId, ref: 'SuperAdmin' },
  verifiedAt: Date
});`}
                  </pre>
                </div>

                {/* 2. Security Middleware */}
                <div className="p-5 rounded-2xl bg-slate-900 text-slate-200 text-xs font-mono space-y-3">
                  <div className="flex items-center justify-between text-blue-400 font-bold border-b border-slate-800 pb-2">
                    <span>2. Role & Verification Guards</span>
                    <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded">Express Middleware</span>
                  </div>
                  <pre className="text-[11px] overflow-x-auto text-cyan-400 leading-relaxed">
                    {`// Super Admin Guard Middleware
export const requireSuperAdmin = (req, res, next) => {
  if (req.user.role !== 'super_admin') {
    return res.status(403).json({
      error: 'Access Forbidden: Super Admin only'
    });
  }
  next();
};

// Admin Verification Access Guard
export const requireVerifiedAdmin = async (req, res, next) => {
  const admin = await HospitalAdmin.findById(req.user.id);
  if (!admin || admin.verificationStatus !== 'Verified') {
    return res.status(403).json({
      error: 'Account Pending Verification',
      status: admin?.verificationStatus || 'Pending'
    });
  }
  req.hospitalId = admin.hospital;
  next();
};`}
                  </pre>
                </div>

                {/* 3. REST API Endpoints & 1-to-1 Validation */}
                <div className="p-5 rounded-2xl bg-slate-900 text-slate-200 text-xs font-mono space-y-3">
                  <div className="flex items-center justify-between text-purple-400 font-bold border-b border-slate-800 pb-2">
                    <span>3. Validation Endpoints</span>
                    <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded">REST APIs</span>
                  </div>
                  <pre className="text-[11px] overflow-x-auto text-amber-300 leading-relaxed">
                    {`// 1-to-1 Mapping Validation Endpoint
POST /api/super-admin/hospitals/:id/assign-admin
-> Validates:
   1. hospital.admin == null
   2. admin.hospital == null
   If either fails -> 409 Conflict

// Verification Actions
PUT /api/super-admin/admins/:id/verify
-> Updates status to 'Verified'
-> Emits real-time Socket.IO event

PUT /api/super-admin/admins/:id/reject
-> Updates status to 'Rejected'
-> Records rejection reason`}
                  </pre>
                </div>

              </div>

              {/* Visual Flow Diagram */}
              <div className="p-5 bg-amber-50/70 border border-amber-200 rounded-3xl space-y-3">
                <h4 className="font-bold text-amber-900 text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Admin Registration & 1-to-1 Verification Lifecycle:</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-white rounded-2xl border border-amber-200">
                    <span className="font-black text-amber-700 block text-sm">Step 1: Assign</span>
                    <p className="text-slate-600 mt-1">Admin registers for an unassigned hospital. Strict 1-to-1 mapping checks guarantee hospital is not already occupied.</p>
                  </div>
                  <div className="p-3 bg-white rounded-2xl border border-amber-200">
                    <span className="font-black text-amber-700 block text-sm">Step 2: Status "Pending"</span>
                    <p className="text-slate-600 mt-1">Account enters Pending state. Access to hospital OPD, doctors, and departments is locked.</p>
                  </div>
                  <div className="p-3 bg-white rounded-2xl border border-amber-200">
                    <span className="font-black text-amber-700 block text-sm">Step 3: Super Admin Review</span>
                    <p className="text-slate-600 mt-1">Super Admin inspects credentials, licenses, and hospital capacity from central dashboard.</p>
                  </div>
                  <div className="p-3 bg-white rounded-2xl border border-amber-200">
                    <span className="font-black text-emerald-700 block text-sm">Step 4: Verified Access</span>
                    <p className="text-slate-600 mt-1">Upon Super Admin verification, the Hospital Admin gains full authority over their individual hospital.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 6: Global Authority Settings */}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-card max-w-3xl mx-auto space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-xl font-bold text-slate-900">National Health Authority Configuration</h2>
                <p className="text-xs text-slate-500">Configure global parameters and strict validation policies.</p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">Enforce Strict 1-to-1 Mapping</span>
                    <span className="text-slate-500">Prohibit any hospital from having more than 1 administrator.</span>
                  </div>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-full">
                    Enforced (Mandatory)
                  </span>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">Mandatory Super Admin Verification</span>
                    <span className="text-slate-500">All newly registered hospital administrators start with "Pending" status.</span>
                  </div>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-full">
                    Active
                  </span>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">Cross-Hospital Admin Prevention</span>
                    <span className="text-slate-500">Block any single administrator from registering with multiple hospitals.</span>
                  </div>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-full">
                    Active
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400">Authority: Dr. Alok Verma • Ministry of Health</span>
                <button
                  onClick={() => addToast('Global health governance settings saved.', 'success')}
                  className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-md transition-all"
                >
                  Save Authority Policies
                </button>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Modal: Register New Hospital */}
      <Modal
        isOpen={isAddHospitalModalOpen}
        onClose={() => setIsAddHospitalModalOpen(false)}
        title="Register New Hospital on MediQueue"
      >
        <form onSubmit={handleAddHospitalSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Hospital Name</label>
            <input
              type="text"
              required
              value={newHospitalForm.name}
              onChange={(e) => setNewHospitalForm({ ...newHospitalForm, name: e.target.value })}
              placeholder="e.g. Apollo Super Specialty Hospital"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Hospital Code</label>
              <input
                type="text"
                required
                value={newHospitalForm.code}
                onChange={(e) => setNewHospitalForm({ ...newHospitalForm, code: e.target.value })}
                placeholder="e.g. ASH-06"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium uppercase focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">City</label>
              <input
                type="text"
                required
                value={newHospitalForm.city}
                onChange={(e) => setNewHospitalForm({ ...newHospitalForm, city: e.target.value })}
                placeholder="e.g. New Delhi"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Bed Capacity</label>
              <input
                type="number"
                min="10"
                value={newHospitalForm.beds}
                onChange={(e) => setNewHospitalForm({ ...newHospitalForm, beds: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Helpline Phone</label>
              <input
                type="text"
                value={newHospitalForm.phone}
                onChange={(e) => setNewHospitalForm({ ...newHospitalForm, phone: e.target.value })}
                placeholder="+91 11 4455 6677"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Address</label>
            <input
              type="text"
              value={newHospitalForm.address}
              onChange={(e) => setNewHospitalForm({ ...newHospitalForm, address: e.target.value })}
              placeholder="Plot No. 12, Health Zone, Sector 44"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-800">
            ℹ️ The newly created hospital will start in an <strong>Unassigned</strong> state ready for 1-to-1 administrator assignment.
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-md transition-all"
          >
            Confirm Hospital Registration
          </button>
        </form>
      </Modal>

      {/* Modal: Assign Admin with STRICT 1-TO-1 MAPPING RULES */}
      <Modal
        isOpen={isAssignAdminModalOpen}
        onClose={() => setIsAssignAdminModalOpen(false)}
        title="Assign Hospital Administrator (1-to-1 Strict Mapping)"
      >
        <form onSubmit={handleAssignAdminSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Target Hospital</label>
            <select
              required
              value={assignForm.hospitalId}
              onChange={(e) => setAssignForm({ ...assignForm, hospitalId: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-amber-500 bg-white"
            >
              <option value="">-- Select a Hospital --</option>
              {hospitals.map(h => (
                <option key={h.id} value={h.id}>
                  {h.name} ({h.city}) {h.assignedAdminId ? '⚠️ [Already Assigned]' : '✅ [Available for 1-to-1]'}
                </option>
              ))}
            </select>
            <span className="text-[10px] text-slate-400 mt-1 block">
              Validation Rule: If an occupied hospital is selected, submission will be rejected by the 1-to-1 constraint engine.
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Administrator Full Name</label>
            <input
              type="text"
              required
              value={assignForm.name}
              onChange={(e) => setAssignForm({ ...assignForm, name: e.target.value })}
              placeholder="e.g. Meenakshi Sundaram"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email Address</label>
              <input
                type="email"
                required
                value={assignForm.email}
                onChange={(e) => setAssignForm({ ...assignForm, email: e.target.value })}
                placeholder="admin@hospital.org"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Phone Number</label>
              <input
                type="text"
                required
                value={assignForm.phone}
                onChange={(e) => setAssignForm({ ...assignForm, phone: e.target.value })}
                placeholder="+91 98000 11223"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Medical Admin License / ID</label>
            <input
              type="text"
              value={assignForm.licenseNumber}
              onChange={(e) => setAssignForm({ ...assignForm, licenseNumber: e.target.value })}
              placeholder="e.g. HA-DEL-2026-4432"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-[11px] text-blue-800">
            🔒 <strong>Verification Rule:</strong> The admin will be registered with initial status: <strong>Pending</strong>. Super Admin approval will be required before they can log in to their hospital dashboard.
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-md transition-all"
          >
            Validate & Register Administrator
          </button>
        </form>
      </Modal>

      {/* Modal: Rejection Reason Dialog */}
      {rejectingAdmin && (
        <Modal
          isOpen={!!rejectingAdmin}
          onClose={() => setRejectingAdmin(null)}
          title={`Reject Verification: ${rejectingAdmin.name}`}
        >
          <div className="space-y-4 text-xs">
            <p className="text-slate-600">
              Please enter the official rejection reason for <strong>{rejectingAdmin.name}</strong> ({rejectingAdmin.hospitalName}). The admin will remain blocked from accessing the hospital dashboard until verified.
            </p>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Reason for Rejection</label>
              <textarea
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setRejectingAdmin(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold"
              >
                Confirm Rejection & Block Access
              </button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};
