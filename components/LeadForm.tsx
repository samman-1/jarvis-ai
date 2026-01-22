import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Cpu, BrainCircuit, Layers, Scaling, Bot, ShieldCheck, BookOpen } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const SECTORS = [
  { id: 's1', icon: Cpu },
  { id: 's2', icon: BrainCircuit },
  { id: 's3', icon: Layers },
  { id: 's4', icon: Scaling },
  { id: 's5', icon: Bot },
  { id: 's6', icon: ShieldCheck },
  { id: 's7', icon: BookOpen },
];

export const LeadForm: React.FC = () => {
  const { t, isLeadFormOpen, closeLeadForm } = useLanguage();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedSector, setSelectedSector] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const handleClose = () => {
    closeLeadForm();
    setTimeout(() => {
      setIsSubmitted(false);
      setSelectedSector(null);
    }, 300);
  };

  // Auto-close after 6 seconds on success
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    if (isSubmitted && isLeadFormOpen) {
      timeoutId = setTimeout(() => {
        handleClose();
      }, 6000);
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isSubmitted, isLeadFormOpen]);

  const showOperationalParams = selectedSector === 's1' || selectedSector === 's3';

  return (
    <AnimatePresence>
      {isLeadFormOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl overflow-hidden"
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 30 }}
            className="relative w-full lg:w-[60vw] max-w-5xl max-h-[85vh] bg-black/95 border border-jarvis-orange clip-hex overflow-y-auto p-6 md:p-12 shadow-[0_0_80px_rgba(255,69,0,0.2)] custom-scrollbar"
          >
            {/* Close Button */}
            <button 
              onClick={handleClose}
              className="absolute top-6 right-6 rtl:right-auto rtl:left-6 text-gray-500 hover:text-jarvis-orange transition-colors z-[60]"
              aria-label="Close partnership protocol"
            >
              <X className="w-6 h-6 md:w-8 md:h-8" />
            </button>

            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-8 md:space-y-10 pb-12">
                {/* Header */}
                <div className="border-b border-white/10 pb-6 pr-10">
                  <h2 className="text-xl md:text-3xl lg:text-4xl font-black text-white tracking-tighter uppercase font-mono leading-tight">
                    {t('form.title')}
                  </h2>
                  <p className="text-jarvis-orange font-mono text-[9px] md:text-[10px] mt-2 uppercase tracking-[0.2em] opacity-70">
                    Awaiting Handshake Protocol...
                  </p>
                </div>

                {/* Section A: Identity */}
                <div className="space-y-4 md:space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-jarvis-orange rounded-full animate-pulse"></div>
                    <h3 className="text-[10px] md:text-xs font-mono text-gray-400 uppercase tracking-widest">{t('form.identity_header')}</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div className="space-y-1 md:space-y-2">
                      <label className="text-[9px] font-mono text-gray-500 uppercase">{t('form.name')}</label>
                      <input required type="text" className="w-full bg-tech-gray/50 border border-white/10 px-4 py-3 md:py-4 text-white font-mono text-sm focus:border-jarvis-orange outline-none transition-colors" />
                    </div>
                    <div className="space-y-1 md:space-y-2">
                      <label className="text-[9px] font-mono text-gray-500 uppercase">{t('form.email')}</label>
                      <input required type="email" className="w-full bg-tech-gray/50 border border-white/10 px-4 py-3 md:py-4 text-white font-mono text-sm focus:border-jarvis-orange outline-none transition-colors" />
                    </div>
                    <div className="space-y-1 md:space-y-2">
                      <label className="text-[9px] font-mono text-gray-500 uppercase">{t('form.company')}</label>
                      <input required type="text" className="w-full bg-tech-gray/50 border border-white/10 px-4 py-3 md:py-4 text-white font-mono text-sm focus:border-jarvis-orange outline-none transition-colors" />
                    </div>
                    <div className="space-y-1 md:space-y-2">
                      <label className="text-[9px] font-mono text-gray-500 uppercase">{t('form.phone')}</label>
                      <input required type="tel" className="w-full bg-tech-gray/50 border border-white/10 px-4 py-3 md:py-4 text-white font-mono text-sm focus:border-jarvis-orange outline-none transition-colors" />
                    </div>
                  </div>
                </div>

                {/* Section B: Target Sector Grid */}
                <div className="space-y-4 md:space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-jarvis-orange rounded-full animate-pulse"></div>
                    <h3 className="text-[10px] md:text-xs font-mono text-gray-400 uppercase tracking-widest">{t('form.sector_header')}</h3>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 md:gap-3">
                    {SECTORS.map((sector) => (
                      <button
                        key={sector.id}
                        type="button"
                        onClick={() => setSelectedSector(sector.id)}
                        className={`
                          group p-3 md:p-4 border transition-all flex flex-col items-center justify-center gap-2 h-24 md:h-28
                          ${selectedSector === sector.id 
                            ? 'bg-jarvis-orange/20 border-jarvis-orange shadow-[0_0_20px_rgba(255,69,0,0.1)]' 
                            : 'bg-black/50 border-white/10 hover:border-jarvis-orange/50'}
                        `}
                      >
                        <sector.icon className={`w-5 h-5 md:w-6 md:h-6 ${selectedSector === sector.id ? 'text-jarvis-orange' : 'text-gray-500 group-hover:text-jarvis-orange'}`} />
                        <span className={`text-[7px] md:text-[8px] font-mono uppercase tracking-tighter text-center leading-none ${selectedSector === sector.id ? 'text-white' : 'text-gray-600'}`}>
                          {t(`services.${sector.id}.title`)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Section C: Conditional Parameters */}
                <AnimatePresence>
                  {showOperationalParams && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-4 md:space-y-6 pt-4 border-t border-white/5">
                        <div className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 bg-jarvis-orange rounded-full animate-pulse"></div>
                          <h3 className="text-[10px] md:text-xs font-mono text-gray-400 uppercase tracking-widest">{t('form.ops_header')}</h3>
                        </div>
                        <div className="grid grid-cols-1 gap-4 md:gap-6">
                          <div className="space-y-1 md:space-y-2">
                            <label className="text-[9px] font-mono text-gray-500 uppercase">{t('form.workflow_desc')}</label>
                            <textarea required className="w-full bg-tech-gray/50 border border-white/10 px-4 py-3 md:py-4 text-white font-mono text-sm focus:border-jarvis-orange outline-none transition-colors min-h-[80px] md:min-h-[100px] resize-none" />
                          </div>
                          <div className="space-y-1 md:space-y-2">
                            <label className="text-[9px] font-mono text-gray-500 uppercase">{t('form.stack')}</label>
                            <input required type="text" className="w-full bg-tech-gray/50 border border-white/10 px-4 py-3 md:py-4 text-white font-mono text-sm focus:border-jarvis-orange outline-none transition-colors" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Section D: Recon */}
                <div className="space-y-4 md:space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-jarvis-orange rounded-full animate-pulse"></div>
                    <h3 className="text-[10px] md:text-xs font-mono text-gray-400 uppercase tracking-widest">{t('form.recon_header')}</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 items-end">
                    <div className="space-y-1 md:space-y-2">
                      <label className="text-[9px] font-mono text-gray-500 uppercase">{t('form.data_volume')}</label>
                      <div className="relative">
                        <select required className="w-full bg-tech-gray/50 border border-white/10 px-4 py-3 md:py-4 text-white font-mono text-sm focus:border-jarvis-orange outline-none transition-colors appearance-none cursor-pointer pr-10">
                          <option value="low">{t('form.vol_low')}</option>
                          <option value="med">{t('form.vol_med')}</option>
                          <option value="enterprise">{t('form.vol_ent')}</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                          <Scaling className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                    <div className="pb-1 md:pb-3">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative w-5 h-5 border border-white/20 group-hover:border-jarvis-orange transition-all">
                           <input type="checkbox" className="peer absolute inset-0 opacity-0 cursor-pointer z-10" />
                           <div className="absolute inset-1 bg-jarvis-orange opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                        </div>
                        <span className="text-[9px] md:text-[10px] font-mono text-gray-400 uppercase tracking-wider group-hover:text-white transition-colors">
                          {t('form.nda')}
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Submit Action */}
                <button 
                  type="submit"
                  disabled={!selectedSector}
                  className={`
                    w-full py-4 md:py-6 bg-jarvis-orange text-black font-mono font-bold uppercase tracking-[0.2em] md:tracking-[0.4em] transition-all
                    ${!selectedSector ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white hover:tracking-[0.3em] md:hover:tracking-[0.6em]'}
                  `}
                >
                  {t('form.submit')}
                </button>
              </form>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 md:py-16 text-center space-y-6 md:space-y-8"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 border-2 border-green-500 rounded-full mb-4">
                  <div className="w-3 h-3 md:w-4 md:h-4 bg-green-500 rounded-full animate-ping"></div>
                </div>
                <div className="space-y-4 px-4">
                  <h3 className="text-2xl md:text-3xl font-bold text-white uppercase font-mono tracking-tighter">
                    {t('form.success')}
                  </h3>
                  <p className="text-gray-400 font-mono text-[11px] md:text-sm leading-relaxed max-w-md mx-auto">
                    {t('form.success_body')}
                  </p>
                  <p className="text-jarvis-orange font-mono text-[9px] md:text-[10px] uppercase tracking-[0.2em] animate-pulse">
                    Handshake verified. Uplink active.
                  </p>
                </div>
                <button 
                  onClick={handleClose}
                  className="px-8 md:px-10 py-3 border border-white/20 text-white font-mono text-[10px] md:text-xs uppercase hover:bg-white hover:text-black transition-all tracking-[0.2em]"
                >
                  {t('form.close')}
                </button>
              </motion.div>
            )}

            {/* Background Decoration */}
            <div className="absolute -bottom-20 -right-20 w-48 h-48 md:w-64 md:h-64 bg-jarvis-orange/5 rounded-full blur-[100px] pointer-events-none"></div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};