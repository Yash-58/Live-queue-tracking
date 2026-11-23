import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  Bell,
  Search,
  ChevronDown,
  User,
  Shield,
  Stethoscope,
  Radio,
  ExternalLink,
  Check,
  Crown,
  Building,
  UserCheck
} from 'lucide-react';

export const Navbar = ({ onOpenMobile, role, pageTitle }) => {
  const {
    currentUser,
    currentRole,
    switchRole,
    notifications,
    markAllNotificationsAsRead,
    hospitalAdmins,
    activeHospitalAdminId,
    switchHospitalAdminUser
  } = useApp();
  const navigate = useNavigate();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  const unreadNotifs = notifications.filter(n => n.unread);

  const roleColors = {
    patient: {
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      pill: 'bg-emerald-500',
      label: 'Patient'
    },
    doctor: {
      badge: 'bg-blue-50 text-blue-700 border-blue-200',
      pill: 'bg-blue-500',
      label: 'Doctor'
    },
    admin: {
      badge: 'bg-purple-50 text-purple-700 border-purple-200',
      pill: 'bg-purple-500',
      label: 'Hospital Admin'
    },
    super_admin: {
      badge: 'bg-amber-50 text-amber-800 border-amber-300 font-bold',
      pill: 'bg-amber-500',
      label: 'Super Admin'
    }
  };

  const handleRoleChange = (newRole) => {
    switchRole(newRole);
    setShowRoleMenu(false);
    if (newRole === 'super_admin') {
      navigate('/super-admin');
    } else {
      navigate(`/${newRole}`);
    }
  };

  return (
    <header className="sticky top-0 z-30 h-20 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between">
      {/* Left side: Hamburger and Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenMobile}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <span>{pageTitle || 'Dashboard'}</span>
            {currentRole === 'super_admin' && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
                <Crown className="w-3 h-3 text-amber-600" />
                <span>Central Authority</span>
              </span>
            )}
          </h1>
          <p className="text-xs text-slate-400 hidden sm:block">
            {currentRole === 'super_admin'
              ? 'National Health Portal • Multi-Hospital Management & Verification'
              : `${currentUser?.hospital || 'City Care Hospital'} • Real-Time Queue`}
          </p>
        </div>
      </div>

      {/* Right side: Live indicator, Role Switcher, Notifications, User */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Live Socket Status */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span>Live Sync Active</span>
        </div>

        {/* Quick Role Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors shadow-sm text-xs font-semibold text-slate-700"
          >
            <span className={`w-2 h-2 rounded-full ${roleColors[currentRole]?.pill || 'bg-slate-400'}`}></span>
            <span className="hidden sm:inline">Role:</span>
            <span className="capitalize">{currentRole === 'super_admin' ? 'Super Admin' : currentRole}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Switch Portal
              </div>

              {/* Super Admin option */}
              <button
                onClick={() => handleRoleChange('super_admin')}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium hover:bg-amber-50/70 transition-colors ${
                  currentRole === 'super_admin' ? 'text-amber-800 font-bold bg-amber-50' : 'text-slate-800 font-semibold'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                    <Crown className="w-3.5 h-3.5" />
                  </div>
                  <span>Super Admin Portal</span>
                </div>
                {currentRole === 'super_admin' && <Check className="w-3.5 h-3.5 text-amber-600" />}
              </button>

              <button
                onClick={() => handleRoleChange('admin')}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium hover:bg-slate-50 transition-colors ${
                  currentRole === 'admin' ? 'text-purple-600 font-semibold bg-purple-50/50' : 'text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-purple-500" />
                  <span>Hospital Admin</span>
                </div>
                {currentRole === 'admin' && <Check className="w-3.5 h-3.5 text-purple-600" />}
              </button>

              <button
                onClick={() => handleRoleChange('doctor')}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium hover:bg-slate-50 transition-colors ${
                  currentRole === 'doctor' ? 'text-blue-600 font-semibold bg-blue-50/50' : 'text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-blue-500" />
                  <span>Doctor Dashboard</span>
                </div>
                {currentRole === 'doctor' && <Check className="w-3.5 h-3.5 text-blue-600" />}
              </button>

              <button
                onClick={() => handleRoleChange('patient')}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium hover:bg-slate-50 transition-colors ${
                  currentRole === 'patient' ? 'text-emerald-600 font-semibold bg-emerald-50/50' : 'text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-emerald-500" />
                  <span>Patient Dashboard</span>
                </div>
                {currentRole === 'patient' && <Check className="w-3.5 h-3.5 text-emerald-600" />}
              </button>

              {/* Sub-selector for Hospital Admin verification testing */}
              {currentRole === 'admin' && (
                <div className="mt-2 pt-2 border-t border-slate-100 px-3">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Demo Admin User
                  </span>
                  <div className="space-y-1">
                    {(hospitalAdmins || []).map(adm => (
                      <button
                        key={adm.id}
                        onClick={() => {
                          switchHospitalAdminUser(adm.id);
                          setShowRoleMenu(false);
                        }}
                        className={`w-full text-left p-1.5 rounded-lg text-[11px] flex items-center justify-between ${
                          activeHospitalAdminId === adm.id
                            ? 'bg-purple-100 text-purple-900 font-bold'
                            : 'hover:bg-slate-100 text-slate-600'
                        }`}
                      >
                        <span className="truncate pr-1">{adm.name.split(' ')[0]} ({adm.verificationStatus})</span>
                        <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                          adm.verificationStatus === 'Verified' ? 'bg-emerald-100 text-emerald-700' :
                          adm.verificationStatus === 'Pending' ? 'bg-amber-100 text-amber-700' :
                          'bg-rose-100 text-rose-700'
                        }`}>
                          {adm.verificationStatus}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="border-t border-slate-100 my-1"></div>
              <button
                onClick={() => {
                  setShowRoleMenu(false);
                  navigate('/');
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-50"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Overview / Landing Page</span>
              </button>
            </div>
          )}
        </div>

        {/* Notifications Button */}
        <div className="relative">
          <button
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 relative transition-colors shadow-sm"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifs.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {unreadNotifs.length}
              </span>
            )}
          </button>

          {showNotifMenu && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm text-slate-800">Notifications</h3>
                  {unreadNotifs.length > 0 && (
                    <span className="px-2 py-0.5 text-[10px] bg-rose-100 text-rose-700 font-semibold rounded-full">
                      {unreadNotifs.length} new
                    </span>
                  )}
                </div>
                <button
                  onClick={markAllNotificationsAsRead}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  Mark all as read
                </button>
              </div>

              <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto my-2">
                {notifications.slice(0, 5).map(item => (
                  <div
                    key={item.id}
                    className={`py-3 px-1 flex gap-3 items-start ${
                      item.unread ? 'bg-blue-50/30' : ''
                    }`}
                  >
                    <div className="w-2 h-2 mt-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-slate-800">{item.title}</p>
                      <p className="text-xs text-slate-500">{item.message}</p>
                      <span className="text-[10px] text-slate-400 mt-1 block">{item.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Avatar & Info */}
        <div className="flex items-center gap-3 pl-2 sm:pl-3 border-l border-slate-200">
          <img
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
            alt={currentUser?.name || 'User'}
            className="w-9 h-9 rounded-full object-cover ring-2 ring-white shadow-sm border border-slate-200"
          />
          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold text-slate-800 leading-tight">
              {currentUser?.name || 'Dr. Alok Verma'}
            </p>
            <p className="text-[11px] text-slate-500 font-medium capitalize">
              {currentRole === 'super_admin' ? 'Super Administrator' : currentUser?.specialization || currentUser?.department || currentUser?.role || 'Patient'}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
