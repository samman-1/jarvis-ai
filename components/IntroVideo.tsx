import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCcw, RotateCw, Volume2, VolumeX, Play } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

// The two hosted intro videos (EN + AR). Served from /public, no download button.
const SRC: Record<'en' | 'ar', string> = {
  en: '/videos/intro-en.mp4',
  ar: '/videos/intro-ar.mp4',
};

export const IntroVideo: React.FC = () => {
  const { isVideoOpen, closeVideo, language } = useLanguage();
  const [vlang, setVlang] = useState<'en' | 'ar'>(language);
  const [muted, setMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const ar = vlang === 'ar';

  // Open in whatever language the site is currently in; viewer can switch below.
  useEffect(() => { if (isVideoOpen) setVlang(language); }, [isVideoOpen, language]);

  useEffect(() => {
    document.body.style.overflow = isVideoOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isVideoOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeVideo(); };
    if (isVideoOpen) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isVideoOpen, closeVideo]);

  // Start instantly. Try with sound first (works when opened from a click); if the
  // browser blocks autoplay-with-sound, fall back to muted so it still plays at once,
  // and surface an "unmute" prompt.
  useEffect(() => {
    if (!isVideoOpen) return;
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    v.muted = false;
    setMuted(false);
    const p = v.play();
    if (p && typeof p.catch === 'function') {
      p.catch(() => { v.muted = true; setMuted(true); v.play().catch(() => {}); });
    }
  }, [isVideoOpen, vlang]);

  const skip = (d: number) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = Math.max(0, Math.min(v.duration || Infinity, v.currentTime + d));
  };
  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    if (!v.muted) v.play().catch(() => {});
  };

  const bracket = 'absolute w-6 h-6 border-jarvis-orange/70 pointer-events-none';

  return (
    <AnimatePresence>
      {isVideoOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] bg-background flex flex-col overflow-hidden"
        >
          {/* Ambient Jarvis backdrop: grid + pulsing orange glow + sweeping scanline */}
          <div className="absolute inset-0 honeycomb-grid opacity-40 pointer-events-none" />
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(circle at 50% 42%, rgba(255,69,0,0.20), transparent 60%)' }}
            animate={{ opacity: [0.55, 1, 0.55] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          />
          <div className="absolute left-0 right-0 h-24 pointer-events-none animate-scanline opacity-[0.07]"
            style={{ background: 'linear-gradient(to bottom, transparent, #FF4500, transparent)' }} />
          <div className="absolute top-0 left-0 right-0 h-px pointer-events-none"
            style={{ background: 'linear-gradient(90deg,transparent,#FF4500,transparent)' }} />

          {/* Top bar */}
          <div className="relative z-10 flex items-center justify-between px-5 sm:px-8 py-4 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-4">
              <span className="text-lg font-bold tracking-tighter text-white uppercase">
                JARVIS<span className="text-jarvis-orange">AI</span>
              </span>
              <span className="hidden sm:flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-gray-400 uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                {ar ? 'الأنظمة تعمل' : 'Systems Online'}
                <span className="text-gray-600">// {ar ? 'فيديو تعريفي' : 'Intro Feed'}</span>
              </span>
            </div>
            <button onClick={closeVideo} aria-label="Close" className="text-gray-500 hover:text-jarvis-orange transition">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Video (16:9) framed with HUD corner brackets */}
          <div className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-8 min-h-0">
            <div className="relative" style={{ maxWidth: 'min(100%, 142vh)', width: '100%' }}>
              <div className="relative w-full" style={{ aspectRatio: '16 / 9' }}>
                <video
                  ref={videoRef}
                  key={vlang}
                  src={SRC[vlang]}
                  controls
                  autoPlay
                  playsInline
                  preload="auto"
                  controlsList="nodownload"
                  disablePictureInPicture
                  onClick={() => { if (muted) toggleMute(); }}
                  onContextMenu={(e) => e.preventDefault()}
                  className="absolute inset-0 w-full h-full rounded-lg border border-jarvis-orange/25 shadow-[0_0_70px_rgba(255,69,0,0.22)] bg-black object-contain"
                />
                {/* corner brackets */}
                <span className={`${bracket} -top-1 -left-1 border-t-2 border-l-2 rounded-tl`} />
                <span className={`${bracket} -top-1 -right-1 border-t-2 border-r-2 rounded-tr`} />
                <span className={`${bracket} -bottom-1 -left-1 border-b-2 border-l-2 rounded-bl`} />
                <span className={`${bracket} -bottom-1 -right-1 border-b-2 border-r-2 rounded-br`} />

                {/* Unmute prompt (only while muted, i.e. autoplay fell back to silent) */}
                {muted && (
                  <button onClick={toggleMute}
                    className="absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full bg-jarvis-orange text-black font-mono text-[11px] font-bold uppercase tracking-widest shadow-lg hover:bg-white transition animate-pulse">
                    <Volume2 className="w-4 h-4" /> {ar ? 'اضغط للصوت' : 'Tap for sound'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Control row: skip -10 / +10, mute, then language */}
          <div className="relative z-10 flex flex-col items-center gap-4 pb-6 pt-2 shrink-0">
            <div className="flex items-center gap-3">
              <button onClick={() => skip(-10)} aria-label="Back 10 seconds"
                className="flex items-center gap-1 px-3 py-2 rounded-md border border-white/15 text-gray-300 hover:text-jarvis-orange hover:border-jarvis-orange/50 transition font-mono text-[11px]">
                <RotateCcw className="w-4 h-4" /> 10
              </button>
              <button onClick={toggleMute} aria-label={muted ? 'Unmute' : 'Mute'}
                className="w-10 h-10 grid place-items-center rounded-md border border-white/15 text-gray-300 hover:text-jarvis-orange hover:border-jarvis-orange/50 transition">
                {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <button onClick={() => skip(10)} aria-label="Forward 10 seconds"
                className="flex items-center gap-1 px-3 py-2 rounded-md border border-white/15 text-gray-300 hover:text-jarvis-orange hover:border-jarvis-orange/50 transition font-mono text-[11px]">
                10 <RotateCw className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              {(['en', 'ar'] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setVlang(l)}
                  className={`px-5 py-2 text-xs uppercase tracking-widest border transition ${
                    vlang === l
                      ? 'bg-jarvis-orange text-black border-jarvis-orange font-bold'
                      : 'border-white/15 text-gray-400 hover:text-jarvis-orange hover:border-jarvis-orange/50'
                  } ${l === 'ar' ? 'font-arabic' : 'font-mono'}`}
                >
                  {l === 'en' ? 'English' : 'العربية'}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
