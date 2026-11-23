import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sidebar } from '../../components/common/Sidebar';
import { Navbar } from '../../components/common/Navbar';
import { StatusBadge } from '../../components/common/StatusBadge';
import { StatCard } from '../../components/common/StatCard';
import { Modal } from '../../components/common/Modal';
import {
  Users,
  CheckCircle,
  Clock,
  Timer,
  ChevronRight,
  ArrowRight,
  CheckCheck,
  RotateCcw,
  XCircle,
  FileText,
  Save,
  Calendar,
  Phone,
  UserCheck,
  Stethoscope,
  Activity,
  AlertTriangle,
  Search
} from 'lucide-react';

export const DoctorDashboard = () => {
  const {
    currentUser,
    appointments,
    queueState,
    completeCurrentConsultation,
    skipCurrentPatient,
    saveConsultationNotes,
    updateDoctorAvailability,
    doctors
  } = useApp();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Active Doctor record
  const currentDoc = doctors.find(d => d.id === currentUser?.id) || doctors[0];

  // Active patient in consultation
  const activeServing = appointments.find(
    a => a.status === 'In Consultation' && a.doctorId === currentDoc.id
  ) || appointments[0];

  // Consultation Notes state
  const [consultationNotes, setConsultationNotes] = useState(activeServing?.notes || 'Patient is stable. Resting pulse 76 bpm.');

  // Availability schedule local state
  const [availabilitySchedule, setAvailabilitySchedule] = useState(
    currentDoc.availability || {
      Monday: { active: true, hours: '09:00 AM - 05:00 PM' },
      Tuesday: { active: true, hours: '09:00 AM - 05:00 PM' },
      Wednesday: { active: true, hours: '09:00 AM - 05:00 PM' },
      Thursday: { active: true, hours: '09:00 AM - 05:00 PM' },
      Friday: { active: true, hours: '09:00 AM - 05:00 PM' },
      Saturday: { active: true, hours: '09:00 AM - 01:00 PM' },
      Sunday: { active: false, hours: 'OFF' }
    }
  );

  // Selected patient for details view
  const [selectedPatientRecord, setSelectedPatientRecord] = useState(activeServing);

  // Doctor appointments tab filter
  const [doctorAptTab, setDoctorAptTab] = useState('Upcoming');

  // Stats calculation
  const totalPatientsToday = appointments.filter(a => a.doctorId === currentDoc.id).length || 25;
  const completedToday = appointments.filter(a => a.doctorId === currentDoc.id && a.status === 'Completed').length || 12;
  const waitingToday = appointments.filter(a => a.doctorId === currentDoc.id && a.status === 'Waiting').length || 13;

  // Filtered appointments for Appointments section
  const docFilteredApts = appointments.filter(a => {
    if (doctorAptTab === 'Upcoming') return a.status === 'Waiting' || a.status === 'In Consultation';
    return a.status === 'Completed';
  });

  const handleToggleDay = (day) => {
    setAvailabilitySchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        active: !prev[day].active,
        hours: !prev[day].active ? '09:00 AM - 05:00 PM' : 'OFF'
      }
    }));
  };

  const handleHoursChange = (day, newHours) => {
    setAvailabilitySchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        hours: newHours
      }
    }));
  };

  const handleSaveAvailability = () => {
    updateDoctorAvailability(currentDoc.id, availabilitySchedule);
  };

  const handleSaveNotes = () => {
    if (activeServing) {
      saveConsultationNotes(activeServing.token, consultationNotes);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* Dark Navy Sidebar */}
      <Sidebar
        role="doctor"
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <Navbar
          onOpenMobile={() => setIsMobileOpen(true)}
          role="doctor"
          pageTitle={
            activeTab === 'dashboard' ? 'Doctor Dashboard' :
            activeTab === 'today-queue' ? "Today's Queue" :
            activeTab === 'appointments' ? 'Appointments' :
            activeTab === 'patients' ? 'Patient Details' :
            activeTab === 'availability' ? 'Doctor Availability' : 'Doctor Profile'
          }
        />

        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">

          {/* Quick Screen Tabs */}
          <div className="bg-white p-2 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-1.5 overflow-x-auto text-xs font-semibold">
            {[
              { id: 'dashboard', label: '1. Doctor Dashboard' },
              { id: 'today-queue', label: "2. Today's Queue" },
              { id: 'patients', label: '3. Patient Details' },
              { id: 'consultation', label: '4. Consultation Actions' },
              { id: 'availability', label: '5. Availability' },
              { id: 'appointments', label: '6. Appointments' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* SECTION 1: Doctor Dashboard Overview */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Header Greeting */}
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  Welcome, {currentDoc.name}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Here's your today's overview • {currentDoc.department} OPD ({currentDoc.room})
                </p>
              </div>

              {/* 4 Stat Cards matching reference */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  title="Total Patients"
                  value={totalPatientsToday}
                  subtitle="Scheduled today"
                  icon={Users}
                  color="blue"
                />
                <StatCard
                  title="Completed"
                  value={completedToday}
                  subtitle="Finished consultations"
                  icon={CheckCircle}
                  color="emerald"
                />
                <StatCard
                  title="Waiting"
                  value={waitingToday}
                  subtitle="In waiting lounge"
                  icon={Clock}
                  color="amber"
                />
                <StatCard
                  title="Avg. Time"
                  value="8 mins"
                  subtitle="Per consultation"
                  icon={Timer}
                  color="purple"
                />
              </div>

              {/* Two Column Section: Currently Serving + Up Next */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Currently Serving Card */}
                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Currently Serving
                      </span>
                      <StatusBadge status="In Consultation" />
                    </div>

                    <div className="bg-blue-50/60 p-5 rounded-2xl border border-blue-100 flex items-center justify-between">
                      <div>
                        <span className="text-4xl font-black text-blue-700 tracking-tight">
                          {activeServing?.token || 'A-12'}
                        </span>
                        <h4 className="text-base font-bold text-slate-900 mt-1">
                          {activeServing?.patientName || 'Rahul Verma'}
                        </h4>
                        <p className="text-xs text-slate-500">
                          {activeServing?.patientAge || 28} Yrs, {activeServing?.patientGender || 'Male'} • Phone: {activeServing?.patientPhone || '98765 43210'}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-[11px] font-bold text-blue-600 bg-white px-2.5 py-1 rounded-lg border border-blue-200">
                          {activeServing?.time || '11:15 AM'}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 p-3.5 bg-slate-50 rounded-2xl text-xs space-y-1">
                      <span className="text-slate-400 font-semibold block uppercase text-[10px]">Reason for Visit</span>
                      <p className="font-medium text-slate-800">{activeServing?.reason || 'Chest pain & discomfort'}</p>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-3">
                    <button
                      onClick={() => setActiveTab('consultation')}
                      className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
                    >
                      <Activity className="w-4 h-4" />
                      <span>Open Consultation Desk</span>
                    </button>
                    <button
                      onClick={completeCurrentConsultation}
                      className="py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5"
                    >
                      <CheckCheck className="w-4 h-4" />
                      <span>Complete</span>
                    </button>
                  </div>
                </div>

                {/* Up Next Patient List */}
                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-600" />
                        <h3 className="font-bold text-slate-800 text-sm">Up Next in Queue</h3>
                      </div>
                      <button
                        onClick={() => setActiveTab('today-queue')}
                        className="text-xs font-bold text-blue-600 hover:underline"
                      >
                        View All
                      </button>
                    </div>

                    <div className="divide-y divide-slate-100">
                      {appointments
                        .filter(a => a.status === 'Waiting')
                        .slice(0, 4)
                        .map((apt) => (
                          <div
                            key={apt.id}
                            className="py-3 flex items-center justify-between hover:bg-slate-50 px-2 rounded-xl transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-black text-slate-800 bg-slate-100 px-2.5 py-1 rounded-xl">
                                {apt.token}
                              </span>
                              <div>
                                <p className="text-xs font-bold text-slate-800">{apt.patientName}</p>
                                <span className="text-[11px] text-slate-400">{apt.time}</span>
                              </div>
                            </div>

                            <button
                              onClick={() => {
                                setSelectedPatientRecord(apt);
                                setActiveTab('patients');
                              }}
                              className="text-xs font-semibold text-blue-600 hover:bg-blue-50 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1"
                            >
                              <span>Examine</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 text-center">
                    <button
                      onClick={() => setActiveTab('today-queue')}
                      className="text-xs font-bold text-slate-600 hover:text-slate-900"
                    >
                      View All Waiting Patients ({waitingToday})
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* SECTION 2: Today's Queue */}
          {activeTab === 'today-queue' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-card">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Today's Queue</h2>
                  <p className="text-xs text-slate-500">Manage patient queue, call tokens, and monitor status.</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={completeCurrentConsultation}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all"
                  >
                    <CheckCheck className="w-4 h-4" />
                    <span>Call Next Patient</span>
                  </button>
                  <button
                    onClick={skipCurrentPatient}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Skip Current</span>
                  </button>
                </div>
              </div>

              <div className="divide-y divide-slate-100">
                {appointments
                  .filter(a => a.status === 'In Consultation' || a.status === 'Waiting')
                  .map((apt) => {
                    const isServing = apt.status === 'In Consultation';
                    return (
                      <div
                        key={apt.id}
                        className={`py-4 px-3 flex items-center justify-between rounded-2xl transition-all ${
                          isServing ? 'bg-blue-50/60 border border-blue-200' : 'hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <span className={`text-base font-black px-3 py-1.5 rounded-xl ${
                            isServing ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-800'
                          }`}>
                            {apt.token}
                          </span>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-slate-800">{apt.patientName}</h4>
                              {isServing && (
                                <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                                  In Cabin
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-400 mt-0.5">
                              {apt.time} • {apt.reason || 'Consultation'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <StatusBadge status={apt.status} />
                          <button
                            onClick={() => {
                              setSelectedPatientRecord(apt);
                              setActiveTab('patients');
                            }}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                          >
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Total Waiting in Lounge: {waitingToday}</span>
                <span>OPD Status: Active</span>
              </div>
            </div>
          )}

          {/* SECTION 3: Patient Details */}
          {(activeTab === 'patients' || activeTab === 'consultation') && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Patient Profile & Medical Record */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-card space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                      Patient Details
                    </span>
                    <h3 className="text-xl font-black text-slate-900 mt-0.5">
                      {selectedPatientRecord?.token || 'A-12'} — {selectedPatientRecord?.patientName || 'Rahul Verma'}
                    </h3>
                  </div>
                  <StatusBadge status={selectedPatientRecord?.status || 'In Consultation'} size="md" />
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-slate-400 font-medium block">Age & Gender</span>
                    <span className="font-bold text-slate-800 text-sm">
                      {selectedPatientRecord?.patientAge || 28} Years, {selectedPatientRecord?.patientGender || 'Male'}
                    </span>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-slate-400 font-medium block">Contact Number</span>
                    <span className="font-bold text-slate-800 text-sm">
                      {selectedPatientRecord?.patientPhone || '98765 43210'}
                    </span>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-slate-400 font-medium block">Appointment Time</span>
                    <span className="font-bold text-slate-800 text-sm">
                      {selectedPatientRecord?.time || '11:15 AM'}
                    </span>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-slate-400 font-medium block">Department</span>
                    <span className="font-bold text-slate-800 text-sm">
                      {selectedPatientRecord?.department || 'Cardiology'}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Reason for Visit
                    </span>
                    <p className="text-xs font-medium text-slate-800">
                      {selectedPatientRecord?.reason || 'Chest pain & discomfort. Palpitations during light exertion.'}
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Medical History & Allergies
                    </span>
                    <p className="text-xs font-medium text-slate-800">
                      {selectedPatientRecord?.medicalHistory || 'No known allergies. Previously treated for mild BP in 2024.'}
                    </p>
                  </div>

                  <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-100">
                    <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block mb-1">
                      Doctor Clinical Notes
                    </span>
                    <p className="text-xs font-medium text-slate-800">
                      {selectedPatientRecord?.notes || 'Patient is stable. Resting pulse 76 bpm. Advised standard ECG.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Consultation Desk Actions (Section 4) */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-card flex flex-col justify-between space-y-6">
                <div>
                  <div className="border-b border-slate-100 pb-4 mb-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                          Consultation Actions
                        </span>
                        <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                          Desk Controls: {activeServing?.token || 'A-12'}
                        </h3>
                      </div>
                      <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                        11:15 AM • 28 M
                      </span>
                    </div>
                  </div>

                  {/* 3 Main Action Buttons matching reference */}
                  <div className="space-y-3">
                    <button
                      onClick={completeCurrentConsultation}
                      className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
                    >
                      <CheckCheck className="w-5 h-5" />
                      <span>Complete Consultation</span>
                    </button>

                    <button
                      onClick={skipCurrentPatient}
                      className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-bold shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
                    >
                      <RotateCcw className="w-5 h-5" />
                      <span>Skip Patient (Move to Back)</span>
                    </button>

                    <button
                      onClick={() => alert(`Appointment cancelled for ${activeServing?.token}`)}
                      className="w-full py-3.5 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl text-xs font-bold shadow-md shadow-rose-600/20 transition-all flex items-center justify-center gap-2"
                    >
                      <XCircle className="w-5 h-5" />
                      <span>Cancel Appointment</span>
                    </button>
                  </div>

                  {/* Add Note field */}
                  <div className="mt-6">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Add Clinical Note (Optional)
                    </label>
                    <textarea
                      rows={3}
                      value={consultationNotes}
                      onChange={(e) => setConsultationNotes(e.target.value)}
                      placeholder="Type your examination notes, prescription, vitals..."
                      className="w-full p-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    />

                    <button
                      onClick={handleSaveNotes}
                      className="mt-3 w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Clinical Note</span>
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-[11px] text-amber-800 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>Clicking "Complete Consultation" auto-notifies the next queued patient.</span>
                </div>
              </div>

            </div>
          )}

          {/* SECTION 5: Availability */}
          {activeTab === 'availability' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-card max-w-3xl mx-auto">
              <div className="border-b border-slate-100 pb-4 mb-6">
                <h2 className="text-xl font-bold text-slate-900">Set Your Availability</h2>
                <p className="text-xs text-slate-500">Manage your weekly working hours and OPD shifts.</p>
              </div>

              <div className="space-y-4">
                {Object.keys(availabilitySchedule).map((day) => {
                  const dayData = availabilitySchedule[day];
                  return (
                    <div
                      key={day}
                      className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
                        dayData.active ? 'bg-white border-slate-200' : 'bg-slate-50 border-slate-200/60 opacity-60'
                      }`}
                    >
                      <div className="w-32">
                        <span className="text-sm font-bold text-slate-800">{day}</span>
                      </div>

                      <div className="flex-1 max-w-xs">
                        <input
                          type="text"
                          value={dayData.hours}
                          disabled={!dayData.active}
                          onChange={(e) => handleHoursChange(day, e.target.value)}
                          className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 disabled:bg-slate-100"
                        />
                      </div>

                      {/* Toggle Switch */}
                      <button
                        type="button"
                        onClick={() => handleToggleDay(day)}
                        className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                          dayData.active ? 'bg-blue-600' : 'bg-slate-300'
                        }`}
                      >
                        <div
                          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                            dayData.active ? 'translate-x-6' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 pt-5 border-t border-slate-100">
                <button
                  onClick={handleSaveAvailability}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-bold shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Availability Schedule</span>
                </button>
              </div>
            </div>
          )}

          {/* SECTION 6: Appointments */}
          {activeTab === 'appointments' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-card">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Appointments Schedule</h2>
                  <p className="text-xs text-slate-500">View upcoming and completed patient appointments.</p>
                </div>

                <div className="flex items-center gap-2">
                  {['Upcoming', 'Completed'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setDoctorAptTab(tab)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        doctorAptTab === tab
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-y border-slate-100">
                    <tr>
                      <th className="py-3.5 px-4">Token</th>
                      <th className="py-3.5 px-4">Patient Name</th>
                      <th className="py-3.5 px-4">Date & Time</th>
                      <th className="py-3.5 px-4">Reason</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {docFilteredApts.map((apt) => (
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
                          {apt.date} • {apt.time}
                        </td>
                        <td className="py-3.5 px-4 text-slate-500">
                          {apt.reason || 'General Checkup'}
                        </td>
                        <td className="py-3.5 px-4">
                          <StatusBadge status={apt.status} />
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => {
                              setSelectedPatientRecord(apt);
                              setActiveTab('patients');
                            }}
                            className="font-bold text-blue-600 hover:underline"
                          >
                            Examine
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SECTION 7: Doctor Profile */}
          {activeTab === 'profile' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-card text-center">
                <img
                  src={currentDoc.avatar}
                  alt={currentDoc.name}
                  className="w-24 h-24 rounded-3xl object-cover mx-auto ring-4 ring-blue-50 shadow-md"
                />
                <h2 className="text-xl font-bold text-slate-900 mt-4">{currentDoc.name}</h2>
                <p className="text-xs text-blue-600 font-semibold">{currentDoc.specialization} • {currentDoc.department}</p>
                <p className="text-xs text-slate-400 mt-1">{currentDoc.hospital} • {currentDoc.room}</p>

                <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-slate-100">
                  <div className="p-3 bg-slate-50 rounded-2xl">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Experience</span>
                    <p className="text-sm font-bold text-slate-800">{currentDoc.experience || '14 Years'}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-2xl">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Rating</span>
                    <p className="text-sm font-bold text-slate-800">⭐ {currentDoc.rating || 4.9}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-2xl">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Today's Patients</span>
                    <p className="text-sm font-bold text-slate-800">{totalPatientsToday}</p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-100 text-left space-y-3 text-xs">
                  <div className="p-3.5 bg-slate-50 rounded-xl flex items-center justify-between">
                    <span className="text-slate-400 font-medium">Contact Phone</span>
                    <span className="font-bold text-slate-800">{currentDoc.phone}</span>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-xl flex items-center justify-between">
                    <span className="text-slate-400 font-medium">Official Email</span>
                    <span className="font-bold text-slate-800">{currentDoc.email}</span>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-xl flex items-center justify-between">
                    <span className="text-slate-400 font-medium">Assigned Cabin</span>
                    <span className="font-bold text-slate-800">{currentDoc.room}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

