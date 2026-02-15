import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const Navbar: React.FC = () => {
  const { t, language, toggleLanguage, openLeadForm } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { label: 'nav.academy', id: 'academy' },
    { label: 'nav.protocol', id: 'architecture' },
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
    setIsMenuOpen(false);
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="fixed top-0 w-full z-[100] bg-black lg:bg-background/90 lg:backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex justify-between items-center relative">
        {/* Branding */}
        <div 
          className="flex items-center gap-3 group cursor-pointer relative z-[110]" 
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setIsMenuOpen(false);
          }}
        >
          <div className="flex flex-col">
            <span className="text-xl md:text-2xl font-bold tracking-tighter text-white uppercase leading-none">
              JARVIS<span className="text-jarvis-orange">AI</span>
            </span>
            <span className="text-[9px] md:text-[10px] text-gray-400 font-mono tracking-widest leading-tight rtl:tracking-normal font-bold uppercase mt-0.5">
              {t('nav.system_online')}
            </span>
          </div>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => (
            <a 
              key={item.id} 
              href={`#${item.id}`} 
              onClick={(e) => handleScroll(e, item.id)}
              className="text-xs font-mono rtl:font-arabic text-gray-400 hover:text-jarvis-orange transition-colors uppercase tracking-widest rtl:tracking-wider"
            >
              {t(item.label)}
            </a>
          ))}
          
          <button 
            onClick={toggleLanguage}
            className="flex items-center gap-2 text-xs font-mono text-white hover:text-jarvis-orange transition-colors border border-white/20 px-3 py-1.5 rounded hover:border-jarvis-orange/50"
          >
            <Globe className="w-3 h-3" />
            {language === 'en' ? 'AR' : 'EN'}
          </button>

          <button 
            onClick={openLeadForm}
            className="px-6 py-2 border border-jarvis-orange/50 text-jarvis-orange text-xs font-mono uppercase tracking-widest hover:bg-jarvis-orange hover:text-black transition-all duration-300 clip-hex rtl:font-arabic rtl:font-bold"
          >
            {t('nav.start')}
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="lg:hidden relative z-[110] p-2 text-white hover:text-jarvis-orange transition-colors"
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
        >
          {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="fixed inset-0 lg:hidden bg-black z-[105] flex flex-col pt-24 px-6"
            >
              <div className="flex flex-col items-center gap-8 mt-12">
                {navItems.map((item, idx) => (
                  <motion.a
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={(e) => handleScroll(e, item.id)}
                    className="text-2xl font-mono text-white hover:text-jarvis-orange transition-colors uppercase tracking-widest text-center"
                  >
                    {t(item.label)}
                  </motion.a>
                ))}
                
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-col items-center gap-6 w-full mt-8 pt-8 border-t border-white/10"
                >
                  <button 
                    onClick={toggleLanguage}
                    className="flex items-center gap-3 text-lg font-mono text-white hover:text-jarvis-orange transition-colors"
                  >
                    <Globe className="w-5 h-5" />
                    {language === 'en' ? 'ARABIC (SAUDI)' : 'ENGLISH (US)'}
                  </button>

                  <button 
                    onClick={() => {
                      openLeadForm();
                      setIsMenuOpen(false);
                    }}
                    className="w-full py-5 bg-jarvis-orange text-black text-lg font-mono font-bold uppercase tracking-widest clip-hex shadow-[0_0_20px_rgba(255,69,0,0.3)]"
                  >
                    {t('nav.start')}
                  </button>
                </motion.div>
              </div>

              {/* Decorative background element */}
              <div className="absolute bottom-0 right-0 w-full h-1/2 pointer-events-none overflow-hidden opacity-20">
                <div className="absolute bottom-[-10%] right-[-10%] w-[300px] h-[300px] border border-jarvis-orange/20 rounded-full animate-spin-slow"></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};