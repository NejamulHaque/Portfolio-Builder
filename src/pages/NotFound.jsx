import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, LayoutDashboard } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans selection:bg-indigo-500/30">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none"></div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-lg p-8 sm:p-12 rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-2xl shadow-2xl space-y-6"
        >
          <div className="text-8xl sm:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
            404
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Page Not Found</h1>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm mx-auto">
              The page you requested might have been moved, deleted, or doesn't exist yet.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link 
              to="/" 
              className="w-full sm:w-auto px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/30"
            >
              <Home size={16} /> <span>Go to Homepage</span>
            </Link>

            <Link 
              to="/dashboard" 
              className="w-full sm:w-auto px-6 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <LayoutDashboard size={16} /> <span>Open Dashboard</span>
            </Link>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}