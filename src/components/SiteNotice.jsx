import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SiteNotice() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('user_notice_accepted');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('user_notice_accepted', 'true');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 80, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 80, opacity: 0, scale: 0.95 }}
          className="fixed bottom-5 left-5 right-5 sm:left-auto sm:right-5 sm:w-[380px] z-50 bg-[#0f0f16]/95 border border-white/15 p-5 rounded-3xl shadow-2xl backdrop-blur-2xl"
        >
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
              <Shield size={14} />
              <span>Privacy & Experience</span>
            </div>
            <button 
              onClick={accept} 
              className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X size={16}/>
            </button>
          </div>

          <p className="text-gray-300 text-xs leading-relaxed mb-4">
            We use anonymized cookies and telemetry to personalize themes and improve AI performance. Read our{' '}
            <Link to="/legal/privacy" className="text-indigo-400 underline hover:text-indigo-300">Privacy Policy</Link>.
          </p>

          <div className="flex gap-2">
            <button 
              onClick={accept}
              className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/20"
            >
              Got it
            </button>
            <button 
              onClick={() => setIsVisible(false)}
              className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl text-xs font-medium transition-colors"
            >
              Dismiss
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}