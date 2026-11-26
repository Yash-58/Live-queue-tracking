import React, { useState, useEffect } from 'react';
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
  Building2,
  Phone,
  Mail,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  Download,
  CalendarCheck,
  CalendarPlus,
  CalendarX,
  Activity,
  LogOut,
  Search,
  Star,
  Edit3,
  Save,
  Check,
  X,
  Hospital,
  AlertTriangle,
  HeartPulse,
  Share2,
  ExternalLink,
  QrCode
} from 'lucide-react';

export const PatientDashboard = () => {
  const {
    currentUser,
    departments,
    doctors,
    appointments,
    queueState,
    notifications,
    hospitals,
    updateUserProfile,
    bookAppointment,
    cancelAppointment,
    markAllNotificationsAsRead,
    logout
  } = useApp();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Hospital Selection & Search State
  const [hospitalSearch, setHospitalSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('All');
  const [selectedHospitalForBooking, setSelectedHospitalForBooking] = useState(
    hospitals[0]?.name || 'City Care Multispeciality Hospital'
  );

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

  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: currentUser?.name || 'Rahul Verma',
    email: currentUser?.email || 'rahulverma@gmail.com',
    phone: currentUser?.phone || '+91 98765 43210',
    age: currentUser?.age || 28,
    gender: currentUser?.gender || 'Male',
    bloodGroup: currentUser?.bloodGroup || 'O+',
    address: currentUser?.address || '42, Park Avenue, Sector 15, New Delhi',
    emergencyContact: currentUser?.emergencyContact || '+91 98765 11223 (Father)',
    allergies: currentUser?.allergies || 'Penicillin, Dust mites',
    medicalHistory: currentUser?.medicalHistory || 'Mild hypertension managed with lifestyle, childhood asthma (resolved).'
  });

  // Track which active booked appointment is currently selected in Live Queue tab
  const [selectedBookedAptId, setSelectedBookedAptId] = useState('');

  // Keep profile form in sync if currentUser changes
  useEffect(() => {
    if (currentUser) {
      setProfileForm(prev => ({
        ...prev,
        name: currentUser.name || prev.name,
        email: currentUser.email || prev.email,
        phone: currentUser.phone || prev.phone,
        age: currentUser.age || prev.age,
        gender: currentUser.gender || prev.gender,
        bloodGroup: currentUser.bloodGroup || prev.bloodGroup,
        address: currentUser.address || prev.address
      }));
    }
  }, [currentUser]);

  // Filtered doctors for booking
  const filteredDoctors = doctors.filter(d => !selectedDept || d.department === selectedDept);

  // Time slots
  const timeSlots = [
    '08:00 AM',
    '09:30 AM',
    '10:30 AM',
    '11:00 AM',
    '12:00 PM',
    '02:00 PM',
    '03:30 PM',
    '04:30 PM'
  ];

  // 1. Patient's own appointments
  const myAppointments = appointments.filter(
    a => a.patientId === currentUser?.id || a.patientName?.toLowerCase() === currentUser?.name?.toLowerCase()
  );

  // 2. Patient's active booked appointments (Waiting or In Consultation)
  const myActiveBookedAppointments = myAppointments.filter(
    a => a.status === 'Waiting' || a.status === 'In Consultation'
  );

  // Auto-select first active appointment if not explicitly chosen
  const activeTrackedApt = myActiveBookedAppointments.find(a => a.id === selectedBookedAptId) || myActiveBookedAppointments[0] || null;

  // Strict hospital & department queue computation for the selected booked appointment
  const currentHospitalQueue = activeTrackedApt
    ? appointments.filter(
        a => (a.hospital === activeTrackedApt.hospital || a.hospital?.includes(activeTrackedApt.hospital)) &&
             a.department === activeTrackedApt.department &&
             (a.status === 'Waiting' || a.status === 'In Consultation')
      )
    : [];

  const currentlyServingInHospital = currentHospitalQueue.find(a => a.status === 'In Consultation') || {
    token: 'A-19',
    patientName: 'Serving Patient',
    doctorName: activeTrackedApt?.doctorName || 'Dr. Arjun Sharma'
  };

  const waitingListInHospital = currentHospitalQueue.filter(a => a.status === 'Waiting');

  // Calculate people ahead of this patient's token in that specific hospital queue
  const myTokenIndex = activeTrackedApt
    ? waitingListInHospital.findIndex(a => a.token === activeTrackedApt.token)
    : -1;
  const peopleAheadCount = myTokenIndex >= 0 ? myTokenIndex : 0;
  const estimatedWaitMins = Math.max(0, peopleAheadCount * 8);

  // Filtered hospitals list for the Registered Hospitals tab
  const filteredHospitals = (hospitals || []).filter(hosp => {
    const matchesSearch = hosp.name.toLowerCase().includes(hospitalSearch.toLowerCase()) ||
                          hosp.code?.toLowerCase().includes(hospitalSearch.toLowerCase()) ||
                          hosp.city.toLowerCase().includes(hospitalSearch.toLowerCase());
    const matchesCity = cityFilter === 'All' || hosp.city === cityFilter;
    return matchesSearch && matchesCity;
  });

  // Unique cities from hospitals
  const uniqueCities = ['All', ...new Set((hospitals || []).map(h => h.city))];

  // Filter appointments for My Appointments tab
  const filteredAppointments = myAppointments.filter(a => {
    if (aptFilter === 'Upcoming') return a.status === 'Waiting' || a.status === 'In Consultation';
    if (aptFilter === 'Completed') return a.status === 'Completed';
    if (aptFilter === 'Cancelled') return a.status === 'Cancelled';
    return true;
  });

  // Handle Booking Submit
  const handleBookingSubmit = (e) => {
    e.preventDefault();
    const newApt = bookAppointment({
      hospital: selectedHospitalForBooking,
      department: selectedDept,
      doctorId: selectedDoctorId || filteredDoctors[0]?.id,
      date: selectedDate,
      timeSlot: selectedSlot,
      reason,
      priority
    });
    if (newApt?.id) {
      setSelectedBookedAptId(newApt.id);
    }
    setActiveTab('live-queue');
  };

  // Handle Profile Save
  const handleProfileSave = (e) => {
    e.preventDefault();
    updateUserProfile(profileForm);
    setIsEditingProfile(false);
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
          onNavigateTab={setActiveTab}
          pageTitle={
            activeTab === 'dashboard' ? 'Patient Dashboard' :
            activeTab === 'hospitals' ? 'Registered Hospitals Directory' :
            activeTab === 'book' ? 'Book OPD Appointment' :
            activeTab === 'live-queue' ? 'Live Queue Tracking' :
            activeTab === 'appointments' ? 'My Appointments' :
            activeTab === 'notifications' ? 'Notifications' :
            activeTab === 'profile' ? 'My Health Profile & ABHA' : 'Settings'
          }
        />

        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">

          {/* Quick Tab Pills for quick multi-screen navigation */}
          <div className="bg-white p-2 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-1.5 overflow-x-auto text-xs font-semibold">
            {[
              { id: 'dashboard', label: '1. Patient Dashboard' },
              { id: 'hospitals', label: '2. Registered Hospitals', count: (hospitals || []).length },
              { id: 'book', label: '3. Book Appointment' },
              { id: 'live-queue', label: '4. Live Queue Tracking', badge: activeTrackedApt?.token },
              { id: 'appointments', label: '5. My Appointments', count: myAppointments.length },
              { id: 'notifications', label: '6. Notifications' },
              { id: 'profile', label: '7. Profile & Health ID' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activeTab === tab.id
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
                {tab.badge && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950 animate-pulse">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* ========================================================= */}
          {/* SECTION 1: Patient Dashboard Overview                     */}
          {/* ========================================================= */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Welcome Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-emerald-600 via-teal-700 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden">
                <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-10">
                  <Activity className="w-64 h-64 text-white" />
                </div>
                <div className="relative z-10 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-200 text-xs font-bold uppercase tracking-wider bg-emerald-500/30 px-3 py-1 rounded-full border border-emerald-400/20">
                      National Health Authority • Patient Portal
                    </span>
                    <span className="text-xs font-mono bg-white/10 px-2 py-0.5 rounded-md">
                      ABHA: 9824-2026-9011
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-2">
                    Welcome back, {currentUser?.name || 'Rahul'}! 👋
                  </h2>
                  <p className="text-emerald-100 text-sm max-w-lg">
                    Manage your hospital OPD visits, explore {hospitals.length} registered hospitals across India, and track your booked live tokens in real time.
                  </p>
                </div>
                <div className="relative z-10 flex flex-wrap gap-2.5">
                  <button
                    onClick={() => setActiveTab('hospitals')}
                    className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-3.5 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all flex items-center gap-1.5"
                  >
                    <Building2 className="w-4 h-4 text-emerald-300" />
                    <span>Explore Hospitals</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('book')}
                    className="bg-white text-emerald-800 hover:bg-emerald-50 px-4 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                  >
                    <CalendarPlus className="w-4 h-4 text-emerald-600" />
                    <span>Book New Slot</span>
                  </button>
                  {activeTrackedApt && (
                    <button
                      onClick={() => setActiveTab('live-queue')}
                      className="bg-amber-400 hover:bg-amber-300 text-slate-950 px-4 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-1.5 animate-pulse"
                    >
                      <Activity className="w-4 h-4" />
                      <span>Track Token {activeTrackedApt.token}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Two Column Layout: Upcoming Appointment & Live Token */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Upcoming Booked Appointment Card */}
                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <CalendarCheck className="w-4 h-4 text-emerald-600" />
                        <span>Active Booked Appointment</span>
                      </span>
                      {activeTrackedApt ? (
                        <StatusBadge status={activeTrackedApt.status} />
                      ) : (
                        <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                          No Active Bookings
                        </span>
                      )}
                    </div>

                    {activeTrackedApt ? (
                      <>
                        <div className="flex items-start gap-4">
                          <img
                            src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80"
                            alt={activeTrackedApt.doctorName}
                            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-50 shadow-sm"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="font-bold text-slate-800 text-base">
                                {activeTrackedApt.doctorName}
                              </h3>
                              <span className="text-base font-black text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-100">
                                {activeTrackedApt.token}
                              </span>
                            </div>
                            <p className="text-emerald-600 text-xs font-semibold">
                              {activeTrackedApt.doctorSpecialization || activeTrackedApt.department}
                            </p>
                            <p className="text-slate-400 text-xs mt-1">
                              {activeTrackedApt.date} • {activeTrackedApt.time}
                            </p>
                          </div>
                        </div>

                        <div className="mt-5 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs text-slate-600">
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-slate-400" />
                            <span className="font-semibold text-slate-800">{activeTrackedApt.hospital}</span>
                          </div>
                          <span className="font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                            OPD Room 302
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="py-8 text-center space-y-2">
                        <CalendarX className="w-10 h-10 text-slate-300 mx-auto" />
                        <p className="text-sm font-bold text-slate-700">No upcoming appointment scheduled</p>
                        <p className="text-xs text-slate-400 max-w-xs mx-auto">
                          Select any registered hospital below to schedule a consultation and receive your live queue token.
                        </p>
                        <button
                          onClick={() => setActiveTab('hospitals')}
                          className="mt-2 text-xs font-bold text-emerald-600 hover:text-emerald-700 underline"
                        >
                          Explore Registered Hospitals →
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    {activeTrackedApt ? (
                      <>
                        <button
                          onClick={() => setSelectedAptDetails(activeTrackedApt)}
                          className="text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100/80 px-4 py-2 rounded-xl transition-colors"
                        >
                          View Appointment Slip
                        </button>
                        <button
                          onClick={() => cancelAppointment(activeTrackedApt.id)}
                          className="text-xs font-semibold text-rose-500 hover:text-rose-600 px-3 py-2"
                        >
                          Cancel Appointment
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setActiveTab('book')}
                        className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors"
                      >
                        Book Appointment Now
                      </button>
                    )}
                  </div>
                </div>

                {/* Booked Hospital Queue Status Card */}
                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                          Your Active Token
                        </span>
                        <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-1 flex items-center gap-3">
                          <span>{activeTrackedApt?.token || 'None'}</span>
                          {activeTrackedApt && (
                            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                              {activeTrackedApt.status}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[11px] font-semibold text-slate-400 block">Serving Now</span>
                        <span className="text-xl font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-100 inline-block mt-0.5">
                          {currentlyServingInHospital?.token || 'A-19'}
                        </span>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 mt-5">
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                        <span className="text-xs text-slate-400 font-medium">People Ahead of You</span>
                        <p className="text-2xl font-extrabold text-slate-800 mt-0.5">
                          {peopleAheadCount}
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100">
                        <span className="text-xs text-emerald-700 font-medium">Estimated Wait Time</span>
                        <p className="text-2xl font-extrabold text-emerald-800 mt-0.5">
                          {estimatedWaitMins} <span className="text-sm font-semibold">mins</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 p-3 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-center justify-between gap-3 text-xs text-blue-700">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <span>{activeTrackedApt ? `Hospital: ${activeTrackedApt.hospital}` : 'SMS & Real-time queue alerts are active'}</span>
                    </div>
                    {activeTrackedApt && (
                      <button
                        onClick={() => setActiveTab('live-queue')}
                        className="font-bold underline text-blue-800 whitespace-nowrap"
                      >
                        Open Queue
                      </button>
                    )}
                  </div>
                </div>

              </div>

              {/* SECTION: Registered Hospitals Carousel / Grid on Dashboard */}
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-emerald-600" />
                      <h3 className="font-bold text-slate-900 text-base">Registered Network Hospitals ({hospitals.length})</h3>
                    </div>
                    <p className="text-xs text-slate-500">
                      Hospitals registered and verified under the National Health Authority multi-portal system.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('hospitals')}
                    className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 hover:underline"
                  >
                    <span>View All Hospitals Directory</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {hospitals.slice(0, 3).map((hosp) => {
                    const hasMyBooking = myActiveBookedAppointments.some(
                      a => a.hospital === hosp.name || a.hospital?.includes(hosp.name)
                    );

                    return (
                      <div
                        key={hosp.id}
                        className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                          hasMyBooking
                            ? 'bg-emerald-50/40 border-emerald-300 ring-2 ring-emerald-500/20'
                            : 'bg-slate-50/60 hover:bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-900 text-white">
                              {hosp.code}
                            </span>
                            <div className="flex items-center gap-1 text-xs font-bold text-amber-600">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              <span>{hosp.rating || 4.8}</span>
                            </div>
                          </div>

                          <h4 className="font-bold text-slate-900 text-sm leading-snug">
                            {hosp.name}
                          </h4>
                          <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                            <span className="truncate">{hosp.city} • {hosp.address}</span>
                          </p>

                          <div className="mt-3 flex items-center gap-3 text-[11px] font-medium text-slate-600">
                            <span>🛏️ {hosp.beds} Beds</span>
                            <span>👨‍⚕️ {hosp.doctorsCount || 15} Doctors</span>
                            <span>🏥 {hosp.departmentsCount || 6} OPDs</span>
                          </div>

                          {hasMyBooking && (
                            <div className="mt-3 px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>You have an active appointment here!</span>
                            </div>
                          )}
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedHospitalForBooking(hosp.name);
                              setActiveTab('book');
                            }}
                            className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors text-center"
                          >
                            Book Token
                          </button>
                          {hasMyBooking && (
                            <button
                              onClick={() => {
                                const matched = myActiveBookedAppointments.find(
                                  a => a.hospital === hosp.name || a.hospital?.includes(hosp.name)
                                );
                                if (matched) setSelectedBookedAptId(matched.id);
                                setActiveTab('live-queue');
                              }}
                              className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl transition-colors"
                              title="Track Live Queue"
                            >
                              <Activity className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* SECTION 2: REGISTERED HOSPITALS DIRECTORY OF PATIENT      */}
          {/* ========================================================= */}
          {activeTab === 'hospitals' && (
            <div className="space-y-6">
              {/* Header Banner */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-card">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                      National Health Authority Registered Network
                    </span>
                    <h2 className="text-2xl font-extrabold text-slate-900 mt-2">
                      Registered Hospitals Directory
                    </h2>
                    <p className="text-xs text-slate-500 mt-1 max-w-xl">
                      Browse all hospitals registered in the MediQueue network. View bed capacity, contact details, and book your OPD token with real-time queue tracking.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="px-4 py-2.5 bg-emerald-50 rounded-2xl border border-emerald-100 text-center">
                      <span className="text-[10px] uppercase font-bold text-emerald-700 block">Total Network</span>
                      <span className="text-xl font-black text-emerald-900">{hospitals.length} Hospitals</span>
                    </div>
                  </div>
                </div>

                {/* Search & City Filter Bar */}
                <div className="mt-6 flex flex-col md:flex-row items-center gap-3 pt-5 border-t border-slate-100">
                  <div className="relative flex-1 w-full">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search hospital by name, code, or city..."
                      value={hospitalSearch}
                      onChange={(e) => setHospitalSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                    />
                  </div>

                  <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
                    {uniqueCities.map(city => (
                      <button
                        key={city}
                        onClick={() => setCityFilter(city)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                          cityFilter === city
                            ? 'bg-slate-900 text-white shadow-sm'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Hospital Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredHospitals.length === 0 ? (
                  <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-slate-100">
                    <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-600 font-bold text-sm">No hospitals match your search criteria</p>
                    <p className="text-xs text-slate-400 mt-1">Try clearing filters or searching with another keyword.</p>
                  </div>
                ) : (
                  filteredHospitals.map((hosp) => {
                    const hasMyBooking = myActiveBookedAppointments.some(
                      a => a.hospital === hosp.name || a.hospital?.includes(hosp.name)
                    );
                    const myAptAtThisHosp = myActiveBookedAppointments.find(
                      a => a.hospital === hosp.name || a.hospital?.includes(hosp.name)
                    );

                    return (
                      <div
                        key={hosp.id}
                        className={`bg-white rounded-3xl p-6 border shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between ${
                          hasMyBooking ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-100'
                        }`}
                      >
                        <div>
                          {/* Card Header */}
                          <div className="flex items-center justify-between mb-3">
                            <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-slate-900 text-white">
                              {hosp.code}
                            </span>
                            <div className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              <span>{hosp.rating || 4.8} / 5.0</span>
                            </div>
                          </div>

                          <h3 className="font-bold text-slate-900 text-base leading-snug">
                            {hosp.name}
                          </h3>

                          <p className="text-xs text-slate-500 flex items-start gap-1.5 mt-2">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                            <span>{hosp.address}</span>
                          </p>

                          <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1.5">
                            <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                            <a href={`tel:${hosp.phone}`} className="hover:text-emerald-600 font-medium">{hosp.phone}</a>
                          </p>

                          {/* Stats Chips */}
                          <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100 text-center">
                            <div className="p-2 bg-slate-50 rounded-xl">
                              <span className="text-[10px] text-slate-400 font-bold block uppercase">Beds</span>
                              <span className="text-xs font-black text-slate-800">{hosp.beds}</span>
                            </div>
                            <div className="p-2 bg-slate-50 rounded-xl">
                              <span className="text-[10px] text-slate-400 font-bold block uppercase">Doctors</span>
                              <span className="text-xs font-black text-slate-800">{hosp.doctorsCount || 15}</span>
                            </div>
                            <div className="p-2 bg-slate-50 rounded-xl">
                              <span className="text-[10px] text-slate-400 font-bold block uppercase">OPDs</span>
                              <span className="text-xs font-black text-slate-800">{hosp.departmentsCount || 6}</span>
                            </div>
                          </div>

                          {/* Active Booking Banner if patient has token here */}
                          {hasMyBooking && (
                            <div className="mt-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                                <div>
                                  <span className="font-bold block">Active Token: {myAptAtThisHosp?.token}</span>
                                  <span className="text-[11px] text-emerald-600">{myAptAtThisHosp?.department} • {myAptAtThisHosp?.status}</span>
                                </div>
                              </div>
                              <button
                                onClick={() => {
                                  if (myAptAtThisHosp) setSelectedBookedAptId(myAptAtThisHosp.id);
                                  setActiveTab('live-queue');
                                }}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[10px]"
                              >
                                View Queue
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2.5">
                          <button
                            onClick={() => {
                              setSelectedHospitalForBooking(hosp.name);
                              setActiveTab('book');
                            }}
                            className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-1.5"
                          >
                            <CalendarPlus className="w-4 h-4" />
                            <span>Book OPD Slot</span>
                          </button>

                          {hasMyBooking ? (
                            <button
                              onClick={() => {
                                if (myAptAtThisHosp) setSelectedBookedAptId(myAptAtThisHosp.id);
                                setActiveTab('live-queue');
                              }}
                              className="px-3.5 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
                            >
                              <Activity className="w-4 h-4" />
                              <span>Live Queue</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setSelectedHospitalForBooking(hosp.name);
                                setActiveTab('book');
                              }}
                              className="px-3.5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
                              title="Select Hospital"
                            >
                              <span>Select</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* SECTION 3: Book Appointment (Multi-Hospital Aware)        */}
          {/* ========================================================= */}
          {activeTab === 'book' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-card max-w-3xl mx-auto">
              <div className="border-b border-slate-100 pb-5 mb-6">
                <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold uppercase tracking-wider">
                  <CalendarPlus className="w-4 h-4" />
                  <span>Online Appointment Portal</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mt-1">Book Hospital Appointment</h2>
                <p className="text-xs text-slate-500">
                  Select your hospital, specialist department, and preferred time slot to generate your verified digital token.
                </p>
              </div>

              <form onSubmit={handleBookingSubmit} className="space-y-6">
                {/* 1. Hospital Selection (All Registered Hospitals) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    1. Select Registered Hospital
                  </label>
                  <select
                    value={selectedHospitalForBooking}
                    onChange={(e) => setSelectedHospitalForBooking(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                  >
                    {hospitals.map((hosp) => (
                      <option key={hosp.id} value={hosp.name}>
                        {hosp.name} ({hosp.code}) — {hosp.city}
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Booking at: <strong className="text-slate-700">{selectedHospitalForBooking}</strong>
                  </p>
                </div>

                {/* 2. Department Selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    2. Select OPD Department
                  </label>
                  <select
                    value={selectedDept}
                    onChange={(e) => {
                      setSelectedDept(e.target.value);
                      const docs = doctors.filter(d => d.department === e.target.value);
                      if (docs.length > 0) setSelectedDoctorId(docs[0].id);
                    }}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  >
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.name}>
                        {dept.name} ({dept.room})
                      </option>
                    ))}
                  </select>
                </div>

                {/* 3. Doctor Selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    3. Select Attending Specialist Doctor
                  </label>
                  <select
                    value={selectedDoctorId}
                    onChange={(e) => setSelectedDoctorId(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  >
                    {filteredDoctors.map((doc) => (
                      <option key={doc.id} value={doc.id}>
                        {doc.name} — {doc.specialization} ({doc.room})
                      </option>
                    ))}
                  </select>
                </div>

                {/* 4. Date Selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    4. Select Consultation Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>

                {/* 5. Time Slots */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    5. Select Time Slot
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {timeSlots.map((slot) => {
                      const isSelected = selectedSlot === slot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedSlot(slot)}
                          className={`py-2.5 px-3 rounded-2xl text-xs font-bold border transition-all ${
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

                {/* 6. Reason & Priority */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Reason for Visit
                    </label>
                    <input
                      type="text"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="e.g. Chest pain, Follow-up consultation"
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
                  <span>Confirm Booking & Generate Digital Token for {selectedHospitalForBooking}</span>
                </button>
              </form>
            </div>
          )}

          {/* ========================================================= */}
          {/* SECTION 4: LIVE QUEUE (ONLY BOOKED APPOINTMENT RELATED)   */}
          {/* ========================================================= */}
          {activeTab === 'live-queue' && (
            <div className="space-y-6">
              {myActiveBookedAppointments.length === 0 ? (
                /* Empty State: Patient has NO booked appointments */
                <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-100 shadow-card text-center max-w-2xl mx-auto space-y-4">
                  <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-600 mx-auto flex items-center justify-center text-3xl">
                    <CalendarX className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900">
                    No Active Booked Appointment Found
                  </h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                    Live Queue tracking is strictly tied to your booked hospital appointment. You do not have any active appointments in progress at any registered hospital right now.
                  </p>
                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      onClick={() => setActiveTab('hospitals')}
                      className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                    >
                      <Building2 className="w-4 h-4 text-emerald-400" />
                      <span>Browse Registered Hospitals</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('book')}
                      className="w-full sm:w-auto px-5 py-3 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20"
                    >
                      <CalendarPlus className="w-4 h-4" />
                      <span>Book OPD Token</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Patient HAS active booked appointment(s) */
                <>
                  {/* Multiple Booked Appointments Switcher */}
                  {myActiveBookedAppointments.length > 1 && (
                    <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-2 overflow-x-auto text-xs">
                      <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] pl-2 whitespace-nowrap">
                        Select Booked Hospital Queue:
                      </span>
                      {myActiveBookedAppointments.map((apt) => (
                        <button
                          key={apt.id}
                          onClick={() => setSelectedBookedAptId(apt.id)}
                          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                            activeTrackedApt?.id === apt.id
                              ? 'bg-emerald-600 text-white shadow-sm'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          <Building2 className="w-3.5 h-3.5" />
                          <span>{apt.hospital} (Token {apt.token})</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Header Info for Selected Hospital */}
                  <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                            Live Booked OPD Queue Active
                          </span>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
                          <span>{activeTrackedApt?.hospital}</span>
                          <span className="text-sm font-semibold text-slate-500">
                            • {activeTrackedApt?.department}
                          </span>
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Attending Doctor: <strong>{activeTrackedApt?.doctorName}</strong> ({activeTrackedApt?.doctorSpecialization}) • OPD Room 302
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 font-bold block uppercase">Appointment Date</span>
                          <span className="text-xs font-bold text-slate-800">{activeTrackedApt?.date} ({activeTrackedApt?.time})</span>
                        </div>
                        <span className="text-xs font-bold text-slate-800 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                          Avg: 8 mins / patient
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Two Column Live Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Currently Serving Banner Card */}
                    <div className="bg-gradient-to-br from-emerald-600 to-teal-800 rounded-3xl p-7 text-white shadow-xl flex flex-col justify-between relative overflow-hidden">
                      <div className="relative z-10">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full">
                            Currently Serving
                          </span>
                          <span className="text-xs font-bold bg-emerald-500/50 px-2.5 py-0.5 rounded-lg">
                            {activeTrackedApt?.hospital}
                          </span>
                        </div>
                        <div className="mt-4">
                          <span className="text-5xl sm:text-6xl font-black tracking-tight">
                            {currentlyServingInHospital.token || 'A-19'}
                          </span>
                          <p className="text-emerald-100 font-semibold text-lg mt-1">
                            {currentlyServingInHospital.patientName || 'In Consultation'}
                          </p>
                          <p className="text-xs text-emerald-200 mt-0.5">
                            Attending Doctor: {activeTrackedApt?.doctorName}
                          </p>
                        </div>
                      </div>

                      <div className="mt-8 pt-4 border-t border-white/20 flex items-center justify-between text-xs text-emerald-100">
                        <span>Started: 11:15 AM</span>
                        <span className="bg-white/20 px-2.5 py-1 rounded-lg font-bold">Room 302</span>
                      </div>
                    </div>

                    {/* Patient's Token Card */}
                    <div className="bg-white rounded-3xl p-7 border border-slate-100 shadow-card flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                            Your Booked Token
                          </span>
                          <StatusBadge status={activeTrackedApt?.status || 'Waiting'} />
                        </div>

                        <div className="mt-3">
                          <span className="text-5xl sm:text-6xl font-black text-slate-900 tracking-tight">
                            {activeTrackedApt?.token}
                          </span>
                          <p className="text-sm font-semibold text-slate-600 mt-1">
                            Patient: {currentUser?.name || 'Rahul Verma'}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-6">
                          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                            <span className="text-[11px] text-slate-400 font-medium">People Ahead of You</span>
                            <p className="text-2xl font-black text-slate-800 mt-0.5">
                              {peopleAheadCount}
                            </p>
                          </div>

                          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100">
                            <span className="text-[11px] text-emerald-700 font-medium">Estimated Wait Time</span>
                            <p className="text-2xl font-black text-emerald-800 mt-0.5">
                              {estimatedWaitMins} <span className="text-xs font-semibold">mins</span>
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 p-3 rounded-2xl bg-amber-50 border border-amber-200/60 text-xs text-amber-800 font-medium">
                        ⚡ Please be seated in Waiting Lounge A at {activeTrackedApt?.hospital}. You will be called soon.
                      </div>
                    </div>

                  </div>

                  {/* Live Queue Table / List strictly for that hospital */}
                  <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-slate-800 text-sm">
                          Live OPD Queue — {activeTrackedApt?.hospital} ({activeTrackedApt?.department})
                        </h3>
                        <p className="text-xs text-slate-400">
                          Showing real-time tokens waiting for {activeTrackedApt?.doctorName}
                        </p>
                      </div>
                      <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-xl">
                        {waitingListInHospital.length} Patients Waiting
                      </span>
                    </div>

                    <div className="divide-y divide-slate-100">
                      {waitingListInHospital.length === 0 ? (
                        <div className="py-8 text-center text-xs text-slate-400">
                          No waiting tokens currently in line for this department.
                        </div>
                      ) : (
                        waitingListInHospital.map((item, index) => {
                          const isMyToken = item.token === activeTrackedApt?.token;
                          return (
                            <div
                              key={item.token || index}
                              className={`py-3.5 px-3 flex items-center justify-between rounded-2xl transition-colors ${
                                isMyToken
                                  ? 'bg-emerald-50/90 border border-emerald-300 font-semibold shadow-sm'
                                  : 'hover:bg-slate-50'
                              }`}
                            >
                              <div className="flex items-center gap-4">
                                <span className="text-xs font-bold text-slate-400 w-6">#{index + 1}</span>
                                <span className={`text-base font-black px-3 py-1 rounded-xl ${
                                  isMyToken ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-800'
                                }`}>
                                  {item.token}
                                </span>
                                <div>
                                  <p className="text-xs font-bold text-slate-800">
                                    {item.patientName} {isMyToken && <span className="text-emerald-700 font-black">(Your Booked Token)</span>}
                                  </p>
                                  <span className="text-[11px] text-slate-400">{activeTrackedApt?.department} OPD • {activeTrackedApt?.hospital}</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                {item.priority === 'Emergency' && (
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                                    Emergency
                                  </span>
                                )}
                                <StatusBadge status={item.status} />
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* SECTION 5: My Appointments                                */}
          {/* ========================================================= */}
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
                    <p className="text-xs text-slate-400 mt-1">Book an appointment at any registered hospital to receive a digital token.</p>
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
                          <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-1">
                            <Building2 className="w-3.5 h-3.5 text-slate-400" />
                            <span>{apt.hospital}</span>
                          </p>
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
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setSelectedBookedAptId(apt.id);
                                setActiveTab('live-queue');
                              }}
                              className="text-xs font-bold text-amber-600 hover:text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg"
                            >
                              Live Queue
                            </button>
                            <button
                              onClick={() => cancelAppointment(apt.id)}
                              className="text-xs font-semibold text-rose-500 hover:text-rose-600"
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* SECTION 6: Notifications                                  */}
          {/* ========================================================= */}
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

          {/* ========================================================= */}
          {/* SECTION 7: CLICKABLE USER & PATIENT PROFILE (EDITABLE)    */}
          {/* ========================================================= */}
          {(activeTab === 'profile' || activeTab === 'settings') && (
            <div className="max-w-3xl mx-auto space-y-6">
              {/* ABHA Digital Health Identity Card */}
              <div className="bg-gradient-to-r from-emerald-700 via-teal-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
                <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-10">
                  <ShieldCheck className="w-64 h-64 text-white" />
                </div>

                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/20 pb-5">
                  <div className="flex items-center gap-3">
                    <img
                      src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                      alt={currentUser?.name}
                      className="w-16 h-16 rounded-2xl object-cover ring-2 ring-white/40 shadow-md"
                    />
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full">
                        Verified Digital Health Card
                      </span>
                      <h3 className="text-xl font-bold mt-1">{currentUser?.name || 'Rahul Verma'}</h3>
                      <p className="text-xs text-emerald-200">Patient ID: {currentUser?.id || 'pat-1'}</p>
                    </div>
                  </div>

                  <div className="text-left sm:text-right bg-white/10 sm:bg-transparent p-3 sm:p-0 rounded-2xl">
                    <span className="text-[10px] uppercase font-bold text-emerald-200 block">ABHA Number</span>
                    <span className="text-sm sm:text-base font-mono font-black tracking-wider text-white">
                      9824-2026-9011
                    </span>
                    <span className="text-[10px] text-emerald-300 block mt-0.5">National Health Authority</span>
                  </div>
                </div>

                <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 text-xs">
                  <div className="bg-white/10 p-2.5 rounded-xl">
                    <span className="text-[10px] text-emerald-200 block uppercase">Blood Group</span>
                    <span className="font-bold text-white text-sm">{profileForm.bloodGroup}</span>
                  </div>
                  <div className="bg-white/10 p-2.5 rounded-xl">
                    <span className="text-[10px] text-emerald-200 block uppercase">Age / Gender</span>
                    <span className="font-bold text-white text-sm">{profileForm.age} Yrs / {profileForm.gender}</span>
                  </div>
                  <div className="bg-white/10 p-2.5 rounded-xl">
                    <span className="text-[10px] text-emerald-200 block uppercase">Booked Visits</span>
                    <span className="font-bold text-white text-sm">{myAppointments.length} Consultations</span>
                  </div>
                  <div className="bg-white/10 p-2.5 rounded-xl">
                    <span className="text-[10px] text-emerald-200 block uppercase">NHA Status</span>
                    <span className="font-bold text-emerald-300 text-sm flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Active</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Profile Details & Edit Form */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-card space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Personal & Health Details</h3>
                    <p className="text-xs text-slate-500">Keep your patient record up-to-date across all registered network hospitals.</p>
                  </div>
                  <button
                    onClick={() => setIsEditingProfile(!isEditingProfile)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      isEditingProfile
                        ? 'bg-slate-200 text-slate-800'
                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    }`}
                  >
                    {isEditingProfile ? (
                      <>
                        <X className="w-3.5 h-3.5" />
                        <span>Cancel Editing</span>
                      </>
                    ) : (
                      <>
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit Profile</span>
                      </>
                    )}
                  </button>
                </div>

                {isEditingProfile ? (
                  /* Editable Form */
                  <form onSubmit={handleProfileSave} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                        <input
                          type="text"
                          value={profileForm.name}
                          onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                        <input
                          type="email"
                          value={profileForm.email}
                          onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                        <input
                          type="text"
                          value={profileForm.phone}
                          onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Blood Group</label>
                        <select
                          value={profileForm.bloodGroup}
                          onChange={(e) => setProfileForm({ ...profileForm, bloodGroup: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 font-bold"
                        >
                          {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(b => (
                            <option key={b} value={b}>{b}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Age</label>
                        <input
                          type="number"
                          value={profileForm.age}
                          onChange={(e) => setProfileForm({ ...profileForm, age: Number(e.target.value) })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Gender</label>
                        <select
                          value={profileForm.gender}
                          onChange={(e) => setProfileForm({ ...profileForm, gender: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="text-xs space-y-3">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Residential Address</label>
                        <input
                          type="text"
                          value={profileForm.address}
                          onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Emergency Contact</label>
                        <input
                          type="text"
                          value={profileForm.emergencyContact}
                          onChange={(e) => setProfileForm({ ...profileForm, emergencyContact: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Known Allergies</label>
                        <input
                          type="text"
                          value={profileForm.allergies}
                          onChange={(e) => setProfileForm({ ...profileForm, allergies: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Medical History Notes</label>
                        <textarea
                          rows={2}
                          value={profileForm.medicalHistory}
                          onChange={(e) => setProfileForm({ ...profileForm, medicalHistory: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Profile Changes</span>
                    </button>
                  </form>
                ) : (
                  /* Read-Only Overview */
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="p-3 bg-slate-50 rounded-xl">
                        <span className="text-slate-400 block font-medium">Full Name</span>
                        <span className="font-bold text-slate-800 text-sm">{profileForm.name}</span>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl">
                        <span className="text-slate-400 block font-medium">Email Address</span>
                        <span className="font-bold text-slate-800 text-sm">{profileForm.email}</span>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl">
                        <span className="text-slate-400 block font-medium">Phone Number</span>
                        <span className="font-bold text-slate-800 text-sm">{profileForm.phone}</span>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl">
                        <span className="text-slate-400 block font-medium">Blood Group</span>
                        <span className="font-bold text-rose-600 text-sm">{profileForm.bloodGroup}</span>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl">
                        <span className="text-slate-400 block font-medium">Age & Gender</span>
                        <span className="font-bold text-slate-800 text-sm">{profileForm.age} Yrs • {profileForm.gender}</span>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl">
                        <span className="text-slate-400 block font-medium">Emergency Contact</span>
                        <span className="font-bold text-slate-800 text-sm">{profileForm.emergencyContact}</span>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl text-xs">
                      <span className="text-slate-400 block font-medium">Residential Address</span>
                      <span className="font-medium text-slate-700">{profileForm.address}</span>
                    </div>

                    <div className="p-3 bg-amber-50/70 border border-amber-100 rounded-xl text-xs">
                      <span className="text-amber-800 font-bold block">Allergies & Medical History</span>
                      <p className="text-slate-700 mt-0.5">
                        <strong>Allergies:</strong> {profileForm.allergies || 'None reported'}
                      </p>
                      <p className="text-slate-700 mt-0.5">
                        <strong>History:</strong> {profileForm.medicalHistory || 'No major history'}
                      </p>
                    </div>

                    {/* Quick navigation actions */}
                    <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        onClick={() => setActiveTab('hospitals')}
                        className="p-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-left transition-colors flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2.5">
                          <Building2 className="w-4 h-4 text-emerald-600" />
                          <span className="text-xs font-bold text-slate-800">Browse Registered Hospitals</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </button>

                      <button
                        onClick={() => setActiveTab('appointments')}
                        className="p-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-left transition-colors flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2.5">
                          <CalendarCheck className="w-4 h-4 text-blue-600" />
                          <span className="text-xs font-bold text-slate-800">My Booked Appointments</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </button>
                    </div>

                    <button
                      onClick={logout}
                      className="w-full py-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs transition-colors flex items-center justify-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out of Patient Portal</span>
                    </button>
                  </div>
                )}
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
          title={`Appointment Slip — Token ${selectedAptDetails.token}`}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
              <div>
                <span className="text-xs text-emerald-800 font-semibold">Your Digital OPD Token</span>
                <p className="text-3xl font-black text-emerald-900">{selectedAptDetails.token}</p>
              </div>
              <StatusBadge status={selectedAptDetails.status} size="md" />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 font-medium block">Hospital</span>
                <span className="font-bold text-slate-800">{selectedAptDetails.hospital}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 font-medium block">Doctor</span>
                <span className="font-bold text-slate-800">{selectedAptDetails.doctorName}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 font-medium block">Department</span>
                <span className="font-bold text-slate-800">{selectedAptDetails.department}</span>
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

            <div className="p-3 bg-slate-50 rounded-xl text-xs flex items-center justify-between">
              <div>
                <span className="text-slate-400 block font-medium">Patient ABHA Number</span>
                <span className="font-mono font-bold text-slate-800">9824-2026-9011</span>
              </div>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                NHA Verified
              </span>
            </div>

            <div className="flex gap-2">
              {selectedAptDetails.status === 'Waiting' && (
                <button
                  onClick={() => {
                    setSelectedBookedAptId(selectedAptDetails.id);
                    setSelectedAptDetails(null);
                    setActiveTab('live-queue');
                  }}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  <Activity className="w-4 h-4" />
                  <span>Open Live Queue</span>
                </button>
              )}
              <button
                onClick={() => setSelectedAptDetails(null)}
                className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
