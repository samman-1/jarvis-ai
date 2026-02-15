import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const LegalModal: React.FC = () => {
  const { t, activeLegalModal, closeLegalModal } = useLanguage();

  const getTitle = () => {
    if (activeLegalModal === 'privacy') return t('legal.privacy.title');
    if (activeLegalModal === 'terms') return t('legal.terms.title');
    return '';
  };

  const getBody = () => {
    if (activeLegalModal === 'privacy') return t('legal.privacy.body');
    if (activeLegalModal === 'terms') return t('legal.terms.body');
    return '';
  };

  return (
    <AnimatePresence>
      {activeLegalModal && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl"
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full max-w-4xl max-h-[85vh] bg-tech-gray/90 border border-white/10 clip-hex overflow-hidden flex flex-col shadow-2xl"
          >
            {/* Modal Header */}
            <div className="p-6 md:p-8 border-b border-white/10 flex justify-between items-center bg-black/40">
              <h2 className="text-xl md:text-2xl font-black text-white tracking-tighter uppercase font-mono">
                {getTitle()}
              </h2>
              <button 
                onClick={closeLegalModal}
                className="text-gray-500 hover:text-jarvis-orange transition-colors"
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 md:p-10 overflow-y-auto custom-scrollbar flex-grow bg-black/20">
              <div className="text-gray-300 font-mono text-sm md:text-base whitespace-pre-wrap leading-relaxed rtl:font-arabic">
                {getBody()}
              </div>
            </div>

            {/* Modal Footer Decorative Line */}
            <div className="h-1 bg-gradient-to-r from-transparent via-jarvis-orange/30 to-transparent"></div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};