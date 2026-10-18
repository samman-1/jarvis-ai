import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, Direction, LanguageContextType } from '../types';
import { translations } from '../utils/translations';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [direction, setDirection] = useState<Direction>('ltr');
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [activeLegalModal, setActiveLegalModal] = useState<'privacy' | 'terms' | null>(null);

  useEffect(() => {
    // Set direction based on language
    const dir = language === 'ar' ? 'rtl' : 'ltr';
    setDirection(dir);
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ar' : 'en');
  };

  // "Book a meeting" opens the booking overlay ON TOP of the current page (the site
  // stays behind, faded). The URL is set to /book so it's a shareable direct link;
  // opening /book cold loads the site and auto-opens the overlay over it.
  const openLeadForm = () => {
    setIsLeadFormOpen(true);
    try { if (!window.location.pathname.startsWith('/book')) window.history.pushState({ booking: true }, '', '/book'); } catch { /* noop */ }
  };
  const closeLeadForm = () => {
    setIsLeadFormOpen(false);
    try { if (window.location.pathname.startsWith('/book')) window.history.pushState({}, '', '/'); } catch { /* noop */ }
  };

  // "Watch intro" opens the intro-video view over the site, same pattern as /book.
  // /watch is a shareable direct link (for LinkedIn etc.); the back button closes it.
  const openVideo = () => {
    setIsVideoOpen(true);
    try { if (!window.location.pathname.startsWith('/watch')) window.history.pushState({ video: true }, '', '/watch'); } catch { /* noop */ }
  };
  const closeVideo = () => {
    setIsVideoOpen(false);
    try { if (window.location.pathname.startsWith('/watch')) window.history.pushState({}, '', '/'); } catch { /* noop */ }
  };

  // Direct links (/book, /watch) open the right view; the back button closes it.
  useEffect(() => {
    const sync = () => {
      const path = window.location.pathname;
      setIsLeadFormOpen(path.startsWith('/book'));
      setIsVideoOpen(path.startsWith('/watch'));
    };
    sync();
    window.addEventListener('popstate', sync);
    return () => window.removeEventListener('popstate', sync);
  }, []);

  const openLegalModal = (type: 'privacy' | 'terms') => setActiveLegalModal(type);
  const closeLegalModal = () => setActiveLegalModal(null);

  const t = (key: string): string => {
    if (!translations[key]) {
      console.warn(`Missing translation for key: ${key}`);
      return key;
    }
    return translations[key][language];
  };

  return (
    <LanguageContext.Provider value={{ 
      language, 
      direction, 
      toggleLanguage, 
      t, 
      isLeadFormOpen,
      openLeadForm,
      closeLeadForm,
      isVideoOpen,
      openVideo,
      closeVideo,
      activeLegalModal,
      openLegalModal,
      closeLegalModal
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};