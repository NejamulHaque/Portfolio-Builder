import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Mail, Lock, User, ArrowRight, AlertCircle, ArrowLeft } from 'lucide-react'; // Added ArrowLeft
import { motion } from 'framer-motion';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
        await supabase.from('portfolios').insert({
          id: data.user.id,
          name: name,
          username: email.split('@')[0],
        });
      }
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
            <h2 className="text-2xl font-bold text-white mb-2">Create your account</h2>
            <p className="text-gray-400 text-sm">Start building your professional identity</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-3.5 text-gray-500" size={20} />
                <input 
                  type="text" required value={name} onChange={(e) => setName(e.target.value)} 
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-indigo-500 outline-none text-white transition-colors placeholder-gray-600" 
                  placeholder="John Doe" 
                />
              </div>
            </div>

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
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
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
              {loading ? 'Creating Account...' : 'Get Started'} {!loading && <ArrowRight size={20} />}
            </button>
          </form>

          <p className="text-center mt-8 text-sm text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}