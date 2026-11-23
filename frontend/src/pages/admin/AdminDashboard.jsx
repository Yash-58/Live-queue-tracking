import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sidebar } from '../../components/common/Sidebar';
import { Navbar } from '../../components/common/Navbar';
import { StatusBadge } from '../../components/common/StatusBadge';
import { StatCard } from '../../components/common/StatCard';
import { Modal } from '../../components/common/Modal';
import {
  Users,
  Stethoscope,
  CalendarCheck,
  Clock,
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  TrendingUp,
  Download,
  Building2,
  HeartPulse,
  Phone,
  Mail,
  Shield,
  FileBarChart,
  Eye,
  CheckCircle2,
  Settings,
  RotateCcw,
  Save,
  Bell,
  Sliders,
  Check,
  Lock,
  ShieldAlert,
  ArrowRight,
  Crown,
  BadgeCheck,
  XCircle
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';

export const AdminDashboard = () => {
  const {
    doctors,
    departments,
    appointments,
    patients,
    analyticsData,
    addDoctor,
    updateDoctor,
    deleteDoctor,
    addDepartment,
    updateDepartment,
    deleteDepartment,
    resetDemoData,
    addToast,
    currentUser,
    currentHospitalAdmin,
    switchRole,
    switchHospitalAdminUser,
    hospitalAdmins,
    activeHospitalAdminId
  } = useApp();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // All useState hooks MUST be defined before any conditional returns
  const [aptFilter, setAptFilter] = useState('All');
  const [aptSearch, setAptSearch] = useState('');
  const [patientSearch, setPatientSearch] = useState('');
  const [selectedPatientModal, setSelectedPatientModal] = useState(null);

  const [hospitalSettings, setHospitalSettings] = useState({
    hospitalName: 'City Care Multispeciality Hospital',
    address: '42 Health Boulevard, Medical Enclave, New Delhi',
    phone: '+91 11 2345 6789',
    email: 'contact@citycarehospital.com',
    avgConsultationMins: 8,
    emergencyPriorityActive: true,
    smsAlertsActive: true,
    autoTokenReset: 'Everyday at Midnight'
  });

  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [doctorForm, setDoctorForm] = useState({
    name: '',
    email: '',
    password: '',
    specialization: '',
    department: 'Cardiology',
    phone: '',
    room: 'Room 101'
  });

  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [deptForm, setDeptForm] = useState({
    name: '',
    head: '',
    room: 'Room 201',
    description: ''
  });

  // Check verification status: is the active hospital admin verified?
  const adminRecord = hospitalAdmins?.find(a => a.id === activeHospitalAdminId) || currentHospitalAdmin;
  const isVerified = adminRecord?.verificationStatus === 'Verified';

  // If Hospital Admin is NOT verified (Pending or Rejected), lock the features
  if (!isVerified) {
    const isPending = adminRecord?.verificationStatus === 'Pending';
    const isRejected = adminRecord?.verificationStatus === 'Rejected';

    return (
      <div className="min-h-screen bg-[#f8fafc] flex">
        <Sidebar
          role="admin"
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isMobileOpen={isMobileOpen}
          onCloseMobile={() => setIsMobileOpen(false)}
        />

        <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
          <Navbar
            onOpenMobile={() => setIsMobileOpen(true)}
            role="admin"
            pageTitle="Hospital Admin Portal"
          />

          <main className="p-6 sm:p-10 max-w-4xl w-full mx-auto space-y-6">
            {/* Status Alert Card */}
            <div className={`p-8 rounded-3xl border shadow-xl text-center space-y-5 ${
              isPending
                ? 'bg-gradient-to-b from-amber-50 to-white border-amber-200 shadow-amber-900/5'
                : 'bg-gradient-to-b from-rose-50 to-white border-rose-200 shadow-rose-900/5'
            }`}>
              <div className={`w-20 h-20 rounded-3xl mx-auto flex items-center justify-center shadow-lg ${
                isPending ? 'bg-amber-500 text-white animate-pulse' : 'bg-rose-500 text-white'
              }`}>
                {isPending ? <Clock className="w-10 h-10" /> : <XCircle className="w-10 h-10" />}
              </div>

              <div className="space-y-2 max-w-lg mx-auto">
                <span className={`text-[11px] font-extrabold uppercase px-3 py-1 rounded-full border tracking-wider inline-block ${
                  isPending
                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                    : 'bg-rose-100 text-rose-900 border-rose-300'
                }`}>
                  {isPending ? 'Verification Pending • Access Restricted' : 'Verification Rejected'}
                </span>

                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {isPending
                    ? `Approval Pending for ${adminRecord?.hospitalName || 'Assigned Hospital'}`
                    : `Credentials Rejected for ${adminRecord?.hospitalName || 'Assigned Hospital'}`}
                </h2>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {isPending ? (
                    <>
                      Hello <strong>{adminRecord?.name}</strong>, your hospital admin account has been assigned under the strict 1-to-1 policy, but it is currently <strong>awaiting Super Admin verification</strong>. Hospital queue management, OPD doctors, and appointments remain locked until verified.
                    </>
                  ) : (
                    <>
                      Your administrator request for <strong>{adminRecord?.hospitalName}</strong> was rejected by the Super Admin. Reason: <em className="text-rose-600 font-semibold">{adminRecord?.rejectionReason || 'Documentation criteria not fulfilled.'}</em>
                    </>
                  )}
                </p>
              </div>

              {/* Progress Flow Diagram */}
              <div className="pt-4 max-w-md mx-auto">
                <div className="grid grid-cols-3 gap-2 text-left">
                  <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-sm">
                    <span className="text-[10px] font-bold text-emerald-600 block">Step 1: Done</span>
                    <p className="text-xs font-bold text-slate-800">1-to-1 Assignment</p>
                  </div>
                  <div className={`p-3 rounded-2xl border shadow-sm ${
                    isPending ? 'bg-amber-100 border-amber-300' : 'bg-rose-100 border-rose-300'
                  }`}>
                    <span className="text-[10px] font-bold text-amber-800 block">Step 2: Review</span>
                    <p className="text-xs font-bold text-slate-900">Super Admin Review</p>
                  </div>
                  <div className="p-3 bg-slate-100 rounded-2xl border border-slate-200 opacity-60">
                    <span className="text-[10px] font-bold text-slate-400 block">Step 3: Locked</span>
                    <p className="text-xs font-bold text-slate-500">OPD Dashboard</p>
                  </div>
                </div>
              </div>

              {/* Demonstration Helper Controls */}
              <div className="pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => switchRole('super_admin')}
                  className="w-full sm:w-auto px-5 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Crown className="w-4 h-4" />
                  <span>Switch to Super Admin to Approve ({adminRecord?.name})</span>
                </button>

                <button
                  onClick={() => switchHospitalAdminUser('hadmin-1')}
                  className="w-full sm:w-auto px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <BadgeCheck className="w-4 h-4 text-emerald-400" />
                  <span>Switch to Verified Admin (Rajesh Gupta)</span>
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Safe Analytics Data
  const hourlyData = analyticsData?.hourlyAppointments || [
    { time: '12 AM', appointments: 12 },
    { time: '4 AM', appointments: 8 },
    { time: '8 AM', appointments: 35 },
    { time: '12 PM', appointments: 58 },
    { time: '4 PM', appointments: 42 },
    { time: '8 PM', appointments: 25 },
  ];

  const deptShareData = analyticsData?.departmentShare || [
    { name: 'Cardiology', value: 40, color: '#2563eb' },
    { name: 'General Medicine', value: 30, color: '#10b981' },
    { name: 'Neurology', value: 15, color: '#8b5cf6' },
    { name: 'Orthopedics', value: 10, color: '#f59e0b' },
    { name: 'Others', value: 5, color: '#94a3b8' }
  ];

  const monthlyTrendData = analyticsData?.monthlyTrend || [
    { month: 'Jan', appointments: 210, completed: 185 },
    { month: 'Feb', appointments: 245, completed: 215 },
    { month: 'Mar', appointments: 280, completed: 250 },
    { month: 'Apr', appointments: 300, completed: 270 },
    { month: 'May', appointments: 320, completed: 260 },
  ];

  // Filtered Appointments (Safe from null/undefined)
  const filteredAppointments = (appointments || []).filter(a => {
    if (!a) return false;
    const matchFilter =
      aptFilter === 'All' ? true :
      aptFilter === 'Upcoming' ? (a.status === 'Waiting' || a.status === 'In Consultation') :
      aptFilter === 'Completed' ? a.status === 'Completed' :
      aptFilter === 'Cancelled' ? a.status === 'Cancelled' : true;

    const s = (aptSearch || '').toLowerCase();
    const pName = (a.patientName || '').toLowerCase();
    const dName = (a.doctorName || '').toLowerCase();
    const tok = (a.token || '').toLowerCase();

    const matchSearch = !s || pName.includes(s) || dName.includes(s) || tok.includes(s);
    return matchFilter && matchSearch;
  });

  // Filtered Patients (Safe from null/undefined)
  const filteredPatients = (patients || []).filter(p => {
    if (!p) return false;
    const s = (patientSearch || '').toLowerCase();
    const name = (p.name || '').toLowerCase();
    const phone = String(p.phone || '');
    return !s || name.includes(s) || phone.includes(s);
  });

  // Handle Doctor Add/Edit
  const handleOpenDoctorModal = (doc = null) => {
    if (doc) {
      setEditingDoctor(doc);
      setDoctorForm({
        name: doc.name || '',
        email: doc.email || '',
        password: doc.password || 'Doctor@123',
        specialization: doc.specialization || '',
        department: doc.department || departments[0]?.name || 'Cardiology',
        phone: doc.phone || '',
        room: doc.room || 'Room 302'
      });
    } else {
      setEditingDoctor(null);
      setDoctorForm({
        name: '',
        email: '',
        password: '',
        specialization: '',
        department: departments[0]?.name || 'Cardiology',
        phone: '',
        room: 'Room 101'
      });
    }
    setIsDoctorModalOpen(true);
  };

  const handleSaveDoctor = (e) => {
    e.preventDefault();
    if (editingDoctor) {
      updateDoctor(editingDoctor.id, doctorForm);
    } else {
      addDoctor(doctorForm);
    }
    setIsDoctorModalOpen(false);
  };

  // Handle Department Add/Edit
  const handleOpenDeptModal = (dept = null) => {
    if (dept) {
      setEditingDept(dept);
      setDeptForm({
        name: dept.name || '',
        head: dept.head || '',
        room: dept.room || 'Room 101',
        description: dept.description || ''
      });
    } else {
      setEditingDept(null);
      setDeptForm({
        name: '',
        head: doctors[0]?.name || 'Dr. Arjun Sharma',
        room: 'Room 201',
        description: 'Specialized healthcare division'
      });
    }
    setIsDeptModalOpen(true);
  };

  const handleSaveDepartment = (e) => {
    e.preventDefault();
    if (editingDept) {
      updateDepartment(editingDept.id, deptForm);
    } else {
      addDepartment(deptForm);
    }
    setIsDeptModalOpen(false);
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    addToast('Hospital settings saved successfully!', 'success');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* Dark Navy Sidebar */}
      <Sidebar
        role="admin"
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <Navbar
          onOpenMobile={() => setIsMobileOpen(true)}
          role="admin"
          pageTitle={
            activeTab === 'dashboard' ? 'Admin Dashboard' :
            activeTab === 'doctors' ? 'Manage Doctors' :
            activeTab === 'departments' ? 'Manage Departments' :
            activeTab === 'appointments' ? 'Appointments Management' :
            activeTab === 'patients' ? 'Patients List' :
            activeTab === 'reports' ? 'Reports & Analytics' : 'Hospital Settings'
          }
        />

        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">

          {/* Quick Screen Tabs */}
          <div className="bg-white p-2 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-1.5 overflow-x-auto text-xs font-semibold">
            {[
              { id: 'dashboard', label: '1. Admin Dashboard' },
              { id: 'doctors', label: '2. Manage Doctors' },
              { id: 'departments', label: '3. Manage Departments' },
              { id: 'appointments', label: '4. Appointments Management' },
              { id: 'patients', label: '5. Patients List' },
              { id: 'reports', label: '6. Reports & Analytics' },
              { id: 'settings', label: '7. Settings' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* SECTION 1: Admin Dashboard Overview */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Header Title */}
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  Hospital Overview
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Real-time operational dashboard for City Care Hospital
                </p>
              </div>

              {/* 4 Stat Cards matching reference */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  title="Total Patients"
                  value="250"
                  trend="+12% from yesterday"
                  icon={Users}
                  color="purple"
                />
                <StatCard
                  title="Doctors"
                  value={doctors.length || 25}
                  trend="+2 new"
                  icon={Stethoscope}
                  color="blue"
                />
                <StatCard
                  title="Appointments"
                  value={appointments.length || 180}
                  subtitle="Recorded today"
                  icon={CalendarCheck}
                  color="emerald"
                />
                <StatCard
                  title="Waiting"
                  value={appointments.filter(a => a.status === 'Waiting').length || 40}
                  subtitle="Right now in OPDs"
                  icon={Clock}
                  color="amber"
                />
              </div>

              {/* Analytics Section with Charts matching reference */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Appointment Trends Line Chart (2 cols) */}
                <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-100 shadow-card">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-slate-800 text-sm">Appointment Trends</h3>
                      <p className="text-xs text-slate-400">Hourly patient inflow</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <select className="text-xs font-semibold px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700">
                        <option>Today</option>
                        <option>Yesterday</option>
                        <option>This Week</option>
                      </select>
                    </div>
                  </div>

                  <div className="w-full h-64 pt-2">
                    <ResponsiveContainer width="100%" height={240}>
                      <LineChart data={hourlyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} />
                        <YAxis stroke="#94a3b8" fontSize={11} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#0d1527',
                            borderRadius: '12px',
                            border: 'none',
                            color: '#fff',
                            fontSize: '12px'
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="appointments"
                          stroke="#2563eb"
                          strokeWidth={3}
                          dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Patients by Department Doughnut Chart (1 col) */}
                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">Patients by Department</h3>
                    <p className="text-xs text-slate-400">Departmental breakdown</p>

                    <div className="w-full h-44 mt-2">
                      <ResponsiveContainer width="100%" height={170}>
                        <PieChart>
                          <Pie
                            data={deptShareData}
                            cx="50%"
                            cy="50%"
                            innerRadius={45}
                            outerRadius={65}
                            paddingAngle={4}
                            dataKey="value"
                          >
                            {deptShareData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Legend matching screenshot */}
                  <div className="space-y-1.5 mt-2 text-xs">
                    {deptShareData.map((dept) => (
                      <div key={dept.name} className="flex items-center justify-between text-slate-600">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: dept.color }}
                          />
                          <span className="font-medium">{dept.name}</span>
                        </div>
                        <span className="font-bold text-slate-800">{dept.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* SECTION 2: Manage Doctors */}
          {activeTab === 'doctors' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-card">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Doctors</h2>
                  <p className="text-xs text-slate-500">Manage hospital doctors, departments and schedules.</p>
                </div>

                <button
                  onClick={() => handleOpenDoctorModal()}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 transition-all flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add Doctor</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-y border-slate-100">
                    <tr>
                      <th className="py-3.5 px-4">Name</th>
                      <th className="py-3.5 px-4">Department</th>
                      <th className="py-3.5 px-4">Phone</th>
                      <th className="py-3.5 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {doctors.map((doc) => (
                      <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={doc.avatar}
                              alt={doc.name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                            <div>
                              <p className="font-bold text-slate-900">{doc.name}</p>
                              <span className="text-[11px] text-slate-400">{doc.specialization} ({doc.room})</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                            {doc.department}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 font-medium">
                          {doc.phone}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenDoctorModal(doc)}
                              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit Doctor"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteDoctor(doc.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Delete Doctor"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SECTION 3: Manage Departments */}
          {activeTab === 'departments' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-card">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Departments</h2>
                  <p className="text-xs text-slate-500">Manage hospital clinical departments and rooms.</p>
                </div>

                <button
                  onClick={() => handleOpenDeptModal()}
                  className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-600/20 transition-all flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add Department</span>
                </button>
              </div>

              <div className="divide-y divide-slate-100">
                {departments.map((dept) => (
                  <div
                    key={dept.id}
                    className="py-4 px-3 flex items-center justify-between hover:bg-slate-50 rounded-2xl transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 font-bold">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{dept.name}</h4>
                        <p className="text-xs text-slate-400">{dept.description || 'Clinical care & diagnostics'} • {dept.room}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenDeptModal(dept)}
                        className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-colors"
                        title="Edit Department"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteDepartment(dept.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                        title="Delete Department"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 4: Appointments Management */}
          {activeTab === 'appointments' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-card">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Appointments Management</h2>
                  <p className="text-xs text-slate-500">Live registry of all patient queue tokens and statuses.</p>
                </div>

                {/* Filter Tabs matching reference: All, Upcoming, Completed, Cancelled */}
                <div className="flex items-center gap-1.5 overflow-x-auto">
                  {['All', 'Upcoming', 'Completed', 'Cancelled'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setAptFilter(tab)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        aptFilter === tab
                          ? 'bg-purple-600 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search Bar */}
              <div className="mb-4 relative">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  value={aptSearch}
                  onChange={(e) => setAptSearch(e.target.value)}
                  placeholder="Search token, patient name or doctor..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Table matching reference */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-y border-slate-100">
                    <tr>
                      <th className="py-3.5 px-4">Token</th>
                      <th className="py-3.5 px-4">Patient</th>
                      <th className="py-3.5 px-4">Doctor</th>
                      <th className="py-3.5 px-4">Time</th>
                      <th className="py-3.5 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredAppointments.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="py-8 text-center text-slate-400">
                          No appointments found matching your filter criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredAppointments.map((apt) => (
                        <tr key={apt.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3.5 px-4">
                            <span className="font-black text-slate-900 bg-slate-100 px-2.5 py-1 rounded-xl">
                              {apt.token}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-bold text-slate-800">
                            {apt.patientName}
                          </td>
                          <td className="py-3.5 px-4 text-slate-600">
                            {apt.doctorName}
                          </td>
                          <td className="py-3.5 px-4 text-slate-600 font-medium">
                            {apt.time}
                          </td>
                          <td className="py-3.5 px-4">
                            <StatusBadge status={apt.status} />
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SECTION 5: Patients List */}
          {activeTab === 'patients' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-card">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Patients</h2>
                  <p className="text-xs text-slate-500">All registered patients directory.</p>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={patientSearch}
                    onChange={(e) => setPatientSearch(e.target.value)}
                    placeholder="Search patients..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-y border-slate-100">
                    <tr>
                      <th className="py-3.5 px-4">Name</th>
                      <th className="py-3.5 px-4">Phone</th>
                      <th className="py-3.5 px-4">Total Appointments</th>
                      <th className="py-3.5 px-4 text-right">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredPatients.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="py-8 text-center text-slate-400">
                          No patients found matching your search.
                        </td>
                      </tr>
                    ) : (
                      filteredPatients.map((pat) => (
                        <tr key={pat.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={pat.avatar}
                                alt={pat.name}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                              <div>
                                <p className="font-bold text-slate-900">{pat.name}</p>
                                <span className="text-[11px] text-slate-400">{pat.email}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-slate-600 font-medium">
                            {pat.phone}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-purple-700">
                            {pat.totalAppointments}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => setSelectedPatientModal(pat)}
                              className="font-bold text-purple-600 hover:underline"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SECTION 6: Reports & Analytics */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              {/* Top Summary Bar */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-card">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5 mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Reports & Analytics</h2>
                    <p className="text-xs text-slate-500">Detailed hospital performance metrics and queue audits.</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <select className="text-xs font-semibold px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700">
                      <option>This Month</option>
                      <option>Last Month</option>
                      <option>Year to Date</option>
                    </select>
                    <button
                      onClick={() => addToast('Hospital KPI Report exported to CSV format!', 'success')}
                      className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export</span>
                    </button>
                  </div>
                </div>

                {/* 5 Stats matching reference */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Total Appointments</span>
                    <p className="text-2xl font-black text-slate-900 mt-1">320</p>
                  </div>

                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                    <span className="text-[11px] font-bold text-emerald-700 uppercase">Completed</span>
                    <p className="text-2xl font-black text-emerald-900 mt-1">260</p>
                  </div>

                  <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100">
                    <span className="text-[11px] font-bold text-rose-700 uppercase">Cancelled</span>
                    <p className="text-2xl font-black text-rose-900 mt-1">20</p>
                  </div>

                  <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                    <span className="text-[11px] font-bold text-amber-700 uppercase">No Shows</span>
                    <p className="text-2xl font-black text-amber-900 mt-1">40</p>
                  </div>

                  <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100 col-span-2 lg:col-span-1">
                    <span className="text-[11px] font-bold text-purple-700 uppercase">Avg Waiting Time</span>
                    <p className="text-2xl font-black text-purple-900 mt-1">22 mins</p>
                    <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">-5 mins from last month</span>
                  </div>
                </div>
              </div>

              {/* Monthly Trend Chart */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-card">
                <h3 className="font-bold text-slate-800 text-sm mb-4">Monthly Appointment Trend</h3>
                <div className="w-full h-64 pt-2">
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={monthlyTrendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                      <YAxis stroke="#94a3b8" fontSize={11} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0d1527',
                          borderRadius: '12px',
                          border: 'none',
                          color: '#fff',
                          fontSize: '12px'
                        }}
                      />
                      <Bar dataKey="appointments" fill="#8b5cf6" radius={[6, 6, 0, 0]} name="Booked" />
                      <Bar dataKey="completed" fill="#10b981" radius={[6, 6, 0, 0]} name="Completed" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 7: Hospital Settings */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-card">
                <div className="border-b border-slate-100 pb-4 mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Hospital & System Settings</h2>
                    <p className="text-xs text-slate-500">Configure hospital profile, queue timings, and alerts.</p>
                  </div>
                  <button
                    onClick={resetDemoData}
                    className="px-3.5 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Demo Data</span>
                  </button>
                </div>

                <form onSubmit={handleSaveSettings} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Hospital Name</label>
                      <input
                        type="text"
                        value={hospitalSettings.hospitalName}
                        onChange={(e) => setHospitalSettings({ ...hospitalSettings, hospitalName: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Helpline / Contact Phone</label>
                      <input
                        type="text"
                        value={hospitalSettings.phone}
                        onChange={(e) => setHospitalSettings({ ...hospitalSettings, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Hospital Address</label>
                    <input
                      type="text"
                      value={hospitalSettings.address}
                      onChange={(e) => setHospitalSettings({ ...hospitalSettings, address: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Avg. Consultation Time (Mins)</label>
                      <input
                        type="number"
                        min="2"
                        max="60"
                        value={hospitalSettings.avgConsultationMins}
                        onChange={(e) => setHospitalSettings({ ...hospitalSettings, avgConsultationMins: Number(e.target.value) })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-purple-500"
                      />
                      <span className="text-[10px] text-slate-400 mt-1 block">Used by the smart algorithm to calculate estimated wait times.</span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Token Auto Reset Frequency</label>
                      <select
                        value={hospitalSettings.autoTokenReset}
                        onChange={(e) => setHospitalSettings({ ...hospitalSettings, autoTokenReset: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-purple-500"
                      >
                        <option>Everyday at Midnight</option>
                        <option>Every Shift (8 Hours)</option>
                        <option>Manual Reset Only</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 space-y-3">
                    <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl">
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">Emergency Priority Triage</span>
                        <span className="text-[11px] text-slate-500">Auto-elevates emergency marked patients to the top of the queue.</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={hospitalSettings.emergencyPriorityActive}
                        onChange={(e) => setHospitalSettings({ ...hospitalSettings, emergencyPriorityActive: e.target.checked })}
                        className="w-4 h-4 text-purple-600 rounded"
                      />
                    </div>

                    <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl">
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">Automated SMS & In-App Reminders</span>
                        <span className="text-[11px] text-slate-500">Alerts patients 15 minutes before their token number is called.</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={hospitalSettings.smsAlertsActive}
                        onChange={(e) => setHospitalSettings({ ...hospitalSettings, smsAlertsActive: e.target.checked })}
                        className="w-4 h-4 text-purple-600 rounded"
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-colors shadow-md flex items-center justify-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Hospital Settings</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Doctor Modal (Add/Edit) */}
      <Modal
        isOpen={isDoctorModalOpen}
        onClose={() => setIsDoctorModalOpen(false)}
        title={editingDoctor ? 'Edit Doctor Details' : 'Add New Hospital Doctor'}
      >
        <form onSubmit={handleSaveDoctor} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Doctor Name</label>
            <input
              type="text"
              required
              value={doctorForm.name}
              onChange={(e) => setDoctorForm({ ...doctorForm, name: e.target.value })}
              placeholder="e.g. Dr. Ramesh Kumar"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Specialization</label>
            <input
              type="text"
              required
              value={doctorForm.specialization}
              onChange={(e) => setDoctorForm({ ...doctorForm, specialization: e.target.value })}
              placeholder="e.g. Senior Neurologist"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Department</label>
              <select
                value={doctorForm.department}
                onChange={(e) => setDoctorForm({ ...doctorForm, department: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-500"
              >
                {departments.map(d => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Room / Cabin</label>
              <input
                type="text"
                value={doctorForm.room}
                onChange={(e) => setDoctorForm({ ...doctorForm, room: e.target.value })}
                placeholder="e.g. Room 305"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Phone Number</label>
              <input
                type="text"
                required
                value={doctorForm.phone}
                onChange={(e) => setDoctorForm({ ...doctorForm, phone: e.target.value })}
                placeholder="e.g. 98765 43299"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Doctor Email</label>
              <input
                type="email"
                required
                value={doctorForm.email}
                onChange={(e) => setDoctorForm({ ...doctorForm, email: e.target.value })}
                placeholder="dr.name@citycare.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex items-center justify-between">
              <span>Doctor Portal Login Password</span>
              <span className="text-[10px] text-blue-600 font-semibold normal-case">Required for Doctor Login</span>
            </label>
            <input
              type="text"
              required
              value={doctorForm.password}
              onChange={(e) => setDoctorForm({ ...doctorForm, password: e.target.value })}
              placeholder="Set password for doctor (e.g. Doctor@123)"
              className="w-full px-3.5 py-2.5 rounded-xl border border-blue-200 bg-blue-50/50 text-xs font-mono font-medium focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-[10px] text-slate-500 mt-1">
              🔑 Doctor will use this email & password to sign in to the Doctor Consultation Desk.
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-md mt-2"
          >
            {editingDoctor ? 'Save Changes' : 'Create Doctor Record'}
          </button>
        </form>
      </Modal>

      {/* Department Modal */}
      <Modal
        isOpen={isDeptModalOpen}
        onClose={() => setIsDeptModalOpen(false)}
        title={editingDept ? 'Edit Department' : 'Add New Department'}
      >
        <form onSubmit={handleSaveDepartment} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Department Name</label>
            <input
              type="text"
              required
              value={deptForm.name}
              onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })}
              placeholder="e.g. Pediatrics"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Head of Department</label>
              <input
                type="text"
                value={deptForm.head}
                onChange={(e) => setDeptForm({ ...deptForm, head: e.target.value })}
                placeholder="e.g. Dr. Meena Roy"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Room / Floor</label>
              <input
                type="text"
                value={deptForm.room}
                onChange={(e) => setDeptForm({ ...deptForm, room: e.target.value })}
                placeholder="e.g. Floor 2, Room 204"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Description</label>
            <input
              type="text"
              value={deptForm.description}
              onChange={(e) => setDeptForm({ ...deptForm, description: e.target.value })}
              placeholder="Clinical scope and specialties..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-colors shadow-md mt-2"
          >
            {editingDept ? 'Save Department' : 'Create Department'}
          </button>
        </form>
      </Modal>

      {/* Patient Detail Modal */}
      {selectedPatientModal && (
        <Modal
          isOpen={!!selectedPatientModal}
          onClose={() => setSelectedPatientModal(null)}
          title={`Patient Record — ${selectedPatientModal.name}`}
        >
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
              <img
                src={selectedPatientModal.avatar}
                alt={selectedPatientModal.name}
                className="w-14 h-14 rounded-2xl object-cover"
              />
              <div>
                <h3 className="font-bold text-base text-slate-900">{selectedPatientModal.name}</h3>
                <p className="text-xs text-slate-500">{selectedPatientModal.email}</p>
                <p className="text-xs font-semibold text-purple-600">{selectedPatientModal.phone}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block font-medium">Age & Gender</span>
                <span className="font-bold text-slate-800">{selectedPatientModal.age} Yrs, {selectedPatientModal.gender}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block font-medium">Blood Group</span>
                <span className="font-bold text-slate-800">{selectedPatientModal.bloodGroup}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block font-medium">Total Appointments</span>
                <span className="font-bold text-slate-800">{selectedPatientModal.totalAppointments} Completed</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block font-medium">Emergency Contact</span>
                <span className="font-bold text-slate-800">{selectedPatientModal.emergencyContact}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl text-xs">
              <span className="text-slate-400 block font-medium">Medical History</span>
              <p className="font-medium text-slate-700 mt-0.5">{selectedPatientModal.medicalHistory}</p>
            </div>

            <button
              onClick={() => setSelectedPatientModal(null)}
              className="w-full py-3 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
            >
              Close Record
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};
