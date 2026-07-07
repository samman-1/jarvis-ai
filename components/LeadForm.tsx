import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../utils/translations';

// n8n webhook the form posts to. Set VITE_N8N_WEBHOOK_URL in .env.local (dev) and in Vercel (prod).
const WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL as string | undefined;

// Cloudflare Turnstile SITE key (public). If unset, the CAPTCHA is skipped and the
// form behaves exactly as before — so this is safe to ship before the key is configured.
const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined;
const TURNSTILE_SCRIPT_ID = 'cf-turnstile-script';

// Minimal typing for the Turnstile global injected by Cloudflare's script.
declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      remove: (id: string) => void;
      reset: (id?: string) => void;
    };
  }
}

const SECTORS = [
  { id: 'finance', label: 'sector.finance' },
  { id: 'healthcare', label: 'sector.healthcare' },
  { id: 'supply_chain', label: 'sector.supply_chain' },
  { id: 'ecommerce', label: 'sector.ecommerce' },
  { id: 'real_estate', label: 'sector.real_estate' },
  { id: 'hr', label: 'sector.hr' },
  { id: 'custom', label: 'sector.custom' },
];

const SUB_SYSTEMS: Record<string, string[]> = {
  finance: ['opt.finance.auditing', 'opt.finance.cashflow', 'opt.finance.expenses', 'opt.other'],
  healthcare: ['opt.healthcare.records', 'opt.healthcare.support', 'opt.healthcare.billing', 'opt.other'],
  supply_chain: ['opt.supply_chain.tracking', 'opt.supply_chain.stock', 'opt.supply_chain.planner', 'opt.other'],
  ecommerce: ['opt.ecommerce.pricing', 'opt.ecommerce.chat', 'opt.ecommerce.orders', 'opt.other'],
  real_estate: ['opt.real_estate.portals', 'opt.real_estate.contracts', 'opt.real_estate.maintenance', 'opt.other'],
  hr: ['opt.hr.hiring', 'opt.hr.payroll', 'opt.hr.onboarding', 'opt.other'],
};

export const LeadForm: React.FC = () => {
  const { t, language, isLeadFormOpen, closeLeadForm } = useLanguage();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [subSystem, setSubSystem] = useState<string>('');
  const [customDescription, setCustomDescription] = useState<string>('');

  // Identity fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  // Honeypot (bots fill this; humans never see it)
  const [honeypot, setHoneypot] = useState('');
  // Cloudflare Turnstile token (only used when TURNSTILE_SITE_KEY is set)
  const [turnstileToken, setTurnstileToken] = useState('');
  const turnstileRef = useRef<HTMLDivElement | null>(null);
  const turnstileWidgetId = useRef<string | null>(null);
  // Submission status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Load + render the Turnstile widget while the form is open (no-op if no site key).
  useEffect(() => {
    if (!TURNSTILE_SITE_KEY || !isLeadFormOpen) return;

    const renderWidget = () => {
      const el = turnstileRef.current;
      if (!el || !window.turnstile || turnstileWidgetId.current) return;
      turnstileWidgetId.current = window.turnstile.render(el, {
        sitekey: TURNSTILE_SITE_KEY,
        theme: 'dark',
        callback: (token: string) => setTurnstileToken(token),
        'expired-callback': () => setTurnstileToken(''),
        'error-callback': () => setTurnstileToken(''),
      });
    };

    if (window.turnstile) {
      renderWidget();
    } else {
      let script = document.getElementById(TURNSTILE_SCRIPT_ID) as HTMLScriptElement | null;
      if (!script) {
        script = document.createElement('script');
        script.id = TURNSTILE_SCRIPT_ID;
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      }
      script.addEventListener('load', renderWidget, { once: true });
    }

    return () => {
      if (turnstileWidgetId.current && window.turnstile) {
        try { window.turnstile.remove(turnstileWidgetId.current); } catch { /* already gone */ }
      }
      turnstileWidgetId.current = null;
      setTurnstileToken('');
    };
  }, [isLeadFormOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Silently absorb bot submissions (honeypot filled) — show success, send nothing.
    if (honeypot) {
      setIsSubmitted(true);
      return;
    }

    // Require a Turnstile token only when the CAPTCHA is enabled.
    if (TURNSTILE_SITE_KEY && !turnstileToken) {
      setErrorMsg(t('form.error'));
      return;
    }

    if (!WEBHOOK_URL) {
      console.error('VITE_N8N_WEBHOOK_URL is not configured.');
      setErrorMsg(t('form.error'));
      return;
    }

    // Resolve human-readable English labels so the team notification isn't raw keys.
    const sectorLabel = selectedSector
      ? translations[`sector.${selectedSector}`]?.en ?? selectedSector
      : '';
    const systemLabel =
      selectedSector === 'custom'
        ? customDescription
        : subSystem
        ? translations[subSystem]?.en ?? subSystem
        : '';

    const payload = {
      name,
      email,
      company,
      phone,
      sector: sectorLabel,
      sectorId: selectedSector,
      system: systemLabel,
      isCustom: selectedSector === 'custom',
      language,
      company_website: honeypot, // honeypot passthrough for n8n-side check
      turnstileToken, // empty string when CAPTCHA disabled; verified server-side in n8n
    };

    try {
      setIsSubmitting(true);
      const res = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
      setIsSubmitted(true);
    } catch (err) {
      console.error('Lead submission failed:', err);
      setErrorMsg(t('form.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    closeLeadForm();
    setTimeout(() => {
      setIsSubmitted(false);
      setSelectedSector(null);
      setSubSystem('');
      setCustomDescription('');
      setName('');
      setEmail('');
      setCompany('');
      setPhone('');
      setHoneypot('');
      setTurnstileToken('');
      setErrorMsg('');
      setIsSubmitting(false);
    }, 300);
  };

  // Reset sub-system when sector changes
  useEffect(() => {
    setSubSystem('');
    setCustomDescription('');
  }, [selectedSector]);

  // Auto-close success message
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
            className="relative w-full lg:w-[60vw] max-w-5xl max-h-[90vh] bg-black/95 border border-jarvis-orange clip-hex overflow-y-auto p-6 md:p-12 shadow-[0_0_80px_rgba(255,69,0,0.2)] custom-scrollbar"
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
                {/* Honeypot — hidden from real users, catches bots */}
                <input
                  type="text"
                  name="company_website"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="absolute left-[-9999px] top-0 h-0 w-0 opacity-0"
                />
                {/* Header */}
                <div className="border-b border-white/10 pb-6 pr-10">
                  <h2 className="text-xl md:text-3xl lg:text-4xl font-black text-white tracking-tighter uppercase font-mono leading-tight">
                    {t('form.title')}
                  </h2>
                  <p className="text-jarvis-orange font-mono text-[9px] md:text-[10px] mt-2 uppercase tracking-[0.2em] opacity-70 font-bold">
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
                    <div className="space-y-2">
                      <label className="text-sm md:text-base font-bold text-gray-300 uppercase tracking-tight">{t('form.name')}</label>
                      <input required type="text" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className="w-full bg-tech-gray/50 border border-white/10 px-4 py-3 md:py-4 text-white font-mono text-sm focus:border-jarvis-orange outline-none transition-colors" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm md:text-base font-bold text-gray-300 uppercase tracking-tight">{t('form.email')}</label>
                      <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" className="w-full bg-tech-gray/50 border border-white/10 px-4 py-3 md:py-4 text-white font-mono text-sm focus:border-jarvis-orange outline-none transition-colors" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm md:text-base font-bold text-gray-300 uppercase tracking-tight">{t('form.company')}</label>
                      <input required type="text" value={company} onChange={(e) => setCompany(e.target.value)} autoComplete="organization" className="w-full bg-tech-gray/50 border border-white/10 px-4 py-3 md:py-4 text-white font-mono text-sm focus:border-jarvis-orange outline-none transition-colors" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm md:text-base font-bold text-gray-300 uppercase tracking-tight">{t('form.phone')}</label>
                      <input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" className="w-full bg-tech-gray/50 border border-white/10 px-4 py-3 md:py-4 text-white font-mono text-sm focus:border-jarvis-orange outline-none transition-colors" />
                    </div>
                  </div>
                </div>

                {/* Section B: Sector Selection Grid */}
                <div className="space-y-4 md:space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-jarvis-orange rounded-full animate-pulse"></div>
                    <h3 className="text-[10px] md:text-xs font-mono text-gray-400 uppercase tracking-widest">{t('form.sector_header')}</h3>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
                    {SECTORS.map((sector) => (
                      <button
                        key={sector.id}
                        type="button"
                        onClick={() => setSelectedSector(sector.id)}
                        className={`
                          group p-3 border transition-all flex items-center justify-center h-16 md:h-20
                          ${selectedSector === sector.id 
                            ? 'bg-jarvis-orange text-black border-jarvis-orange font-black shadow-[0_0_20px_rgba(255,69,0,0.3)]' 
                            : 'bg-black/50 border-white/10 text-gray-400 hover:border-jarvis-orange/50 hover:text-white'}
                        `}
                      >
                        <span className="text-[9px] md:text-[10px] font-mono uppercase tracking-tighter text-center leading-none font-bold">
                          {t(sector.label)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Section C: Conditional Sub-System Selection */}
                <AnimatePresence mode="wait">
                  {selectedSector && selectedSector !== 'custom' && (
                    <motion.div 
                      key="sub-system-selector"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4 md:space-y-6 overflow-hidden"
                    >
                      <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                        <div className="w-1.5 h-1.5 bg-jarvis-orange rounded-full"></div>
                        <h3 className="text-[10px] md:text-xs font-mono text-gray-400 uppercase tracking-widest">{t('form.ops_header')}</h3>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm md:text-base font-bold text-gray-300 uppercase tracking-tight">{t('form.system_query')}</label>
                        <div className="relative">
                          <select 
                            required 
                            value={subSystem}
                            onChange={(e) => setSubSystem(e.target.value)}
                            className="w-full bg-tech-gray/50 border border-white/10 px-4 py-3 md:py-4 text-white font-mono text-sm focus:border-jarvis-orange outline-none transition-colors appearance-none cursor-pointer pr-10"
                          >
                            <option value="" disabled>{t('form.system_query')}</option>
                            {SUB_SYSTEMS[selectedSector].map((opt) => (
                              <option key={opt} value={opt}>{t(opt)}</option>
                            ))}
                          </select>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-jarvis-orange">
                            <ChevronDown className="w-5 h-5" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {selectedSector === 'custom' && (
                    <motion.div 
                      key="custom-description"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4 md:space-y-6 overflow-hidden"
                    >
                      <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                        <div className="w-1.5 h-1.5 bg-jarvis-orange rounded-full"></div>
                        <h3 className="text-[10px] md:text-xs font-mono text-gray-400 uppercase tracking-widest">{t('form.ops_header')}</h3>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm md:text-base font-bold text-gray-300 uppercase tracking-tight">{t('form.custom_desc')}</label>
                        <textarea 
                          required 
                          value={customDescription}
                          onChange={(e) => setCustomDescription(e.target.value)}
                          className="w-full bg-tech-gray/50 border border-white/10 px-4 py-3 md:py-4 text-white font-mono text-sm focus:border-jarvis-orange outline-none transition-colors min-h-[120px] md:min-h-[150px] resize-none" 
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Error message */}
                {errorMsg && (
                  <p className="text-red-500 font-mono text-[10px] md:text-xs uppercase tracking-widest text-center animate-pulse">
                    {errorMsg}
                  </p>
                )}

                {/* Cloudflare Turnstile — only rendered when a site key is configured */}
                {TURNSTILE_SITE_KEY && (
                  <div className="flex justify-center">
                    <div ref={turnstileRef} />
                  </div>
                )}

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={isSubmitting || !selectedSector || (selectedSector !== 'custom' && !subSystem) || (selectedSector === 'custom' && !customDescription) || (!!TURNSTILE_SITE_KEY && !turnstileToken)}
                  className={`
                    w-full py-4 md:py-6 bg-jarvis-orange text-black font-mono font-bold uppercase tracking-[0.2em] md:tracking-[0.4em] transition-all
                    ${(isSubmitting || !selectedSector || (selectedSector !== 'custom' && !subSystem) || (selectedSector === 'custom' && !customDescription) || (!!TURNSTILE_SITE_KEY && !turnstileToken)) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white hover:tracking-[0.3em] md:hover:tracking-[0.6em]'}
                  `}
                >
                  {isSubmitting ? t('form.submitting') : t('form.submit')}
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
                  <p className="text-jarvis-orange font-mono text-[9px] md:text-[10px] uppercase tracking-[0.2em] animate-pulse font-bold">
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};