import React from 'react';
import { motion } from 'framer-motion';
import { GlitchText } from './ui/GlitchText';
import { useLanguage } from '../contexts/LanguageContext';

export const AntiSaaS: React.FC = () => {
  const { t, language } = useLanguage();

  return (
    <section id="protocol" className="relative py-16 lg:py-24 bg-background border-b border-white/5 overflow-hidden">
        {/* Background Grid Accent */}
        <div className="absolute right-0 rtl:right-auto rtl:left-0 top-0 w-1/2 h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-20"></div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 mobile-container flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
        {/* Left: Text */}
        <div className="relative z-10 w-full lg:w-3/5 flex flex-col">
          <div className="flex items-center gap-2 mb-6">
             <div className="w-2 h-2 bg-jarvis-orange rounded-full animate-pulse"></div>
             <span className="text-jarvis-orange font-mono text-sm tracking-widest rtl:tracking-normal uppercase">{t('antisaas.label')}</span>
          </div>
          
          <motion.h2 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="fluid-header-sub font-bold text-white mb-8 leading-tight rtl:leading-tight uppercase tracking-tight break-words w-full max-w-4xl whitespace-normal"
          >
            {language === 'en' ? (
              <>SAAS FORCES YOU TO <span className="line-through decoration-jarvis-orange decoration-4">ADAPT</span>.</>
            ) : (
              t('antisaas.headline_main')
            )}
            <br />
            <span className="text-jarvis-orange">{t('antisaas.headline_sub')}</span>
          </motion.h2>
          
          <div className="space-y-6 text-gray-400 text-base md:text-lg border-l-2 rtl:border-l-0 rtl:border-r-2 border-jarvis-orange/20 pl-6 rtl:pl-0 rtl:pr-6 w-full max-w-full mr-0">
             <p className="rtl:font-arabic whitespace-normal break-words">
                {t('antisaas.body')}
             </p>
             <p className="font-mono rtl:font-arabic text-white whitespace-normal break-words w-full max-w-full">
                <GlitchText text={t('antisaas.glitch')} />
             </p>
          </div>
        </div>

        {/* Right: Abstract 3D/Visual Element */}
        <div className="relative h-[300px] md:h-[400px] w-full lg:w-2/5 flex items-center justify-center mt-8 lg:mt-0">
           <div className="relative w-48 h-48 md:w-80 md:h-80">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border border-dashed border-jarvis-orange/30 rounded-full"
              ></motion.div>
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute inset-4 border border-jarvis-orange/20 rounded-full"
              ></motion.div>
              
              {/* Central Hexagon */}
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="relative w-24 h-24 md:w-32 md:h-32 bg-black/80 backdrop-blur-md border border-jarvis-orange flex items-center justify-center clip-hex z-20">
                    <span className="text-2xl md:text-4xl font-mono text-white">AI</span>
                 </div>
                 {/* Orbiting particles */}
                 {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-full h-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear", delay: i * 0.5 }}
                    >
                        <div className="w-2 md:w-3 h-2 md:h-3 bg-jarvis-orange rounded-full absolute top-0 left-1/2 -translate-x-1/2 shadow-[0_0_10px_#FF4500]"></div>
                    </motion.div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </section>
  );
};