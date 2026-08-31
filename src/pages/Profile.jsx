import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Award, Activity, TrendingUp, Globe, Download, 
  Sun, Moon, LogOut, LayoutTemplate, ShieldCheck, 
  Clock, Zap, CheckCircle2, Circle, ArrowRight, QrCode, Copy, Check, Loader2
} from 'lucide-react';
import QRCodeModal from '../components/QRCodeModal';
import { useToast } from '../components/Toast';
import { Helmet } from 'react-helmet-async';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isDark, setIsDark] = useState(true);
  const [subStatus, setSubStatus] = useState('free'); // free, pending, pro
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '', username: '', bio: '', avatar_url: '', headline: '', location: '',
    skills: [], projects: [], experience: [], education: [], certificates: [], socials: [], views: 0
  });

  useEffect(() => {
    if (user) {
      fetchPortfolio();
      checkSubscription();
    }
  }, [user]);

  const fetchPortfolio = async () => {
    try {
      const { data } = await supabase.from('portfolios').select('*').eq('id', user.id).single();
      if (data) {
        setFormData({
          ...data,
          skills: typeof data.skills === 'string' ? JSON.parse(data.skills) : data.skills || [],
          projects: typeof data.projects === 'string' ? JSON.parse(data.projects) : data.projects || [],
          experience: typeof data.experience === 'string' ? JSON.parse(data.experience) : data.experience || [],
          education: typeof data.education === 'string' ? JSON.parse(data.education) : data.education || [],
          certificates: typeof data.certificates === 'string' ? JSON.parse(data.certificates) : data.certificates || [],
          socials: typeof data.socials === 'string' ? JSON.parse(data.socials) : data.socials || [],
        });
        setIsDark(data.theme !== 'light');
      }
    } catch (err) { 
      console.error(err); 
    }
  };

  const checkSubscription = async () => {
    try {
      const { data: approved } = await supabase
        .from('subscriptions')
        .select('status')
        .eq('user_id', user.id)
        .eq('status', 'approved')
        .maybeSingle();

      if (approved) {
        setSubStatus('pro');
        return;
      }

      const { data: pending } = await supabase
        .from('subscriptions')
        .select('status')
        .eq('user_id', user.id)
        .eq('status', 'pending')
        .maybeSingle();

      if (pending) {
        setSubStatus('pending');
      } else {
        setSubStatus('free');
      }
    } catch (err) {
      console.error("Subscription check error:", err);
    }
  };

  // Checklist items
  const checklist = [
    { label: 'Add a professional avatar photo', done: !!formData.avatar_url, points: 15 },
    { label: 'Set full name & headline', done: !!(formData.name && formData.headline), points: 15 },
    { label: 'Write engaging bio summary', done: !!(formData.bio && formData.bio.length > 20), points: 15 },
    { label: 'Add at least 2 projects with links', done: formData.projects?.length >= 2, points: 20 },
    { label: 'Add work experience history', done: formData.experience?.length >= 1, points: 15 },
    { label: 'List your technical stack', done: formData.skills?.some(s => s.skills?.length > 0), points: 10 },
    { label: 'Connect social / GitHub links', done: formData.socials?.length >= 1, points: 10 },
  ];

  const completeness = checklist.reduce((acc, item) => item.done ? acc + item.points : acc, 0);

  const portfolioUrl = `${window.location.origin}/portfolio/${formData.username || ''}`;

  const copyLink = () => {
    navigator.clipboard.writeText(portfolioUrl);
    setCopied(true);
    toast.success('Portfolio URL copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(formData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `portfolio-${formData.username || 'backup'}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast.success('Backup downloaded!');
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#050505] text-white' : 'bg-gray-50 text-gray-900'} font-sans pb-24 transition-colors duration-300`}>
      <Helmet>
        <title>Account Profile & Analytics | Portfolio Builder</title>
        <meta name="description" content="View your developer identity score, track live portfolio traffic, and manage account settings." />
      </Helmet>
      
      {/* NAVBAR */}
      <nav className={`border-b ${isDark ? 'border-white/10 bg-black/60' : 'border-gray-200 bg-white/70'} backdrop-blur-xl sticky top-0 z-40`}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-bold text-xs text-white">
              <img src="/favicon.svg" alt="Portfolio Builder Logo" className="w-4 h-4" />
            </div>
            <span className="font-bold text-lg tracking-tight">Portfolio<span className="text-indigo-400"> Builder</span></span>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsDark(!isDark)} 
              className={`p-2 rounded-xl ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-200 hover:bg-gray-300'} transition-colors`}
            >
              {isDark ? <Sun size={16}/> : <Moon size={16}/>}
            </button>
            <Link 
              to="/dashboard" 
              className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-2 transition-all shadow-md shadow-indigo-600/20"
            >
              <LayoutTemplate size={14}/> Back to Editor
            </Link>
            <button 
              onClick={logout} 
              className={`p-2 rounded-xl ${isDark ? 'bg-white/5 hover:bg-rose-500/20 text-rose-400' : 'bg-rose-100 text-rose-600'}`}
              title="Logout"
            >
              <LogOut size={16}/>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 pt-10 space-y-8">
        
        {/* TOP IDENTITY SUMMARY BANNER */}
        <div className={`p-6 sm:p-8 rounded-3xl border ${isDark ? 'bg-white/[0.02] border-white/10' : 'bg-white border-gray-200 shadow-sm'} flex flex-col sm:flex-row items-center justify-between gap-6`}>
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <img 
              src={formData.avatar_url || `https://ui-avatars.com/api/?name=${formData.name || 'User'}&background=6366f1&color=fff`} 
              alt="Avatar" 
              className="w-20 h-20 rounded-2xl object-cover border-2 border-indigo-500/40 shadow-xl"
            />
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                <h1 className="text-2xl font-black">{formData.name || 'Your Name'}</h1>
                {subStatus === 'pro' && (
                  <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-[10px] font-bold text-indigo-300 uppercase">
                    PRO
                  </span>
                )}
              </div>
              <p className="text-sm text-indigo-400 font-medium mb-2">{formData.headline || 'Developer & Creator'}</p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-gray-400">
                <span className="font-mono">@{formData.username || 'username'}</span>
                {formData.location && <span>• {formData.location}</span>}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <a
              href={portfolioUrl}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 bg-white text-black hover:bg-gray-200 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-lg"
            >
              <Globe size={14} /> View Live Page
            </a>
            <button
              onClick={() => setQrModalOpen(true)}
              className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-300 hover:text-white transition-colors"
              title="Share QR Code"
            >
              <QrCode size={16} />
            </button>
            <button
              onClick={copyLink}
              className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-300 hover:text-white transition-colors"
              title="Copy URL"
            >
              {copied ? <Check size={16} className="text-emerald-400"/> : <Copy size={16}/>}
            </button>
            <button
              onClick={handleExportJSON}
              className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-300 hover:text-white transition-colors"
              title="Export JSON"
            >
              <Download size={16} />
            </button>
          </div>
        </div>

        {/* SUBSCRIPTION STATUS BANNER */}
        {subStatus === 'pro' ? (
          <div className="p-5 bg-gradient-to-r from-indigo-900/30 via-purple-900/20 to-pink-900/20 border border-indigo-500/40 rounded-3xl flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-500/20 rounded-2xl text-indigo-400"><ShieldCheck size={24}/></div>
              <div>
                <h3 className="font-bold text-indigo-200 text-base">Pro Developer Subscriber</h3>
                <p className="text-xs text-indigo-300/70">You have unlocked unlimited portfolios, custom domain routing, and priority AI generation.</p>
              </div>
            </div>
            <Zap className="text-indigo-400 fill-indigo-400" size={24}/>
          </div>
        ) : subStatus === 'pending' ? (
          <div className="p-5 bg-amber-500/10 border border-amber-500/30 rounded-3xl flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-500/20 rounded-2xl text-amber-400"><Clock size={24}/></div>
              <div>
                <h3 className="font-bold text-amber-300 text-base">Payment Verification Pending</h3>
                <p className="text-xs text-amber-400/80">Your UTR is currently being reviewed by admin. Your Pro badge will activate shortly.</p>
              </div>
            </div>
            <Loader2 className="animate-spin text-amber-400" size={24}/>
          </div>
        ) : (
          <div 
            onClick={() => navigate('/pricing')} 
            className="p-5 bg-gradient-to-r from-white/[0.04] to-white/[0.01] border border-white/10 hover:border-indigo-500/40 rounded-3xl flex items-center justify-between cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-600/20 rounded-2xl text-indigo-400"><Award size={24}/></div>
              <div>
                <h3 className="font-bold text-white text-base">Upgrade to Pro Developer</h3>
                <p className="text-xs text-gray-400">Unlock custom domain name, priority AI generations, and premium templates.</p>
              </div>
            </div>
            <span className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-md">Upgrade (₹99)</span>
          </div>
        )}

        {/* STATS & IDENTITY SCORE GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Identity Score & Progress */}
          <div className={`p-8 rounded-3xl border ${isDark ? 'bg-white/[0.02] border-white/10' : 'bg-white border-gray-200 shadow-sm'} space-y-6`}>
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-400">Identity Completeness</h3>
              <span className="text-3xl font-black">{completeness}%</span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-1000 rounded-full"
                style={{ width: `${completeness}%` }}
              ></div>
            </div>

            {/* Checklist */}
            <div className="space-y-3 pt-2">
              {checklist.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    {item.done ? (
                      <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                    ) : (
                      <Circle size={16} className="text-gray-500 shrink-0" />
                    )}
                    <span className={item.done ? 'text-gray-300' : 'text-gray-500'}>{item.label}</span>
                  </div>
                  <span className="font-mono text-gray-500">+{item.points}%</span>
                </div>
              ))}
            </div>

            {completeness < 100 && (
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-indigo-400 flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Complete Profile in Editor</span>
                <ArrowRight size={14} />
              </button>
            )}
          </div>

          {/* Views Analytics & Trends */}
          <div className={`p-8 rounded-3xl border ${isDark ? 'bg-white/[0.02] border-white/10' : 'bg-white border-gray-200 shadow-sm'} flex flex-col justify-between`}>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-6">Traffic & Reach</h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3.5 rounded-2xl bg-indigo-500/10 text-indigo-400"><Activity size={28}/></div>
                <div>
                  <div className="text-4xl font-black">{formData.views || 0}</div>
                  <div className="text-xs font-bold uppercase tracking-wider text-gray-500">Total Portfolio Views</div>
                </div>
              </div>
            </div>

            {/* Weekly Activity Simulated Graph */}
            <div className="pt-6 border-t border-white/5 space-y-3">
              <div className="flex justify-between items-center text-xs text-gray-400">
                <span>Recent Traffic Growth</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1"><TrendingUp size={14}/> +18% this week</span>
              </div>
              <div className="flex items-end gap-2 h-20 pt-4">
                {[35, 55, 45, 80, 65, 90, 100].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div 
                      className="w-full rounded-lg bg-gradient-to-t from-indigo-600 to-purple-500 opacity-70 hover:opacity-100 transition-opacity" 
                      style={{ height: `${h}%` }}
                    ></div>
                    <span className="text-[9px] text-gray-500 font-mono">
                      {['M','T','W','T','F','S','S'][i]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* QR Code Sharing Modal */}
      <QRCodeModal 
        isOpen={qrModalOpen} 
        onClose={() => setQrModalOpen(false)} 
        url={portfolioUrl}
        title={`${formData.name || 'Developer'}'s Portfolio`}
      />

    </div>
  );
}