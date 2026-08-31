import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Mail, Lock, User, ArrowRight, AlertCircle, ArrowLeft, Sparkles, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '../components/Toast';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } },
      });
      if (error) throw error;
      
      if (data.user) {
        const username = email.split('@')[0].toLowerCase().replace(/[^a-z0-9_-]/g, '');
        await supabase.from('portfolios').insert({
          id: data.user.id,
          name: name,
          username: username,
          template: 'minimal',
          theme: 'dark'
        }).catch(() => {});
      }
      toast.success('Account created! Welcome to Portfolio Builder');
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] text-white font-sans relative overflow-hidden selection:bg-indigo-500/30">
      
      {/* Glow Effects */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/15 rounded-full blur-[140px] pointer-events-none"></div>

      {/* BACK BUTTON */}
      <div className="absolute top-6 left-6 z-10">
        <Link to="/" className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-3 py-2 rounded-xl border border-white/10">
          <ArrowLeft size={14} />
          <span>Back to Home</span>
        </Link>
      </div>

      <div className="flex-grow flex items-center justify-center p-4 sm:p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="w-full max-w-md bg-white/[0.03] border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-2xl space-y-6"
        >
          <div className="text-center space-y-2">
            <Link to="/" className="inline-block mb-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-[1px] mx-auto shadow-lg shadow-indigo-600/20">
                <div className="w-full h-full bg-[#0a0a0f] rounded-2xl flex items-center justify-center">
                  <img src="/favicon.svg" alt="P" className="w-6 h-6" />
                </div>
              </div>
            </Link>
            <h2 className="text-2xl font-black tracking-tight text-white">Create your account</h2>
            <p className="text-gray-400 text-xs sm:text-sm">Start building your digital developer presence in seconds</p>
          </div>

          {error && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 text-rose-300 text-xs">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 text-gray-500" size={18} />
                <input 
                  type="text" 
                  required 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:border-indigo-500 outline-none text-white text-sm placeholder-gray-600 transition-colors" 
                  placeholder="Alex Rivera" 
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 text-gray-500" size={18} />
                <input 
                  type="email" 
                  required 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:border-indigo-500 outline-none text-white text-sm placeholder-gray-600 transition-colors" 
                  placeholder="alex@developer.dev" 
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 text-gray-500" size={18} />
                <input 
                  type="password" 
                  required 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:border-indigo-500 outline-none text-white text-sm placeholder-gray-600 transition-colors" 
                  placeholder="••••••••" 
                />
              </div>
            </div>

            <button 
              disabled={loading} 
              type="submit" 
              className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-indigo-600/30"
            >
              {loading ? <Loader2 size={16} className="animate-spin"/> : null}
              <span>{loading ? 'Creating Account...' : 'Get Started Free'}</span>
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          <p className="text-center pt-2 border-t border-white/5 text-xs text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-bold">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}