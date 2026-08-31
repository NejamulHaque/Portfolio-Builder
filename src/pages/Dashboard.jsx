import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { generateBio, generateHeadline, enhanceProjectDesc } from '../services/aiService';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Eye, Trash2, User, Upload, X, Sun, Moon, 
  LogOut, Sparkles, Globe,
  Loader2, Code, Rocket, ExternalLink, LayoutTemplate,
  Briefcase, Download, UploadCloud, QrCode, Monitor, Tablet, Smartphone
} from 'lucide-react';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import PortfolioRenderer from '../components/PortfolioRenderer';
import QRCodeModal from '../components/QRCodeModal';
import { useToast } from '../components/Toast';
import { SAMPLE_PROFILES } from '../data/sampleProfiles';

const SOCIAL_PLATFORMS = [
  { id: 'github', name: 'GitHub', icon: <FaGithub size={16} /> },
  { id: 'linkedin', name: 'LinkedIn', icon: <FaLinkedin size={16} /> },
  { id: 'twitter', name: 'Twitter/X', icon: <FaTwitter size={16} /> },
  { id: 'website', name: 'Website', icon: <Globe size={16} /> },
];

const TEMPLATES = [
  { id: 'minimal', name: 'Minimalist', desc: 'Clean & Simple' },
  { id: 'cyberpunk', name: 'Cyberpunk', desc: 'Neon & Matrix' },
  { id: 'corporate', name: 'Corporate', desc: 'Professional Slate' },
  { id: 'terminal', name: 'Terminal CLI', desc: 'Retro Hacker' },
  { id: 'glassmorphism', name: 'Glass Luxe', desc: 'Frosted Glow' },
  { id: 'bento', name: 'Bento Grid', desc: 'Modular & Playful' },
];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [aiLoading, setAiLoading] = useState(null); // null, 'bio', 'headline', or index
  const [isDark, setIsDark] = useState(true);
  const [activeTab, setActiveTab] = useState('editor'); // 'editor' | 'preview' for mobile
  const [previewDevice, setPreviewDevice] = useState('desktop'); // 'desktop' | 'tablet' | 'mobile'
  const [qrModalOpen, setQrModalOpen] = useState(false);

  const fileInputRef = useRef(null);
  const jsonInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: '', username: '', bio: '', avatar_url: '', headline: '', location: '',
    skills: [{ category: 'Frontend', skills: ['React', 'TypeScript', 'Tailwind'] }],
    projects: [], experience: [], education: [], certificates: [],
    contact: { email: '', website: '', location: '' },
    socials: [], theme: 'dark', template: 'minimal'
  });

  useEffect(() => { 
    if (user) fetchPortfolio(); 
  }, [user]);

  const fetchPortfolio = async () => {
    try {
      const { data, error } = await supabase.from('portfolios').select('*').eq('id', user.id).single();
      if (data) {
        const skills = typeof data.skills === 'string' ? JSON.parse(data.skills) : data.skills || [];
        const projects = typeof data.projects === 'string' ? JSON.parse(data.projects) : data.projects || [];
        const experience = typeof data.experience === 'string' ? JSON.parse(data.experience) : data.experience || [];
        const education = typeof data.education === 'string' ? JSON.parse(data.education) : data.education || [];
        const certificates = typeof data.certificates === 'string' ? JSON.parse(data.certificates) : data.certificates || [];
        const contact = typeof data.contact === 'string' ? JSON.parse(data.contact) : data.contact || {};
        const socials = typeof data.socials === 'string' ? JSON.parse(data.socials) : data.socials || [];
        
        const isNejamul = user.email?.toLowerCase().includes('nejamul') || data.username === 'nejamulhaque';
        const isBlank = (!skills.length && !projects.length && !experience.length);

        if (isNejamul && isBlank) {
          const preset = SAMPLE_PROFILES.nejamul;
          setFormData({
            ...preset,
            ...data,
            name: data.name || preset.name,
            headline: (data.headline && data.headline !== 'DevSecOps Engineer' && data.headline !== 'Hi') ? data.headline : preset.headline,
            bio: (data.bio && data.bio !== 'Hi' && data.bio.length > 10) ? data.bio : preset.bio,
            avatar_url: data.avatar_url || preset.avatar_url,
            skills: skills.length ? skills : preset.skills,
            projects: projects.length ? projects : preset.projects,
            experience: experience.length ? experience : preset.experience,
            education: education.length ? education : preset.education,
            certificates: certificates.length ? certificates : preset.certificates,
            socials: socials.length ? socials : preset.socials,
            contact: { ...preset.contact, ...(contact || {}) },
            template: data.template || preset.template
          });
        } else {
          setFormData({
            ...data,
            skills,
            projects,
            experience,
            education,
            certificates,
            contact,
            socials,
            template: data.template || 'minimal'
          });
        }
        setIsDark(data.theme !== 'light');
      } else {
        // Pre-fill username & profile from sample if brand new
        const isNejamul = user.email?.toLowerCase().includes('nejamul');
        const fallback = isNejamul ? SAMPLE_PROFILES.nejamul : null;
        
        setFormData(prev => ({
          ...prev,
          ...(fallback || {}),
          name: user.user_metadata?.full_name || fallback?.name || '',
          username: (user.email?.split('@')[0] || fallback?.username || '').toLowerCase().replace(/[^a-z0-9]/g, ''),
          contact: { ...(fallback?.contact || prev.contact), email: user.email || fallback?.contact?.email || '' }
        }));
      }
    } catch (err) { 
      console.error(err); 
    }
  };

  // --- PRESET LOADER ---
  const handleLoadPreset = (presetKey) => {
    const preset = SAMPLE_PROFILES[presetKey];
    if (!preset) return;
    setFormData(prev => ({
      ...prev,
      ...preset,
      // keep current user id & username if user has one
      username: prev.username || preset.username,
      contact: {
        ...preset.contact,
        email: prev.contact?.email || preset.contact.email
      }
    }));
    toast.success(`Loaded ${preset.name} preset sample!`);
  };

  // --- AI HANDLERS ---
  const handleGenerateBio = async () => {
    setAiLoading('bio');
    try {
      const bio = await generateBio(formData);
      setFormData(prev => ({ ...prev, bio }));
      toast.success('Generated professional bio with AI!');
    } catch (err) { 
      toast.error('AI Failed: ' + err.message); 
    } finally { 
      setAiLoading(null); 
    }
  };

  const handleGenerateHeadline = async () => {
    setAiLoading('headline');
    try {
      const headline = await generateHeadline(formData);
      setFormData(prev => ({ ...prev, headline }));
      toast.success('Generated headline with AI!');
    } catch (err) { 
      toast.error('AI Failed: ' + err.message); 
    } finally { 
      setAiLoading(null); 
    }
  };

  const handleEnhanceProject = async (index) => {
    setAiLoading(`project-${index}`);
    try {
      const newDesc = await enhanceProjectDesc(formData.projects[index]);
      const newProjects = [...formData.projects];
      newProjects[index].description = newDesc;
      setFormData(prev => ({ ...prev, projects: newProjects }));
      toast.success('Enhanced project description with AI!');
    } catch (err) { 
      toast.error('AI Failed: ' + err.message); 
    } finally { 
      setAiLoading(null); 
    }
  };

  // --- IMAGE UPLOAD ---
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      if (formData.avatar_url && formData.avatar_url.includes('portfolios')) {
        await supabase.storage.from('portfolios').remove([formData.avatar_url.split('/').pop()]).catch(() => {});
      }
      const fileName = `${user.id}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const { error } = await supabase.storage.from('portfolios').upload(fileName, file, { upsert: true });
      if (error) throw error;
      const { data: urlData } = supabase.storage.from('portfolios').getPublicUrl(fileName);
      setFormData(prev => ({ ...prev, avatar_url: urlData.publicUrl }));
      toast.success('Photo uploaded successfully!');
    } catch (err) { 
      toast.error('Upload failed. Using direct image link instead.'); 
    } finally { 
      setUploading(false); 
      if (fileInputRef.current) fileInputRef.current.value = ''; 
    }
  };

  const removeAvatar = async () => {
    if (formData.avatar_url && formData.avatar_url.includes('portfolios')) {
      await supabase.storage.from('portfolios').remove([formData.avatar_url.split('/').pop()]).catch(() => {});
    }
    setFormData(prev => ({ ...prev, avatar_url: '' }));
    toast.info('Avatar removed');
  };

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    setFormData(prev => ({ ...prev, theme: nextDark ? 'dark' : 'light' }));
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // --- ARRAY EDIT HELPERS ---
  const addArrayItem = (field, template) => setFormData({ ...formData, [field]: [...(formData[field] || []), template] });
  const removeArrayItem = (field, index) => setFormData({ ...formData, [field]: formData[field].filter((_, i) => i !== index) });
  const updateArrayItem = (field, index, key, value) => {
    const n = [...(formData[field] || [])]; 
    n[index] = { ...n[index], [key]: value };
    setFormData({ ...formData, [field]: n });
  };
  
  const addSocialLink = () => setFormData(prev => ({ ...prev, socials: [...(prev.socials || []), { platform: 'github', url: '' }] }));
  const updateSocialLink = (index, field, value) => {
    const n = [...formData.socials]; 
    n[index][field] = value;
    setFormData(prev => ({ ...prev, socials: n }));
  };
  const removeSocialLink = (index) => setFormData(prev => ({ ...prev, socials: prev.socials.filter((_, i) => i !== index) }));

  // --- EXPORT / IMPORT JSON ---
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(formData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `portfolio-${formData.username || 'backup'}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast.success('Portfolio backup exported to JSON!');
  };

  const handleImportJSON = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        setFormData(prev => ({
          ...prev,
          ...imported,
          username: prev.username || imported.username
        }));
        toast.success('Portfolio imported successfully!');
      } catch (err) {
        toast.error('Invalid JSON file format.');
      }
    };
    reader.readAsText(file);
    if (jsonInputRef.current) jsonInputRef.current.value = '';
  };

  // --- SAVE & DEPLOY ---
  const handleSave = async () => {
    if (!formData.username) {
      toast.error('Please enter a username before deploying!');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.from('portfolios').upsert({ 
        id: user.id, 
        ...formData, 
        theme: isDark ? 'dark' : 'light',
        updated_at: new Date().toISOString() 
      });
      if (error) throw error;
      toast.success('🚀 Portfolio deployed and live!');
    } catch (e) { 
      toast.error(e.message); 
    } finally { 
      setLoading(false); 
    }
  };

  const livePortfolioUrl = `${window.location.origin}/portfolio/${formData.username || 'username'}`;

  // Device width frame for preview
  const getDeviceFrameClass = () => {
    if (previewDevice === 'mobile') return 'max-w-[375px] mx-auto border-[10px] border-gray-800 rounded-[3rem] shadow-2xl overflow-hidden min-h-[667px]';
    if (previewDevice === 'tablet') return 'max-w-[768px] mx-auto border-[8px] border-gray-800 rounded-[2rem] shadow-2xl overflow-hidden min-h-[800px]';
    return 'w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl';
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans">
      
      {/* --- TOP NAVBAR --- */}
      <nav className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#08080c]/90 backdrop-blur-xl">
        <div className="max-w-full mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          
          {/* Brand & Left Links */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 group cursor-pointer" title="Go to Homepage">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 p-[1px]">
                <div className="w-full h-full bg-[#0a0a0f] rounded-xl flex items-center justify-center">
                  <img src="/favicon.svg" alt="Portfolio Builder" className="w-4 h-4" />
                </div>
              </div>
              <span className="font-bold text-lg tracking-tight hidden sm:block">
                Portfolio<span className="text-indigo-400"> Builder</span>
              </span>
            </Link>

            <div className="h-5 w-px bg-white/10 mx-1 hidden md:block"></div>

            {/* Preset Loaders Dropdown */}
            <div className="hidden sm:flex items-center gap-1">
              <span className="text-xs text-gray-500 font-bold uppercase tracking-wider pl-2">Load Preset:</span>
              <button onClick={() => handleLoadPreset('nejamul')} className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 text-xs font-bold transition-colors">
                Nejamul (DevSecOps)
              </button>
              <button onClick={() => handleLoadPreset('fullstack')} className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-gray-300 font-medium transition-colors">
                Fullstack
              </button>
              <button onClick={() => handleLoadPreset('ai')} className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-gray-300 font-medium transition-colors">
                AI / ML
              </button>
              <button onClick={() => handleLoadPreset('designer')} className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-gray-300 font-medium transition-colors">
                Design
              </button>
            </div>
          </div>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Live Portfolio Link / QR */}
            {formData.username && (
              <button
                onClick={() => setQrModalOpen(true)}
                className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-300 hover:text-white transition-colors"
                title="Share & QR Code"
              >
                <QrCode size={18} />
              </button>
            )}

            {/* JSON Export */}
            <button
              onClick={handleExportJSON}
              className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-300 hover:text-white transition-colors hidden sm:flex"
              title="Backup as JSON"
            >
              <Download size={18} />
            </button>

            {/* JSON Import Hidden */}
            <input ref={jsonInputRef} type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
            <button
              onClick={() => jsonInputRef.current?.click()}
              className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-300 hover:text-white transition-colors hidden sm:flex"
              title="Restore from JSON"
            >
              <UploadCloud size={18} />
            </button>

            {/* Light / Dark Mode */}
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-indigo-400 transition-colors"
              title="Toggle Theme Mode"
            >
              {isDark ? <Sun size={18}/> : <Moon size={18}/>}
            </button>

            {/* Profile Link */}
            <button 
              onClick={() => navigate('/profile')} 
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-colors hidden md:flex" 
              title="Identity Score & Analytics"
            >
              <User size={18}/>
            </button>

            {/* Logout */}
            <button 
              onClick={handleLogout} 
              className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-gray-300 hover:text-red-400 border border-white/10 transition-colors" 
              title="Logout"
            >
              <LogOut size={18}/>
            </button>

            {/* Deploy Button */}
            <button 
              onClick={handleSave} 
              disabled={loading} 
              className="ml-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold text-white text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all"
            >
              {loading ? <Loader2 size={16} className="animate-spin"/> : <Rocket size={16}/>}
              <span>{loading ? 'Deploying...' : 'Deploy'}</span>
            </button>

          </div>
        </div>

        {/* Mobile View Toggle Bar (Only visible below lg breakpoint) */}
        <div className="lg:hidden flex border-t border-white/5 bg-black/40">
          <button
            onClick={() => setActiveTab('editor')}
            className={`flex-1 py-2.5 text-xs font-bold flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'editor' ? 'text-indigo-400 border-b-2 border-indigo-500 bg-white/5' : 'text-gray-400'
            }`}
          >
            <Code size={14} /> <span>Edit Form</span>
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex-1 py-2.5 text-xs font-bold flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'preview' ? 'text-indigo-400 border-b-2 border-indigo-500 bg-white/5' : 'text-gray-400'
            }`}
          >
            <Eye size={14} /> <span>Live Preview</span>
          </button>
        </div>
      </nav>

      {/* --- MAIN SPLIT WORKSPACE --- */}
      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        
        {/* LEFT: FORM EDITOR PANEL */}
        <div className={`w-full lg:w-1/2 p-4 sm:p-8 lg:p-10 border-r border-white/10 overflow-y-auto h-[calc(100vh-4.5rem)] custom-scrollbar ${
          activeTab === 'editor' ? 'block' : 'hidden lg:block'
        }`}>
          <div className="space-y-10 pb-28">
            
            {/* Quick Template Picker */}
            <section className="space-y-3">
              <h3 className="text-xs uppercase tracking-widest text-indigo-400 font-bold flex items-center gap-2">
                <LayoutTemplate size={14}/> Template Theme
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setFormData({ ...formData, template: t.id })}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      formData.template === t.id
                        ? 'border-indigo-500 bg-indigo-500/15 ring-1 ring-indigo-500'
                        : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className={`text-xs sm:text-sm font-bold ${formData.template === t.id ? 'text-indigo-300' : 'text-white'}`}>{t.name}</div>
                    <div className="text-[10px] text-gray-400">{t.desc}</div>
                  </button>
                ))}
              </div>
            </section>

            {/* Profile Identity */}
            <section className="space-y-4">
              <h3 className="text-xs uppercase tracking-widest text-gray-400 font-bold flex items-center gap-2">
                <User size={14} /> Profile Identity
              </h3>

              {/* Avatar Upload */}
              <div className="flex items-center gap-4 mb-2">
                <div className="relative group">
                  {formData.avatar_url ? (
                    <img src={formData.avatar_url} alt="Avatar" className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-white/10" />
                  ) : (
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/5 border-2 border-dashed border-white/15 flex items-center justify-center text-gray-400">
                      <User size={24}/>
                    </div>
                  )}
                  {formData.avatar_url && (
                    <button 
                      onClick={removeAvatar} 
                      className="absolute -top-2 -right-2 w-6 h-6 bg-rose-600 rounded-full text-white flex items-center justify-center opacity-0 group-hover:opacity-100 shadow-lg transition-opacity"
                    >
                      <X size={12}/>
                    </button>
                  )}
                </div>

                <div className="space-y-1.5 flex-1">
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="avatar-file-upload" />
                  <label 
                    htmlFor="avatar-file-upload" 
                    className="cursor-pointer px-4 py-2 bg-white/10 hover:bg-white/15 border border-white/10 rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5 text-gray-200"
                  >
                    {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                    <span>{uploading ? 'Uploading...' : 'Upload Photo'}</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Or paste image URL"
                    value={formData.avatar_url}
                    onChange={e => setFormData({ ...formData, avatar_url: e.target.value })}
                    className="w-full text-xs p-2 bg-black/40 border border-white/10 rounded-xl text-gray-300 placeholder-gray-600 outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Basic Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input 
                  placeholder="Full Name" 
                  className="sm:col-span-2 p-3 rounded-xl bg-black/30 border border-white/10 text-white placeholder-gray-500 outline-none focus:border-indigo-500 text-sm" 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                />
                
                {/* Headline with AI */}
                <div className="sm:col-span-2 relative group">
                  <input 
                    placeholder="Headline (e.g. Full Stack Architect)" 
                    className="w-full p-3 pr-12 rounded-xl bg-black/30 border border-white/10 text-white placeholder-gray-500 outline-none focus:border-indigo-500 text-sm" 
                    value={formData.headline} 
                    onChange={e => setFormData({...formData, headline: e.target.value})} 
                  />
                  <button 
                    onClick={handleGenerateHeadline} 
                    disabled={aiLoading === 'headline'} 
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 rounded-lg transition-all" 
                    title="Generate Headline with AI"
                  >
                    {aiLoading === 'headline' ? <Loader2 size={14} className="animate-spin"/> : <Sparkles size={14}/>}
                  </button>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Custom Username (URL slug)</label>
                  <input 
                    placeholder="username" 
                    className="w-full p-3 rounded-xl bg-black/30 border border-white/10 text-white placeholder-gray-500 outline-none focus:border-indigo-500 text-sm font-mono" 
                    value={formData.username} 
                    onChange={e => setFormData({...formData, username: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '')})} 
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Location</label>
                  <input 
                    placeholder="City, Country" 
                    className="w-full p-3 rounded-xl bg-black/30 border border-white/10 text-white placeholder-gray-500 outline-none focus:border-indigo-500 text-sm" 
                    value={formData.location} 
                    onChange={e => setFormData({...formData, location: e.target.value})} 
                  />
                </div>
              </div>
              
              {/* Bio with AI */}
              <div className="relative">
                <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Professional Bio</label>
                <textarea 
                  placeholder="Write a short summary about your background and achievements..." 
                  className="w-full p-3 pr-12 rounded-xl bg-black/30 border border-white/10 text-white placeholder-gray-500 outline-none h-24 focus:border-indigo-500 text-sm resize-none custom-scrollbar" 
                  value={formData.bio} 
                  onChange={e => setFormData({...formData, bio: e.target.value})} 
                />
                <button 
                  onClick={handleGenerateBio} 
                  disabled={aiLoading === 'bio'} 
                  className="absolute top-8 right-2.5 p-2 bg-indigo-500/20 hover:bg-indigo-500/30 rounded-lg text-indigo-300 transition-colors" 
                  title="Generate Bio with AI"
                >
                  {aiLoading === 'bio' ? <Loader2 size={16} className="animate-spin"/> : <Sparkles size={16}/>}
                </button>
              </div>
            </section>

            {/* --- WORK EXPERIENCE SECTION (ADDED!) --- */}
            <section className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xs uppercase tracking-widest text-gray-400 font-bold flex items-center gap-2">
                  <Briefcase size={14}/> Work Experience
                </h3>
                <button 
                  onClick={() => addArrayItem('experience', { company: '', role: '', duration: '', desc: '' })} 
                  className="text-xs bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-lg hover:bg-indigo-500/20 font-bold"
                >
                  + Add Experience
                </button>
              </div>

              {(formData.experience || []).map((exp, i) => (
                <div key={i} className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3 relative">
                  <div className="flex justify-between items-center">
                    <input 
                      placeholder="Company Name" 
                      className="flex-1 p-2 rounded-lg text-sm font-bold bg-black/30 border border-white/5 outline-none text-white focus:border-indigo-500" 
                      value={exp.company} 
                      onChange={e => updateArrayItem('experience', i, 'company', e.target.value)} 
                    />
                    <button 
                      onClick={() => removeArrayItem('experience', i)} 
                      className="ml-2 p-1.5 text-rose-400 hover:text-rose-300 rounded-lg hover:bg-white/5"
                    >
                      <Trash2 size={16}/>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <input 
                      placeholder="Role (e.g. Senior Engineer)" 
                      className="p-2 rounded-lg text-xs bg-black/30 border border-white/5 outline-none text-white focus:border-indigo-500" 
                      value={exp.role} 
                      onChange={e => updateArrayItem('experience', i, 'role', e.target.value)} 
                    />
                    <input 
                      placeholder="Duration (e.g. 2022 - Present)" 
                      className="p-2 rounded-lg text-xs bg-black/30 border border-white/5 outline-none text-white focus:border-indigo-500" 
                      value={exp.duration} 
                      onChange={e => updateArrayItem('experience', i, 'duration', e.target.value)} 
                    />
                  </div>

                  <textarea 
                    placeholder="Key impact, accomplishments, and tech used..." 
                    className="w-full p-2.5 rounded-lg text-xs h-20 bg-black/30 border border-white/5 outline-none text-white focus:border-indigo-500 resize-none custom-scrollbar" 
                    value={exp.desc} 
                    onChange={e => updateArrayItem('experience', i, 'desc', e.target.value)} 
                  />
                </div>
              ))}
            </section>

            {/* --- PROJECTS SECTION WITH AI --- */}
            <section className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xs uppercase tracking-widest text-gray-400 font-bold flex items-center gap-2">
                  <Code size={14}/> Featured Projects
                </h3>
                <button 
                  onClick={() => addArrayItem('projects', { title: '', description: '', tags: [], repoLink: '', demoLink: '' })} 
                  className="text-xs bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-lg hover:bg-indigo-500/20 font-bold"
                >
                  + Add Project
                </button>
              </div>

              {(formData.projects || []).map((proj, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                  <div className="flex justify-between items-center">
                    <input 
                      placeholder="Project Title" 
                      className="flex-1 p-2 rounded-lg text-sm font-bold bg-black/30 border border-white/5 outline-none text-white focus:border-indigo-500" 
                      value={proj.title} 
                      onChange={e => updateArrayItem('projects', idx, 'title', e.target.value)} 
                    />
                    <button 
                      onClick={() => removeArrayItem('projects', idx)} 
                      className="ml-2 text-rose-400 hover:text-rose-300 p-1.5"
                    >
                      <Trash2 size={16}/>
                    </button>
                  </div>
                  
                  {/* Description with AI Enhance */}
                  <div className="relative">
                    <textarea 
                      placeholder="Project description and key innovations..." 
                      className="w-full p-2.5 pr-10 rounded-lg text-xs h-20 bg-black/30 border border-white/5 outline-none text-white focus:border-indigo-500 resize-none custom-scrollbar" 
                      value={proj.description} 
                      onChange={e => updateArrayItem('projects', idx, 'description', e.target.value)} 
                    />
                    <button 
                      onClick={() => handleEnhanceProject(idx)} 
                      disabled={aiLoading === `project-${idx}`} 
                      className="absolute right-2 top-2 p-1.5 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 rounded-md transition-all" 
                      title="Enhance Description with AI"
                    >
                      {aiLoading === `project-${idx}` ? <Loader2 size={14} className="animate-spin"/> : <Sparkles size={14}/>}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <input 
                      placeholder="GitHub Repo URL" 
                      className="p-2 rounded-lg text-xs bg-black/30 border border-white/5 outline-none text-white focus:border-indigo-500 font-mono" 
                      value={proj.repoLink || ''} 
                      onChange={e => updateArrayItem('projects', idx, 'repoLink', e.target.value)} 
                    />
                    <input 
                      placeholder="Live Demo URL" 
                      className="p-2 rounded-lg text-xs bg-black/30 border border-white/5 outline-none text-white focus:border-indigo-500 font-mono" 
                      value={proj.demoLink || ''} 
                      onChange={e => updateArrayItem('projects', idx, 'demoLink', e.target.value)} 
                    />
                  </div>

                  <input 
                    placeholder="Tags (e.g. React, TypeScript, Kafka, Docker)" 
                    className="w-full p-2 rounded-lg text-xs bg-black/30 border border-white/5 outline-none text-white focus:border-indigo-500" 
                    value={Array.isArray(proj.tags) ? proj.tags.join(', ') : (proj.tags || '')}
                    onChange={e => updateArrayItem('projects', idx, 'tags', e.target.value.split(',').map(t => t.trim()))} 
                  />
                </div>
              ))}
            </section>

            {/* --- SKILLS & TECH STACK --- */}
            <section className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xs uppercase tracking-widest text-gray-400 font-bold flex items-center gap-2">
                  <Sparkles size={14}/> Tech Stack Categories
                </h3>
                <button 
                  onClick={() => addArrayItem('skills', { category: 'Backend', skills: [] })} 
                  className="text-xs bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-lg hover:bg-indigo-500/20 font-bold"
                >
                  + Add Category
                </button>
              </div>

              {(formData.skills || []).map((stack, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                  <div className="flex justify-between items-center">
                    <input 
                      placeholder="Category (e.g. Frontend, Cloud, Languages)" 
                      className="flex-1 p-2 rounded-lg text-xs font-bold bg-black/30 border border-white/5 outline-none text-white focus:border-indigo-500" 
                      value={stack.category} 
                      onChange={e => updateArrayItem('skills', idx, 'category', e.target.value)} 
                    />
                    <button 
                      onClick={() => removeArrayItem('skills', idx)} 
                      className="ml-2 text-rose-400 p-1"
                    >
                      <Trash2 size={14}/>
                    </button>
                  </div>
                  <input 
                    placeholder="Skills comma-separated (e.g. React, Next.js, GraphQL)" 
                    className="w-full p-2 rounded-lg text-xs bg-black/30 border border-white/5 outline-none text-white focus:border-indigo-500" 
                    value={Array.isArray(stack.skills) ? stack.skills.join(', ') : (stack.skills || '')}
                    onChange={e => updateArrayItem('skills', idx, 'skills', e.target.value.split(',').map(s=>s.trim()))} 
                  />
                </div>
              ))}
            </section>

            {/* --- SOCIAL LINKS --- */}
            <section className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xs uppercase tracking-widest text-gray-400 font-bold">Social Profiles</h3>
                <button 
                  onClick={addSocialLink} 
                  className="text-xs bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-lg hover:bg-indigo-500/20 font-bold"
                >
                  + Add Social
                </button>
              </div>
              {(formData.socials || []).map((s, i) => (
                <div key={i} className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center gap-2">
                  <select 
                    className="p-2 rounded-lg text-xs bg-black/50 border border-white/10 text-white outline-none" 
                    value={s.platform} 
                    onChange={e => updateSocialLink(i, 'platform', e.target.value)}
                  >
                    {SOCIAL_PLATFORMS.map(p => <option key={p.id} value={p.id} className="bg-neutral-900">{p.name}</option>)}
                  </select>
                  <input 
                    placeholder="https://..." 
                    className="flex-1 p-2 rounded-lg text-xs bg-black/30 border border-white/5 outline-none text-white focus:border-indigo-500 font-mono" 
                    value={s.url} 
                    onChange={e => updateSocialLink(i, 'url', e.target.value)} 
                  />
                  <button onClick={() => removeSocialLink(i)} className="text-rose-400 hover:text-rose-300 p-1.5">
                    <Trash2 size={16}/>
                  </button>
                </div>
              ))}
            </section>

            {/* --- EDUCATION & ACHIEVEMENTS --- */}
            <section className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xs uppercase tracking-widest text-gray-400 font-bold">Education & Certificates</h3>
                <div className="flex gap-2">
                  <button onClick={() => addArrayItem('education', { degree: '', school: '', year: '' })} className="text-xs bg-indigo-500/10 text-indigo-400 px-2.5 py-1 rounded-lg hover:bg-indigo-500/20 font-bold">+ Education</button>
                  <button onClick={() => addArrayItem('certificates', { title: '', issuer: '', date: '' })} className="text-xs bg-indigo-500/10 text-indigo-400 px-2.5 py-1 rounded-lg hover:bg-indigo-500/20 font-bold">+ Award</button>
                </div>
              </div>

              {/* Education Items */}
              {(formData.education || []).map((edu, i) => (
                <div key={i} className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                  <div className="flex justify-between items-center">
                    <input placeholder="Degree (e.g. B.S. in Computer Science)" className="flex-1 p-2 rounded-lg text-xs font-bold bg-black/30 border border-white/5 outline-none text-white focus:border-indigo-500" value={edu.degree} onChange={e => updateArrayItem('education', i, 'degree', e.target.value)} />
                    <button onClick={() => removeArrayItem('education', i)} className="ml-2 text-rose-400 p-1"><Trash2 size={14}/></button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input placeholder="Institution / School" className="p-2 rounded-lg text-xs bg-black/30 border border-white/5 outline-none text-white" value={edu.school} onChange={e => updateArrayItem('education', i, 'school', e.target.value)} />
                    <input placeholder="Years (e.g. 2018 - 2022)" className="p-2 rounded-lg text-xs bg-black/30 border border-white/5 outline-none text-white" value={edu.year} onChange={e => updateArrayItem('education', i, 'year', e.target.value)} />
                  </div>
                </div>
              ))}

              {/* Certificate Items */}
              {(formData.certificates || []).map((cert, i) => (
                <div key={i} className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                  <div className="flex justify-between items-center">
                    <input placeholder="Certificate / Award Title" className="flex-1 p-2 rounded-lg text-xs font-bold bg-black/30 border border-white/5 outline-none text-white focus:border-indigo-500" value={cert.title} onChange={e => updateArrayItem('certificates', i, 'title', e.target.value)} />
                    <button onClick={() => removeArrayItem('certificates', i)} className="ml-2 text-rose-400 p-1"><Trash2 size={14}/></button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input placeholder="Issuer (e.g. AWS, Google)" className="p-2 rounded-lg text-xs bg-black/30 border border-white/5 outline-none text-white" value={cert.issuer} onChange={e => updateArrayItem('certificates', i, 'issuer', e.target.value)} />
                    <input placeholder="Year / Date" className="p-2 rounded-lg text-xs bg-black/30 border border-white/5 outline-none text-white" value={cert.date} onChange={e => updateArrayItem('certificates', i, 'date', e.target.value)} />
                  </div>
                </div>
              ))}
            </section>

            {/* --- CONTACT DETAILS --- */}
            <section className="space-y-4">
              <h3 className="text-xs uppercase tracking-widest text-gray-400 font-bold">Direct Contact</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input 
                  placeholder="Direct Contact Email" 
                  className="p-3 rounded-xl bg-black/30 border border-white/10 text-white placeholder-gray-500 outline-none focus:border-indigo-500 text-xs" 
                  value={formData.contact?.email || ''} 
                  onChange={e => setFormData({ ...formData, contact: { ...formData.contact, email: e.target.value } })} 
                />
                <input 
                  placeholder="Portfolio / Website URL" 
                  className="p-3 rounded-xl bg-black/30 border border-white/10 text-white placeholder-gray-500 outline-none focus:border-indigo-500 text-xs" 
                  value={formData.contact?.website || ''} 
                  onChange={e => setFormData({ ...formData, contact: { ...formData.contact, website: e.target.value } })} 
                />
              </div>
            </section>

          </div>
        </div>

        {/* RIGHT: LIVE PREVIEW PANEL */}
        <div className={`w-full lg:w-1/2 bg-[#08080c] p-4 sm:p-6 lg:p-8 overflow-y-auto h-[calc(100vh-4.5rem)] custom-scrollbar transition-all ${
          activeTab === 'preview' ? 'block' : 'hidden lg:block'
        }`}>
          
          {/* Preview Controls Sticky Header */}
          <div className="sticky top-0 z-20 flex flex-col sm:flex-row items-center justify-between gap-3 pb-4 mb-6 border-b border-white/10 bg-[#08080c]/90 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              <h3 className="text-xs uppercase tracking-widest text-indigo-400 font-bold flex items-center gap-1.5">
                <Eye size={14}/> Live Sync Preview
              </h3>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/5 text-gray-400 ml-1">
                {formData.template}
              </span>
            </div>

            {/* Device Viewport Selector */}
            <div className="flex items-center gap-1 bg-black/40 border border-white/10 rounded-xl p-1">
              <button
                onClick={() => setPreviewDevice('desktop')}
                className={`p-1.5 rounded-lg transition-colors ${previewDevice === 'desktop' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
                title="Desktop View"
              >
                <Monitor size={15} />
              </button>
              <button
                onClick={() => setPreviewDevice('tablet')}
                className={`p-1.5 rounded-lg transition-colors ${previewDevice === 'tablet' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
                title="Tablet View (768px)"
              >
                <Tablet size={15} />
              </button>
              <button
                onClick={() => setPreviewDevice('mobile')}
                className={`p-1.5 rounded-lg transition-colors ${previewDevice === 'mobile' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
                title="Mobile View (375px)"
              >
                <Smartphone size={15} />
              </button>
            </div>

            {/* Open in New Tab Button */}
            {formData.username && (
              <a
                href={livePortfolioUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-gray-300 hover:text-white flex items-center gap-1 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 transition-colors"
              >
                <span>View Full Page</span>
                <ExternalLink size={12} />
              </a>
            )}
          </div>

          {/* Device Frame */}
          <div className={`${getDeviceFrameClass()} transition-all duration-300`}>
            <PortfolioRenderer 
              data={formData} 
              isDark={isDark} 
              previewMode={true} 
            />
          </div>
        </div>

      </div>

      {/* QR Code Sharing Modal */}
      <QRCodeModal 
        isOpen={qrModalOpen} 
        onClose={() => setQrModalOpen(false)} 
        url={livePortfolioUrl}
        title={`${formData.name || 'Developer'}'s Portfolio`}
      />

    </div>
  );
}