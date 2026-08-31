import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Heart, Shield, Check, Mail, ExternalLink } from 'lucide-react';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
      setSubscribed(false);
    }, 4000);
  };

  return (
    <footer className="border-t border-white/10 bg-[#030305] text-gray-400 font-sans pt-16 pb-12 relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6">
        
        {/* Top Newsletter & Banner Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-white/5">
          
          {/* Brand & Mission */}
          <div className="lg:col-span-5 space-y-6">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-[1px]">
                <div className="w-full h-full bg-[#0a0a0f] rounded-xl flex items-center justify-center">
                  <img src="/favicon.svg" alt="Portfolio.ai" className="w-4 h-4" />
                </div>
              </div>
              <span className="font-black text-xl tracking-tight text-white">
                Portfolio<span className="text-indigo-400">.ai</span>
              </span>
            </Link>
            
            <p className="text-sm text-gray-400 leading-relaxed max-w-md">
              The premier AI-driven portfolio ecosystem built for modern developers, designers, and engineers. Design, customize, and publish your world-class digital presence in minutes.
            </p>

            {/* System Status Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>All Systems Operational • 99.9% Uptime</span>
            </div>
          </div>

          {/* Newsletter Box */}
          <div className="lg:col-span-7 flex flex-col justify-center bg-white/[0.02] border border-white/5 rounded-3xl p-8 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-widest mb-2">
              <Sparkles size={14} /> Developer Newsletter
            </div>
            <h4 className="text-xl font-bold text-white mb-2">Stay ahead of developer portfolio trends</h4>
            <p className="text-xs text-gray-400 mb-6">Receive curated theme updates, resume writing formulas, and AI prompting tricks. No spam, ever.</p>
            
            {subscribed ? (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-2 text-emerald-300 text-sm">
                <Check size={18} />
                <span>Thank you! You have been added to our developer newsletter.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  required
                  placeholder="developer@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:border-indigo-500 outline-none transition-colors"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shrink-0 shadow-lg shadow-indigo-600/20"
                >
                  <span>Subscribe</span>
                  <ArrowRight size={16} />
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Links Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-16 border-b border-white/5">
          
          <div>
            <h5 className="text-xs font-bold uppercase tracking-widest text-white mb-4">Product</h5>
            <ul className="space-y-3 text-sm">
              <li><a href="/#playground" className="hover:text-white transition-colors">Interactive Playground</a></li>
              <li><a href="/#templates" className="hover:text-white transition-colors">Template Gallery</a></li>
              <li><a href="/#features" className="hover:text-white transition-colors">AI Writing Engine</a></li>
              <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing & UPI</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors">Create Free Account</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-widest text-white mb-4">Themes</h5>
            <ul className="space-y-3 text-sm">
              <li><a href="/#templates" className="hover:text-white transition-colors">Minimalist Monochrome</a></li>
              <li><a href="/#templates" className="hover:text-white transition-colors">Cyberpunk Neon</a></li>
              <li><a href="/#templates" className="hover:text-white transition-colors">Corporate Slate</a></li>
              <li><a href="/#templates" className="hover:text-white transition-colors">Retro Hacker Terminal</a></li>
              <li><a href="/#templates" className="hover:text-white transition-colors">Glassmorphism Luxe</a></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-widest text-white mb-4">Resources</h5>
            <ul className="space-y-3 text-sm">
              <li><a href="https://github.com/NejamulHaque/Portfolio-Builder" target="_blank" rel="noreferrer" className="hover:text-white transition-colors flex items-center gap-1">GitHub Repo <ExternalLink size={12}/></a></li>
              <li><a href="/#faq" className="hover:text-white transition-colors">FAQ & Support</a></li>
              <li><Link to="/login" className="hover:text-white transition-colors">User Sign In</Link></li>
              <li><Link to="/admin" className="hover:text-white transition-colors">Admin Portal</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-widest text-white mb-4">Legal</h5>
            <ul className="space-y-3 text-sm">
              <li><Link to="/legal/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/legal/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><span className="text-gray-500">Security & GDPR</span></li>
              <li><span className="text-gray-500">Cookie Preferences</span></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <span>&copy; {new Date().getFullYear()} Portfolio.ai. Crafted with</span>
            <Heart size={14} className="text-rose-500 fill-rose-500 inline" />
            <span>by</span>
            <a
              href="https://github.com/NejamulHaque"
              target="_blank"
              rel="noreferrer"
              className="text-gray-300 font-bold hover:text-white transition-colors underline decoration-indigo-500 underline-offset-2"
            >
              Nejamul Haque
            </a>
          </div>

          <div className="flex items-center gap-4 text-gray-400">
            <a
              href="https://github.com/NejamulHaque"
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <FaGithub size={16} />
            </a>
            <a
              href="https://twitter.com/Nejamul_Haque_"
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 hover:text-white transition-colors"
              aria-label="Twitter"
            >
              <FaTwitter size={16} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 hover:text-white transition-colors"
              aria-label="LinkedIn"
            >
              <FaLinkedin size={16} />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
