import React from 'react';

export const StatusBadge = ({ status, size = 'sm' }) => {
  let colorStyles = 'bg-slate-100 text-slate-700 border-slate-200';
  let dotColor = 'bg-slate-400';

  const normalized = (status || '').toLowerCase();

  if (normalized === 'waiting') {
    colorStyles = 'bg-amber-50 text-amber-700 border-amber-200/80';
    dotColor = 'bg-amber-500';
  } else if (normalized === 'in consultation' || normalized === 'consultation' || normalized === 'serving') {
    colorStyles = 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
    dotColor = 'bg-emerald-500 animate-pulse';
  } else if (normalized === 'completed' || normalized === 'verified' || normalized === 'approved') {
    colorStyles = 'bg-teal-50 text-teal-700 border-teal-200/80';
    dotColor = 'bg-teal-500';
  } else if (normalized === 'cancelled' || normalized === 'rejected') {
    colorStyles = 'bg-rose-50 text-rose-700 border-rose-200/80';
    dotColor = 'bg-rose-500';
  } else if (normalized === 'pending') {
    colorStyles = 'bg-amber-50 text-amber-800 border-amber-300 font-semibold';
    dotColor = 'bg-amber-500 animate-pulse';
  } else if (normalized === 'emergency') {
    colorStyles = 'bg-red-100 text-red-800 border-red-300 font-semibold';
    dotColor = 'bg-red-600 animate-ping';
  } else if (normalized === 'active') {
    colorStyles = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    dotColor = 'bg-emerald-500';
  } else if (normalized === 'unassigned') {
    colorStyles = 'bg-slate-100 text-slate-500 border-slate-200 italic';
    dotColor = 'bg-slate-400';
  }

  const sizeClasses = size === 'xs' 
    ? 'text-[11px] px-2 py-0.5' 
    : size === 'md' 
    ? 'text-sm px-3 py-1 font-medium' 
    : 'text-xs px-2.5 py-1 font-medium';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border shadow-sm ${sizeClasses} ${colorStyles}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></span>
      <span className="capitalize">{status}</span>
    </span>
  );
};
