import React, { useState, useEffect } from 'react';
import { useSMS } from '../../context/SMSContext';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Hand,
  MonitorUp,
  MessageSquare,
  Users,
  Settings,
  CircleDot,
  Send,
  Sparkles,
  Maximize2,
  Volume2,
  VolumeX,
  Share2,
  BookOpen,
  PenTool,
  CheckCircle2,
  AlertCircle,
  Shield,
  Layers,
} from 'lucide-react';
import { ConferenceParticipant } from '../../types';

export const VideoConferenceRoom: React.FC = () => {
  const { activeConference, leaveConference, endConference, currentUser } = useSMS();

  if (!activeConference) return null;

  const isHost =
    currentUser.uid === activeConference.hostUid ||
    currentUser.role === 'teacher' ||
    currentUser.role === 'class_teacher' ||
    currentUser.role === 'principal' ||
    currentUser.role === 'super_admin';

  // Device & Stream States
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [isRecording, setIsRecording] = useState(activeConference.isRecording);
  const [sidebarView, setSidebarView] = useState<'none' | 'chat' | 'participants' | 'whiteboard'>('none');
  const [activeSlide, setActiveSlide] = useState(1);

  // In-room chat state
  const [chatMessages, setChatMessages] = useState<
    Array<{ sender: string; role: string; text: string; time: string }>
  >([
    {
      sender: activeConference.hostName,
      role: 'Host',
      text: 'Welcome everyone! Please open Chapter 9 notes on spherical lenses.',
      time: '10:02 AM',
    },
    {
      sender: 'Dia Patel',
      role: 'Student',
      text: 'Good morning ma\'am! Screen is visible.',
      time: '10:03 AM',
    },
    {
      sender: 'Kabir Mehta',
      role: 'Student',
      text: 'Audio is loud and clear.',
      time: '10:04 AM',
    },
  ]);
  const [chatInput, setChatInput] = useState('');

  // Initial simulated participants
  const [participants, setParticipants] = useState<ConferenceParticipant[]>([
    {
      id: 'HOST',
      name: activeConference.hostName,
      role: 'host',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      isAudioOn: true,
      isVideoOn: true,
      isHandRaised: false,
      isSpeaking: true,
    },
    {
      id: 'USER',
      name: currentUser.fullName,
      role: currentUser.role === 'teacher' ? 'teacher' : (currentUser.role === 'principal' ? 'principal' : 'student'),
      avatarUrl: currentUser.avatarUrl,
      isAudioOn: isAudioOn,
      isVideoOn: isVideoOn,
      isHandRaised: isHandRaised,
      isSpeaking: false,
    },
    {
      id: 'STU_02',
      name: 'Dia Patel (Roll 88911)',
      role: 'student',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      isAudioOn: false,
      isVideoOn: true,
      isHandRaised: false,
      isSpeaking: false,
    },
    {
      id: 'STU_03',
      name: 'Kabir Mehta (Roll 88912)',
      role: 'student',
      avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
      isAudioOn: false,
      isVideoOn: false,
      isHandRaised: true,
      isSpeaking: false,
    },
    {
      id: 'ADMIN_OBSERVER',
      name: 'Dr. Alok Verma (Principal)',
      role: 'principal',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      isAudioOn: false,
      isVideoOn: true,
      isHandRaised: false,
      isSpeaking: false,
    },
  ]);

  // Synchronize user participant state
  useEffect(() => {
    setParticipants((prev) =>
      prev.map((p) =>
        p.id === 'USER'
          ? {
              ...p,
              isAudioOn,
              isVideoOn,
              isHandRaised,
              isScreenSharing,
            }
          : p
      )
    );
  }, [isAudioOn, isVideoOn, isHandRaised, isScreenSharing]);

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setChatMessages((prev) => [
      ...prev,
      {
        sender: currentUser.fullName,
        role: currentUser.role === 'teacher' ? 'Teacher' : (currentUser.role === 'principal' ? 'Principal' : 'Student'),
        text: chatInput.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setChatInput('');
  };

  const handleMuteAll = () => {
    setParticipants((prev) =>
      prev.map((p) => (p.id === 'HOST' ? p : { ...p, isAudioOn: false }))
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col overflow-hidden animate-fade-in font-sans">
      {/* Top Conference Header */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-md">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-extrabold text-sm sm:text-base text-white tracking-tight">
                {activeConference.title}
              </h1>
              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                <span>LIVE</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Host: <span className="text-slate-200 font-semibold">{activeConference.hostName}</span> • Class:{' '}
              <span className="text-slate-200 font-semibold">{activeConference.className}</span> • Room Code:{' '}
              <span className="font-mono text-indigo-400">{activeConference.roomCode}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Recording Badge */}
          {isRecording && (
            <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-rose-950/80 border border-rose-800/60 text-rose-400 text-xs font-semibold">
              <CircleDot className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
              <span>REC 1080p Cloud</span>
            </div>
          )}

          {/* Attendees Count */}
          <button
            onClick={() => setSidebarView(sidebarView === 'participants' ? 'none' : 'participants')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              sidebarView === 'participants'
                ? 'bg-blue-600 border-blue-500 text-white'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>{participants.length} Active</span>
          </button>

          {/* Quick Exit */}
          <button
            onClick={() => leaveConference()}
            className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-md shadow-rose-600/30"
          >
            Leave
          </button>
        </div>
      </div>

      {/* Main Grid: Video Stream + Presentation Screen + Sidebar */}
      <div className="flex-1 flex overflow-hidden relative bg-slate-950 p-2 sm:p-4 gap-3">
        {/* Left / Center Video Stage */}
        <div className="flex-1 flex flex-col gap-3 overflow-hidden">
          {/* Main Stage: Screen Share or Teacher Main Cam */}
          <div className="flex-1 bg-slate-900 rounded-2xl border border-slate-800 relative overflow-hidden flex items-center justify-center shadow-inner">
            {isScreenSharing ? (
              /* Simulated Presentation Screen / Slides */
              <div className="w-full h-full bg-slate-950 p-6 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-4 h-4 text-blue-400" />
                    <span className="text-xs font-bold text-slate-200">
                      Live Digital Blackboard: CBSE Class 11 Physics Optics
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 text-xs">
                    <button
                      onClick={() => setActiveSlide(1)}
                      className={`px-2 py-0.5 rounded text-[11px] ${
                        activeSlide === 1 ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      Slide 1: Ray Optics
                    </button>
                    <button
                      onClick={() => setActiveSlide(2)}
                      className={`px-2 py-0.5 rounded text-[11px] ${
                        activeSlide === 2 ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      Slide 2: Lens Formula
                    </button>
                  </div>
                </div>

                {/* Blackboard Content */}
                <div className="my-auto text-center space-y-4 max-w-2xl mx-auto">
                  {activeSlide === 1 ? (
                    <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800/80 shadow-2xl text-left space-y-3 font-mono">
                      <div className="text-xs text-blue-400 font-bold uppercase">
                        Section 9.4: Refraction at Spherical Surfaces
                      </div>
                      <div className="text-lg font-bold text-white">
                        (μ₂ / v) - (μ₁ / u) = (μ₂ - μ₁) / R
                      </div>
                      <p className="text-xs text-slate-300 font-sans leading-relaxed">
                        • u = Object Distance, v = Image Distance, R = Radius of curvature.<br />
                        • Valid for paraxial rays and small apertures conforming to standard CBSE exam criteria.
                      </p>
                    </div>
                  ) : (
                    <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800/80 shadow-2xl text-left space-y-3 font-mono">
                      <div className="text-xs text-indigo-400 font-bold uppercase">
                        Lens Maker's Equation Derivation
                      </div>
                      <div className="text-lg font-bold text-white">
                        1 / f = (n - 1) × [(1 / R₁) - (1 / R₂)]
                      </div>
                      <p className="text-xs text-slate-300 font-sans leading-relaxed">
                        • For double convex lens: R₁ is positive, R₂ is negative.<br />
                        • Hence focal length is always positive in air.
                      </p>
                    </div>
                  )}
                </div>

                <div className="text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-800/80 pt-2">
                  <span>Presented by Host: {activeConference.hostName}</span>
                  <span className="text-emerald-400 font-semibold">Broadcasting to 28 Connected Classrooms</span>
                </div>
              </div>
            ) : (
              /* High-Def Teacher & Speaker Main Cam View */
              <div className="w-full h-full relative flex items-center justify-center bg-gradient-to-b from-slate-900 to-slate-950">
                <img
                  src={participants[0].avatarUrl}
                  alt="Host Teacher"
                  className="w-full h-full object-cover opacity-85"
                />

                {/* Speaker Active HUD */}
                <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/60 flex items-center space-x-2 text-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-bold text-white">{activeConference.hostName}</span>
                  <span className="text-[10px] text-blue-400 font-mono px-1.5 py-0.2 bg-blue-950/80 rounded">
                    HOST / INSTRUCTOR
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 bg-slate-950/70 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs text-slate-300 max-w-md">
                  <span className="font-semibold text-white">Topic: </span>
                  {activeConference.topicSummary}
                </div>
              </div>
            )}

            {/* In-Video Floating Self PIP Camera (Bottom Right) */}
            <div className="absolute bottom-4 right-4 w-40 sm:w-48 h-28 sm:h-32 rounded-xl bg-slate-900 border-2 border-indigo-500/80 shadow-2xl overflow-hidden">
              {isVideoOn ? (
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800 text-slate-400 p-2 text-center">
                  <VideoOff className="w-6 h-6 mb-1" />
                  <span className="text-[10px]">Camera Paused</span>
                </div>
              )}
              <div className="absolute bottom-1.5 left-1.5 bg-black/70 px-2 py-0.5 rounded text-[10px] font-bold text-white flex items-center space-x-1">
                <span>You</span>
                {isAudioOn ? (
                  <Mic className="w-2.5 h-2.5 text-emerald-400" />
                ) : (
                  <MicOff className="w-2.5 h-2.5 text-rose-400" />
                )}
              </div>
            </div>
          </div>

          {/* Horizontal Gallery of Classmates & Principal */}
          <div className="h-24 sm:h-28 flex items-center space-x-2.5 overflow-x-auto pb-1 shrink-0">
            {participants.map((p) => (
              <div
                key={p.id}
                className="w-36 sm:w-40 h-full bg-slate-900 rounded-xl border border-slate-800 relative overflow-hidden shrink-0 group hover:border-slate-700 transition-all"
              >
                {p.isVideoOn ? (
                  <img src={p.avatarUrl} alt={p.name} className="w-full h-full object-cover opacity-90" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-300 font-bold text-xs">
                    {p.name.slice(0, 2).toUpperCase()}
                  </div>
                )}

                {/* Hand Raised Alert */}
                {p.isHandRaised && (
                  <div className="absolute top-1.5 right-1.5 bg-amber-500 text-slate-950 p-1 rounded-full shadow-md animate-bounce">
                    <Hand className="w-3 h-3" />
                  </div>
                )}

                <div className="absolute bottom-1.5 left-1.5 right-1.5 bg-black/75 px-1.5 py-0.5 rounded text-[10px] flex items-center justify-between text-white truncate">
                  <span className="truncate">{p.name.split(' ')[0]}</span>
                  {p.isAudioOn ? (
                    <Mic className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                  ) : (
                    <MicOff className="w-2.5 h-2.5 text-rose-400 shrink-0" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Collapsible Sidebar (Chat or Participants) */}
        {sidebarView !== 'none' && (
          <div className="w-80 bg-slate-900 rounded-2xl border border-slate-800 flex flex-col shrink-0 overflow-hidden shadow-2xl animate-slide-left">
            {/* Sidebar Tab Header */}
            <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs font-bold text-slate-200">
              <div className="flex items-center space-x-2">
                {sidebarView === 'chat' && <MessageSquare className="w-4 h-4 text-blue-400" />}
                {sidebarView === 'participants' && <Users className="w-4 h-4 text-emerald-400" />}
                <span className="capitalize">{sidebarView}</span>
              </div>
              <button
                onClick={() => setSidebarView('none')}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            {/* TAB: LIVE IN-CLASS CHAT */}
            {sidebarView === 'chat' && (
              <div className="flex-1 flex flex-col justify-between p-3 overflow-hidden text-xs">
                <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                  {chatMessages.map((msg, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mb-0.5">
                        <span className="font-bold text-indigo-300">
                          {msg.sender} ({msg.role})
                        </span>
                        <span>{msg.time}</span>
                      </div>
                      <p className="text-slate-100 text-[11px] leading-relaxed">{msg.text}</p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendChat} className="mt-3 flex items-center space-x-1.5 pt-2 border-t border-slate-800">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask question in live class..."
                    className="flex-1 text-xs px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="p-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            )}

            {/* TAB: PARTICIPANTS ROSTER & ATTENDANCE */}
            {sidebarView === 'participants' && (
              <div className="flex-1 p-3 flex flex-col justify-between overflow-hidden text-xs">
                <div className="flex-1 overflow-y-auto space-y-2">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>In Call ({participants.length})</span>
                    {isHost && (
                      <button
                        onClick={handleMuteAll}
                        className="text-[10px] font-semibold text-rose-400 hover:text-rose-300 px-2 py-0.5 rounded bg-rose-950/80 border border-rose-800/50"
                      >
                        Mute All
                      </button>
                    )}
                  </div>

                  {participants.map((p) => (
                    <div
                      key={p.id}
                      className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-2.5 overflow-hidden">
                        <img src={p.avatarUrl} alt={p.name} className="w-7 h-7 rounded-full object-cover" />
                        <div className="truncate">
                          <div className="font-semibold text-slate-100 text-xs truncate">{p.name}</div>
                          <div className="text-[10px] text-slate-400 capitalize">{p.role}</div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1.5">
                        {p.isHandRaised && (
                          <span className="text-amber-400 font-bold text-[10px]">✋</span>
                        )}
                        {p.isAudioOn ? (
                          <Mic className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <MicOff className="w-3.5 h-3.5 text-rose-400" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-800 text-[10px] text-emerald-400 flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Session attendance automatically recorded in Firestore.</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Floating Control Bar */}
      <div className="bg-slate-900 border-t border-slate-800 px-4 py-3 flex items-center justify-between shrink-0">
        <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-400">
          <Shield className="w-4 h-4 text-indigo-400" />
          <span>WebRTC End-to-End Encrypted Session</span>
        </div>

        {/* Center Control Action Buttons */}
        <div className="flex items-center space-x-2 sm:space-x-3 mx-auto">
          {/* Mic */}
          <button
            onClick={() => setIsAudioOn(!isAudioOn)}
            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
              isAudioOn
                ? 'bg-slate-800 text-white hover:bg-slate-700 border border-slate-700'
                : 'bg-rose-600 text-white hover:bg-rose-700 shadow-md shadow-rose-600/30'
            }`}
            title={isAudioOn ? 'Mute Microphone' : 'Unmute Microphone'}
          >
            {isAudioOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>

          {/* Camera */}
          <button
            onClick={() => setIsVideoOn(!isVideoOn)}
            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
              isVideoOn
                ? 'bg-slate-800 text-white hover:bg-slate-700 border border-slate-700'
                : 'bg-rose-600 text-white hover:bg-rose-700 shadow-md shadow-rose-600/30'
            }`}
            title={isVideoOn ? 'Turn Off Camera' : 'Turn On Camera'}
          >
            {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </button>

          {/* Share Screen */}
          <button
            onClick={() => setIsScreenSharing(!isScreenSharing)}
            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
              isScreenSharing
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-2 ring-blue-400'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
            }`}
            title="Present Screen / Digital Whiteboard"
          >
            <MonitorUp className="w-5 h-5" />
          </button>

          {/* Hand Raise */}
          <button
            onClick={() => setIsHandRaised(!isHandRaised)}
            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
              isHandRaised
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/30 ring-2 ring-amber-300'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
            }`}
            title="Raise Hand for Doubt / Question"
          >
            <Hand className="w-5 h-5" />
          </button>

          {/* Chat */}
          <button
            onClick={() => setSidebarView(sidebarView === 'chat' ? 'none' : 'chat')}
            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
              sidebarView === 'chat'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
            }`}
            title="In-Call Chat"
          >
            <MessageSquare className="w-5 h-5" />
          </button>

          {/* End Call / Leave */}
          <button
            onClick={() => {
              if (isHost) {
                endConference(activeConference.sessionId);
              } else {
                leaveConference();
              }
            }}
            className="px-5 h-11 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-rose-600/40 transition-all"
          >
            <PhoneOff className="w-4 h-4" />
            <span>{isHost ? 'End Call for All' : 'Leave Class'}</span>
          </button>
        </div>

        {/* Right Info Pill */}
        <div className="hidden sm:flex items-center space-x-2">
          {isHost && (
            <button
              onClick={() => setIsRecording(!isRecording)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                isRecording
                  ? 'bg-rose-950/80 border-rose-800 text-rose-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              {isRecording ? 'Stop REC' : 'Record'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
