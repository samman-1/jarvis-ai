import React from 'react';
import { motion } from 'framer-motion';
import { SERVICES } from '../constants';
import { Cpu, BrainCircuit, Layers, Scaling, Bot, ShieldCheck, BookOpen } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const icons: Record<string, React.ReactNode> = {
  cpu: <Cpu className="w-10 h-10 text-jarvis-orange" />,
  brain: <BrainCircuit className="w-10 h-10 text-jarvis-orange" />,
  layers: <Layers className="w-10 h-10 text-jarvis-orange" />,
  scale: <Scaling className="w-10 h-10 text-jarvis-orange" />,
  bot: <Bot className="w-10 h-10 text-jarvis-orange" />,
  shield: <ShieldCheck className="w-10 h-10 text-jarvis-orange" />,
  book: <BookOpen className="w-10 h-10 text-jarvis-orange" />,
};

export const Services: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="architecture" className="py-16 lg:py-24 bg-background relative border-b border-white/5">
       <div className="max-w-7xl mx-auto px-6 mb-12 lg:mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 uppercase tracking-tight leading-tight">
            {t('services.title')}
          </h2>
          <p className="font-mono text-gray-500 uppercase tracking-widest rtl:tracking-normal text-xs md:text-sm">
            {t('services.subtitle')}
          </p>
       </div>

       <div className="max-w-7xl mx-auto px-6">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
           {SERVICES.map((service, index) => (
             <motion.div
               key={service.id}
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: index * 0.1 }}
               className={`
                  bg-tech-gray/20 border border-white/10 p-6 lg:p-8 relative group hover:border-jarvis-orange/50 transition-colors duration-300 flex flex-col justify-between
                  ${index === 0 ? 'md:col-span-2 xl:col-span-2' : ''}
                  ${index === 3 ? 'md:row-span-2' : ''}
               `}
             >
               <div>
                  <div className="absolute top-0 right-0 rtl:right-auto rtl:left-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <span className="text-4xl md:text-6xl font-black text-white font-mono">{`0${index + 1}`}</span>
                  </div>
                  
                  <div className="mb-6 bg-black/50 p-4 rounded inline-block border border-white/5 group-hover:border-jarvis-orange/30 transition-colors shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                    {icons[service.icon]}
                  </div>
                  
                  <div className="mb-4">
                    <span className="block text-[10px] text-gray-500 font-mono uppercase tracking-[0.2em] mb-1 group-hover:text-jarvis-orange/70 transition-colors">
                      {t(`services.${service.id}.subtitle`)}
                    </span>
                    <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-jarvis-orange transition-colors uppercase tracking-wider leading-tight">
                      {t(`services.${service.id}.title`)}
                    </h3>
                  </div>
                  
                  <p className="text-gray-400 font-mono rtl:font-arabic text-sm leading-relaxed border-t border-white/5 pt-4">
                    {t(`services.${service.id}.desc`)}
                  </p>
               </div>
               
               <div className="mt-8 flex items-center justify-between">
                 <div className="flex items-center gap-2">
                    <div className="h-[2px] w-4 bg-jarvis-orange"></div>
                    <span className="text-[10px] font-mono text-jarvis-orange uppercase rtl:font-bold tracking-widest">{t('services.execute')}</span>
                 </div>
                 <div className="w-2 h-2 bg-jarvis-orange rounded-full opacity-0 group-hover:opacity-100 animate-pulse"></div>
               </div>
             </motion.div>
           ))}
         </div>
       </div>
    </section>
  );
};