import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, Menu, X, ArrowRight, LayoutDashboard, User, LogOut, 
  ExternalLink, Layers, DollarSign, HelpCircle, Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#050505]/80 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
        
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 group cursor-pointer">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-[1px] shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all">
              <div className="w-full h-full bg-[#0a0a0f] rounded-xl flex items-center justify-center">
                <img src="/favicon.svg" alt="Portfolio Builder" className="w-5 h-5" />
              </div>
            </div>
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#050505] animate-pulse"></div>
          </div>
          <div className="flex flex-col">
            <span className="font-black text-lg sm:text-xl tracking-tight text-white flex items-center gap-1">
              Portfolio<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400"> Builder</span>
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-gray-400">
          <a href="/#playground" className="hover:text-white transition-colors flex items-center gap-1.5">
            <Sparkles size={14} className="text-indigo-400" /> Live Demo
          </a>
          <a href="/#templates" className="hover:text-white transition-colors">
            Templates
          </a>
          <a href="/#features" className="hover:text-white transition-colors">
            Features
          </a>
          <Link to="/pricing" className="hover:text-white transition-colors">
            Pricing
          </Link>
          <a href="/#faq" className="hover:text-white transition-colors">
            FAQ
          </a>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="px-4 py-2 bg-indigo-600/20 border border-indigo-500/40 text-indigo-300 hover:bg-indigo-600/30 rounded-xl text-sm font-bold flex items-center gap-2 transition-all"
              >
                <LayoutDashboard size={16} />
                <span>Dashboard</span>
              </Link>
              <Link
                to="/profile"
                className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-300 hover:text-white transition-colors"
                title="Profile & Stats"
              >
                <User size={18} />
              </Link>
              <button
                onClick={handleLogout}
                className="p-2.5 bg-white/5 hover:bg-red-500/20 text-gray-300 hover:text-red-400 border border-white/10 rounded-xl transition-colors"
                title="Log Out"
              >
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="group relative px-5 py-2.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-xl text-sm font-bold shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all flex items-center gap-2"
              >
                <span>Get Started Free</span>
                <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden items-center gap-2">
          {user && (
            <Link
              to="/dashboard"
              className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-lg flex items-center gap-1"
            >
              <LayoutDashboard size={14} /> App
            </Link>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/10 bg-[#08080c] px-6 py-6 space-y-4 shadow-2xl"
          >
            <div className="flex flex-col space-y-3 font-medium text-gray-300 text-base">
              <a
                href="/#playground"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 text-indigo-400"
              >
                <Sparkles size={18} /> Live Playground
              </a>
              <a
                href="/#templates"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5"
              >
                <Layers size={18} /> Templates Gallery
              </a>
              <a
                href="/#features"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5"
              >
                <Shield size={18} /> Features & AI
              </a>
              <Link
                to="/pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5"
              >
                <DollarSign size={18} /> Pricing & Plans
              </Link>
              <a
                href="/#faq"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5"
              >
                <HelpCircle size={18} /> FAQs
              </a>
            </div>

            <div className="pt-4 border-t border-white/10 space-y-3">
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold flex items-center justify-center gap-2"
                  >
                    <LayoutDashboard size={18} /> Open Dashboard
                  </Link>
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="py-2.5 bg-white/5 border border-white/10 rounded-xl font-medium text-center text-sm flex items-center justify-center gap-2"
                    >
                      <User size={16} /> Profile
                    </Link>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleLogout();
                      }}
                      className="py-2.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl font-medium text-center text-sm flex items-center justify-center gap-2"
                    >
                      <LogOut size={16} /> Log Out
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30"
                  >
                    Start Free <ArrowRight size={18} />
                  </Link>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-3 bg-white/5 border border-white/10 text-white font-medium rounded-xl text-center block text-sm"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
