import React from 'react';
import { motion } from 'framer-motion';
import { FileCode2, ShieldCheck, QrCode, Zap, Clock, Link2, BadgeCheck } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const FEATURES = [
  { icon: FileCode2, title: 'einv.f1.title', desc: 'einv.f1.desc' },
  { icon: ShieldCheck, title: 'einv.f2.title', desc: 'einv.f2.desc' },
  { icon: QrCode, title: 'einv.f3.title', desc: 'einv.f3.desc' },
  { icon: Zap, title: 'einv.f4.title', desc: 'einv.f4.desc' },
  { icon: Clock, title: 'einv.f5.title', desc: 'einv.f5.desc' },
  { icon: Link2, title: 'einv.f6.title', desc: 'einv.f6.desc' },
];

export const EInvoicing: React.FC = () => {
  const { t, openLeadForm } = useLanguage();

  return (
    <section id="einvoicing" className="py-16 lg:py-24 bg-black relative overflow-hidden border-t border-white/5">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-900/20 via-black to-black"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-12 lg:mb-16">
          <div className="inline-block border-l-2 border-jarvis-orange pl-4 mb-6 rtl:border-l-0 rtl:border-r-2 rtl:pl-0 rtl:pr-4 text-left rtl:text-right">
            <span className="text-jarvis-orange font-mono text-xs tracking-[0.2em] rtl:tracking-normal uppercase">
              {t('einv.sub')}
            </span>
          </div>

          <h2 className="text-3xl md:text-5xl font-black text-white leading-tight uppercase tracking-tight">
            {t('einv.title')}
          </h2>

          <p className="text-gray-400 font-mono rtl:font-arabic text-sm md:text-base mt-6 max-w-3xl leading-relaxed">
            {t('einv.body')}
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {FEATURES.map((f, idx) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
                className="group p-6 bg-white/[0.03] border border-white/10 hover:border-jarvis-orange/50 transition-colors duration-300 clip-hex"
              >
                <div className="w-11 h-11 flex items-center justify-center border border-jarvis-orange/40 bg-jarvis-orange/10 mb-5 group-hover:bg-jarvis-orange/20 transition-colors">
                  <Icon className="w-5 h-5 text-jarvis-orange" />
                </div>
                <h3 className="text-white font-bold text-base md:text-lg mb-2 uppercase tracking-tight rtl:font-arabic">
                  {t(f.title)}
                </h3>
                <p className="text-gray-500 text-sm font-mono rtl:font-arabic leading-relaxed">
                  {t(f.desc)}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Validation note */}
        <div className="mt-10 flex items-start gap-3 max-w-3xl mx-auto p-5 bg-white/[0.03] border border-white/10 rounded-lg">
          <BadgeCheck className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
          <p className="text-gray-400 text-sm font-mono rtl:font-arabic leading-relaxed text-left rtl:text-right">
            {t('einv.note')}
          </p>
        </div>

        {/* CTA */}
        <div className="mt-12 flex justify-center">
          <button
            onClick={openLeadForm}
            className="px-8 md:px-12 py-4 border-2 border-jarvis-orange text-jarvis-orange font-mono font-bold uppercase tracking-widest text-sm md:text-base hover:bg-jarvis-orange hover:text-black transition-all duration-300 clip-hex rtl:font-arabic"
          >
            {t('einv.cta')}
          </button>
        </div>
      </div>
    </section>
  );
};
