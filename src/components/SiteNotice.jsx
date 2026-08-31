import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Check, Cookie } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SiteNotice() {
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true, // Always true
    analytics: true,
    themes: true
  });

  useEffect(() => {
    const consent = localStorage.getItem('pb_cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('pb_cookie_consent', JSON.stringify({ essential: true, analytics: true, themes: true }));
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('pb_cookie_consent', JSON.stringify({ essential: true, analytics: false, themes: false }));
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem('pb_cookie_consent', JSON.stringify(preferences));
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 80, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 80, opacity: 0, scale: 0.95 }}
          role="region"
          aria-label="Cookie and Privacy Consent"
          className="fixed bottom-5 left-5 right-5 sm:left-auto sm:right-5 sm:w-[420px] z-50 bg-[#0c0c14]/95 border border-white/15 p-5 sm:p-6 rounded-3xl shadow-2xl backdrop-blur-2xl text-white font-sans"
        >
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
              <Cookie size={16} />
              <span>Cookie & Privacy Consent</span>
            </div>
            <button 
              onClick={handleDecline} 
              aria-label="Close Notice"
              className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X size={16}/>
            </button>
          </div>

          {!showPreferences ? (
            <>
              <p className="text-gray-300 text-xs leading-relaxed mb-4">
                We use privacy-friendly cookies and local storage to preserve your theme preferences, authenticate your session, and analyze telemetry. Learn more in our{' '}
                <Link to="/legal/privacy" className="text-indigo-400 font-bold underline hover:text-indigo-300">
                  Privacy Policy
                </Link>.
              </p>

              <div className="flex flex-col sm:flex-row gap-2 pt-1">
                <button 
                  onClick={handleAcceptAll}
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/30 flex items-center justify-center gap-1.5"
                >
                  <Check size={14} /> Accept All
                </button>
                <button 
                  onClick={() => setShowPreferences(true)}
                  className="px-3 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-xl text-xs font-medium transition-colors"
                >
                  Customize
                </button>
                <button 
                  onClick={handleDecline}
                  className="px-3 py-2.5 text-gray-500 hover:text-gray-300 text-xs font-medium transition-colors"
                >
                  Decline
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-3 pt-1">
              <div className="space-y-2 text-xs">
                <label className="flex items-center justify-between p-2 rounded-xl bg-black/40 border border-white/5 cursor-not-allowed opacity-80">
                  <span>Essential System Cookies</span>
                  <span className="text-[10px] font-bold uppercase text-emerald-400">Required</span>
                </label>

                <label className="flex items-center justify-between p-2 rounded-xl bg-black/40 border border-white/5 cursor-pointer">
                  <span>Theme & Viewport State</span>
                  <input 
                    type="checkbox" 
                    checked={preferences.themes} 
                    onChange={e => setPreferences({ ...preferences, themes: e.target.checked })} 
                    className="accent-indigo-600 rounded"
                  />
                </label>

                <label className="flex items-center justify-between p-2 rounded-xl bg-black/40 border border-white/5 cursor-pointer">
                  <span>Anonymized Analytics</span>
                  <input 
                    type="checkbox" 
                    checked={preferences.analytics} 
                    onChange={e => setPreferences({ ...preferences, analytics: e.target.checked })} 
                    className="accent-indigo-600 rounded"
                  />
                </label>
              </div>

              <div className="flex gap-2 pt-2">
                <button 
                  onClick={handleSavePreferences}
                  className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all"
                >
                  Save Choices
                </button>
                <button 
                  onClick={() => setShowPreferences(false)}
                  className="px-3 py-2 bg-white/5 hover:bg-white/10 text-gray-400 text-xs rounded-xl"
                >
                  Back
                </button>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}