import React from 'react';
import { motion } from 'framer-motion';
import { GlitchText } from './ui/GlitchText';
import { useLanguage } from '../contexts/LanguageContext';

export const Hero: React.FC = () => {
  const { t, openLeadForm } = useLanguage();
  
  const systemStatus = t('hero.system_status');
  const parts = systemStatus.split(': ');
  const statusLabel = parts[0];
  const statusValue = parts[1];

  return (
    <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden pt-20 pb-12 lg:pt-32">
      {/* Video Background Placeholder */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/60 z-10 honeycomb-grid"></div>
        <img 
            src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop" 
            alt="Server Room" 
            className="w-full h-full object-cover opacity-40 grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background z-10"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-20 bg-[length:100%_2px,3px_100%] pointer-events-none"></div>
      </div>

      <div className="relative z-30 w-full max-w-5xl px-4 md:px-6 mobile-container text-center mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center w-full"
        >
          <div className="inline-flex items-center border border-jarvis-orange/30 bg-jarvis-orange/10 px-4 py-1 mb-6 lg:mb-8 rounded-full backdrop-blur-sm h-7 md:h-8 overflow-hidden scale-90 md:scale-100">
            <span className="text-jarvis-orange font-mono text-[10px] md:text-xs tracking-[0.2em] rtl:tracking-normal uppercase mr-2">
              {statusLabel}:
            </span>
            <span className="text-green-500 font-mono text-[10px] md:text-xs tracking-[0.2em] rtl:tracking-normal uppercase animate-pulse">
              {statusValue}
            </span>
          </div>
          
          <h1 className="fluid-header font-black text-white tracking-tighter mb-6 uppercase break-words w-full max-w-[90vw] md:max-w-none whitespace-normal">
            {t('hero.headline_1')} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-jarvis-orange to-red-600">
               {t('hero.headline_2')}
            </span>
          </h1>
          
          <div className="w-full max-w-[90vw] md:max-w-3xl mx-auto mb-10 flex items-center justify-center">
             <div className="text-base md:text-xl text-gray-400 font-mono rtl:font-arabic leading-relaxed min-h-[3em] w-full whitespace-normal">
                <GlitchText text={t('hero.subtext')} />
             </div>
          </div>

          <motion.button
            onClick={openLeadForm}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group relative inline-flex items-center justify-center px-8 md:px-12 py-4 overflow-hidden font-bold text-white border-2 border-jarvis-orange transition-all duration-300 bg-transparent hover:bg-jarvis-orange clip-hex"
          >
            <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-56 group-hover:h-56 opacity-10"></span>
            <span className="relative flex items-center gap-2 font-mono rtl:font-arabic rtl:font-bold tracking-widest group-hover:text-black transition-colors text-sm md:text-base">
              {t('hero.cta')}
            </span>
          </motion.button>

          <motion.div 
            className="mt-12 flex flex-col items-center gap-2"
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <span className="text-[10px] text-gray-500 font-mono uppercase tracking-widest rtl:tracking-normal">
              [ {t('hero.scroll')} ]
            </span>
            <div className="w-[1px] h-8 bg-gradient-to-b from-jarvis-orange to-transparent"></div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};