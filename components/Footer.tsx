import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export const Footer: React.FC = () => {
  const { t, openLeadForm } = useLanguage();

  return (
    <footer className="bg-black pt-24 pb-12 border-t border-white/10 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-jarvis-orange to-transparent opacity-50"></div>
      
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
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
            <h4 className="text-white font-bold text-xl mb-4">JARVIS AI</h4>
            <p className="text-gray-500 text-sm max-w-xs rtl:font-arabic">
              {t('footer.desc')}
            </p>
          </div>
          
          <div>
            <h5 className="text-white font-mono text-sm mb-4 uppercase tracking-widest rtl:tracking-normal rtl:font-arabic">{t('footer.connect')}</h5>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><a href="#" className="hover:text-jarvis-orange transition-colors">LinkedIn</a></li>
              <li><a href="#" className="hover:text-jarvis-orange transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-jarvis-orange transition-colors">TikTok</a></li>
            </ul>
          </div>
          
          <div>
            <h5 className="text-white font-mono text-sm mb-4 uppercase tracking-widest rtl:tracking-normal rtl:font-arabic">{t('footer.legal')}</h5>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><a href="#" className="hover:text-jarvis-orange transition-colors">Privacy Protocol</a></li>
              <li><a href="#" className="hover:text-jarvis-orange transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 text-center text-xs text-gray-700 font-mono rtl:font-arabic">
          © {new Date().getFullYear()} {t('footer.rights')}
        </div>
      </div>
    </footer>
  );
};