import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    // Fallback if not inside provider
    return {
      toast: {
        success: (msg) => console.log('Success:', msg),
        error: (msg) => console.error('Error:', msg),
        info: (msg) => console.log('Info:', msg),
      }
    };
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 3500) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toast = {
    success: (msg, duration) => addToast(msg, 'success', duration),
    error: (msg, duration) => addToast(msg, 'error', duration),
    info: (msg, duration) => addToast(msg, 'info', duration),
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Toast Render Portal Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-2xl backdrop-blur-xl border text-sm font-medium ${
                t.type === 'success'
                  ? 'bg-[#0f172a]/90 text-emerald-300 border-emerald-500/30'
                  : t.type === 'error'
                  ? 'bg-[#180a0a]/90 text-rose-300 border-rose-500/30'
                  : 'bg-[#0f172a]/90 text-indigo-300 border-indigo-500/30'
              }`}
            >
              <div className="shrink-0 mt-0.5">
                {t.type === 'success' && <CheckCircle2 size={18} className="text-emerald-400" />}
                {t.type === 'error' && <AlertCircle size={18} className="text-rose-400" />}
                {t.type === 'info' && <Info size={18} className="text-indigo-400" />}
              </div>
              <div className="flex-1 leading-snug">{t.message}</div>
              <button
                onClick={() => removeToast(t.id)}
                className="shrink-0 text-gray-400 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
