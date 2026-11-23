import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  CalendarPlus,
  Activity,
  CalendarCheck,
  Bell,
  User,
  Settings,
  LogOut,
  Users,
  Clock,
  Stethoscope,
  Building2,
  FileBarChart,
  ShieldAlert,
  ChevronRight,
  HeartPulse,
  Crown,
  UserCheck,
  Network,
  Database,
  Building
} from 'lucide-react';

export const Sidebar = ({ role, activeTab, onTabChange, isMobileOpen, onCloseMobile }) => {
  const { logout, notifications, queueState, hospitalAdmins, hospitals } = useApp();
  const navigate = useNavigate();
  const unreadCount = notifications.filter(n => n.unread).length;
  const pendingApprovalsCount = (hospitalAdmins || []).filter(a => a.verificationStatus === 'Pending').length;

  const patientNav = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'book', label: 'Book Appointment', icon: CalendarPlus },
    { id: 'live-queue', label: 'Live Queue', icon: Activity, badge: queueState.patientToken },
    { id: 'appointments', label: 'My Appointments', icon: CalendarCheck },
    { id: 'notifications', label: 'Notifications', icon: Bell, count: unreadCount },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const doctorNav = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'today-queue', label: "Today's Queue", icon: Activity, badge: queueState.liveQueue?.length || 0 },
    { id: 'appointments', label: 'Appointments', icon: CalendarCheck },
    { id: 'patients', label: 'Patients', icon: Users },
    { id: 'availability', label: 'Availability', icon: Clock },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const adminNav = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'doctors', label: 'Doctors', icon: Stethoscope },
    { id: 'departments', label: 'Departments', icon: Building2 },
    { id: 'appointments', label: 'Appointments', icon: CalendarCheck },
    { id: 'patients', label: 'Patients', icon: Users },
    { id: 'reports', label: 'Reports', icon: FileBarChart },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const superAdminNav = [
    { id: 'dashboard', label: 'Super Overview', icon: Crown },
    { id: 'hospitals', label: 'Hospitals Directory', icon: Building2, badge: (hospitals || []).length },
    { id: 'verification', label: 'Admin Verification', icon: UserCheck, count: pendingApprovalsCount },
    { id: 'mapping', label: '1-to-1 Mapping', icon: Network },
    { id: 'architecture', label: 'Schema & Architecture', icon: Database },
    { id: 'settings', label: 'Global Settings', icon: Settings },
  ];

  let items = patientNav;
  let activeBg = 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30';
  let roleBadge = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
  let roleTitle = 'Patient Portal';
  let iconGlow = 'from-blue-600 to-indigo-500';

  if (role === 'doctor') {
    items = doctorNav;
    activeBg = 'bg-blue-600 text-white shadow-lg shadow-blue-900/30';
    roleBadge = 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    roleTitle = 'Doctor Portal';
    iconGlow = 'from-blue-600 to-cyan-500';
  } else if (role === 'admin') {
    items = adminNav;
    activeBg = 'bg-purple-600 text-white shadow-lg shadow-purple-900/30';
    roleBadge = 'bg-purple-500/20 text-purple-300 border-purple-500/30';
    roleTitle = 'Hospital Admin';
    iconGlow = 'from-purple-600 to-indigo-500';
  } else if (role === 'super_admin' || role === 'superadmin') {
    items = superAdminNav;
    activeBg = 'bg-amber-600 text-white shadow-lg shadow-amber-900/30';
    roleBadge = 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold';
    roleTitle = 'Super Admin';
    iconGlow = 'from-amber-500 to-orange-600';
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Vertical Dark Navy Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#0d1527] text-slate-300 flex flex-col border-r border-slate-800/80 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-20 px-6 flex items-center justify-between border-b border-slate-800/60">
          <div
            onClick={() => navigate('/')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${iconGlow} flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform`}>
              {role === 'super_admin' ? (
                <Crown className="w-6 h-6 text-amber-200 animate-pulse" />
              ) : (
                <HeartPulse className="w-6 h-6 animate-pulse" />
              )}
            </div>
            <div>
              <span className="font-bold text-xl text-white tracking-tight flex items-center">
                Medi<span className="text-blue-400">Queue</span>
              </span>
              <span className={`text-[10px] tracking-wider font-semibold uppercase px-1.5 py-0.5 rounded border ${roleBadge}`}>
                {roleTitle}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 py-6 px-3.5 space-y-1.5 overflow-y-auto">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 group ${
                  isActive
                    ? activeBg
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-5 h-5 transition-colors ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.count > 0 && (
                  <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-500 text-slate-950 font-bold animate-pulse">
                    {item.count}
                  </span>
                )}

                {item.badge !== undefined && item.badge !== null && !item.count && (
                  <span className="px-2 py-0.5 text-[11px] font-semibold rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Section with Logout */}
        <div className="p-4 border-t border-slate-800/80">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};
