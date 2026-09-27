'use client';

import React from 'react';
import { useAppState } from '@/components/StateContext';
import { EMERGENCY_RESOURCES } from '@/lib/store';
import { AlertTriangle, Phone, ShieldAlert, X, HeartHandshake, ExternalLink } from 'lucide-react';

export const CrisisModal: React.FC = () => {
  const { crisisModalOpen, setCrisisModalOpen } = useAppState();

  if (!crisisModalOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="crisis-dialog-title"
    >
      <div className="relative w-full max-w-2xl bg-[#0B132B] border-2 border-red-500/50 rounded-2xl shadow-2xl p-6 sm:p-8 text-white overflow-hidden">
        {/* Ambient warning halo */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-amber-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-500/20 border border-red-500/40 rounded-xl text-red-400">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div>
              <h2 id="crisis-dialog-title" className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                We Are Here For You
              </h2>
              <p className="text-sm text-red-200/80">
                You are not alone. Free, confidential support is available right now.
              </p>
            </div>
          </div>
          <button
            onClick={() => setCrisisModalOpen(false)}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Close crisis support modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Clinical Disclaimer Notice */}
        <div className="bg-red-950/40 border border-red-800/40 rounded-xl p-4 mb-6 text-sm text-red-200">
          <p className="font-semibold flex items-center gap-2 mb-1 text-red-300">
            <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
            Important Notice
          </p>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Jijnasu is an academic productivity companion and is <strong>not a medical crisis provider or human counselor</strong>. If you or someone you know is feeling overwhelmed, please connect directly with trained human care professionals below.
          </p>
        </div>

        {/* Emergency Resources Directory */}
        <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
          {EMERGENCY_RESOURCES.map((resource) => (
            <div 
              key={resource.id} 
              className="bg-[#14213D]/70 border border-slate-700/60 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-teal-500/50 transition-all"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-semibold text-white text-base">{resource.name}</span>
                  <span className="text-[11px] font-medium bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded-full border border-teal-500/30">
                    {resource.badge}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    • {resource.available}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mb-2 leading-relaxed">
                  {resource.description}
                </p>
                <div className="text-xs text-slate-400">
                  Region: <span className="text-slate-200">{resource.region}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <a
                  href={resource.actionUrl}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-medium text-sm rounded-xl shadow-lg shadow-red-900/30 transition-all cursor-pointer"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call {resource.phone}</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <HeartHandshake className="w-4 h-4 text-teal-400" />
            <span>24/7 National & Campus Support Services</span>
          </div>
          <button
            onClick={() => setCrisisModalOpen(false)}
            className="text-slate-400 hover:text-white underline underline-offset-2 transition-colors cursor-pointer"
          >
            I am safe now (Return to platform)
          </button>
        </div>
      </div>
    </div>
  );
};
