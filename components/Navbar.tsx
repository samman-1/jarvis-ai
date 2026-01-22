import React from 'react';
import { HexagonLogo } from './ui/Hexagon';
import { useLanguage } from '../contexts/LanguageContext';

export const Navbar: React.FC = () => {
  const { t, language, toggleLanguage, openLeadForm } = useLanguage();

  const navItems = [
    { label: 'nav.protocol', id: 'how-we-work' },
    { label: 'nav.tools', id: 'smart-tools' },
    { label: 'nav.work', id: 'where-we-work' },
    { label: 'nav.us', id: 'origin' }
  ];

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <HexagonLogo className="w-10 h-10 group-hover:animate-pulse" />
          <div className="flex flex-col">
            <span className="text-2xl font-bold tracking-tighter text-white uppercase">JARVIS<span className="text-jarvis-orange">AI</span></span>
            <span className="text-[10px] text-gray-500 font-mono tracking-widest leading-none rtl:tracking-normal">{t('nav.system_online')}</span>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a 
              key={item.id} 
              href={`#${item.id}`} 
              onClick={(e) => handleScroll(e, item.id)}
              className="text-sm font-mono rtl:font-arabic text-gray-400 hover:text-jarvis-orange transition-colors uppercase tracking-widest rtl:tracking-wider"
            >
              {t(item.label)}
            </a>
          ))}
          
          <button 
            onClick={toggleLanguage}
            className="text-sm font-mono text-white hover:text-jarvis-orange transition-colors border border-white/20 px-3 py-1 rounded hover:border-jarvis-orange/50"
          >
            {language === 'en' ? 'AR' : 'EN'}
          </button>

          <button 
            onClick={openLeadForm}
            className="px-6 py-2 border border-jarvis-orange/50 text-jarvis-orange text-xs font-mono uppercase tracking-widest hover:bg-jarvis-orange hover:text-black transition-all duration-300 clip-hex rtl:font-arabic rtl:font-bold"
          >
            {t('nav.start')}
          </button>
        </div>
      </div>
    </nav>
  );
};