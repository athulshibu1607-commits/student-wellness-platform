'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAppState } from '@/components/StateContext';
import { NextActionBanner } from '@/components/ui/NextActionBanner';
import { 
  Bot, 
  Send, 
  ShieldAlert, 
  Sparkles, 
  User, 
  AlertTriangle, 
  Lightbulb, 
  RotateCcw,
  Download,
  Code,
  HeartHandshake
} from 'lucide-react';

export default function MentorPage() {
  const { mentorMessages, sendMentorMessage, clearMentorHistory, setCrisisModalOpen, user, wellnessCheckins } = useAppState();
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const latestWellness = wellnessCheckins[0];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [mentorMessages, isSending]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim() || isSending) return;

    const messageText = inputValue.trim();
    setInputValue('');
    setIsSending(true);

    try {
      await sendMentorMessage(messageText);
    } finally {
      setIsSending(false);
    }
  };

  const samplePrompts = [
    { label: 'Exam Pacing', text: 'How do I structure my study sprints to sustain focus and energy during exams?' },
    { label: 'OS & Concurrency', text: 'Explain how to detect race conditions in multithreaded code.' },
    { label: 'Lab Overload', text: 'I have three lab submissions this week and feel overwhelmed.' },
    { label: 'Hardware/Verilog', text: 'What is the difference between blocking and non-blocking assignments in Verilog?' }
  ];

  const exportChatHistory = () => {
    const textData = mentorMessages.map(m => `[${m.sender === 'user' ? user.name : 'MentorAI'}] (${new Date(m.createdAt).toLocaleString()}):\n${m.content}\n`).join('\n---\n\n');
    const blob = new Blob([textData], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MentorAI_Chat_${user.name.replace(/\s+/g, '_')}_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col min-h-[calc(100vh-5rem)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">
              AI Academic & Wellness Co-Pilot
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            <span className="text-xs text-slate-400">Context: {user.major} Sem {user.semester}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
            MentorAI
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportChatHistory}
            className="p-2 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
            title="Export conversation history"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={clearMentorHistory}
            className="p-2 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
            title="Refresh chat session"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setCrisisModalOpen(true)}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-700/50 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            <ShieldAlert className="w-4 h-4 text-red-400" />
            <span>Need Crisis Support?</span>
          </button>
        </div>
      </div>

      {/* UX Banner */}
      <NextActionBanner />

      {/* Context & Clinical AI Identity Banner */}
      <div className="bg-purple-950/30 border border-purple-500/25 rounded-2xl p-4 mb-6 text-xs text-slate-300 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <Bot className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="text-purple-300 block mb-0.5">MentorAI Transparent Identity & Protocol:</strong>
            MentorAI is an artificial intelligence tutor and productivity companion. It <strong>is not a human counselor or licensed medical practitioner</strong>. Your current logged stress score ({latestWellness ? `${latestWellness.stressScore}/5` : 'Steady'}) is referenced to ensure pacing advice protects against cognitive fatigue.
          </div>
        </div>

        <span className="hidden md:inline-flex text-[10px] font-mono font-semibold bg-purple-500/20 text-purple-300 px-2.5 py-1 rounded-full border border-purple-500/40 flex-shrink-0">
          AI Co-Pilot Active
        </span>
      </div>

      {/* Chat Messages Panel */}
      <div className="glass-panel flex-1 rounded-3xl p-4 sm:p-6 border border-white/10 flex flex-col justify-between overflow-hidden min-h-[460px]">
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4 max-h-[55vh]">
          {mentorMessages.map((msg) => {
            const isAI = msg.sender === 'mentor_ai';
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isAI ? 'justify-start' : 'justify-end'}`}
              >
                {isAI && (
                  <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-400/40 text-purple-300 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-sm ${
                    msg.isCrisisAlert
                      ? 'bg-red-950/80 border-2 border-red-500/60 text-red-100'
                      : isAI
                      ? 'bg-slate-900/90 border border-white/10 text-slate-200'
                      : 'bg-gradient-to-r from-sky-600 to-teal-600 text-white font-medium'
                  }`}
                >
                  {msg.isCrisisAlert && (
                    <div className="flex items-center gap-1.5 font-bold text-red-400 mb-1 text-xs uppercase tracking-wider">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Crisis Safety Intercept</span>
                    </div>
                  )}

                  <p className="whitespace-pre-line">{msg.content}</p>

                  <span className="block text-[10px] text-slate-400 mt-2 text-right">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {!isAI && (
                  <div className="w-8 h-8 rounded-xl bg-sky-500/20 border border-sky-400/40 text-sky-300 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isSending && (
            <div className="flex items-start gap-3 justify-start">
              <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-400/40 text-purple-300 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-4 bg-slate-900/90 border border-white/10 rounded-2xl text-xs text-slate-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
                <span>MentorAI is analyzing your coursework and cognitive pacing...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Prompt Pills */}
        <div className="pt-3 border-t border-white/10 mb-3 flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-[11px] text-slate-400 flex items-center gap-1 flex-shrink-0 font-medium">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            Quick Prompts:
          </span>
          {samplePrompts.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInputValue(item.text);
              }}
              className="flex-shrink-0 px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg text-slate-300 hover:text-white transition-colors cursor-pointer text-xs"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} className="relative flex items-center">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask about academic strategy, concept debugging, or workload balance..."
            className="w-full bg-slate-900 border border-white/10 rounded-2xl px-4 py-3.5 pr-14 text-xs sm:text-sm text-white focus:outline-none focus:border-purple-500 transition-colors shadow-inner"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isSending}
            className="absolute right-2 p-2.5 bg-gradient-to-r from-purple-500 to-sky-500 hover:opacity-90 disabled:opacity-40 text-white rounded-xl shadow cursor-pointer transition-all"
            aria-label="Send message to MentorAI"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
