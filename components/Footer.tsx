import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export const Footer: React.FC = () => {
  const { t, openLeadForm, openLegalModal } = useLanguage();

  return (
    <footer className="bg-black pt-24 pb-12 border-t border-white/10 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-jarvis-orange to-transparent opacity-50"></div>
      
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 uppercase tracking-tight">
          {t('footer.headline')} <br />
          <span className="text-gray-500 rtl:font-arabic">{t('footer.manual')}</span>
        </h2>
        
        <div className="mb-16">
          <button 
            onClick={openLeadForm}
            className="w-full max-w-2xl mx-auto group relative py-6 px-12 bg-transparent overflow-hidden"
          >
             <div className="absolute inset-0 w-full h-full bg-jarvis-orange/10 skew-x-12 transform group-hover:bg-jarvis-orange transition-all duration-300 origin-left rtl:origin-right scale-x-0 group-hover:scale-x-100"></div>
             <div className="absolute inset-0 border border-jarvis-orange clip-hex"></div>
             <span className="relative z-10 font-mono text-2xl font-bold text-jarvis-orange group-hover:text-black tracking-widest rtl:tracking-wider uppercase transition-colors rtl:font-arabic">
               {t('footer.cta')}
             </span>
          </button>
        </div>

        <div className="grid md:grid-cols-4 gap-8 text-left rtl:text-right border-t border-white/10 pt-12">
          <div className="col-span-1 md:col-span-2">
            <h4 className="text-white font-bold text-xl mb-4 tracking-tighter">JARVIS AI</h4>
            <p className="text-gray-500 text-sm max-w-xs rtl:font-arabic font-mono uppercase">
              {t('footer.desc')}
            </p>
          </div>
          
          <div>
            <h5 className="text-white font-mono text-sm mb-4 uppercase tracking-widest rtl:tracking-normal rtl:font-arabic">{t('footer.connect')}</h5>
            <ul className="space-y-2 text-sm text-gray-500 font-mono">
              <li><a href="https://www.linkedin.com/in/jarvis-ai-3542293a7/" target="_blank" rel="noopener noreferrer" className="hover:text-jarvis-orange transition-colors uppercase tracking-wider">LinkedIn</a></li>
              <li><a href="https://www.instagram.com/jarvis.ai.sa/" target="_blank" rel="noopener noreferrer" className="hover:text-jarvis-orange transition-colors uppercase tracking-wider">Instagram</a></li>
              <li><a href="https://www.tiktok.com/@jarvis.ai.sa?is_from_webapp=1&sender_device=pc" target="_blank" rel="noopener noreferrer" className="hover:text-jarvis-orange transition-colors uppercase tracking-wider">TikTok</a></li>
            </ul>
          </div>
          
          <div>
            <h5 className="text-white font-mono text-sm mb-4 uppercase tracking-widest rtl:tracking-normal rtl:font-arabic">{t('footer.legal')}</h5>
            <ul className="space-y-2 text-sm text-gray-500 font-mono">
              <li>
                <button 
                  onClick={() => openLegalModal('privacy')}
                  className="hover:text-jarvis-orange transition-colors uppercase tracking-wider text-left rtl:text-right"
                >
                  {t('footer.privacy')}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => openLegalModal('terms')}
                  className="hover:text-jarvis-orange transition-colors uppercase tracking-wider text-left rtl:text-right"
                >
                  {t('footer.terms')}
                </button>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 text-center text-xs text-gray-700 font-mono rtl:font-arabic uppercase tracking-widest">
          © {new Date().getFullYear()} {t('footer.rights')}
        </div>
      </div>
    </footer>
  );
};