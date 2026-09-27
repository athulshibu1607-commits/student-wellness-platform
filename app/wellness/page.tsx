'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { useAppState } from '@/components/StateContext';
import { NextActionBanner } from '@/components/ui/NextActionBanner';
import { EMERGENCY_RESOURCES } from '@/lib/store';
import { 
  Heart, 
  Sparkles, 
  Moon, 
  BatteryCharging, 
  ShieldAlert, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  Smile, 
  Frown, 
  Meh,
  Phone,
  Lightbulb,
  Volume2
} from 'lucide-react';
import { MoodLevel, StressLevel } from '@/types';

const BreathingOrb = dynamic(
  () => import('@/components/3d/BreathingOrb').then(m => m.BreathingOrb),
  { ssr: false }
);

export default function WellnessPage() {
  const { wellnessCheckins, logWellnessCheckin, setCrisisModalOpen } = useAppState();

  // Guided breathing state
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState('Inhale');

  // Checkin form state
  const [mood, setMood] = useState<MoodLevel>(4);
  const [stress, setStress] = useState<StressLevel>(3);
  const [sleep, setSleep] = useState<number>(7.0);
  const [energy, setEnergy] = useState<number>(4);
  const [notes, setNotes] = useState('');
  const [submittedMessage, setSubmittedMessage] = useState(false);

  const handleSubmitCheckin = (e: React.FormEvent) => {
    e.preventDefault();

    logWellnessCheckin({
      userId: 'usr_001',
      moodScore: mood,
      stressScore: stress,
      sleepHours: Number(sleep),
      energyLevel: energy,
      notes: notes.trim() || undefined
    });

    setNotes('');
    setSubmittedMessage(true);
    setTimeout(() => setSubmittedMessage(false), 4000);
  };

  const moodDescriptions: Record<number, { label: string; icon: string }> = {
    1: { label: 'Cognitively Drained', icon: '😫' },
    2: { label: 'Fatigued / Foggy', icon: '🥱' },
    3: { label: 'Neutral / Steady', icon: '😐' },
    4: { label: 'Focused & Clear', icon: '🙂' },
    5: { label: 'Peak Cognitive Flow', icon: '🚀' }
  };

  const stressDescriptions: Record<number, { label: string; color: string; advice: string }> = {
    1: { label: 'Tranquil & Calm', color: 'text-emerald-400', advice: 'Excellent equilibrium. Optimal window for tackling complex architectural proofs or deep coding.' },
    2: { label: 'Manageable Workload', color: 'text-teal-400', advice: 'Steady academic pacing. Keep maintaining your 25m/5m Pomodoro rhythm.' },
    3: { label: 'Noticeable Pressure', color: 'text-sky-400', advice: 'Normal deadline tension. Ensure you step away from screens for a 15-minute walk before lab.' },
    4: { label: 'Elevated Strain', color: 'text-amber-400', advice: 'High cognitive friction. Avoid all-nighter marathons; prioritize minimum 7 hours of restorative sleep.' },
    5: { label: 'Critical Overload', color: 'text-red-400', advice: 'Critical workload strain. Step away immediately, hydrate, practice 4-7-8 breathing, and talk to a trusted friend or academic counselor.' }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-orange-400">
              Self-Regulation & Cognitive Resiliency
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
            <span className="text-xs text-slate-400">Non-Clinical Support</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Engineering Wellness & Biofeedback
          </h1>
        </div>

        <button
          onClick={() => setCrisisModalOpen(true)}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-700/50 rounded-xl text-xs font-bold transition-all cursor-pointer"
        >
          <ShieldAlert className="w-4 h-4 text-red-400" />
          <span>Need Urgent Support? Click Here</span>
        </button>
      </div>

      {/* UX Action Anchor */}
      <NextActionBanner />

      {/* Clinical Disclaimer Banner */}
      <div className="bg-sky-950/30 border border-sky-500/20 rounded-2xl p-4 mb-8 text-xs text-slate-300 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-sky-400 flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-sky-300">Calm-by-Design Philosophy:</strong> Jijnasu is an academic self-care and workload regulation platform. Self-reported stress indices represent academic pressure and are <em>not clinical psychiatric diagnoses</em>. If you ever feel in crisis, 24/7 verified helplines are available instantly via the SOS button.
        </p>
      </div>

      {/* Main Grid: 3D Breathing Orb & Check-in Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        
        {/* Left Column: 3D Biofeedback Breathing Orb (6 Cols) */}
        <div className="lg:col-span-6 glass-panel p-6 sm:p-8 rounded-3xl flex flex-col justify-between border border-white/10">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-teal-400" />
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Pranayama 4-7-8 Breathing Orb
                </h2>
              </div>
              <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/30">
                PNS Activation
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Inhale for 4 seconds, hold for 7 seconds, exhale for 8 seconds. This biofeedback sequence engages the parasympathetic nervous system to slow heart rate after intense coding or exams.
            </p>

            {/* 3D Orb Canvas Component */}
            <div className="my-2 bg-[#060D1E]/60 rounded-2xl border border-white/5 overflow-hidden">
              <BreathingOrb 
                isRunning={isBreathingActive} 
                onPhaseChange={setCurrentPhase} 
              />
            </div>
          </div>

          {/* Breathing Controls */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-4">
            <span className="text-xs text-slate-400">
              Current Cycle: <strong className="text-teal-300">{isBreathingActive ? currentPhase : 'Standing By'}</strong>
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsBreathingActive(false)}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Reset session"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsBreathingActive(!isBreathingActive)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-teal-500 to-sky-500 hover:from-teal-400 hover:to-sky-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-teal-500/20 transition-all cursor-pointer"
              >
                {isBreathingActive ? (
                  <>
                    <Pause className="w-4 h-4 fill-current" />
                    <span>Pause Exercise</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Begin Breathing</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Daily Wellness Pulse Check-in (6 Cols) */}
        <div className="lg:col-span-6 glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Heart className="w-5 h-5 text-orange-400" />
              <h2 className="text-lg font-bold text-white tracking-tight">
                Daily Cognitive Pulse Check-in
              </h2>
            </div>
            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              Record today's state to correlate academic velocity with sleep and stress levels.
            </p>

            {submittedMessage && (
              <div className="p-3 mb-4 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Check-in logged! Thank you for maintaining self-awareness today.</span>
              </div>
            )}

            <form onSubmit={handleSubmitCheckin} className="space-y-4">
              {/* Mood selector (1 to 5) */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <label className="font-semibold text-white">Mood Clarity</label>
                  <span className="text-slate-300 font-medium">
                    {moodDescriptions[mood].icon} {moodDescriptions[mood].label}
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {[1, 2, 3, 4, 5].map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setMood(val as MoodLevel)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        mood === val
                          ? 'bg-sky-500 text-black border-sky-400 shadow'
                          : 'bg-white/5 text-slate-300 border-white/5 hover:bg-white/10'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stress level selector (1 to 5) */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <label className="font-semibold text-white">Workload Stress Level</label>
                  <span className={`font-semibold ${stressDescriptions[stress].color}`}>
                    {stressDescriptions[stress].label}
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-2 mb-2">
                  {[1, 2, 3, 4, 5].map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setStress(val as StressLevel)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        stress === val
                          ? 'bg-orange-500 text-black border-orange-400 shadow'
                          : 'bg-white/5 text-slate-300 border-white/5 hover:bg-white/10'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
                {/* Real-time Dynamic Stress Insight */}
                <div className="p-2.5 bg-white/5 border border-white/5 rounded-xl text-[11px] text-slate-300 flex items-start gap-2">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <span>{stressDescriptions[stress].advice}</span>
                </div>
              </div>

              {/* Sleep & Energy */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-white mb-1.5 flex items-center gap-1.5">
                    <Moon className="w-3.5 h-3.5 text-sky-400" />
                    Sleep ({sleep} hrs)
                  </label>
                  <input
                    type="range"
                    min="4"
                    max="12"
                    step="0.5"
                    value={sleep}
                    onChange={(e) => setSleep(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white mb-1.5 flex items-center gap-1.5">
                    <BatteryCharging className="w-3.5 h-3.5 text-teal-400" />
                    Energy Level ({energy}/5)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    value={energy}
                    onChange={(e) => setEnergy(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
                  />
                </div>
              </div>

              {/* Reflection Notes */}
              <div>
                <label className="block text-xs font-semibold text-white mb-1">
                  Academic Reflections & Thoughts (Optional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="What is occupying your mental RAM today? Labs, tests, or breakthroughs?"
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all cursor-pointer"
              >
                Log Today's Wellness Pulse
              </button>
            </form>
          </div>
        </div>

      </div>

      {/* Emergency Helplines Direct Directory */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-400" />
            24/7 Verified Emergency Mental Health Helplines
          </h3>
          <span className="text-[10px] text-teal-300 font-mono">Toll-Free & Confidential</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {EMERGENCY_RESOURCES.slice(0, 4).map(res => (
            <div key={res.id} className="p-3 bg-white/5 rounded-xl border border-white/5 flex flex-col justify-between">
              <div>
                <span className="font-bold text-xs text-white block mb-0.5">{res.name}</span>
                <span className="text-[10px] text-slate-400 block mb-2">{res.available}</span>
              </div>
              <a
                href={res.actionUrl}
                className="inline-flex items-center justify-center gap-1.5 py-1.5 px-3 bg-red-950/40 hover:bg-red-900/60 border border-red-700/40 rounded-lg text-red-300 text-xs font-bold transition-colors cursor-pointer"
              >
                <Phone className="w-3 h-3" />
                <span>Call {res.phone}</span>
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* History of Wellness Logs */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-teal-400" />
          Recent Check-in Logs ({wellnessCheckins.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {wellnessCheckins.map((item) => (
            <div key={item.id} className="p-4 bg-white/5 rounded-2xl border border-white/5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span>{new Date(item.createdAt).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                  <span className="font-semibold text-slate-300">{item.sleepHours}h sleep</span>
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-bold text-white">Mood: {item.moodScore}/5</span>
                  <span className="text-xs font-bold text-orange-400">Stress: {item.stressScore}/5</span>
                </div>
                {item.notes && (
                  <p className="text-xs text-slate-300 italic line-clamp-3">
                    "{item.notes}"
                  </p>
                )}
              </div>

              <div className="mt-3 pt-2 border-t border-white/5 text-[10px] text-slate-500">
                Logged at {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
