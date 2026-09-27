'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAppState } from '@/components/StateContext';
import { NextActionBanner } from '@/components/ui/NextActionBanner';
import { 
  Users2, 
  Plus, 
  MessageSquare, 
  ThumbsUp, 
  Tag, 
  UserX, 
  UserCheck, 
  Send, 
  Sparkles, 
  X, 
  CheckCircle2,
  Search,
  Hourglass,
  Flame,
  Radio,
  UserPlus,
  BookOpen
} from 'lucide-react';
import { CommunityPost } from '@/types';

export default function CommunityPage() {
  const { communityPosts, addCommunityPost, toggleUpvotePost, addCommunityComment, user } = useAppState();

  const [activeTab, setActiveTab] = useState<'board' | 'rooms' | 'partners'>('board');
  const [activeTag, setActiveTag] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewPostOpen, setIsNewPostOpen] = useState(false);
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);

  // New post form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tag, setTag] = useState<CommunityPost['tag']>('General');
  const [isAnonymous, setIsAnonymous] = useState(false);

  // Comment input per post
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  // Partner connection states
  const [connectedPartners, setConnectedPartners] = useState<Record<string, boolean>>({
    'p_001': true
  });

  const tags = ['ALL', 'General', 'Algorithms', 'GATE Exam', 'Hardware', 'Workload & Wellness', 'Lab Work'];

  const filteredPosts = communityPosts.filter(p => {
    if (activeTag !== 'ALL' && p.tag !== activeTag) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchContent = p.content.toLowerCase().includes(q);
      if (!matchTitle && !matchContent) return false;
    }
    return true;
  });

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    addCommunityPost({
      title: title.trim(),
      content: content.trim(),
      tag,
      isAnonymous
    });

    setTitle('');
    setContent('');
    setIsAnonymous(false);
    setIsNewPostOpen(false);
  };

  const handleSendComment = (postId: string) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;

    addCommunityComment(postId, text);
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
  };

  const studyRooms = [
    {
      id: 'room_os',
      name: 'OS Kernel & Concurrency Lab',
      courseCode: 'CS301',
      activeStudents: 8,
      soundscape: '432Hz Ambient Drone',
      topic: 'xv6 Spinlocks & Page Replacement'
    },
    {
      id: 'room_algo',
      name: 'Algorithms & Graph Theory Sprint',
      courseCode: 'CS302',
      activeStudents: 14,
      soundscape: 'Rain Soundscape',
      topic: 'Network Flow & Dynamic Programming'
    },
    {
      id: 'room_gate',
      name: 'GATE 2027 Discrete Math Sprint',
      courseCode: 'MA301',
      activeStudents: 6,
      soundscape: 'Stream Soundscape',
      topic: 'Markov Chains & Random Walks'
    },
    {
      id: 'room_quiet',
      name: 'Late Night Quiet Focus Sanctum',
      courseCode: 'GENERAL',
      activeStudents: 19,
      soundscape: 'Binaural Silence',
      topic: 'Silent Deep Work Marathon'
    }
  ];

  const accountabilityPeers = [
    {
      id: 'p_001',
      name: 'Rohan K.',
      major: 'Computer Science',
      semester: 6,
      weeklyTarget: 28,
      streak: 12,
      focusArea: 'Operating Systems & Distributed Consensus'
    },
    {
      id: 'p_002',
      name: 'Ananya M.',
      major: 'Electrical & Electronics',
      semester: 6,
      weeklyTarget: 25,
      streak: 9,
      focusArea: 'VLSI Systems & Digital Logic'
    },
    {
      id: 'p_003',
      name: 'Vikram S.',
      major: 'Computer Science',
      semester: 6,
      weeklyTarget: 30,
      streak: 15,
      focusArea: 'GATE CS & Algorithms'
    },
    {
      id: 'p_004',
      name: 'Pooja T.',
      major: 'Mechanical Engineering',
      semester: 6,
      weeklyTarget: 24,
      streak: 7,
      focusArea: 'Thermodynamics & Finite Element Analysis'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-sky-400">
              Study Community & Peer Synergy
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
            <span className="text-xs text-slate-400">Collaborative Engineering Support</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Engineering Circles
          </h1>
        </div>

        {activeTab === 'board' && (
          <button
            onClick={() => setIsNewPostOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-500 to-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-md shadow-sky-500/20 hover:opacity-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Post Doubt / Share Insight</span>
          </button>
        )}
      </div>

      {/* UX Banner */}
      <NextActionBanner />

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 mb-8 p-1.5 bg-white/5 border border-white/10 rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab('board')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'board'
              ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Community Board</span>
          <span className="text-[10px] bg-sky-950 text-sky-300 px-1.5 py-0.2 rounded-full border border-sky-500/30">
            {communityPosts.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('rooms')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'rooms'
              ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Radio className="w-3.5 h-3.5 text-teal-400" />
          <span>Study Rooms</span>
          <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
        </button>

        <button
          onClick={() => setActiveTab('partners')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'partners'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Users2 className="w-3.5 h-3.5 text-amber-400" />
          <span>Accountability Partners</span>
        </button>
      </div>

      {/* =====================================================================
          TAB 1: COMMUNITY BOARD
          ===================================================================== */}
      {activeTab === 'board' && (
        <div>
          {/* Search & Topic Filters */}
          <div className="glass-panel p-4 rounded-2xl mb-8 space-y-3 border border-white/10">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search discussions by topic, concepts, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 overflow-x-auto text-xs pb-1">
              <span className="text-slate-400 text-[11px] font-semibold uppercase tracking-wider flex-shrink-0">
                Topics:
              </span>
              {tags.map(t => {
                const count = t === 'ALL' ? communityPosts.length : communityPosts.filter(p => p.tag === t).length;
                return (
                  <button
                    key={t}
                    onClick={() => setActiveTag(t)}
                    className={`px-3 py-1 rounded-xl flex-shrink-0 transition-colors cursor-pointer text-xs ${
                      activeTag === t
                        ? 'bg-sky-500 text-slate-950 font-bold'
                        : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <span>{t}</span>
                    <span className="ml-1.5 opacity-60 text-[10px]">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Posts List */}
          <div className="space-y-4">
            {filteredPosts.length > 0 ? (
              filteredPosts.map(post => {
                const isExpanded = expandedPostId === post.id;
                const comments = post.comments || [];

                return (
                  <div
                    key={post.id}
                    className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3 transition-all hover:border-white/20"
                  >
                    {/* Post Meta */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2 text-xs">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          post.isAnonymous ? 'bg-slate-700 text-slate-300' : 'bg-sky-500/20 text-sky-400'
                        }`}>
                          {post.isAnonymous ? '?' : post.authorName.charAt(0)}
                        </span>
                        <span className="font-semibold text-white">
                          {post.isAnonymous ? 'Anonymous Peer' : post.authorName}
                        </span>
                        {post.authorMajor && !post.isAnonymous && (
                          <span className="text-[11px] text-slate-400 hidden sm:inline">
                            • {post.authorMajor}
                          </span>
                        )}
                        <span className="text-slate-400">•</span>
                        <span className="text-[11px] text-slate-400">
                          {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                      </div>

                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-white/5 text-teal-300 border border-white/10">
                        {post.tag}
                      </span>
                    </div>

                    {/* Title & Content */}
                    <h3 className="text-base font-bold text-white tracking-tight">
                      {post.title}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                      {post.content}
                    </p>

                    {/* Actions: Upvote & Comments toggle */}
                    <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleUpvotePost(post.id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                            post.hasUpvoted
                              ? 'bg-sky-500/20 text-sky-300 border-sky-500/40 font-bold'
                              : 'bg-white/5 text-slate-400 border-white/5 hover:text-white'
                          }`}
                        >
                          <ThumbsUp className={`w-3.5 h-3.5 ${post.hasUpvoted ? 'fill-current' : ''}`} />
                          <span>{post.upvotes}</span>
                        </button>

                        <button
                          onClick={() => setExpandedPostId(isExpanded ? null : post.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>{comments.length} comments</span>
                        </button>
                      </div>
                    </div>

                    {/* Expandable Comments Drawer */}
                    {isExpanded && (
                      <div className="pt-3 border-t border-white/10 space-y-3 mt-3">
                        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                          {comments.length > 0 ? (
                            comments.map(c => (
                              <div key={c.id} className="p-3 bg-slate-900/90 rounded-xl border border-white/5 text-xs space-y-1">
                                <div className="flex items-center justify-between text-[11px] text-slate-400">
                                  <span className="font-semibold text-sky-300">{c.authorName}</span>
                                  <span>{new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <p className="text-slate-200">{c.content}</p>
                              </div>
                            ))
                          ) : (
                            <p className="text-xs text-slate-400 py-2">No replies yet. Be the first to share your approach!</p>
                          )}
                        </div>

                        {/* Reply Input */}
                        <div className="flex items-center gap-2 pt-1">
                          <input
                            type="text"
                            placeholder="Write a constructive engineering reply..."
                            value={commentInputs[post.id] || ''}
                            onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleSendComment(post.id);
                              }
                            }}
                            className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                          />
                          <button
                            onClick={() => handleSendComment(post.id)}
                            className="px-3.5 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="glass-panel p-8 rounded-2xl text-center border border-white/10 space-y-3">
                <Users2 className="w-8 h-8 text-slate-400 mx-auto" />
                <h4 className="text-sm font-bold text-white">No discussions matching this filter</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Try another topic tag or be the first to start a conversation around your course challenges.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 2: STUDY ROOMS (Virtual Silent Focus Pods)
          ===================================================================== */}
      {activeTab === 'rooms' && (
        <div className="space-y-4">
          <div className="p-4 bg-teal-950/30 border border-teal-500/25 rounded-2xl text-xs text-slate-300 flex items-start gap-3 mb-6">
            <Radio className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-teal-300 block mb-0.5">Virtual Silent Study Pods:</strong>
              Join virtual rooms shared with fellow engineering peers. Microphones are muted by default to protect deep concentration. Entering a room automatically opens Focus Studio with the room’s ambient soundscape.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {studyRooms.map((room) => (
              <div
                key={room.id}
                className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                      {room.courseCode}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      {room.activeStudents} Students In Flow
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white tracking-tight mb-1">
                    {room.name}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed mb-3">
                    Active Sprint: <strong className="text-slate-200">{room.topic}</strong>
                  </p>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                    <Hourglass className="w-3.5 h-3.5 text-teal-400" />
                    Soundscape: {room.soundscape}
                  </span>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <Link
                    href={`/focus`}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-teal-500 to-sky-500 hover:from-teal-400 hover:to-sky-400 text-slate-950 font-bold text-xs rounded-xl shadow-md shadow-teal-500/20 transition-all cursor-pointer"
                  >
                    <span>Enter Silent Focus Pod</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 3: ACCOUNTABILITY PARTNERS
          ===================================================================== */}
      {activeTab === 'partners' && (
        <div className="space-y-4">
          <div className="p-4 bg-amber-950/30 border border-amber-500/25 rounded-2xl text-xs text-slate-300 flex items-start gap-3 mb-6">
            <Flame className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-300 block mb-0.5">Engineering Accountability Pods:</strong>
              Consistency is reinforced when study targets are shared. Connect with department peers to keep your weekly focus targets on track throughout examination seasons.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {accountabilityPeers.map((peer) => {
              const isConnected = connectedPartners[peer.id] || false;

              return (
                <div
                  key={peer.id}
                  className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-400 to-amber-400 text-slate-950 font-black text-xs flex items-center justify-center">
                          {peer.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-white">{peer.name}</h3>
                          <span className="text-[11px] text-slate-400">{peer.major} • Sem {peer.semester}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-xs text-orange-400 font-bold">
                        <Flame className="w-3.5 h-3.5 fill-current" />
                        <span>{peer.streak}d streak</span>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-900/80 rounded-xl border border-white/5 space-y-1.5 my-3 text-xs">
                      <div className="flex items-center justify-between text-slate-400">
                        <span>Weekly Target:</span>
                        <strong className="text-white">{peer.weeklyTarget}h / week</strong>
                      </div>
                      <div className="flex items-center justify-between text-slate-400">
                        <span>Focus Priority:</span>
                        <span className="text-teal-300 font-medium truncate max-w-[180px]">{peer.focusArea}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/10">
                    <button
                      onClick={() => setConnectedPartners(prev => ({ ...prev, [peer.id]: !isConnected }))}
                      className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                        isConnected
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                      }`}
                    >
                      {isConnected ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Accountability Partner Connected</span>
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-3.5 h-3.5 text-amber-400" />
                          <span>Request Accountability Match</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* New Post Modal */}
      {isNewPostOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-lg p-6 sm:p-8 rounded-3xl border border-white/20 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-sky-400" />
                Start Discussion or Ask Doubt
              </h2>
              <button 
                onClick={() => setIsNewPostOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Title / Core Question</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., How do you debug deadlocks in xv6 spinlocks?"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Details & Context</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Share your assumptions, edge cases, compiler errors, or study strategies..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Topic Category</label>
                  <select
                    value={tag}
                    onChange={(e) => setTag(e.target.value as CommunityPost['tag'])}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                  >
                    <option value="General">General</option>
                    <option value="Algorithms">Algorithms</option>
                    <option value="GATE Exam">GATE Exam</option>
                    <option value="Hardware">Hardware & VLSI</option>
                    <option value="Workload & Wellness">Workload & Wellness</option>
                    <option value="Lab Work">Lab Work</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-300 text-xs">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="w-4 h-4 rounded text-sky-500 bg-slate-900 border-white/10 cursor-pointer"
                    />
                    <span>Post Anonymously</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsNewPostOpen(false)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-sky-500 to-teal-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-sky-500/20 hover:opacity-95 transition-all cursor-pointer"
                >
                  Publish to Circles
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
