import React from 'react';
import { motion } from 'framer-motion';
import { Handshake, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const Academy: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="academy" className="py-20 lg:py-28 bg-[#0a0a0a] relative overflow-hidden">
      {/* Background Tech Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,69,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,69,0,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-50"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* The Special Unit Container with Strict 1px Orange Border */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="border border-jarvis-orange bg-black/40 backdrop-blur-md p-8 md:p-12 lg:p-16 relative overflow-hidden"
        >
          {/* Subtle Industrial Corner Details */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-jarvis-orange/60"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-jarvis-orange/60"></div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content Side */}
            <div className="order-2 lg:order-1">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-jarvis-orange/10 border border-jarvis-orange/30 rounded-lg shadow-[0_0_20px_rgba(255,69,0,0.1)]">
                  <Handshake className="w-8 h-8 text-jarvis-orange" />
                </div>
                <h2 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter">
                  {t('academy.title')}
                </h2>
              </div>

              <h3 className="text-lg md:text-xl font-bold text-jarvis-orange mb-6 font-mono tracking-wider uppercase leading-snug max-w-xl">
                {t('academy.subtitle')}
              </h3>

              <div className="relative mb-10">
                <p className="text-gray-300 font-mono rtl:font-arabic text-sm md:text-base leading-relaxed border-l-2 border-jarvis-orange/30 pl-6 rtl:border-l-0 rtl:border-r-2 rtl:pl-0 rtl:pr-6">
                  {t('academy.body')}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                {[1, 2, 3].map((i) => (
                  <motion.div 
                    key={i} 
                    whileHover={{ x: 10 }}
                    className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded group hover:border-jarvis-orange/50 transition-all shadow-sm"
                  >
                    <ShieldCheck className="w-6 h-6 text-jarvis-orange shrink-0" />
                    <span className="text-[11px] md:text-sm font-mono text-white uppercase tracking-widest font-bold rtl:font-arabic">
                      {t(`academy.bullet${i}`)}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Visual Side: Symbolizing Trust and Upgrade */}
            <div className="order-1 lg:order-2 flex justify-center">
              <div className="relative">
                {/* Large Holographic Trust Core */}
                <div className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border border-dashed border-jarvis-orange/20 rounded-full"
                  />
                  <motion.div 
                    animate={{ rotate: -360 }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-4 border border-jarvis-orange/10 rounded-full"
                  />
                  
                  {/* Central Handshake / Trust Icon */}
                  <Handshake className="w-32 h-32 md:w-48 md:h-48 text-jarvis-orange opacity-40 filter drop-shadow-[0_0_30px_rgba(255,69,0,0.5)]" />
                  
                  {/* Digital Pulse Ring */}
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 bg-jarvis-orange/5 rounded-full"
                  />
                </div>
                
                {/* Float Badges - Strictly Mono & Bold */}
                <motion.div 
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-6 -right-6 bg-jarvis-orange text-black px-6 py-2 text-[11px] font-black uppercase tracking-[0.2em] skew-x-12 shadow-[0_0_20px_rgba(255,69,0,0.4)]"
                >
                  ZERO COST
                </motion.div>
                
                <motion.div 
                  animate={{ y: [10, -10, 10] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute -bottom-6 -left-6 border border-jarvis-orange bg-black px-6 py-2 text-[11px] text-jarvis-orange font-mono font-bold uppercase tracking-[0.2em] -skew-x-12"
                >
                  AI MANAGER v1.0
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};