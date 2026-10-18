import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

// The two hosted intro videos (EN + AR). Served from /public, no download button.
const SRC: Record<'en' | 'ar', string> = {
  en: '/videos/intro-en.mp4',
  ar: '/videos/intro-ar.mp4',
};

export const IntroVideo: React.FC = () => {
  const { isVideoOpen, closeVideo, language } = useLanguage();
  const [vlang, setVlang] = useState<'en' | 'ar'>(language);

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

  return (
    <AnimatePresence>
      {isVideoOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] bg-background flex flex-col overflow-hidden"
        >
          {/* Ambient Jarvis backdrop: honeycomb grid + orange glow behind the video */}
          <div className="absolute inset-0 honeycomb-grid opacity-40 pointer-events-none" />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(circle at 50% 42%, rgba(255,69,0,0.16), transparent 58%)' }}
          />
          <div
            className="absolute top-0 left-0 right-0 h-px pointer-events-none"
            style={{ background: 'linear-gradient(90deg,transparent,#FF4500,transparent)' }}
          />

          {/* Top bar */}
          <div className="relative z-10 flex items-center justify-between px-5 sm:px-8 py-4 border-b border-white/10 shrink-0">
            <span className="text-lg font-bold tracking-tighter text-white uppercase">
              JARVIS<span className="text-jarvis-orange">AI</span>
            </span>
            <button onClick={closeVideo} aria-label="Close" className="text-gray-500 hover:text-jarvis-orange transition">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Video (16:9, fits the viewport, no download) */}
          <div className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-8 min-h-0">
            <video
              key={vlang}
              src={SRC[vlang]}
              controls
              playsInline
              preload="metadata"
              controlsList="nodownload"
              disablePictureInPicture
              onContextMenu={(e) => e.preventDefault()}
              className="max-w-full max-h-full rounded-lg border border-jarvis-orange/25 shadow-[0_0_60px_rgba(255,69,0,0.18)] bg-black"
            />
          </div>

          {/* Language switch */}
          <div className="relative z-10 flex items-center justify-center gap-2 pb-6 pt-2 shrink-0">
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
        </motion.div>
      )}
    </AnimatePresence>
  );
};
