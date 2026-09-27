'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { useAppState } from '@/components/StateContext';
import confetti from 'canvas-confetti';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  CheckCircle2, 
  Sliders, 
  Coffee, 
  Moon, 
  Sun, 
  Check, 
  Music,
  Maximize2,
  Shield,
  Star,
  X
} from 'lucide-react';

const FocusEnvironment = dynamic(
  () => import('@/components/3d/FocusEnvironment').then(m => m.FocusEnvironment),
  { ssr: false }
);

function FocusInner() {
  const searchParams = useSearchParams();
  const initialTaskId = searchParams.get('taskId') || '';

  const { tasks, logFocusSession } = useAppState();

  const [theme, setTheme] = useState<'sanctum' | 'cosmos' | 'zen'>('sanctum');
  const [selectedTaskId, setSelectedTaskId] = useState(initialTaskId);
  const [durationMinutes, setDurationMinutes] = useState(25);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [completedSessionsCount, setCompletedSessionsCount] = useState(0);

  // Custom time modal
  const [isCustomTimeOpen, setIsCustomTimeOpen] = useState(false);
  const [customTimeInput, setCustomTimeInput] = useState(30);

  // Completion modal state
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [sessionRating, setSessionRating] = useState(5);
  const [sessionNotes, setSessionNotes] = useState('');

  // Distraction Shield checklist
  const [shieldChecks, setShieldChecks] = useState<Record<string, boolean>>({
    notifications: true,
    tabs: false,
    water: true
  });

  // Soundscape audio synthesizer states
  const [soundscape, setSoundscape] = useState<'none' | 'rain' | 'binaural' | 'stream'>('none');
  const [volume, setVolume] = useState(0.4);
  const [isMuted, setIsMuted] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const soundNodesRef = useRef<{ oscillator?: OscillatorNode; gain?: GainNode; noiseSource?: AudioBufferSourceNode } | null>(null);

  // Keyboard shortcut listener: Space to toggle play/pause, Esc to reset
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === 'Space') {
        e.preventDefault();
        setIsActive(prev => !prev);
      } else if (e.code === 'Escape') {
        resetTimer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Timer Tick Interval
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeftSeconds > 0) {
      interval = setInterval(() => {
        setTimeLeftSeconds(prev => prev - 1);
      }, 1000);
    } else if (isActive && timeLeftSeconds === 0) {
      triggerSessionEnd();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeftSeconds]);

  // Web Audio Synthesizer logic
  useEffect(() => {
    stopSoundscape();

    if (soundscape === 'none') return;

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const masterGain = ctx.createGain();
      const currentGain = isMuted ? 0 : volume;
      masterGain.gain.setValueAtTime(currentGain, ctx.currentTime);
      masterGain.connect(ctx.destination);

      if (soundscape === 'binaural') {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(432, ctx.currentTime);
        
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(500, ctx.currentTime);

        osc.connect(filter);
        filter.connect(masterGain);
        osc.start();
        soundNodesRef.current = { oscillator: osc, gain: masterGain };
      } else if (soundscape === 'rain' || soundscape === 'stream') {
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
          output[i] *= 0.11;
          b6 = white * 0.115926;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = ctx.createBiquadFilter();
        if (soundscape === 'stream') {
          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(700, ctx.currentTime);
          filter.Q.setValueAtTime(1.5, ctx.currentTime);
        } else {
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(450, ctx.currentTime);
        }

        whiteNoise.connect(filter);
        filter.connect(masterGain);
        whiteNoise.start();

        soundNodesRef.current = { noiseSource: whiteNoise, gain: masterGain };
      }
    } catch (e) {
      console.warn('Audio context init notice:', e);
    }

    return () => stopSoundscape();
  }, [soundscape, isMuted]);

  useEffect(() => {
    if (soundNodesRef.current?.gain && audioCtxRef.current) {
      const activeVol = isMuted ? 0 : volume;
      soundNodesRef.current.gain.gain.setValueAtTime(activeVol, audioCtxRef.current.currentTime);
    }
  }, [volume, isMuted]);

  const stopSoundscape = () => {
    if (soundNodesRef.current?.oscillator) {
      soundNodesRef.current.oscillator.stop();
      soundNodesRef.current.oscillator.disconnect();
    }
    if (soundNodesRef.current?.noiseSource) {
      soundNodesRef.current.noiseSource.stop();
      soundNodesRef.current.noiseSource.disconnect();
    }
    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      audioCtxRef.current.close().catch(() => {});
    }
    audioCtxRef.current = null;
    soundNodesRef.current = null;
  };

  const triggerSessionEnd = () => {
    setIsActive(false);
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 }
    });
    setShowCompletionModal(true);
  };

  const finalizeSessionLog = () => {
    const targetTask = tasks.find(t => t.id === selectedTaskId);
    logFocusSession({
      userId: 'usr_001',
      taskId: selectedTaskId || undefined,
      taskTitle: targetTask ? targetTask.title : undefined,
      durationMinutes,
      sessionType: durationMinutes >= 45 ? 'deepwork' : 'pomodoro',
      environment3D: theme,
      rating: sessionRating,
      notes: sessionNotes || `Focus sprint completed in ${theme} space.`
    });

    setCompletedSessionsCount(prev => prev + 1);
    setTimeLeftSeconds(durationMinutes * 60);
    setShowCompletionModal(false);
    setSessionNotes('');
  };

  const setTimerPreset = (mins: number) => {
    setIsActive(false);
    setDurationMinutes(mins);
    setTimeLeftSeconds(mins * 60);
  };

  const handleApplyCustomTime = (e: React.FormEvent) => {
    e.preventDefault();
    if (customTimeInput > 0 && customTimeInput <= 180) {
      setTimerPreset(customTimeInput);
      setIsCustomTimeOpen(false);
    }
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeftSeconds(durationMinutes * 60);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const currentTask = tasks.find(t => t.id === selectedTaskId);
  const progressPercent = Math.round(((durationMinutes * 60 - timeLeftSeconds) / (durationMinutes * 60)) * 100);

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between overflow-hidden">
      {/* 3D Immersive Canvas Layer */}
      <FocusEnvironment theme={theme} isTicking={isActive} />

      {/* Main Focus UI Cockpit */}
      <div className="relative z-10 max-w-4xl mx-auto w-full px-4 sm:px-6 py-6 flex-1 flex flex-col items-center justify-center">
        
        {/* Top Controls: 3D Environment Selector & Fullscreen */}
        <div className="flex items-center gap-2 mb-8 flex-wrap justify-center">
          <div className="glass-panel px-4 py-2 rounded-full flex items-center gap-3 text-xs border border-white/10">
            <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              Atmosphere:
            </span>
            <button
              onClick={() => setTheme('sanctum')}
              className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                theme === 'sanctum'
                  ? 'bg-sky-500 text-slate-950 font-bold shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Sanctum (Teal)
            </button>
            <button
              onClick={() => setTheme('cosmos')}
              className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                theme === 'cosmos'
                  ? 'bg-purple-500 text-white font-bold shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Cosmos (Nebula)
            </button>
            <button
              onClick={() => setTheme('zen')}
              className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                theme === 'zen'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Zen (Warm Amber)
            </button>
          </div>

          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-full glass-panel hover:bg-white/10 text-slate-300 border border-white/10 transition-colors cursor-pointer"
            title="Toggle Distraction-free Fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        {/* Focus Timer Display */}
        <div className="text-center relative">
          {/* Associated Task pill */}
          <div className="mb-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 max-w-md truncate">
            <span className="w-2 h-2 rounded-full bg-teal-400" />
            <span>Target: {currentTask ? currentTask.title : 'Free Cognitive Flow'}</span>
          </div>

          <div className="relative w-72 h-72 sm:w-84 sm:h-84 mx-auto flex items-center justify-center">
            {/* SVG Progress Circle */}
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                className="stroke-slate-800"
                strokeWidth="3"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                className="stroke-sky-400 transition-all duration-500"
                strokeWidth="4"
                strokeDasharray="282.7"
                strokeDashoffset={282.7 - (282.7 * progressPercent) / 100}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            {/* Inner Timer Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-5xl sm:text-6xl font-black text-white tracking-tighter drop-shadow-xl font-mono">
                {formatTime(timeLeftSeconds)}
              </span>
              <span className="text-xs uppercase tracking-widest text-slate-400 mt-2 font-semibold">
                {isActive ? 'In Focus Flow' : 'Paused (Space to Toggle)'}
              </span>
            </div>
          </div>

          {/* Preset Buttons */}
          <div className="flex items-center justify-center gap-2 mt-6 flex-wrap">
            {[15, 25, 45, 60].map(mins => (
              <button
                key={mins}
                onClick={() => setTimerPreset(mins)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  durationMinutes === mins
                    ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                    : 'bg-white/5 text-slate-400 border-white/5 hover:text-white'
                }`}
              >
                {mins} mins
              </button>
            ))}
            <button
              onClick={() => setIsCustomTimeOpen(true)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-white/10 bg-white/5 text-slate-300 hover:text-white cursor-pointer"
            >
              Custom...
            </button>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={resetTimer}
              className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-colors cursor-pointer"
              title="Reset Timer (Esc)"
              aria-label="Reset Timer"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            <button
              onClick={() => setIsActive(!isActive)}
              className="px-8 py-4 bg-gradient-to-r from-sky-500 via-teal-400 to-sky-500 text-slate-950 font-black text-base rounded-2xl shadow-xl shadow-sky-500/30 hover:scale-105 transition-all cursor-pointer flex items-center gap-2"
              aria-label={isActive ? 'Pause Focus Session' : 'Start Focus Session'}
            >
              {isActive ? (
                <>
                  <Pause className="w-5 h-5 fill-current" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-current" />
                  <span>Start Focus</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Audio Soundscapes & Distraction Shield Panel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mt-10">
          
          {/* Soundscapes Synthesizer */}
          <div className="glass-panel p-4 rounded-2xl border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Music className="w-3.5 h-3.5 text-teal-400" />
                Audio Ambience
              </span>
              <span className="text-[10px] text-teal-300 font-mono">WebAudio</span>
            </div>

            <div className="grid grid-cols-2 gap-1.5 mb-3">
              {[
                { id: 'none', label: 'Off' },
                { id: 'rain', label: 'Rain' },
                { id: 'binaural', label: '432Hz Drone' },
                { id: 'stream', label: 'Stream' }
              ].map(s => (
                <button
                  key={s.id}
                  onClick={() => setSoundscape(s.id as 'none' | 'rain' | 'binaural' | 'stream')}
                  className={`py-1.5 px-2 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                    soundscape === s.id
                      ? 'bg-teal-500/20 text-teal-300 border-teal-500/40 font-bold'
                      : 'bg-white/5 text-slate-400 border-white/5 hover:text-white'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {soundscape !== 'none' && (
              <div className="flex items-center gap-3 pt-2 border-t border-white/5 text-xs text-slate-400">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`p-1 rounded-md transition-colors ${isMuted ? 'text-red-400 hover:text-red-300' : 'text-teal-400 hover:text-teal-300'}`}
                  title={isMuted ? 'Unmute soundscape' : 'Mute soundscape'}
                  aria-label="Toggle mute"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  disabled={isMuted}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-400 disabled:opacity-40"
                  aria-label="Ambience Volume Slider"
                />
                <span className="text-[10px] font-mono text-slate-400 w-8 text-right">
                  {isMuted ? 'Muted' : `${Math.round(volume * 100)}%`}
                </span>
              </div>
            )}
          </div>

          {/* Associate Task */}
          <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-white block mb-1">
                Link to Assignment
              </span>
              <p className="text-[11px] text-slate-400 mb-2">
                Logs minutes automatically to this task.
              </p>
              <select
                value={selectedTaskId}
                onChange={(e) => setSelectedTaskId(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500"
              >
                <option value="">No Task (Free Flow)</option>
                {tasks.filter(t => t.status !== 'COMPLETED').map(t => (
                  <option key={t.id} value={t.id}>{t.title} ({t.priority})</option>
                ))}
              </select>
            </div>

            <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
              <span>Sessions Done Today:</span>
              <span className="text-white font-bold">{completedSessionsCount}</span>
            </div>
          </div>

          {/* Distraction Shield Pre-Flight Checklist */}
          <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col justify-between text-xs">
            <div>
              <span className="font-bold text-white flex items-center gap-1.5 mb-2">
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                Distraction Shield
              </span>
              <div className="space-y-1.5">
                {[
                  { id: 'notifications', label: 'Mute Phone & Chat Apps' },
                  { id: 'tabs', label: 'Close Non-Academic Tabs' },
                  { id: 'water', label: 'Water & Warm Tea Ready' }
                ].map(item => (
                  <label key={item.id} className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={shieldChecks[item.id] || false}
                      onChange={(e) => setShieldChecks(prev => ({ ...prev, [item.id]: e.target.checked }))}
                      className="w-3.5 h-3.5 rounded text-amber-500 bg-slate-900 border-white/10 cursor-pointer"
                    />
                    <span className={shieldChecks[item.id] ? 'line-through text-slate-400' : ''}>
                      {item.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <span className="text-[10px] text-slate-500 block pt-2 border-t border-white/5">
              Cognitive pre-flight ritual
            </span>
          </div>

        </div>

      </div>

      {/* Custom Duration Modal */}
      {isCustomTimeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-[#0F172A] border border-white/10 rounded-2xl p-6 w-full max-w-xs shadow-2xl">
            <h3 className="text-sm font-bold text-white mb-2">Custom Focus Duration</h3>
            <p className="text-xs text-slate-400 mb-4">Set target focus sprint in minutes (5 to 120 mins):</p>
            <form onSubmit={handleApplyCustomTime} className="space-y-4">
              <input
                type="number"
                min="5"
                max="120"
                value={customTimeInput}
                onChange={(e) => setCustomTimeInput(Number(e.target.value))}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCustomTimeOpen(false)}
                  className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-semibold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-xl"
                >
                  Set Timer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Session Completed Reflection Modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0F172A] border border-teal-500/40 rounded-3xl p-6 w-full max-w-md shadow-2xl animate-fade-in text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-teal-500/20 rounded-xl text-teal-400">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Focus Sprint Cleared!</h3>
                  <span className="text-xs text-teal-300">{durationMinutes} Minutes Logged</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              Excellent focus! Take a mindful 5-minute break. Rate your cognitive clarity during this block:
            </p>

            {/* 5-Star Rating */}
            <div className="flex items-center justify-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setSessionRating(star)}
                  className="p-1 text-slate-600 hover:text-amber-400 cursor-pointer transition-colors"
                >
                  <Star className={`w-6 h-6 ${star <= sessionRating ? 'text-amber-400 fill-amber-400' : ''}`} />
                </button>
              ))}
            </div>

            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Session Reflection / Notes (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="What did you solve or uncover? What's next?"
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            <button
              onClick={finalizeSessionLog}
              className="w-full py-3 bg-gradient-to-r from-teal-500 to-sky-500 hover:from-teal-400 hover:to-sky-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all cursor-pointer"
            >
              Save Session to Study History
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function FocusPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-2 border-sky-500 border-t-transparent animate-spin" />
      </div>
    }>
      <FocusInner />
    </Suspense>
  );
}
