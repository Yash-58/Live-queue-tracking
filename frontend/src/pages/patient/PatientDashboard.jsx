import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sidebar } from '../../components/common/Sidebar';
import { Navbar } from '../../components/common/Navbar';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Users,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Bell,
  Lock,
  CreditCard,
  Building,
  Phone,
  Mail,
  ArrowRight,
  ShieldAlert,
  Download,
  CalendarCheck,
  CalendarPlus,
  Activity,
  LogOut
} from 'lucide-react';

export const PatientDashboard = () => {
  const {
    currentUser,
    departments,
    doctors,
    appointments,
    queueState,
    notifications,
    bookAppointment,
    cancelAppointment,
    markAllNotificationsAsRead,
    logout
  } = useApp();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Booking Form State
  const [selectedDept, setSelectedDept] = useState('Cardiology');
  const [selectedDoctorId, setSelectedDoctorId] = useState(doctors[0]?.id || '');
  const [selectedDate, setSelectedDate] = useState('2026-05-20');
  const [selectedSlot, setSelectedSlot] = useState('11:00 AM');
  const [reason, setReason] = useState('Routine Checkup & Consultation');
  const [priority, setPriority] = useState('Normal');

  // Appointment filter tab
  const [aptFilter, setAptFilter] = useState('Upcoming');

  // Appointment details modal
  const [selectedAptDetails, setSelectedAptDetails] = useState(null);

  // Filtered doctors for booking
  const filteredDoctors = doctors.filter(d => !selectedDept || d.department === selectedDept);

  // Time slots
  const timeSlots = [
    '08:00 AM',
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '02:00 PM',
    '03:00 PM'
  ];

  // User's active upcoming appointment
  const userUpcomingApt = appointments.find(
    a => a.status === 'Waiting' || a.status === 'In Consultation'
  ) || appointments[0];

  // Filter appointments for My Appointments tab
  const filteredAppointments = appointments.filter(a => {
    if (aptFilter === 'Upcoming') return a.status === 'Waiting' || a.status === 'In Consultation';
    if (aptFilter === 'Completed') return a.status === 'Completed';
    if (aptFilter === 'Cancelled') return a.status === 'Cancelled';
    return true;
  });

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    bookAppointment({
      department: selectedDept,
      doctorId: selectedDoctorId || filteredDoctors[0]?.id,
      date: selectedDate,
      timeSlot: selectedSlot,
      reason,
      priority
    });
    setActiveTab('live-queue');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* Dark Navy Sidebar */}
      <Sidebar
        role="patient"
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <Navbar
          onOpenMobile={() => setIsMobileOpen(true)}
          role="patient"
          pageTitle={
            activeTab === 'dashboard' ? 'Patient Dashboard' :
            activeTab === 'book' ? 'Book Appointment' :
            activeTab === 'live-queue' ? 'Live Queue Tracking' :
            activeTab === 'appointments' ? 'My Appointments' :
            activeTab === 'notifications' ? 'Notifications' :
            activeTab === 'profile' ? 'My Profile' : 'Settings'
          }
        />

        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">

          {/* Quick Tab Pills for quick multi-screen viewing */}
          <div className="bg-white p-2 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-1.5 overflow-x-auto text-xs font-semibold">
            {[
              { id: 'dashboard', label: '1. Patient Dashboard' },
              { id: 'book', label: '2. Book Appointment' },
              { id: 'live-queue', label: '3. Live Queue Tracking' },
              { id: 'appointments', label: '4. My Appointments' },
              { id: 'notifications', label: '5. Notifications' },
              { id: 'profile', label: '6. Profile' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* SECTION 1: Patient Dashboard Overview */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Welcome Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden">
                <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-10">
                  <Activity className="w-64 h-64 text-white" />
                </div>
                <div className="relative z-10 space-y-1">
                  <span className="text-emerald-200 text-xs font-bold uppercase tracking-wider bg-emerald-500/30 px-3 py-1 rounded-full border border-emerald-400/20">
                    Patient Portal
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-2">
                    Hello, Rahul! 👋
                  </h2>
                  <p className="text-emerald-100 text-sm max-w-md">
                    Take care of your health. Your appointment is scheduled today at City Care Hospital.
                  </p>
                </div>
                <div className="relative z-10 flex gap-3">
                  <button
                    onClick={() => setActiveTab('book')}
                    className="bg-white text-emerald-800 hover:bg-emerald-50 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2"
                  >
                    <CalendarPlus className="w-4 h-4 text-emerald-600" />
                    <span>Book New Slot</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('live-queue')}
                    className="bg-emerald-500/40 hover:bg-emerald-500/60 border border-emerald-300/30 text-white px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2"
                  >
                    <Activity className="w-4 h-4" />
                    <span>Track Live Queue</span>
                  </button>
                </div>
              </div>

              {/* Two Column Layout matching reference */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Upcoming Appointment Card */}
                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Upcoming Appointment
                      </span>
                      <StatusBadge status={userUpcomingApt?.status || 'Waiting'} />
                    </div>

                    <div className="flex items-start gap-4">
                      <img
                        src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80"
                        alt="Dr. Arjun Sharma"
                        className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-50 shadow-sm"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-slate-800 text-base">
                            {userUpcomingApt?.doctorName || 'Dr. Arjun Sharma'}
                          </h3>
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                        </div>
                        <p className="text-emerald-600 text-xs font-semibold">
                          {userUpcomingApt?.doctorSpecialization || 'Cardiologist'}
                        </p>
                        <p className="text-slate-400 text-xs mt-1">
                          {userUpcomingApt?.date || '20 May 2026'} • {userUpcomingApt?.time || '11:00 AM'}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-slate-400" />
                        <span className="font-medium">{userUpcomingApt?.hospital || 'City Care Hospital'}</span>
                      </div>
                      <span className="font-semibold text-slate-500">Room 302</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => setSelectedAptDetails(userUpcomingApt)}
                      className="text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100/80 px-4 py-2 rounded-xl transition-colors"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => cancelAppointment(userUpcomingApt?.id)}
                      className="text-xs font-semibold text-rose-500 hover:text-rose-600 px-3 py-2"
                    >
                      Cancel Appointment
                    </button>
                  </div>
                </div>

                {/* Token & Waiting Time Card */}
                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                          Your Token
                        </span>
                        <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-1 flex items-center gap-3">
                          <span>{queueState.patientToken || 'A-24'}</span>
                          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-200">
                            Waiting
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[11px] font-semibold text-slate-400 block">Current Token</span>
                        <span className="text-xl font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-100 inline-block mt-0.5">
                          {queueState.currentlyServing?.token || 'A-19'}
                        </span>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 mt-5">
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                        <span className="text-xs text-slate-400 font-medium">People Ahead</span>
                        <p className="text-2xl font-extrabold text-slate-800 mt-0.5">
                          {queueState.peopleAhead}
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100">
                        <span className="text-xs text-emerald-700 font-medium">Estimated Wait</span>
                        <p className="text-2xl font-extrabold text-emerald-800 mt-0.5">
                          {queueState.estimatedWaitMins} <span className="text-sm font-semibold">mins</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 p-3 rounded-2xl bg-blue-50/60 border border-blue-100/80 flex items-center gap-3">
                    <Bell className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <p className="text-xs text-blue-700 font-medium">
                      We will notify you via SMS & real-time alert when it's your turn.
                    </p>
                  </div>
                </div>

              </div>

              {/* Live Queue Mini-Preview */}
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-emerald-600" />
                    <h3 className="font-bold text-slate-800 text-sm">Live Queue Status (Cardiology)</h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('live-queue')}
                    className="text-xs font-semibold text-emerald-600 hover:underline flex items-center gap-1"
                  >
                    <span>Full Live View</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200/80">
                    <span className="text-[10px] uppercase font-bold text-emerald-700 block">Serving Now</span>
                    <p className="text-lg font-black text-emerald-800">{queueState.currentlyServing?.token || 'A-19'}</p>
                    <p className="text-xs text-slate-600 truncate">{queueState.currentlyServing?.patientName}</p>
                  </div>

                  {queueState.liveQueue.slice(0, 3).map((item, idx) => (
                    <div key={item.token} className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Queue #{idx + 1}</span>
                      <p className="text-lg font-black text-slate-800">{item.token}</p>
                      <p className="text-xs text-slate-600 truncate">{item.patientName}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: Book Appointment */}
          {activeTab === 'book' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-card max-w-3xl mx-auto">
              <div className="border-b border-slate-100 pb-5 mb-6">
                <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold uppercase tracking-wider">
                  <CalendarPlus className="w-4 h-4" />
                  <span>Online Appointment Portal</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mt-1">Book Appointment</h2>
                <p className="text-xs text-slate-500">
                  Fill the details below to generate your digital OPD token and smart wait estimation.
                </p>
              </div>

              <form onSubmit={handleBookingSubmit} className="space-y-6">
                {/* Department Selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Select Department
                  </label>
                  <select
                    value={selectedDept}
                    onChange={(e) => {
                      setSelectedDept(e.target.value);
                      const docs = doctors.filter(d => d.department === e.target.value);
                      if (docs.length > 0) setSelectedDoctorId(docs[0].id);
                    }}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-medium"
                  >
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.name}>
                        {dept.name} ({dept.room})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Doctor Selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Select Doctor
                  </label>
                  <select
                    value={selectedDoctorId}
                    onChange={(e) => setSelectedDoctorId(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-medium"
                  >
                    {filteredDoctors.map((doc) => (
                      <option key={doc.id} value={doc.id}>
                        {doc.name} — {doc.specialization} ({doc.room})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date Selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Select Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-medium"
                  />
                </div>

                {/* Time Slots */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Select Time Slot
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {timeSlots.map((slot) => {
                      const isSelected = selectedSlot === slot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedSlot(slot)}
                          className={`py-3 px-4 rounded-2xl text-xs font-bold border transition-all ${
                            isSelected
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Reason / Priority */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Reason for Visit
                    </label>
                    <input
                      type="text"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="e.g. Chest pain, Consultation"
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Priority Category
                    </label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                    >
                      <option value="Normal">Normal Consultation</option>
                      <option value="Senior Citizen">Senior Citizen Priority</option>
                      <option value="Emergency">Emergency / Acute</option>
                    </select>
                  </div>
                </div>

                {/* Confirm Booking Button */}
                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm tracking-wide shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Confirm Booking & Generate Digital Token</span>
                </button>
              </form>
            </div>
          )}

          {/* SECTION 3: Live Queue Tracking */}
          {activeTab === 'live-queue' && (
            <div className="space-y-6">
              {/* Header Info */}
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                        Real-Time Updates Active
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                      City Care Hospital • Cardiology
                    </h2>
                    <p className="text-xs text-slate-500">
                      Live Queue monitoring connected to OPD Room 302
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-slate-500">Avg. Consultation Time:</span>
                    <span className="text-xs font-bold text-slate-800 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                      8 mins / patient
                    </span>
                  </div>
                </div>
              </div>

              {/* Two Column Live Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Currently Serving Banner Card */}
                <div className="bg-gradient-to-br from-emerald-600 to-teal-800 rounded-3xl p-7 text-white shadow-xl flex flex-col justify-between relative overflow-hidden">
                  <div className="relative z-10">
                    <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full">
                      Currently Serving
                    </span>
                    <div className="mt-4">
                      <span className="text-5xl sm:text-6xl font-black tracking-tight">
                        {queueState.currentlyServing?.token || 'A-19'}
                      </span>
                      <p className="text-emerald-100 font-semibold text-lg mt-1">
                        {queueState.currentlyServing?.patientName || 'Amit Verma'}
                      </p>
                      <p className="text-xs text-emerald-200 mt-0.5">
                        Attending Doctor: {queueState.currentlyServing?.doctor || 'Dr. Arjun Sharma'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 pt-4 border-t border-white/20 flex items-center justify-between text-xs text-emerald-100">
                    <span>Started: {queueState.currentlyServing?.timeStarted || '11:15 AM'}</span>
                    <span className="bg-white/20 px-2.5 py-1 rounded-lg font-bold">Room 302</span>
                  </div>
                </div>

                {/* Patient's Token Card */}
                <div className="bg-white rounded-3xl p-7 border border-slate-100 shadow-card flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Your Token
                      </span>
                      <StatusBadge status="Waiting" />
                    </div>

                    <div className="mt-3">
                      <span className="text-5xl sm:text-6xl font-black text-slate-900 tracking-tight">
                        {queueState.patientToken || 'A-24'}
                      </span>
                      <p className="text-sm font-semibold text-slate-600 mt-1">
                        Patient: {currentUser?.name || 'Rahul Verma'}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                        <span className="text-[11px] text-slate-400 font-medium">People Ahead</span>
                        <p className="text-2xl font-black text-slate-800 mt-0.5">
                          {queueState.peopleAhead}
                        </p>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100">
                        <span className="text-[11px] text-emerald-700 font-medium">Estimated Wait</span>
                        <p className="text-2xl font-black text-emerald-800 mt-0.5">
                          {queueState.estimatedWaitMins} <span className="text-xs font-semibold">mins</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-3 rounded-2xl bg-amber-50 border border-amber-200/60 text-xs text-amber-800 font-medium">
                    ⚡ Please be seated in the Waiting Lounge A. You will be called soon.
                  </div>
                </div>

              </div>

              {/* Live Queue Table / List */}
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-800 text-sm">Full Live Queue (Next in line)</h3>
                  <span className="text-xs text-slate-400 font-medium">
                    {queueState.liveQueue.length} Patients in Queue
                  </span>
                </div>

                <div className="divide-y divide-slate-100">
                  {queueState.liveQueue.map((item, index) => {
                    const isMyToken = item.token === queueState.patientToken;
                    return (
                      <div
                        key={item.token}
                        className={`py-3.5 px-3 flex items-center justify-between rounded-2xl transition-colors ${
                          isMyToken ? 'bg-emerald-50/80 border border-emerald-200 font-semibold' : 'hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <span className="text-xs font-bold text-slate-400 w-6">#{index + 1}</span>
                          <span className="text-base font-black text-slate-800 bg-slate-100 px-3 py-1 rounded-xl">
                            {item.token}
                          </span>
                          <div>
                            <p className="text-xs font-bold text-slate-800">
                              {item.patientName} {isMyToken && <span className="text-emerald-600">(You)</span>}
                            </p>
                            <span className="text-[11px] text-slate-400">Cardiology OPD</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {item.priority === 'Emergency' && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                              Priority
                            </span>
                          )}
                          <StatusBadge status={item.status} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: My Appointments */}
          {activeTab === 'appointments' && (
            <div className="space-y-6">
              {/* Tabs */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  {['Upcoming', 'Completed', 'Cancelled'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setAptFilter(tab)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        aptFilter === tab
                          ? 'bg-slate-900 text-white shadow-sm'
                          : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setActiveTab('book')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm flex items-center gap-2"
                >
                  <CalendarPlus className="w-4 h-4" />
                  <span>Book New</span>
                </button>
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredAppointments.length === 0 ? (
                  <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-slate-100">
                    <CalendarCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-600 font-bold text-sm">No {aptFilter.toLowerCase()} appointments found</p>
                    <p className="text-xs text-slate-400 mt-1">Book an appointment to receive a digital token.</p>
                  </div>
                ) : (
                  filteredAppointments.map((apt) => (
                    <div
                      key={apt.id}
                      className="bg-white rounded-3xl p-5 border border-slate-100 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-lg font-black text-slate-900 bg-slate-100 px-3 py-1 rounded-xl">
                            {apt.token}
                          </span>
                          <StatusBadge status={apt.status} />
                        </div>

                        <div className="space-y-1">
                          <h4 className="font-bold text-slate-800 text-sm">{apt.doctorName}</h4>
                          <p className="text-xs text-emerald-600 font-semibold">{apt.department}</p>
                          <p className="text-xs text-slate-400">{apt.hospital}</p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>{apt.date}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>{apt.time}</span>
                          </div>
                        </div>

                        {apt.reason && (
                          <div className="mt-3 text-[11px] text-slate-500 bg-slate-50 p-2 rounded-xl">
                            Reason: {apt.reason}
                          </div>
                        )}
                      </div>

                      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <button
                          onClick={() => setSelectedAptDetails(apt)}
                          className="text-xs font-bold text-emerald-600 hover:underline"
                        >
                          View Details
                        </button>
                        {apt.status === 'Waiting' && (
                          <button
                            onClick={() => cancelAppointment(apt.id)}
                            className="text-xs font-semibold text-rose-500 hover:text-rose-600"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* SECTION 5: Notifications */}
          {activeTab === 'notifications' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-card max-w-3xl mx-auto">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Notifications</h2>
                  <p className="text-xs text-slate-500">Real-time alerts regarding your token and queue updates.</p>
                </div>
                <button
                  onClick={markAllNotificationsAsRead}
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl transition-colors"
                >
                  Mark all as read
                </button>
              </div>

              <div className="divide-y divide-slate-100">
                {notifications.map((notif) => {
                  let iconColor = 'text-blue-500 bg-blue-50';
                  if (notif.type === 'token') iconColor = 'text-emerald-600 bg-emerald-50';
                  if (notif.type === 'serving') iconColor = 'text-amber-600 bg-amber-50';
                  if (notif.type === 'reminder') iconColor = 'text-purple-600 bg-purple-50';

                  return (
                    <div
                      key={notif.id}
                      className={`py-4 px-3 flex items-start gap-4 rounded-2xl transition-colors ${
                        notif.unread ? 'bg-emerald-50/30' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${iconColor}`}>
                        <Bell className="w-5 h-5" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-slate-800">{notif.title}</h4>
                          <span className="text-[11px] text-slate-400">{notif.time}</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5">{notif.message}</p>
                      </div>

                      {notif.unread && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SECTION 6: Profile & Settings */}
          {(activeTab === 'profile' || activeTab === 'settings') && (
            <div className="max-w-2xl mx-auto space-y-6">
              {/* Profile Header Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-card text-center relative">
                <img
                  src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                  alt={currentUser?.name}
                  className="w-24 h-24 rounded-3xl object-cover mx-auto ring-4 ring-emerald-50 shadow-md"
                />
                <h2 className="text-xl font-bold text-slate-900 mt-4">{currentUser?.name || 'Rahul Verma'}</h2>
                <p className="text-xs text-slate-400">{currentUser?.email || 'rahulverma@gmail.com'}</p>
                <p className="text-xs font-semibold text-emerald-600 mt-1">{currentUser?.phone || '+91 98765 43210'}</p>

                <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-slate-100">
                  <div className="p-3 bg-slate-50 rounded-2xl">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Age</span>
                    <p className="text-sm font-bold text-slate-800">28 Yrs</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-2xl">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Blood</span>
                    <p className="text-sm font-bold text-slate-800">O+</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-2xl">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Total Visits</span>
                    <p className="text-sm font-bold text-slate-800">12</p>
                  </div>
                </div>
              </div>

              {/* Profile Navigation Options matching reference */}
              <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-card divide-y divide-slate-100">
                {[
                  { label: 'Personal Information', icon: User, desc: 'Age, gender, blood group and emergency contact' },
                  { label: 'Change Password', icon: Lock, desc: 'Update login credentials and 2FA' },
                  { label: 'Address', icon: MapPin, desc: '42, Park Avenue, Sector 15, New Delhi' },
                  { label: 'Payment Methods', icon: CreditCard, desc: 'UPI, credit cards, insurance policy' },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.label}
                      onClick={() => alert(`${item.label} settings saved`)}
                      className="w-full flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800">{item.label}</p>
                          <p className="text-[11px] text-slate-400">{item.desc}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </button>
                  );
                })}

                <button
                  onClick={() => {
                    logout();
                  }}
                  className="w-full flex items-center justify-between p-4 hover:bg-rose-50 rounded-2xl transition-colors text-left text-rose-600 font-bold text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
                      <LogOut className="w-5 h-5" />
                    </div>
                    <span>Logout</span>
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Appointment Details Modal */}
      {selectedAptDetails && (
        <Modal
          isOpen={!!selectedAptDetails}
          onClose={() => setSelectedAptDetails(null)}
          title={`Appointment Details - Token ${selectedAptDetails.token}`}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
              <div>
                <span className="text-xs text-emerald-800 font-semibold">Token Number</span>
                <p className="text-3xl font-black text-emerald-900">{selectedAptDetails.token}</p>
              </div>
              <StatusBadge status={selectedAptDetails.status} size="md" />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 font-medium block">Doctor</span>
                <span className="font-bold text-slate-800">{selectedAptDetails.doctorName}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 font-medium block">Department</span>
                <span className="font-bold text-slate-800">{selectedAptDetails.department}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 font-medium block">Hospital</span>
                <span className="font-bold text-slate-800">{selectedAptDetails.hospital}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 font-medium block">Schedule</span>
                <span className="font-bold text-slate-800">{selectedAptDetails.date} • {selectedAptDetails.time}</span>
              </div>
            </div>

            {selectedAptDetails.reason && (
              <div className="p-3 bg-slate-50 rounded-xl text-xs">
                <span className="text-slate-400 font-medium block">Reason for Visit</span>
                <span className="font-medium text-slate-700">{selectedAptDetails.reason}</span>
              </div>
            )}

            <button
              onClick={() => setSelectedAptDetails(null)}
              className="w-full py-3 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
            >
              Close
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

