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
          className="fixed inset-0 z-[9999] bg-black flex flex-col"
        >
          {/* Top bar */}
          <div className="flex items-center justify-between px-5 sm:px-8 py-4 border-b border-white/10 shrink-0">
            <span className="text-lg font-bold tracking-tighter text-white uppercase">
              JARVIS<span className="text-jarvis-orange">AI</span>
            </span>
            <button onClick={closeVideo} aria-label="Close" className="text-gray-500 hover:text-jarvis-orange transition">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Video (16:9, fits the viewport, no download) */}
          <div className="flex-1 flex items-center justify-center p-4 sm:p-8 min-h-0">
            <video
              key={vlang}
              src={SRC[vlang]}
              controls
              playsInline
              preload="metadata"
              controlsList="nodownload"
              disablePictureInPicture
              onContextMenu={(e) => e.preventDefault()}
              className="max-w-full max-h-full rounded-lg border border-white/10 shadow-[0_0_40px_rgba(255,69,0,0.08)] bg-black"
            />
          </div>

          {/* Language switch */}
          <div className="flex items-center justify-center gap-2 pb-6 pt-2 shrink-0">
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
