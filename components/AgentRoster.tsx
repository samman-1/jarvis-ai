import React from 'react';
import { motion } from 'framer-motion';
import { AGENTS } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';
import { Settings, ShieldCheck, BadgeDollarSign } from 'lucide-react';

const agentIcons: Record<string, React.ReactNode> = {
  a1: <BadgeDollarSign className="w-24 h-24 text-jarvis-orange opacity-40" />,
  a2: <Settings className="w-24 h-24 text-jarvis-orange opacity-40" />,
  a3: <ShieldCheck className="w-24 h-24 text-jarvis-orange opacity-40" />,
};

export const AgentRoster: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="smart-tools" className="py-16 lg:py-24 bg-[#080808] relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-12 lg:mb-16 border-b border-white/10 pb-6">
           <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 uppercase tracking-tight">{t('agents.title')}</h2>
              <p className="text-jarvis-orange font-mono text-xs uppercase tracking-widest rtl:tracking-normal">{t('agents.subtitle')}</p>
           </div>
           <div className="hidden md:block font-mono text-xs text-gray-600 rtl:font-arabic">
             {t('agents.sync')} <span className="animate-pulse text-green-500">{t('agents.online')}</span>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {AGENTS.map((agent, i) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-black border border-white/10 relative group overflow-hidden h-full flex flex-col"
            >
              {/* Card Header Effect */}
              <div className="h-1 bg-gradient-to-r from-transparent via-jarvis-orange to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              {/* Image Container */}
              <div className="relative h-56 md:h-64 overflow-hidden border-b border-white/10 bg-[linear-gradient(135deg,#1a1a1a_0%,#000000_100%)] flex items-center justify-center">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                  {agentIcons[agent.id]}
                </div>
                
                <div className="absolute inset-0 bg-jarvis-orange/10 opacity-0 group-hover:opacity-20 z-20 transition-opacity"></div>
                
                <img 
                  src={agent.image} 
                  alt={agent.name} 
                  className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700 relative z-0"
                  onLoad={(e) => {
                    (e.target as HTMLImageElement).classList.remove('opacity-0');
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>

              {/* Content */}
              <div className="p-6 flex-grow flex flex-col">
                <h3 className="text-xl font-bold text-white mb-1 uppercase tracking-wider">{t(`agents.${agent.id}.name`)}</h3>
                <p className="text-sm text-gray-500 mb-6 font-mono border-b border-dashed border-white/10 pb-4 rtl:font-arabic">{t(`agents.${agent.id}.role`)}</p>
                
                <div className="flex justify-between items-center mt-auto">
                   <div className="text-xs text-gray-400">
                      <span className="block text-[10px] text-gray-600 uppercase rtl:font-arabic">{t('agents.specialty')}</span>
                      <span className="rtl:font-arabic font-bold">{t(`agents.${agent.id}.spec`)}</span>
                   </div>
                </div>
              </div>

              {/* Corner Accents */}
              <div className="absolute top-2 right-2 rtl:right-auto rtl:left-2 w-2 h-2 border-t border-r rtl:border-r-0 rtl:border-l border-jarvis-orange opacity-50"></div>
              <div className="absolute bottom-2 left-2 rtl:left-auto rtl:right-2 w-2 h-2 border-b border-l rtl:border-l-0 rtl:border-r border-jarvis-orange opacity-50"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};