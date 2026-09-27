'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAppState } from '@/components/StateContext';
import { NextActionBanner } from '@/components/ui/NextActionBanner';
import { 
  Bell, 
  CheckCheck, 
  Clock, 
  Heart, 
  ShieldAlert, 
  ArrowRight, 
  Info, 
  CheckCircle2 
} from 'lucide-react';

export default function NotificationsPage() {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useAppState();
  const [filterType, setFilterType] = useState<string>('ALL');

  const filtered = notifications.filter(n => {
    if (filterType !== 'ALL' && n.type !== filterType) return false;
    return true;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'deadline': return <Clock className="w-4 h-4 text-amber-400" />;
      case 'wellness': return <Heart className="w-4 h-4 text-teal-400" />;
      case 'crisis': return <ShieldAlert className="w-4 h-4 text-red-400" />;
      default: return <Info className="w-4 h-4 text-sky-400" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-sky-400">
              Alerts & Mindful Nudges
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
            <span className="text-xs text-slate-400">{notifications.filter(n => !n.isRead).length} Unread</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Notification Center
          </h1>
        </div>

        <button
          onClick={markAllNotificationsRead}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
        >
          <CheckCheck className="w-4 h-4 text-teal-400" />
          <span>Mark All Read</span>
        </button>
      </div>

      {/* UX Banner */}
      <NextActionBanner />

      {/* Filter Tabs */}
      <div className="glass-panel p-2.5 rounded-2xl mb-6 flex items-center gap-2 overflow-x-auto text-xs border border-white/10">
        {['ALL', 'deadline', 'wellness', 'system'].map(t => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`px-3 py-1.5 rounded-xl capitalize transition-colors cursor-pointer ${
              filterType === t
                ? 'bg-sky-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t === 'ALL' ? 'All Alerts' : `${t}s`}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.map(notif => (
          <div
            key={notif.id}
            className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
              notif.isRead
                ? 'bg-[#0B132B]/40 border-white/5 text-slate-400'
                : 'bg-[#0E1B38] border-sky-500/30 text-white shadow-md'
            }`}
          >
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex-shrink-0 mt-0.5">
                {getIcon(notif.type)}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-sm text-white">{notif.title}</h3>
                  {!notif.isRead && (
                    <span className="w-2 h-2 rounded-full bg-sky-400" />
                  )}
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">
                    {notif.type}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-1">
                  {notif.message}
                </p>
                <span className="text-[10px] text-slate-500">
                  {new Date(notif.createdAt).toLocaleDateString()} at {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              {notif.actionUrl && (
                <Link
                  href={notif.actionUrl}
                  onClick={() => markNotificationRead(notif.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/30 rounded-xl text-xs font-semibold transition-colors"
                >
                  <span>Open Action</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              )}

              {!notif.isRead && (
                <button
                  onClick={() => markNotificationRead(notif.id)}
                  className="p-1.5 hover:text-white text-slate-400 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                  title="Mark as read"
                >
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-500 text-xs">
            No notifications found under this filter.
          </div>
        )}
      </div>
    </div>
  );
}
