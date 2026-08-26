import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { 
  Award, Activity, TrendingUp, Globe, Download, Rocket, 
  Sun, Moon, LogOut, User, Loader2, LayoutTemplate, ShieldCheck, Clock, Zap
} from 'lucide-react';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [subStatus, setSubStatus] = useState('free'); // free, pending, pro
  
  const [formData, setFormData] = useState({
    name: '', username: '', bio: '', avatar_url: '', headline: '',
    skills: [], projects: [], education: [], socials: [], views: 0
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
          education: typeof data.education === 'string' ? JSON.parse(data.education) : data.education || [],
          socials: typeof data.socials === 'string' ? JSON.parse(data.socials) : data.socials || [],
        });
        setIsDark(data.theme !== 'light');
      }
    } catch (err) { console.error(err); }
  };

  const checkSubscription = async () => {
    try {
      // Check for approved subscription first
      const { data: approved } = await supabase
        .from('subscriptions')
        .select('status')
        .eq('user_id', user.id)
        .eq('status', 'approved')
        .single();

      if (approved) {
        setSubStatus('pro');
        return;
      }

      // If not approved, check for pending
      const { data: pending } = await supabase
        .from('subscriptions')
        .select('status')
        .eq('user_id', user.id)
        .eq('status', 'pending')
        .single();

      if (pending) {
        setSubStatus('pending');
      } else {
        setSubStatus('free');
      }
    } catch (err) {
      console.error("Subscription check error:", err);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.from('portfolios').upsert({ 
        id: user.id, 
        ...formData, 
        theme: isDark ? 'dark' : 'light', 
        updated_at: new Date().toISOString() 
      });
      if (error) throw error;
      alert('✅ Changes Deployed!');
    } catch (e) { alert(e.message); } finally { setLoading(false); }
  };

  const calculateScore = () => {
    let score = 0;
    if (formData.name) score++;
    if (formData.headline) score++;
    if (formData.bio) score++;
    if (formData.avatar_url) score++;
    if (formData.projects.length > 0) score++;
    if (formData.socials.length > 0) score++;
    return Math.round((score / 6) * 100);
  };

  const completeness = calculateScore();

  // Dynamic Theme Classes
  const bgClass = isDark ? 'bg-[#050505] text-white' : 'bg-gray-50 text-gray-900';
  const cardBg = isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-sm';
  const accentColor = isDark ? 'text-pink-500' : 'text-indigo-600';
  const accentBg = isDark ? 'bg-pink-500' : 'bg-indigo-600';

  return (
    <div className={`min-h-screen ${bgClass} font-sans transition-colors duration-300`}>
      
      {/* NAVBAR */}
      <nav className={`border-b ${isDark ? 'border-white/10 bg-black/50' : 'border-gray-200 bg-white/50'} backdrop-blur-md sticky top-0 z-50`}>
        <div className="max-w-6xl mx-auto p-4 flex justify-between items-center">
           <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
              <div className={`w-8 h-8 rounded-lg ${isDark ? 'bg-gradient-to-br from-pink-500 to-purple-600' : 'bg-indigo-600'} flex items-center justify-center font-bold text-xs text-white`}>PB</div>
              <span className={`font-bold text-xl tracking-tight ${accentColor}`}>Builder.ai</span>
           </div>
           <div className="flex items-center gap-4">
              <button onClick={() => setIsDark(!isDark)} className={`p-2 rounded-full ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-200'}`}>{isDark ? <Sun size={18}/> : <Moon size={18}/>}</button>
              <button onClick={() => navigate('/dashboard')} className={`px-4 py-2 rounded-lg text-sm font-bold ${isDark ? 'bg-white/10' : 'bg-gray-200'} flex items-center gap-2`}><LayoutTemplate size={16}/> Editor</button>
              <button onClick={logout} className={`p-2 rounded-full ${isDark ? 'hover:bg-red-500/20 text-red-400' : 'hover:bg-red-100 text-red-600'}`}><LogOut size={18}/></button>
              <div className={`w-8 h-8 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-300'} overflow-hidden`}>{formData.avatar_url ? <img src={formData.avatar_url} className="w-full h-full object-cover"/> : <User size={18} className="p-1.5"/>}</div>
           </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-6 space-y-8">
        
        {/* SUBSCRIPTION STATUS BANNER */}
        {subStatus === 'pro' && (
          <div className="p-4 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/50 rounded-2xl flex items-center justify-between">
             <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400"><ShieldCheck size={20}/></div>
                <div>
                   <h3 className="font-bold text-indigo-300">Pro Subscriber</h3>
                   <p className="text-xs text-indigo-400/70">You have full access to all premium features.</p>
                </div>
             </div>
             <Zap className="text-indigo-400 fill-current" size={20}/>
          </div>
        )}

        {subStatus === 'pending' && (
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-2xl flex items-center justify-between">
             <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500/20 rounded-lg text-yellow-500"><Clock size={20}/></div>
                <div>
                   <h3 className="font-bold text-yellow-400">Verification Pending</h3>
                   <p className="text-xs text-yellow-500/70">Your payment is being reviewed by admin. This usually takes &lt; 1 hour.</p>
                </div>
             </div>
             <Loader2 className="animate-spin text-yellow-500" size={20}/>
          </div>
        )}

        {subStatus === 'free' && (
           <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between group hover:border-indigo-500/30 transition-colors cursor-pointer" onClick={() => navigate('/pricing')}>
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-white/10 rounded-lg text-gray-400 group-hover:text-indigo-400 transition-colors"><Award size={20}/></div>
                 <div>
                    <h3 className="font-bold text-gray-300 group-hover:text-white transition-colors">Free Plan</h3>
                    <p className="text-xs text-gray-500">Upgrade to Pro for custom domains and AI features.</p>
                 </div>
              </div>
              <button className="px-4 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-lg">Upgrade</button>
           </div>
        )}

        {/* STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           
           {/* Score Card */}
           <div className={`p-8 rounded-3xl border ${cardBg} relative overflow-hidden`}>
              <div className={`absolute top-0 right-0 p-4 opacity-10`}><Award size={120} /></div>
              <h3 className={`text-xs font-bold uppercase tracking-widest ${isDark ? 'text-gray-400' : 'text-gray-500'} mb-6`}>Digital Identity Score</h3>
              <div className="flex items-end gap-4 mb-4">
                 <span className={`text-6xl font-black ${accentColor}`}>{completeness}%</span>
                 <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mb-2 font-medium`}>Completeness</span>
              </div>
              <div className={`w-full h-2 ${isDark ? 'bg-gray-800' : 'bg-gray-200'} rounded-full mb-6 overflow-hidden`}>
                 <div className={`h-full ${accentBg} transition-all duration-1000`} style={{ width: `${completeness}%` }}></div>
              </div>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>You're building a strong identity! A few more details will make it perfect.</p>
           </div>

           {/* Reach Card */}
           <div className={`p-8 rounded-3xl border ${cardBg} flex flex-col justify-between`}>
              <div>
                 <h3 className={`text-xs font-bold uppercase tracking-widest ${isDark ? 'text-gray-400' : 'text-gray-500'} mb-6`}>Portfolio Reach</h3>
                 <div className="flex items-center gap-4 mb-2">
                    <div className={`p-3 rounded-xl ${isDark ? 'bg-white/5' : 'bg-gray-100'}`}><Activity size={24} className={accentColor} /></div>
                    <div>
                       <div className={`text-4xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>{formData.views || 0}</div>
                       <div className={`text-xs font-bold uppercase ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Total Views</div>
                    </div>
                 </div>
              </div>
              <div className={`mt-8 pt-6 border-t ${isDark ? 'border-white/5' : 'border-gray-200'}`}>
                 <div className="flex justify-between items-center mb-4">
                    <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Trend (Last 7 Days)</span>
                    <span className="text-sm font-bold text-green-500 flex items-center gap-1"><TrendingUp size={14}/> +12%</span>
                 </div>
                 <div className="flex items-end gap-2 h-16">
                    {[40, 70, 45, 90, 60, 85, 100].map((h, i) => (
                       <div key={i} className={`flex-1 ${isDark ? 'bg-white/10' : 'bg-gray-300'} rounded-t-sm`} style={{ height: `${h}%` }}></div>
                    ))}
                 </div>
              </div>
           </div>
        </div>

        {/* ACTION BAR */}
        <div className={`p-6 rounded-3xl border ${cardBg} ${isDark ? 'bg-gradient-to-r from-purple-900/20 to-pink-900/20' : 'bg-gradient-to-r from-indigo-50 to-purple-50'} flex flex-col md:flex-row items-center justify-between gap-6`}>
           <div>
              <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-1`}>Your Portfolio is Live!</h3>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Every edit is synchronized to the cloud.</p>
           </div>
           <div className="flex items-center gap-3 w-full md:w-auto">
              <a href={`/portfolio/${formData.username}`} target="_blank" className={`flex-1 md:flex-none px-6 py-3 ${isDark ? 'bg-white text-black' : 'bg-gray-900 text-white'} rounded-xl font-bold flex items-center justify-center gap-2`}><Globe size={18}/> View Live</a>
              <button onClick={() => navigate('/dashboard')} className={`flex-1 md:flex-none px-6 py-3 ${isDark ? 'bg-white/10 text-white' : 'bg-white text-gray-900'} border rounded-xl font-bold`}>Customize Theme</button>
              <button className={`flex-1 md:flex-none px-6 py-3 bg-transparent border ${isDark ? 'border-pink-500/50 text-pink-500' : 'border-indigo-500/50 text-indigo-600'} rounded-xl font-bold flex items-center justify-center gap-2`}><Download size={18}/> Backup</button>
           </div>
        </div>

        {/* DEPLOY BUTTON */}
        <button onClick={handleSave} disabled={loading} className={`w-full py-5 rounded-2xl font-black text-lg uppercase tracking-widest shadow-lg transition-all flex items-center justify-center gap-3 ${loading ? 'bg-gray-700' : `${accentBg} text-white`}`}>
           {loading ? <Loader2 className="animate-spin" size={24}/> : <Rocket size={24}/>}
           {loading ? 'Deploying Changes...' : 'Deploy Changes'}
        </button>

      </div>
    </div>
  );
}