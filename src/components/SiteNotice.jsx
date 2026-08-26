// src/components/SiteNotice.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function SiteNotice() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Changed 'cookieConsent' to 'user_notice_accepted' to be safe
    const consent = localStorage.getItem('user_notice_accepted');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1000);
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
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-96 z-50 bg-[#1a1a1a] border border-white/10 p-6 rounded-2xl shadow-2xl backdrop-blur-xl"
        >
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-white font-bold text-lg">Privacy & Terms</h3>
            <button onClick={accept} className="text-gray-400 hover:text-white"><X size={18}/></button>
          </div>
          <p className="text-gray-400 text-sm mb-6 leading-relaxed">
            We use technologies to analyze traffic and improve your experience. By continuing to use this site, you agree to our terms.
          </p>
          <div className="flex gap-3">
            <button 
              onClick={accept}
              className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-bold transition-colors"
            >
              Accept
            </button>
            <button 
              onClick={() => setIsVisible(false)}
              className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg text-sm font-medium transition-colors"
            >
              Decline
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}