import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, Direction, LanguageContextType } from '../types';
import { translations } from '../utils/translations';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [direction, setDirection] = useState<Direction>('ltr');
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);
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

  const openLeadForm = () => setIsLeadFormOpen(true);
  const closeLeadForm = () => setIsLeadFormOpen(false);

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