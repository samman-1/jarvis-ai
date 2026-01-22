import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { INDUSTRIES } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';

export const Industries: React.FC = () => {
  const { t } = useLanguage();
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <section id="where-we-work" className="py-16 lg:py-24 bg-background border-t border-white/5 relative overflow-hidden min-h-[700px] md:min-h-[900px]">
      {/* Background Tech Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,69,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,69,0,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
      
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 mb-12 lg:mb-16 text-center">
        <h2 className="text-2xl md:text-4xl font-bold text-white mb-4 uppercase tracking-tighter leading-tight">
          {t('industries.title')} <br className="md:hidden" /> <span className="text-jarvis-orange">///</span> <br className="md:hidden" /> {t('industries.subtitle')}
        </h2>
        <p className="text-gray-500 font-mono text-[10px] md:text-xs tracking-[0.2em] rtl:tracking-normal uppercase animate-pulse">
          {t('industries.instruction')}
        </p>
      </div>

      {/* Hubs Interactive Grid - Stacks on Mobile */}
      <div className="max-w-7xl mx-auto px-6 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-4">
          {INDUSTRIES.map((industry) => {
            const isActive = activeId === industry.id;
            
            return (
              <div key={industry.id} className="relative flex flex-col items-center">
                {/* Main Square Node */}
                <motion.div
                  onClick={() => setActiveId(isActive ? null : industry.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    w-full aspect-square max-w-[200px] md:max-w-none flex flex-col items-center justify-center cursor-pointer relative transition-all duration-300
                    border-2 ${isActive ? 'bg-jarvis-orange/20 border-jarvis-orange shadow-[0_0_30px_rgba(255,69,0,0.3)]' : 'bg-tech-gray/40 border-white/10 hover:border-jarvis-orange/50'}
                  `}
                >
                  <div className="text-center p-4">
                    <h3 className={`font-mono text-sm md:text-base font-bold uppercase tracking-widest ${isActive ? 'text-white' : 'text-gray-400'}`}>
                      {t(`ind.${industry.id}.name`)}
                    </h3>
                  </div>
                  
                  {/* Geometric Decoration */}
                  <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-white/20"></div>
                  <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-white/20"></div>
                  
                  {isActive && (
                    <motion.div 
                      layoutId="active-indicator"
                      className="absolute inset-0 border border-white/40 pointer-events-none"
                    />
                  )}
                </motion.div>

                {/* Sub-Nodes revealed on click */}
                <div className="relative w-full">
                  <AnimatePresence>
                    {isActive && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden md:absolute md:top-12 md:left-0 md:right-0 z-30"
                      >
                        {/* Connecting Lines SVG - Hidden on mobile stack for clarity */}
                        <svg className="hidden md:block absolute top-[-48px] left-0 w-full h-[300px] pointer-events-none overflow-visible" style={{ zIndex: -1 }}>
                           {[0, 1, 2].map((i) => {
                             const targetY = 120 + (i * 60);
                             return (
                               <line 
                                 key={`line-${i}`}
                                 x1="50%" 
                                 y1="50%" 
                                 x2="50%" 
                                 y2={`${targetY + 15}px`} 
                                 stroke="#FF4500" 
                                 strokeWidth="2" 
                                 opacity="0.8"
                               />
                             );
                           })}
                        </svg>

                        {/* Stacked Sub-Nodes */}
                        <div className="flex flex-col items-center gap-4 md:gap-6 mt-4 md:mt-16 pb-8 md:pb-0">
                           {[1, 2, 3].map((num, i) => (
                             <div
                               key={`sol-${i}`}
                               className="bg-black/95 border border-jarvis-orange p-3 w-40 text-center backdrop-blur-md shadow-xl"
                             >
                               <span className="text-white text-[10px] md:text-[11px] font-mono block uppercase whitespace-nowrap">
                                 {t(`ind.${industry.id}.sol${num}`)}
                               </span>
                             </div>
                           ))}
                           
                           {/* Detail Description */}
                           <div className="w-full max-w-[280px] md:w-48 bg-tech-gray border-l-4 border-jarvis-orange p-4 mt-2 md:mt-4 text-left shadow-2xl">
                              <p className="text-gray-300 text-xs font-sans leading-relaxed">
                                {t(`ind.${industry.id}.detail`)}
                              </p>
                           </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent pointer-events-none"></div>
    </section>
  );
};