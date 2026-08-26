import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Mail, Lock, ArrowRight, AlertCircle, ArrowLeft } from 'lucide-react'; // Added ArrowLeft
import { motion } from 'framer-motion';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] text-white font-sans relative">
      
      {/* BACK BUTTON (Top Left) */}
      <div className="absolute top-6 left-6 z-10">
        <Link to="/" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </Link>
      </div>

      <div className="flex-grow flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="w-full max-w-md bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl"
        >
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-black font-bold text-xl mx-auto mb-6">P</div>
            <h2 className="text-2xl font-bold text-white mb-2">Welcome back</h2>
            <p className="text-gray-400 text-sm">Sign in to your account to continue</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 text-gray-500" size={20} />
                <input 
                  type="email" required value={email} onChange={(e) => setEmail(e.target.value)} 
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-indigo-500 outline-none text-white transition-colors placeholder-gray-600" 
                  placeholder="name@example.com" 
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-300">Password</label>
                <Link to="/forgot" className="text-xs text-indigo-400 hover:text-indigo-300">Forgot?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-gray-500" size={20} />
                <input 
                  type="password" required value={password} onChange={(e) => setPassword(e.target.value)} 
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-indigo-500 outline-none text-white transition-colors placeholder-gray-600" 
                  placeholder="••••••••" 
                />
              </div>
            </div>

            <button 
              disabled={loading} type="submit" 
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-indigo-500/20"
            >
              {loading ? 'Signing in...' : 'Sign In'} {!loading && <ArrowRight size={20} />}
            </button>
          </form>

          <p className="text-center mt-8 text-sm text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-medium">Create account</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}