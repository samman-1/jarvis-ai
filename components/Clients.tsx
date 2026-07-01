import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

// Client logos live in /public/clients/ (served at /clients/*). Transparent PNGs.
// imgClass tunes each logo's height so they read at a balanced optical size
// (wide marks sit shorter; stacked marks sit taller) while staying center-aligned.
// `nudge` optically re-centers marks whose visual weight isn't box-centered.
const CLIENTS = [
  { name: 'CADI', logo: '/clients/cadi.png', imgClass: 'max-h-[52px] md:max-h-[60px]', nudge: '' },
  { name: 'Doccia', logo: '/clients/doccia.png', imgClass: 'max-h-[80px] md:max-h-[92px]', nudge: '' },
  { name: 'Middle East Chef', logo: '/clients/mec.png', imgClass: 'max-h-[78px] md:max-h-[90px]', nudge: '' },
  { name: 'Sahb', logo: '/clients/sahb.png', imgClass: 'max-h-[46px] md:max-h-[54px]', nudge: 'translate-y-[7px] md:translate-y-[9px]' },
];

export const Clients: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="clients" className="py-16 lg:py-24 bg-black relative overflow-hidden border-t border-white/5">
      {/* Ambient radial glow to match the rest of the site */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-900/20 via-black to-black"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-12 lg:mb-16">
          <div className="inline-block border-l-2 border-jarvis-orange pl-4 mb-6 rtl:border-l-0 rtl:border-r-2 rtl:pl-0 rtl:pr-4 text-left rtl:text-right">
            <span className="text-jarvis-orange font-mono text-xs tracking-[0.2em] rtl:tracking-normal uppercase">
              {t('clients.sub')}
            </span>
          </div>

          <h2 className="text-3xl md:text-5xl font-black text-white leading-tight uppercase tracking-tight">
            {t('clients.headline')}
          </h2>

          <p className="text-gray-500 font-mono rtl:font-arabic text-sm md:text-base mt-5 max-w-2xl">
            {t('clients.body')}
          </p>
        </div>

        {/* Logo grid — equal centered cells keep every mark on one center line */}
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-10 md:gap-x-16 lg:gap-x-20">
          {CLIENTS.map((client, idx) => (
            <motion.div
              key={client.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: idx * 0.12 }}
              className="group flex items-center justify-center h-28 w-44 md:w-52"
            >
              <img
                src={client.logo}
                alt={client.name}
                loading="lazy"
                className={`w-auto max-w-full object-contain select-none
                           opacity-50 grayscale transition-all duration-500 ease-out
                           group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-110
                           group-hover:brightness-110 group-hover:drop-shadow-[0_0_22px_rgba(255,69,0,0.45)]
                           ${client.imgClass} ${client.nudge}`}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
