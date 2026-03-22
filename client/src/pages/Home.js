import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabase/config';
import { useAuth } from '../context/AuthContext';
import { User, LogOut, Code, Plus, Trash2, Github, Linkedin, Twitter, Instagram, Briefcase, Palette, Layers, UserCircle, Cpu, Heart, X, Copy, CheckCheck, Coffee, Globe, Youtube, MessageCircle, ExternalLink, Hash, Download, LayoutDashboard, Activity, Award, TrendingUp, Mail, Phone, MapPin } from 'lucide-react';

const THEMES = [
  { id: 'indigo', name: 'Indigo Core', text: 'text-indigo-400', classes: 'from-indigo-500 to-purple-500 text-indigo-400 bg-indigo-500/20 border-indigo-500/50 hover:bg-indigo-500/30 ring-indigo-500' },
  { id: 'emerald', name: 'Emerald Matrix', text: 'text-emerald-400', classes: 'from-emerald-500 to-teal-500 text-emerald-400 bg-emerald-500/20 border-emerald-500/50 hover:bg-emerald-500/30 ring-emerald-500' },
  { id: 'rose', name: 'Rose Nebula', text: 'text-rose-400', classes: 'from-rose-500 to-pink-500 text-rose-400 bg-rose-500/20 border-rose-500/50 hover:bg-rose-500/30 ring-rose-500' },
  { id: 'amber', name: 'Amber Flare', text: 'text-amber-400', classes: 'from-amber-500 to-orange-500 text-amber-400 bg-amber-500/20 border-amber-500/50 hover:bg-amber-500/30 ring-amber-500' },
  { id: 'neon', name: 'Cyberpunk Neon', text: 'text-fuchsia-400', classes: 'from-fuchsia-500 to-cyan-500 text-fuchsia-400 bg-fuchsia-500/20 border-fuchsia-500/50 hover:bg-fuchsia-500/30 ring-fuchsia-500' },
  { id: 'ocean', name: 'Ocean Depth', text: 'text-cyan-400', classes: 'from-cyan-500 to-blue-600 text-cyan-400 bg-cyan-500/20 border-cyan-500/50 hover:bg-cyan-500/30 ring-cyan-500' },
  { id: 'monolith', name: 'Midnight Monolith', text: 'text-slate-300', classes: 'from-slate-600 to-zinc-800 text-slate-300 bg-slate-500/20 border-slate-500/50 hover:bg-slate-500/30 ring-slate-500' }
];

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
  { id: 'profile', label: 'Profile', icon: <UserCircle size={16} /> },
  { id: 'career', label: 'Career', icon: <Briefcase size={16} /> },
  { id: 'tech', label: 'Tech & Projects', icon: <Cpu size={16} /> },
  { id: 'theme', label: 'Theme', icon: <Palette size={16} /> }
];

const SOCIAL_PLATFORMS = [
  { id: 'github', label: 'GitHub', icon: <Github size={16} /> },
  { id: 'linkedin', label: 'LinkedIn', icon: <Linkedin size={16} /> },
  { id: 'twitter', label: 'X (Twitter)', icon: <Twitter size={16} /> },
  { id: 'instagram', label: 'Instagram', icon: <Instagram size={16} /> },
  { id: 'youtube', label: 'YouTube', icon: <Youtube size={16} /> },
  { id: 'website', label: 'Personal Website', icon: <Globe size={16} /> },
  { id: 'discord', label: 'Discord', icon: <MessageCircle size={16} /> }
];

const initialData = {
  username: '',
  name: '',
  bio: '',
  socials: [], // Array of { platform: '', url: '' }
  skillStacks: [
    { category: 'Frontend', skills: [] },
    { category: 'Backend', skills: [] },
    { category: 'Tools & DevOps', skills: [] }
  ],
  projects: [{ title: '', description: '', tags: [], repoLink: '', demoLink: '' }],
  experience: [],
  education: [],
  certificates: [],
  contact: { email: '', phone: '', location: '' },
  theme: 'indigo',
  avatarUrl: ''
};

export default function Home() {
  const [formData, setFormData] = useState(initialData);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
  const [copiedUPI, setCopiedUPI] = useState(false);
  const [copiedURL, setCopiedURL] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUserData() {
      if (!currentUser) return;
      try {
        const { data } = await supabase
          .from('portfolios')
          .select('*')
          .eq('id', currentUser.id)
          .single();

        if (data) {
          // Map snake_case from DB to camelCase for state
          setFormData({
            ...initialData,
            ...data,
            skillStacks: data.skill_stacks || [],
            certificates: data.certificates || [],
            contact: data.contact || { email: '', phone: '', location: '' },
            username: data.username || currentUser.email.split('@')[0],
            name: data.name || currentUser.displayName || '',
            avatarUrl: data.avatar_url || currentUser.user_metadata?.avatar_url || currentUser.user_metadata?.picture || ''
          });
        } else {
          setFormData(prev => ({ 
            ...prev, 
            name: currentUser.displayName || '', 
            username: currentUser.email.split('@')[0],
            avatarUrl: currentUser.user_metadata?.avatar_url || currentUser.user_metadata?.picture || ''
          }));
        }
      } catch (err) {
        if (err.message?.includes('PGRST116') || err.message?.includes('not found')) {
           // No record found, which is fine for first timers
           setFormData(prev => ({ ...prev, name: currentUser.displayName || '', username: currentUser.email.split('@')[0] }));
        } else {
          console.error('Error fetching user data', err);
          toast.error('❌ Failed to load your data');
        }
      }
      setFetching(false);
    }
    fetchUserData();
  }, [currentUser]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleArrayChange = (arrayName, index, field, value) => {
    const updatedArray = [...formData[arrayName]];
    updatedArray[index][field] = value;
    setFormData(prev => ({ ...prev, [arrayName]: updatedArray }));
  };

  const addArrayItem = (arrayName, newItemTemplate) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: [...prev[arrayName], newItemTemplate]
    }));
  };

  const removeArrayItem = (arrayName, index) => {
    const updatedArray = formData[arrayName].filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, [arrayName]: updatedArray }));
  };

  const setSkillInput = (stackIndex, value) => {
    const newStacks = [...formData.skillStacks];
    newStacks[stackIndex].input = value;
    setFormData({ ...formData, skillStacks: newStacks });
  };

  const handleSkillAdd = (stackIndex) => {
    const skill = (formData.skillStacks[stackIndex].input || '').trim();
    if (skill) {
      const newStacks = [...formData.skillStacks];
      if (!newStacks[stackIndex].skills.includes(skill)) {
        newStacks[stackIndex].skills.push(skill);
      }
      newStacks[stackIndex].input = '';
      setFormData({ ...formData, skillStacks: newStacks });
    }
  };

  const removeSkill = (stackIndex, skillIndex) => {
    const newStacks = [...formData.skillStacks];
    newStacks[stackIndex].skills.splice(skillIndex, 1);
    setFormData({ ...formData, skillStacks: newStacks });
  };

  const addTagToProject = (projIndex, tag) => {
    const cleanTag = tag.trim();
    if (cleanTag) {
      const projects = [...formData.projects];
      if (!projects[projIndex].tags.includes(cleanTag)) {
        projects[projIndex].tags.push(cleanTag);
      }
      projects[projIndex].tagInput = '';
      setFormData({ ...formData, projects });
    }
  };

  const removeTagFromProject = (projIndex, tagIndex) => {
    const projects = [...formData.projects];
    projects[projIndex].tags.splice(tagIndex, 1);
    setFormData({ ...formData, projects });
  };

  const exportToJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(formData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", `builder_ai_backup_${formData.username || 'data'}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    toast.info("📂 Digital Identity Exported!");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username) {
      toast.error('Please enter a username for your URL.');
      setActiveTab('profile');
      return;
    }
    try {
      setLoading(true);
      
      // Clean up inputs before saving
      const payloadSkillStacks = formData.skillStacks.map(({ category, skills }) => ({ category, skills }));
      const payloadProjects = formData.projects.map(({ title, description, tags, repoLink, demoLink }) => ({ title, description, tags, repoLink, demoLink }));
      
      const { error } = await supabase.from('portfolios').upsert({
        id: currentUser.id,
        username: formData.username,
        name: formData.name,
        bio: formData.bio,
        socials: formData.socials,
        skill_stacks: payloadSkillStacks, // Use snake_case for Supabase
        projects: payloadProjects,
        experience: formData.experience,
        education: formData.education,
        certificates: formData.certificates,
        contact: formData.contact,
        theme: formData.theme,
        avatar_url: formData.avatarUrl,
        updated_at: new Date().toISOString()
      });

      if (error) throw error;
      
      localStorage.setItem('portfolioData', JSON.stringify(formData));
      
      toast.success('🎉 Portfolio Saved!');
      setTimeout(() => setShowSuccessOverlay(true), 500);
    } catch (err) {
      console.error('Detailed Supabase Error:', err);
      if (err.message?.includes('column "avatar_url" of relation "portfolios" does not exist')) {
        toast.error('❌ Database Outdated');
      } else {
        toast.error(`❌ Save Failed: ${err.message || 'Check your database connection'}`);
      }
    }
    setLoading(false);
  };

  const calculateIdentityScore = () => {
    let score = 0;
    if (formData.name) score += 10;
    if (formData.bio) score += 10;
    if (formData.socials?.length >= 1) score += 7.5;
    if (formData.socials?.length >= 2) score += 7.5;
    
    let totalSkills = 0;
    formData.skillStacks.forEach(stack => { totalSkills += stack.skills.length; });
    if (totalSkills >= 3) score += 10;
    if (totalSkills >= 6) score += 10;
    
    if (formData.projects?.length >= 1 && formData.projects[0].title) score += 10;
    if (formData.projects?.length >= 2) score += 10;
    
    if (formData.experience?.length >= 1) score += 15;
    if (formData.education?.length >= 1) score += 10;
    if (formData.certificates?.length >= 1) score += 5;
    if (formData.contact?.email) score += 5;
    
    return Math.min(score, 100);
  };

  const identityScore = calculateIdentityScore();

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
       e.preventDefault();
    }
  };

  if (fetching) return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white"><Code className="animate-spin w-8 h-8 text-indigo-500" /></div>;

  const currentTheme = THEMES.find(t => t.id === formData.theme) || THEMES[0];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 font-sans selection:bg-indigo-500/30 flex flex-col">
      
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-[#0a0a0a]/80 border-b border-white/10 backdrop-blur-xl h-16">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${currentTheme.classes.split(' ')[0]} ${currentTheme.classes.split(' ')[1]} flex items-center justify-center shadow-lg shadow-black/50 overflow-hidden relative group`}>
              <img src="/logo.png" alt="Builder Logo" className="w-full h-full object-cover z-10" onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex' }} />
              <div className="absolute inset-0 flex items-center justify-center hidden z-0"><Layers size={20} className="text-white" /></div>
            </div>
            <span className={`text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r ${currentTheme.classes.split(' ')[0]} ${currentTheme.classes.split(' ')[1]}`}>
              Builder.ai
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm">
              <User size={14} className={currentTheme.text} />
              <span>{currentUser?.displayName || currentUser?.email}</span>
            </div>
            <button onClick={() => setShowSupportModal(true)} className={`p-2 hover:bg-white/10 rounded-full transition-colors flex items-center gap-2 text-sm font-medium ${currentTheme.text} hover:text-white group`}>
              <Heart size={18} className="group-hover:fill-current" />
              <span className="hidden md:inline">Support Developer</span>
            </button>
            <button onClick={async () => { await logout(); navigate('/login'); }} className="p-2 hover:bg-white/10 rounded-full transition-colors text-red-400 hover:text-red-300">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-12 px-4 sm:px-6 max-w-[90rem] mx-auto w-full flex-grow grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col h-full relative z-10">
          <div className="bg-[#111] border border-white/10 rounded-3xl backdrop-blur-3xl shadow-2xl flex flex-col overflow-hidden min-h-[700px]">
            <div className="bg-black/40 border-b border-white/10 px-4 sm:px-8 py-5 flex items-center gap-2 overflow-x-auto no-scrollbar">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                    activeTab === tab.id 
                      ? `${currentTheme.classes.split(' ')[2]} ${currentTheme.classes.split(' ')[4]} bg-white/10 border-white/20` 
                      : 'text-gray-400 hover:text-white hover:bg-white/5 border-transparent'
                  } border`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="flex-grow p-4 sm:p-8 flex flex-col">
              <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar space-y-8 relative">
                <AnimatePresence mode="wait">
                  {activeTab === 'dashboard' && (
                    <motion.div key="dashboard" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.2 }} className="space-y-8 w-full">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Identity Score Card */}
                      <div className="flex-1 bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-3xl p-8 relative overflow-hidden group">
                         <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Award size={120} className={currentTheme.text} />
                         </div>
                         <div className="relative z-10">
                            <h3 className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-6">Digital Identity Score</h3>
                            <div className="flex items-end gap-3 mb-4">
                               <span className={`text-6xl font-black ${currentTheme.text}`}>{identityScore}%</span>
                               <span className="text-gray-500 mb-2 font-medium">Completeness</span>
                            </div>
                            <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden mb-6">
                               <div 
                                  className={`h-full bg-gradient-to-r ${currentTheme.classes.split(' ').slice(0, 2).join(' ')} transition-all duration-1000 ease-out`}
                                  style={{ width: `${identityScore}%` }}
                               ></div>
                            </div>
                            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
                               {identityScore < 50 ? "Your digital presence is just starting. Add more skills and projects to boost your score." : 
                                identityScore < 90 ? "You're building a strong identity! A few more details like education or socials will make it perfect." :
                                "Phenomenal! Your identity is FAANG-ready and highly competitive."}
                            </p>
                         </div>
                      </div>

                      {/* Reach/Views Card */}
                      <div className="w-full md:w-80 bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-3xl p-8 relative overflow-hidden group">
                         <div className="relative z-10 h-full flex flex-col justify-between">
                            <div>
                               <h3 className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-6">Portfolio Reach</h3>
                               <div className="flex items-center gap-4 mb-2">
                                  <div className={`p-3 rounded-2xl bg-white/5 ${currentTheme.text}`}>
                                     <Activity size={24} />
                                  </div>
                                  <div>
                                     <span className="text-3xl font-black text-white">{formData.views || 0}</span>
                                     <p className="text-gray-500 text-xs font-bold uppercase tracking-tighter">Total Views</p>
                                  </div>
                               </div>
                            </div>
                            
                            <div className="mt-8 pt-8 border-t border-white/5">
                               <div className="flex items-center justify-between mb-4">
                                  <span className="text-xs text-gray-500 font-medium">Trend (Last 7 Days)</span>
                                  <span className="text-emerald-400 text-xs font-bold flex items-center gap-1">
                                     <TrendingUp size={12} /> +12%
                                  </span>
                               </div>
                               <div className="flex items-end gap-1 h-12">
                                  {[30, 45, 25, 60, 40, 75, 90].map((h, i) => (
                                     <div 
                                        key={i} 
                                        className={`flex-1 rounded-t-sm bg-white/10 group-hover:${currentTheme.classes.split(' ')[0]} transition-all duration-500`}
                                        style={{ height: `${h}%`, transitionDelay: `${i * 50}ms` }}
                                     ></div>
                                  ))}
                               </div>
                            </div>
                         </div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-white/5 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                       <div>
                          <h4 className="text-xl font-bold text-white mb-2">Your Portfolio is Live!</h4>
                          <p className="text-gray-400 text-sm">Every edit you make is instantly synchronized to the Database cloud.</p>
                       </div>
                       <div className="flex gap-4">
                          <button 
                            type="button"
                            onClick={() => window.open(`/portfolio/${formData.username}`, '_blank')}
                            className="px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all flex items-center gap-2"
                          >
                             <Globe size={18} /> View Live
                          </button>
                          <button 
                             type="button"
                             onClick={() => setActiveTab('theme')}
                             className="px-6 py-3 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-all"
                          >
                             Customize Theme
                          </button>
                          <button 
                             type="button"
                             onClick={exportToJson}
                             className={`px-6 py-3 bg-transparent border border-[currentColor] ${currentTheme.text} font-bold rounded-xl hover:bg-white/5 transition-all flex items-center gap-2 hidden lg:flex`}
                          >
                             <Download size={18} /> Backup
                          </button>
                       </div>
                    </div>
                    </motion.div>
                  )}

                  {activeTab === 'profile' && (
                    <motion.div key="profile" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.2 }} className="space-y-8 w-full">
                     <section className="space-y-5">
                      <h3 className={`text-sm font-bold uppercase tracking-widest ${currentTheme.text}`}>Basic Identity</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="col-span-1 md:col-span-2">
                          <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Public Username (for URL)</label>
                          <div className="flex bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden focus-within:border-white/30 transition-colors shadow-inner">
                            <span className="flex items-center px-4 bg-white/5 text-gray-500 text-sm border-r border-white/10">builder.ai/portfolio/</span>
                            <input name="username" value={formData.username} onChange={handleChange} required placeholder="username" className="w-full bg-transparent px-4 py-3 text-white outline-none placeholder-gray-600 text-sm font-medium" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Full Name</label>
                          <input name="name" value={formData.name} onChange={handleChange} required placeholder="e.g. Satoshi Nakamoto" className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-white/30 transition-colors text-sm shadow-inner" />
                        </div>
                        <div className="col-span-1 md:col-span-2">
                          <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Bio Overview</label>
                          <textarea name="bio" value={formData.bio} onChange={handleChange} rows="4" placeholder="Craft a compelling story about your professional journey..." className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-white/30 transition-colors text-sm resize-none shadow-inner leading-relaxed"></textarea>
                        </div>
                      </div>
                    </section>

                    <section className="space-y-5 pt-4 border-t border-white/5">
                      <div className="flex items-center justify-between">
                        <h3 className={`text-sm font-bold uppercase tracking-widest ${currentTheme.text}`}>Dynamic Connectivity</h3>
                        <button type="button" onClick={() => addArrayItem('socials', { platform: 'github', url: '' })} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium transition-colors ${currentTheme.text}`}>
                          <Plus size={14} /> Add Social
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {formData.socials.map((social, index) => (
                          <div key={index} className="bg-[#0a0a0a] border border-white/10 rounded-xl p-3 flex gap-3 items-center group shadow-inner">
                            <select 
                              value={social.platform} 
                              onChange={(e) => handleArrayChange('socials', index, 'platform', e.target.value)}
                              className="bg-white/5 border border-white/10 rounded-lg px-2 py-2 text-xs text-white outline-none"
                            >
                              {SOCIAL_PLATFORMS.map(p => <option key={p.id} value={p.id} className="bg-black">{p.label}</option>)}
                            </select>
                            <input 
                              placeholder="URL path" 
                              value={social.url} 
                              onChange={(e) => handleArrayChange('socials', index, 'url', e.target.value)} 
                              className="flex-grow bg-transparent text-sm text-white outline-none placeholder-gray-600"
                            />
                            <button type="button" onClick={() => removeArrayItem('socials', index)} className="text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                         {formData.socials.length === 0 && (
                          <div className="col-span-2 text-center py-6 border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
                            <p className="text-gray-500 text-xs">No social links added. Click 'Add Social' to start connecting.</p>
                          </div>
                        )}
                      </div>
                    </section>

                    <section className="space-y-5 pt-4 border-t border-white/5">
                      <h3 className={`text-sm font-bold uppercase tracking-widest ${currentTheme.text}`}>Reach-out Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-3 flex gap-3 items-center group shadow-inner">
                          <Mail size={16} className="text-gray-500" />
                          <input 
                            placeholder="Email Address" 
                            value={formData.contact?.email || ''} 
                            onChange={(e) => setFormData(prev => ({ ...prev, contact: { ...prev.contact, email: e.target.value } }))} 
                            className="flex-grow bg-transparent text-sm text-white outline-none placeholder-gray-600"
                          />
                        </div>
                        <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-3 flex gap-3 items-center group shadow-inner">
                          <Phone size={16} className="text-gray-500" />
                          <input 
                            placeholder="Phone Number" 
                            value={formData.contact?.phone || ''} 
                            onChange={(e) => setFormData(prev => ({ ...prev, contact: { ...prev.contact, phone: e.target.value } }))} 
                            className="flex-grow bg-transparent text-sm text-white outline-none placeholder-gray-600"
                          />
                        </div>
                        <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-3 flex gap-3 items-center group shadow-inner">
                          <MapPin size={16} className="text-gray-500" />
                          <input 
                            placeholder="Location (e.g. SF, CA)" 
                            value={formData.contact?.location || ''} 
                            onChange={(e) => setFormData(prev => ({ ...prev, contact: { ...prev.contact, location: e.target.value } }))} 
                            className="flex-grow bg-transparent text-sm text-white outline-none placeholder-gray-600"
                          />
                        </div>
                      </div>
                    </section>
                    </motion.div>
                  )}

                  {activeTab === 'career' && (
                    <motion.div key="career" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.2 }} className="space-y-12 w-full">
                    <section className="space-y-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className={`text-sm font-bold uppercase tracking-widest ${currentTheme.text}`}>Work Experience</h3>
                        </div>
                        <button type="button" onClick={() => addArrayItem('experience', { role: '', company: '', duration: '', desc: '' })} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium transition-colors ${currentTheme.text}`}>
                          <Plus size={14} /> Add Role
                        </button>
                      </div>
                      <div className="space-y-6">
                        {formData.experience.map((exp, index) => (
                          <div key={index} className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-5 relative group shadow-inner">
                            <button type="button" onClick={() => removeArrayItem('experience', index)} className="absolute top-5 right-5 text-gray-600 hover:text-red-400 p-1 bg-white/5 rounded-md opacity-0 group-hover:opacity-100 transition-all">
                              <Trash2 size={14} />
                            </button>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pr-8">
                              <input placeholder="Job Title" value={exp.role} onChange={(e) => handleArrayChange('experience', index, 'role', e.target.value)} className="w-full bg-transparent border-b border-white/5 px-0 py-2 text-white outline-none focus:border-white/30 text-sm font-semibold" />
                              <input placeholder="Company Name" value={exp.company} onChange={(e) => handleArrayChange('experience', index, 'company', e.target.value)} className="w-full bg-transparent border-b border-white/5 px-0 py-2 text-white outline-none focus:border-white/30 text-sm" />
                            </div>
                            <input placeholder="Duration (e.g., 2021 - Present)" value={exp.duration} onChange={(e) => handleArrayChange('experience', index, 'duration', e.target.value)} className="w-full bg-transparent border-b border-white/5 px-0 py-2 mb-4 text-white outline-none focus:border-white/30 text-sm" />
                            <textarea placeholder="Key accomplishments..." value={exp.desc} onChange={(e) => handleArrayChange('experience', index, 'desc', e.target.value)} className="w-full bg-white/5 rounded-xl border border-white/5 p-3 text-gray-300 text-sm h-24 shadow-inner" />
                          </div>
                        ))}
                      </div>
                    </section>

                    <section className="space-y-5 pt-10 border-t border-white/5">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className={`text-sm font-bold uppercase tracking-widest ${currentTheme.text}`}>Education</h3>
                        </div>
                        <button type="button" onClick={() => addArrayItem('education', { degree: '', school: '', year: '' })} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium transition-colors ${currentTheme.text}`}>
                          <Plus size={14} /> Add Education
                        </button>
                      </div>
                      <div className="space-y-4">
                        {formData.education.map((edu, index) => (
                          <div key={index} className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-5 relative group shadow-inner">
                            <button type="button" onClick={() => removeArrayItem('education', index)} className="absolute top-5 right-5 text-gray-600 hover:text-red-400 p-1 bg-white/5 rounded-md opacity-0 group-hover:opacity-100 transition-all">
                              <Trash2 size={14} />
                            </button>
                            <input placeholder="Degree / Certificate Name" value={edu.degree} onChange={(e) => handleArrayChange('education', index, 'degree', e.target.value)} className="w-full bg-transparent border-b border-white/10 px-0 py-2 mb-4 text-white outline-none focus:border-white/30 text-sm font-semibold pr-8" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <input placeholder="Institution" value={edu.school} onChange={(e) => handleArrayChange('education', index, 'school', e.target.value)} className="w-full bg-transparent border-b border-white/5 px-0 py-2 text-white outline-none focus:border-white/30 text-sm" />
                              <input placeholder="Year/Duration" value={edu.year} onChange={(e) => handleArrayChange('education', index, 'year', e.target.value)} className="w-full bg-transparent border-b border-white/5 px-0 py-2 text-white outline-none focus:border-white/30 text-sm" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>

                    <section className="space-y-5 pt-10 border-t border-white/5">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className={`text-sm font-bold uppercase tracking-widest ${currentTheme.text}`}>Professional Certifications</h3>
                        </div>
                        <button type="button" onClick={() => addArrayItem('certificates', { title: '', issuer: '', year: '', link: '' })} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium transition-colors ${currentTheme.text}`}>
                          <Plus size={14} /> Add Certificate
                        </button>
                      </div>
                      <div className="space-y-4">
                        {formData.certificates.map((cert, index) => (
                          <div key={index} className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-5 relative group shadow-inner">
                            <button type="button" onClick={() => removeArrayItem('certificates', index)} className="absolute top-5 right-5 text-gray-600 hover:text-red-400 p-1 bg-white/5 rounded-md opacity-0 group-hover:opacity-100 transition-all">
                              <Trash2 size={14} />
                            </button>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pr-8">
                              <input placeholder="Certificate Name" value={cert.title} onChange={(e) => handleArrayChange('certificates', index, 'title', e.target.value)} className="w-full bg-transparent border-b border-white/5 px-0 py-2 text-white outline-none focus:border-white/30 text-sm font-semibold" />
                              <input placeholder="Issuing Organization" value={cert.issuer} onChange={(e) => handleArrayChange('certificates', index, 'issuer', e.target.value)} className="w-full bg-transparent border-b border-white/5 px-0 py-2 text-white outline-none focus:border-white/30 text-sm" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <input placeholder="Year" value={cert.year} onChange={(e) => handleArrayChange('certificates', index, 'year', e.target.value)} className="w-full bg-transparent border-b border-white/5 px-0 py-2 text-white outline-none focus:border-white/30 text-sm" />
                              <input placeholder="Credential Link (Optional)" value={cert.link} onChange={(e) => handleArrayChange('certificates', index, 'link', e.target.value)} className="w-full bg-transparent border-b border-white/5 px-0 py-2 text-white outline-none focus:border-white/30 text-sm" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                    </motion.div>
                  )}

                  {activeTab === 'tech' && (
                    <motion.div key="tech" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.2 }} className="space-y-12 w-full">
                    <section className="space-y-5">
                      <h3 className={`text-sm font-bold uppercase tracking-widest ${currentTheme.text}`}>FAANG-Level Skill Stacks</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {formData.skillStacks.map((stack, sIdx) => (
                          <div key={sIdx} className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-5 shadow-inner">
                            <input 
                              className={`text-xs font-bold uppercase tracking-wider mb-4 bg-transparent outline-none border-b border-white/5 focus:border-white/20 pb-1 w-full ${currentTheme.text}`}
                              value={stack.category}
                              onChange={(e) => {
                                const newStacks = [...formData.skillStacks];
                                newStacks[sIdx].category = e.target.value;
                                setFormData({ ...formData, skillStacks: newStacks });
                              }}
                            />
                            <div className="flex gap-2 mb-4">
                              <input 
                                placeholder="Add skill..." 
                                value={stack.input || ''}
                                onChange={(e) => setSkillInput(sIdx, e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSkillAdd(sIdx)}
                                className="flex-grow bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none"
                              />
                              <button type="button" onClick={() => handleSkillAdd(sIdx)} className="p-1.5 rounded-lg bg-white/10 text-white"><Plus size={14}/></button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {stack.skills.map((skill, skIdx) => (
                                <div key={skIdx} className="flex items-center gap-1.5 bg-white/5 border border-white/10 text-gray-300 px-2 py-1 rounded text-[10px] group">
                                  <span>{skill}</span>
                                  <button type="button" onClick={() => removeSkill(sIdx, skIdx)} className="text-gray-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                                    <Trash2 size={10} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>

                    <section className="space-y-6 pt-6 border-t border-white/5">
                      <div className="flex items-center justify-between">
                        <h3 className={`text-sm font-bold uppercase tracking-widest ${currentTheme.text}`}>Advanced Projects</h3>
                        <button type="button" onClick={() => addArrayItem('projects', { title: '', description: '', tags: [], repoLink: '', demoLink: '' })} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium transition-colors ${currentTheme.text}`}>
                          <Plus size={14} /> Add Project
                        </button>
                      </div>
                      <div className="space-y-8">
                        {formData.projects.map((proj, pIdx) => (
                          <div key={pIdx} className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 relative group shadow-inner">
                            <button type="button" onClick={() => removeArrayItem('projects', pIdx)} className="absolute top-6 right-6 text-gray-600 hover:text-red-400 p-1.5 bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                              <Trash2 size={16} />
                            </button>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-4">
                                <input placeholder="Project Name" value={proj.title} onChange={(e) => handleArrayChange('projects', pIdx, 'title', e.target.value)} className="w-full bg-transparent border-b border-white/5 py-2 text-white text-lg font-bold outline-none" />
                                <textarea placeholder="Describe the technical challenges and outcomes..." value={proj.description} onChange={(e) => handleArrayChange('projects', pIdx, 'description', e.target.value)} className="w-full bg-white/5 rounded-2xl border border-white/5 p-4 text-gray-300 text-sm h-32 resize-none" />
                              </div>
                              <div className="space-y-4">
                                <div>
                                  <label className="text-[10px] text-gray-500 uppercase font-bold mb-2 block">Technology Tags</label>
                                  <div className="flex gap-2 mb-3">
                                    <input 
                                      placeholder="Tailwind, Next.js..." 
                                      value={proj.tagInput || ''}
                                      onChange={(e) => {
                                        const p = [...formData.projects];
                                        p[pIdx].tagInput = e.target.value;
                                        setFormData({...formData, projects: p});
                                      }}
                                      onKeyDown={(e) => e.key === 'Enter' && addTagToProject(pIdx, proj.tagInput)}
                                      className="flex-grow bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white" 
                                    />
                                    <button type="button" onClick={() => addTagToProject(pIdx, proj.tagInput)} className="p-2.5 rounded-xl bg-white/10 text-white"><Plus size={14}/></button>
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    {proj.tags?.map((tag, tIdx) => (
                                      <span key={tIdx} className={`text-[9px] font-bold px-2 py-1 rounded bg-white/10 text-white flex items-center gap-1`}>
                                        <Hash size={8} /> {tag}
                                        <button type="button" onClick={() => removeTagFromProject(pIdx, tIdx)} className="text-gray-500 hover:text-red-400 ml-1"><X size={10}/></button>
                                      </span>
                                    ))}
                                  </div>
                                </div>
                                <div className="space-y-3 pt-2">
                                  <div className="flex items-center gap-3 bg-white/[0.03] border border-white/5 rounded-xl px-3 py-2">
                                    <Github size={14} className="text-gray-500" />
                                    <input placeholder="Repo URL" value={proj.repoLink} onChange={(e) => handleArrayChange('projects', pIdx, 'repoLink', e.target.value)} className="bg-transparent text-xs text-white flex-grow outline-none" />
                                  </div>
                                  <div className="flex items-center gap-3 bg-white/[0.03] border border-white/5 rounded-xl px-3 py-2">
                                    <ExternalLink size={14} className="text-gray-500" />
                                    <input placeholder="Live Demo URL" value={proj.demoLink} onChange={(e) => handleArrayChange('projects', pIdx, 'demoLink', e.target.value)} className="bg-transparent text-xs text-white flex-grow outline-none" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                    </motion.div>
                  )}

                  {activeTab === 'theme' && (
                    <motion.div key="theme" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.2 }} className="space-y-8 w-full">
                     <section className="space-y-6">
                      <div className="mb-4">
                        <h3 className={`text-sm font-bold uppercase tracking-widest ${currentTheme.text}`}>UI Engine Variables</h3>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {THEMES.map(theme => (
                          <button
                            key={theme.id}
                            type="button"
                            onClick={() => setFormData({ ...formData, theme: theme.id })}
                            className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                              formData.theme === theme.id 
                                ? `bg-white/10 border-white/30 ring-2 ${theme.classes.split(' ').find(c => c.startsWith('ring-'))} ring-offset-4 ring-offset-[#111]` 
                                : 'bg-[#0a0a0a] border-white/10 hover:bg-white/5 saturate-50 hover:saturate-100'
                            }`}
                          >
                            <div className="flex items-center gap-4">
                               <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${theme.classes.split(' ')[0]} ${theme.classes.split(' ')[1]} shadow-lg flex items-center justify-center`}>
                                 <Palette size={18} className="text-white drop-shadow-md" />
                               </div>
                               <div className="text-left">
                                 <span className="block text-sm font-bold text-white mb-0.5">{theme.name}</span>
                                 <span className="block text-xs text-gray-500 font-mono">{theme.id}-driven</span>
                               </div>
                            </div>
                            {formData.theme === theme.id && <div className={`w-3 h-3 rounded-full bg-current ${theme.text} animate-pulse shadow-[0_0_10px_currentColor]`}></div>}
                          </button>
                        ))}
                      </div>
                    </section>
                  </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="pt-6 mt-4 border-t border-white/10 bg-[#111] z-20 sticky bottom-0">
                <button disabled={loading} type="submit" className={`w-full py-4 bg-gradient-to-r ${currentTheme.classes.split(' ')[0]} ${currentTheme.classes.split(' ')[1]} opacity-90 hover:opacity-100 text-white font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 text-sm tracking-wide uppercase`}>
                  {loading ? 'Compiling to Edge...' : 'Deploy'}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="lg:col-span-5 xl:col-span-4 relative hidden lg:block h-[calc(100vh-8rem)]">
          <div className="sticky top-24 bg-[#111] border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-2xl overflow-hidden h-full flex flex-col">
            <div className={`absolute -top-32 -right-32 w-72 h-72 bg-gradient-to-br ${currentTheme.classes.split(' ')[0]} ${currentTheme.classes.split(' ')[1]} rounded-full mix-blend-screen filter blur-[120px] opacity-40 pointer-events-none`}></div>
            <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4 relative z-10 shrink-0">
              <h3 className="font-semibold text-gray-200 flex items-center gap-2 text-[10px] uppercase tracking-widest">
                <span className={`w-2 h-2 rounded-full ${currentTheme.text.replace('text-', 'bg-')} animate-pulse`}></span>
                Live Simulation
              </h3>
            </div>
            <div className="overflow-y-auto no-scrollbar relative z-10 flex-grow pb-8 pr-2 space-y-8">
              <div className="text-center">
                <div className="w-24 h-24 rounded-3xl bg-white/5 border border-white/10 mx-auto mb-4 flex items-center justify-center text-gray-500 shadow-inner">
                   <User size={36} />
                </div>
                <h2 className={`text-xl font-black bg-clip-text text-transparent bg-gradient-to-r ${currentTheme.classes.split(' ')[0]} ${currentTheme.classes.split(' ')[1]}`}>{formData.name || 'User Name'}</h2>
                
                {/* Contact Simulation */}
                {(formData.contact?.email || formData.contact?.location) && (
                  <div className="mt-4 pt-4 border-t border-white/5 space-y-1.5 opacity-80">
                    {formData.contact.email && (
                      <div className="flex items-center justify-center gap-2 text-[9px] text-gray-500">
                        <Mail size={10} className={currentTheme.text} />
                        {formData.contact.email}
                      </div>
                    )}
                    {formData.contact.location && (
                      <div className="flex items-center justify-center gap-2 text-[9px] text-gray-500">
                        <MapPin size={10} className={currentTheme.text} />
                        {formData.contact.location}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-3">Stacks Integration</h4>
                  <div className="grid grid-cols-1 gap-3">
                    {formData.skillStacks.filter(s => s.skills.length > 0).slice(0, 2).map((stack, i) => (
                      <div key={i} className="bg-white/[0.02] border border-white/5 rounded-xl p-3">
                        <div className={`text-[9px] font-bold mb-2 uppercase opacity-60`}>{stack.category}</div>
                        <div className="flex flex-wrap gap-1">
                          {stack.skills.slice(0, 4).map((sk, j) => (
                            <span key={j} className="text-[9px] bg-white/5 border border-white/5 px-2 py-0.5 rounded text-gray-400">{sk}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {formData.education.length > 0 && formData.education[0].degree !== '' && (
                  <div>
                    <h4 className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-3">Academic Base</h4>
                    <div className="space-y-2">
                       {formData.education.slice(0, 1).map((edu, i) => (
                         <div key={i} className="text-[10px] border-l-2 border-white/10 pl-3 py-0.5">
                           <div className="font-semibold text-gray-300 leading-tight">{edu.degree}</div>
                           <div className="text-gray-500">{edu.school}</div>
                         </div>
                       ))}
                    </div>
                  </div>
                )}

                {formData.certificates?.length > 0 && (
                  <div>
                    <h4 className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-3">Certifications</h4>
                    <div className="space-y-2">
                       {formData.certificates.slice(0, 2).map((cert, i) => (
                         <div key={i} className="text-[10px] border-l-2 border-white/10 pl-3 py-0.5">
                           <div className="font-semibold text-gray-300 leading-tight">{cert.title}</div>
                           <div className="text-gray-500">{cert.issuer}</div>
                         </div>
                       ))}
                    </div>
                  </div>
                )}

                <div>
                   <h4 className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-3">Top Project</h4>
                   <div className="bg-[#0a0a0a] border border-white/5 p-4 rounded-2xl shadow-inner">
                      <div className={`font-bold text-xs mb-2`}>{formData.projects[0]?.title || 'Untitled'}</div>
                      <div className="flex flex-wrap gap-1">
                        {formData.projects[0]?.tags?.slice(0, 3).map((t, i) => (
                          <span key={i} className={`text-[8px] px-1.5 py-0.5 rounded bg-white/5 text-gray-500 border border-white/10`}>#{t}</span>
                        ))}
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {showSupportModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowSupportModal(false)}></div>
          <div className="relative bg-[#111] border border-white/10 rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <button onClick={() => setShowSupportModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
              <X size={20} />
            </button>
            <div className="text-center mb-6 mt-4">
              <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${currentTheme.classes.split(' ')[0]} ${currentTheme.classes.split(' ')[1]} flex items-center justify-center mb-4 shadow-lg shadow-black/50`}>
                <Heart size={28} className="text-white fill-white" />
              </div>
              <h2 className="text-2xl font-black text-white mb-1">Nejamul Haque</h2>
              <p className={`text-sm font-medium ${currentTheme.text}`}>Creator & Developer</p>
            </div>
            <div className="text-sm text-gray-400 text-center leading-relaxed mb-6">
              I built <strong>Builder.ai</strong> to help developers create stunning portfolios for free. If you love this tool, consider supporting my late-night coding sessions! ☕
            </div>
            <div className="space-y-4">
              <a href="https://nejamulhaque.gumroad.com/coffee" target="_blank" rel="noreferrer" className={`w-full py-3 px-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center gap-3 text-sm font-bold text-white group`}>
                <Coffee size={18} className="group-hover:animate-bounce" />
                Buy me a coffee
              </a>
              <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-4">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 text-center">Scan to Pay via UPI</p>
                <div className="flex flex-col items-center gap-4">
                  <div className="p-3 bg-white rounded-2xl shadow-xl shadow-black/20">
                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=nejamulhaque@freecharge&pn=Nejamul%20Haque&cu=INR`} alt="UPI QR Code" className="w-32 h-32" />
                  </div>
                  <div className="w-full flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-2 pl-4">
                    <span className="flex-grow text-[11px] font-mono text-gray-400 select-all truncate">nejamulhaque@freecharge</span>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText('nejamulhaque@freecharge');
                        setCopiedUPI(true);
                        setTimeout(() => setCopiedUPI(false), 2000);
                      }} 
                      className={`p-2 rounded-lg transition-colors flex items-center justify-center border ${copiedUPI ? 'bg-green-500/20 border-green-500/50 text-green-400' : 'bg-white/10 border-transparent hover:bg-white/20 text-white'}`}
                    >
                      {copiedUPI ? <CheckCheck size={14} /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {showSuccessOverlay && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-500"></div>
          <div className="relative bg-[#111] border border-white/10 rounded-[2.5rem] p-8 sm:p-12 max-w-2xl w-full shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 overflow-hidden group">
            <div className={`absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br ${currentTheme.classes.split(' ')[0]} ${currentTheme.classes.split(' ')[1]} rounded-full blur-[100px] opacity-20`}></div>
            
            <div className="text-center mb-10">
              <div className={`w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br ${currentTheme.classes.split(' ')[0]} ${currentTheme.classes.split(' ')[1]} flex items-center justify-center mb-6 shadow-2xl rotate-3 group-hover:rotate-6 transition-transform`}>
                <CheckCheck size={40} className="text-white" />
              </div>
              <h2 className="text-4xl font-extrabold text-white mb-2 tracking-tight">Deployment Successful</h2>
              <p className="text-gray-400 font-medium">Your modern digital identity is now live on the global edge.</p>
            </div>

            <div className="bg-black/40 border border-white/10 rounded-2xl p-6 mb-8 relative group/url">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-3 block">Public Portfolio URL</label>
              <div className="flex items-center gap-4 bg-white/5 border border-white/5 rounded-xl p-3 pl-4">
                <span className={`text-sm font-mono ${currentTheme.text} truncate`}>builder.ai/portfolio/{formData.username}</span>
                <div className="flex gap-2">
                  <button onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/portfolio/${formData.username}`);
                    setCopiedURL(true);
                    setTimeout(() => setCopiedURL(false), 2000);
                    toast.success("Link copied!");
                  }} className="p-2.5 rounded-lg bg-white/10 hover:bg-white/20 transition-all text-white">
                    {copiedURL ? <CheckCheck size={16} /> : <Copy size={16} />}
                  </button>
                  <button onClick={() => window.open(`/portfolio/${formData.username}`, '_blank')} className="p-2.5 rounded-lg bg-white/10 hover:bg-white/20 transition-all text-white">
                    <ExternalLink size={16} />
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button 
                onClick={() => {
                  setShowSuccessOverlay(false);
                  window.print();
                }} 
                className="flex items-center justify-center gap-3 py-4 rounded-xl bg-white text-black font-bold hover:bg-gray-200 transition-all shadow-xl"
              >
                <Download size={18} /> Download PDF
              </button>
              <button 
                onClick={exportToJson}
                className="flex items-center justify-center gap-3 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all"
              >
                <Layers size={18} /> Export Data (JSON)
              </button>
              <button 
                onClick={() => setShowSuccessOverlay(false)} 
                className="sm:col-span-2 py-4 text-gray-500 font-bold hover:text-white transition-colors text-sm uppercase tracking-widest"
              >
                Dismiss & Continue Editing
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer theme="dark" position="bottom-right" />
    </div>
  );
}