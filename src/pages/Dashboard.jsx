import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { generateBio, generateHeadline, enhanceProjectDesc } from '../services/aiService';
import { useNavigate } from 'react-router-dom';
import { 
  Save, Eye, Plus, Trash2, User, Upload, X, Sun, Moon, 
  Link as LinkIcon, Globe, LogOut, Sparkles, Award, GraduationCap, 
  Loader2, Code, Rocket, Home, ExternalLink, LayoutTemplate
} from 'lucide-react';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';

const SOCIAL_PLATFORMS = [
  { id: 'github', name: 'GitHub', icon: <FaGithub size={16} /> },
  { id: 'linkedin', name: 'LinkedIn', icon: <FaLinkedin size={16} /> },
  { id: 'twitter', name: 'Twitter/X', icon: <FaTwitter size={16} /> },
  { id: 'website', name: 'Website', icon: <Globe size={16} /> },
];

const TEMPLATES = [
  { id: 'minimal', name: 'Minimalist', desc: 'Clean & Simple' },
  { id: 'cyberpunk', name: 'Cyberpunk', desc: 'Neon & Dark' },
  { id: 'corporate', name: 'Corporate', desc: 'Professional Blue' },
];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [aiLoading, setAiLoading] = useState(null); // null, 'bio', 'headline', or index
  const [isDark, setIsDark] = useState(true);
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: '', username: '', bio: '', avatar_url: '', headline: '', location: '',
    skills: [{ category: 'Frontend', skills: [] }],
    projects: [], experience: [], education: [], certificates: [],
    contact: { email: '', phone: '', website: '' },
    socials: [], theme: 'dark', template: 'minimal'
  });

  useEffect(() => { if (user) fetchPortfolio(); }, [user]);

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
          contact: typeof data.contact === 'string' ? JSON.parse(data.contact) : data.contact || {},
          socials: typeof data.socials === 'string' ? JSON.parse(data.socials) : data.socials || [],
          template: data.template || 'minimal'
        });
        setIsDark(data.theme !== 'light');
      }
    } catch (err) { console.error(err); }
  };

  // --- AI HANDLERS ---
  const handleGenerateBio = async () => {
    setAiLoading('bio');
    try {
      const bio = await generateBio(formData);
      setFormData(prev => ({ ...prev, bio }));
    } catch (err) { alert('AI Failed: ' + err.message); } finally { setAiLoading(null); }
  };

  const handleGenerateHeadline = async () => {
    setAiLoading('headline');
    try {
      const headline = await generateHeadline(formData);
      setFormData(prev => ({ ...prev, headline }));
    } catch (err) { alert('AI Failed: ' + err.message); } finally { setAiLoading(null); }
  };

  const handleEnhanceProject = async (index) => {
    setAiLoading(`project-${index}`);
    try {
      const newDesc = await enhanceProjectDesc(formData.projects[index]);
      const newProjects = [...formData.projects];
      newProjects[index].description = newDesc;
      setFormData(prev => ({ ...prev, projects: newProjects }));
    } catch (err) { alert('AI Failed: ' + err.message); } finally { setAiLoading(null); }
  };

  // --- STANDARD HANDLERS ---
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      if (formData.avatar_url) await supabase.storage.from('portfolios').remove([formData.avatar_url.split('/').pop()]);
      const fileName = `${user.id}/${Date.now()}-${file.name}`;
      const { error } = await supabase.storage.from('portfolios').upload(fileName, file, { upsert: true });
      if (error) throw error;
      const { data: urlData } = supabase.storage.from('portfolios').getPublicUrl(fileName);
      setFormData(prev => ({ ...prev, avatar_url: urlData.publicUrl }));
    } catch (err) { alert('Upload failed'); } finally { setUploading(false); if (fileInputRef.current) fileInputRef.current.value = ''; }
  };

  const removeAvatar = async () => {
    if (formData.avatar_url) await supabase.storage.from('portfolios').remove([formData.avatar_url.split('/').pop()]);
    setFormData(prev => ({ ...prev, avatar_url: '' }));
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
    setFormData(prev => ({ ...prev, theme: !isDark ? 'light' : 'dark' }));
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const addArrayItem = (field, template) => setFormData({ ...formData, [field]: [...formData[field], template] });
  const removeArrayItem = (field, index) => setFormData({ ...formData, [field]: formData[field].filter((_, i) => i !== index) });
  const updateArrayItem = (field, index, key, value) => {
    const n = [...formData[field]]; n[index] = { ...n[index], [key]: value };
    setFormData({ ...formData, [field]: n });
  };
  
  const addSocialLink = () => setFormData(prev => ({ ...prev, socials: [...prev.socials, { platform: 'github', url: '' }] }));
  const updateSocialLink = (index, field, value) => {
    const n = [...formData.socials]; n[index][field] = value;
    setFormData(prev => ({ ...prev, socials: n }));
  };
  const removeSocialLink = (index) => setFormData(prev => ({ ...prev, socials: prev.socials.filter((_, i) => i !== index) }));

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.from('portfolios').upsert({ id: user.id, ...formData, updated_at: new Date().toISOString() });
      if (error) throw error;
      alert('✅ Deployed Successfully!');
    } catch (e) { alert(e.message); } finally { setLoading(false); }
  };

  // Dynamic Theme Classes
  const bgClass = isDark ? 'bg-[#0a0a0a]' : 'bg-gray-50';
  const textClass = isDark ? 'text-white' : 'text-gray-900';
  const cardBg = isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-sm';
  const inputBg = isDark ? 'bg-black/20 border-white/10 text-white placeholder-gray-500' : 'bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-400';
  const previewBg = isDark ? 'bg-[#0f0f11]' : 'bg-gray-100';
  const navBg = isDark ? 'bg-[#0a0a0a]/80 border-white/10' : 'bg-white/80 border-gray-200';

  // --- TEMPLATE STYLES FOR PREVIEW ---
  let previewContainerClass = 'bg-white text-gray-900 border-gray-200';
  let previewAccentClass = 'text-indigo-600';
  let previewFontClass = 'font-sans';

  if (formData.template === 'cyberpunk') {
    previewContainerClass = 'bg-[#0f0f11] text-white border-pink-500/30 shadow-[0_0_30px_rgba(236,72,153,0.1)]';
    previewAccentClass = 'text-pink-500';
    previewFontClass = 'font-mono';
  } else if (formData.template === 'corporate') {
    previewContainerClass = 'bg-blue-50 text-slate-800 border-blue-200';
    previewAccentClass = 'text-blue-700';
    previewFontClass = 'font-serif';
  }

  return (
    <div className={`min-h-screen ${bgClass} ${textClass} flex flex-col font-sans`}>
      
      {/* FROZEN TOP NAVBAR */}
      <nav className={`sticky top-0 z-50 w-full border-b backdrop-blur-md ${navBg}`}>
        <div className="max-w-full mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <button onClick={() => navigate('/')} className="flex items-center gap-2 group" title="Go to Landing Page">
                <div className="flex items-center gap-2 cursor-pointer">
  <img src="/logo.png" alt="Portfolio.ai Logo" className="w-8 h-8 object-contain" />
  <span className="font-bold text-xl tracking-tight hidden sm:block">
    Portfolio<span className="text-indigo-400">.ai</span>
  </span>
</div>
             </button>
             <div className="h-6 w-px bg-gray-700 mx-2 hidden sm:block"></div>
             <button onClick={() => navigate('/')} className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5">
                <Home size={16} /><span className="hidden md:inline">Home</span>
             </button>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={toggleTheme} className={`p-2 rounded-lg ${cardBg} hover:text-indigo-400 transition-colors`} title="Toggle Theme">
               {isDark ? <Sun size={18}/> : <Moon size={18}/>}
            </button>
            <button onClick={() => navigate('/profile')} className={`p-2 rounded-lg ${cardBg} hover:text-indigo-400 transition-colors hidden sm:flex`} title="Profile Stats">
               <User size={18}/>
            </button>
            <button onClick={handleLogout} className={`p-2 rounded-lg ${cardBg} hover:text-red-400 transition-colors`} title="Logout">
               <LogOut size={18}/>
            </button>
            <button onClick={handleSave} disabled={loading} className="ml-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-bold text-white text-sm flex items-center gap-2 shadow-lg shadow-indigo-500/20 transition-all">
              {loading ? <Loader2 size={16} className="animate-spin"/> : <Rocket size={16}/>}
              <span className="hidden sm:inline">{loading ? 'Deploying...' : 'Deploy'}</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        
        {/* LEFT: EDITOR PANEL */}
        <div className="w-full lg:w-1/2 p-6 lg:p-10 border-r border-white/10 overflow-y-auto h-[calc(100vh-4rem)] custom-scrollbar">
          <div className="space-y-8 pb-20">
            
            {/* TEMPLATE SELECTOR */}
            <section className="space-y-4">
              <h3 className="text-xs uppercase tracking-widest text-gray-500 font-bold flex items-center gap-2"><LayoutTemplate size={14}/> Template Style</h3>
              <div className="grid grid-cols-3 gap-3">
                {TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setFormData({ ...formData, template: t.id })}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      formData.template === t.id
                        ? 'border-indigo-500 bg-indigo-500/10 ring-1 ring-indigo-500/50'
                        : `${cardBg} hover:border-gray-400`
                    }`}
                  >
                    <div className={`text-sm font-bold mb-1 ${formData.template === t.id ? 'text-indigo-400' : ''}`}>{t.name}</div>
                    <div className="text-[10px] opacity-60">{t.desc}</div>
                  </button>
                ))}
              </div>
            </section>

            {/* Profile Identity */}
            <section className="space-y-4">
              <h3 className="text-xs uppercase tracking-widest text-gray-500 font-bold">Profile Identity</h3>
              <div className="flex items-center gap-6 mb-4">
                <div className="relative group">
                  {formData.avatar_url ? <img src={formData.avatar_url} className="w-20 h-20 rounded-2xl object-cover border-2 border-white/10" /> : <div className={`w-20 h-20 rounded-2xl ${isDark ? 'bg-white/5' : 'bg-gray-200'} border-2 border-dashed flex items-center justify-center`}><User size={24}/></div>}
                  {formData.avatar_url && <button onClick={removeAvatar} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 shadow-lg"><X size={14}/></button>}
                </div>
                <div>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="avatar-upload" />
                  <label htmlFor="avatar-upload" className={`cursor-pointer px-4 py-2.5 ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-white hover:bg-gray-50'} border border-white/10 rounded-xl text-sm font-medium transition-colors inline-block`}>Upload Photo</label>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <input placeholder="Full Name" className={`col-span-2 p-3 rounded-xl border outline-none focus:border-indigo-500 ${inputBg}`} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                 
                 {/* Headline with AI */}
                 <div className="col-span-2 relative group">
                    <input placeholder="Headline" className={`w-full p-3 rounded-xl border outline-none focus:border-indigo-500 pr-12 ${inputBg}`} value={formData.headline} onChange={e => setFormData({...formData, headline: e.target.value})} />
                    <button onClick={handleGenerateHeadline} disabled={aiLoading === 'headline'} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded-lg transition-all opacity-0 group-hover:opacity-100" title="Generate with AI">
                       {aiLoading === 'headline' ? <Loader2 size={14} className="animate-spin"/> : <Sparkles size={14}/>}
                    </button>
                 </div>

                 <input placeholder="Username" className={`p-3 rounded-xl border outline-none focus:border-indigo-500 ${inputBg}`} value={formData.username} onChange={e => setFormData({...formData, username: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '')})} />
                 <input placeholder="Location" className={`p-3 rounded-xl border outline-none focus:border-indigo-500 ${inputBg}`} value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
              </div>
              
              {/* Bio with AI */}
              <div className="relative">
                <textarea placeholder="Bio" className={`w-full p-3 rounded-xl border outline-none h-24 focus:border-indigo-500 pr-12 ${inputBg}`} value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} />
                <button onClick={handleGenerateBio} disabled={aiLoading === 'bio'} className="absolute top-2 right-2 p-2 bg-indigo-500/20 hover:bg-indigo-500/30 rounded-lg text-indigo-400 transition-colors" title="Generate with AI">
                   {aiLoading === 'bio' ? <Loader2 size={16} className="animate-spin"/> : <Sparkles size={16}/>}
                </button>
              </div>
            </section>

            {/* Social Links */}
            <section className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xs uppercase tracking-widest text-gray-500 font-bold">Social Links</h3>
                <button onClick={addSocialLink} className="text-xs bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-lg hover:bg-indigo-500/20 font-bold">+ Add</button>
              </div>
              {formData.socials.map((s, i) => (
                <div key={i} className={`p-3 rounded-xl border flex gap-2 ${cardBg}`}>
                  <select className={`flex-1 p-2 rounded-lg text-sm bg-transparent outline-none ${isDark ? 'text-white' : 'text-gray-900'}`} value={s.platform} onChange={e => updateSocialLink(i, 'platform', e.target.value)}>
                    {SOCIAL_PLATFORMS.map(p => <option key={p.id} value={p.id} className="bg-black">{p.name}</option>)}
                  </select>
                  <input placeholder="URL" className={`flex-1 p-2 rounded-lg text-sm bg-transparent outline-none ${isDark ? 'text-white' : 'text-gray-900'}`} value={s.url} onChange={e => updateSocialLink(i, 'url', e.target.value)} />
                  <button onClick={() => removeSocialLink(i)} className="text-red-400 hover:text-red-300"><Trash2 size={16}/></button>
                </div>
              ))}
            </section>

            {/* Education */}
            <section className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xs uppercase tracking-widest text-gray-500 font-bold">Education</h3>
                <button onClick={() => addArrayItem('education', { degree: '', school: '', year: '' })} className="text-xs bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-lg hover:bg-indigo-500/20 font-bold">+ Add</button>
              </div>
              {formData.education.map((edu, i) => (
                <div key={i} className={`p-4 rounded-xl border space-y-3 ${cardBg}`}>
                  <input placeholder="Degree" className={`w-full p-2 rounded-lg text-sm font-bold bg-transparent outline-none ${isDark ? 'text-white' : 'text-gray-900'}`} value={edu.degree} onChange={e => updateArrayItem('education', i, 'degree', e.target.value)} />
                  <div className="grid grid-cols-2 gap-2">
                    <input placeholder="School" className={`p-2 rounded-lg text-sm bg-transparent outline-none ${isDark ? 'text-white' : 'text-gray-900'}`} value={edu.school} onChange={e => updateArrayItem('education', i, 'school', e.target.value)} />
                    <input placeholder="Year" className={`p-2 rounded-lg text-sm bg-transparent outline-none ${isDark ? 'text-white' : 'text-gray-900'}`} value={edu.year} onChange={e => updateArrayItem('education', i, 'year', e.target.value)} />
                  </div>
                  <button onClick={() => removeArrayItem('education', i)} className="text-xs text-red-400 hover:text-red-300">Remove</button>
                </div>
              ))}
            </section>

            {/* Achievements */}
            <section className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xs uppercase tracking-widest text-gray-500 font-bold">Achievements</h3>
                <button onClick={() => addArrayItem('certificates', { title: '', issuer: '', date: '' })} className="text-xs bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-lg hover:bg-indigo-500/20 font-bold">+ Add</button>
              </div>
              {formData.certificates.map((cert, i) => (
                <div key={i} className={`p-4 rounded-xl border space-y-3 ${cardBg}`}>
                  <input placeholder="Title" className={`w-full p-2 rounded-lg text-sm font-bold bg-transparent outline-none ${isDark ? 'text-white' : 'text-gray-900'}`} value={cert.title} onChange={e => updateArrayItem('certificates', i, 'title', e.target.value)} />
                  <div className="grid grid-cols-2 gap-2">
                    <input placeholder="Issuer" className={`p-2 rounded-lg text-sm bg-transparent outline-none ${isDark ? 'text-white' : 'text-gray-900'}`} value={cert.issuer} onChange={e => updateArrayItem('certificates', i, 'issuer', e.target.value)} />
                    <input placeholder="Date" className={`p-2 rounded-lg text-sm bg-transparent outline-none ${isDark ? 'text-white' : 'text-gray-900'}`} value={cert.date} onChange={e => updateArrayItem('certificates', i, 'date', e.target.value)} />
                  </div>
                  <button onClick={() => removeArrayItem('certificates', i)} className="text-xs text-red-400 hover:text-red-300">Remove</button>
                </div>
              ))}
            </section>

            {/* Skills */}
            <section className="space-y-4">
               <div className="flex justify-between items-center">
                <h3 className="text-xs uppercase tracking-widest text-gray-500 font-bold">Tech Stack</h3>
                <button onClick={() => addArrayItem('skills', { category: 'New Category', skills: [] })} className="text-xs bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-lg hover:bg-indigo-500/20 font-bold">+ Add</button>
              </div>
              {formData.skills.map((stack, idx) => (
                <div key={idx} className={`p-3 rounded-xl border space-y-2 ${cardBg}`}>
                  <input placeholder="Category" className={`w-full p-2 rounded-lg text-sm font-bold bg-transparent outline-none ${isDark ? 'text-white' : 'text-gray-900'}`} value={stack.category} onChange={e => updateArrayItem('skills', idx, 'category', e.target.value)} />
                  <input placeholder="Skills (comma separated)" className={`w-full p-2 rounded-lg text-sm bg-transparent outline-none ${isDark ? 'text-white' : 'text-gray-900'}`} onBlur={e => updateArrayItem('skills', idx, 'skills', e.target.value.split(',').map(s=>s.trim()))} defaultValue={stack.skills?.join(', ')} />
                </div>
              ))}
            </section>

            {/* PROJECTS SECTION WITH AI */}
            <section className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xs uppercase tracking-widest text-gray-500 font-bold flex items-center gap-2"><Code size={14}/> Projects</h3>
                <button onClick={() => addArrayItem('projects', { title: '', description: '', tags: [], repoLink: '', demoLink: '' })} className="text-xs bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-lg hover:bg-indigo-500/20 font-bold">+ Add Project</button>
              </div>
              {formData.projects.map((proj, idx) => (
                <div key={idx} className={`p-4 rounded-xl border space-y-3 ${cardBg}`}>
                  <div className="flex justify-between items-center">
                     <input placeholder="Project Title" className={`flex-1 p-2 rounded-lg text-sm font-bold bg-transparent outline-none ${isDark ? 'text-white' : 'text-gray-900'}`} value={proj.title} onChange={e => updateArrayItem('projects', idx, 'title', e.target.value)} />
                     <button onClick={() => removeArrayItem('projects', idx)} className="ml-2 text-red-400 hover:text-red-300"><Trash2 size={16}/></button>
                  </div>
                  
                  {/* Description with AI Enhance Button */}
                  <div className="relative">
                    <textarea placeholder="Description (or click sparkle to generate)" className={`w-full p-2 rounded-lg text-sm h-20 bg-transparent outline-none resize-none pr-10 ${isDark ? 'text-white' : 'text-gray-900'}`} value={proj.description} onChange={e => updateArrayItem('projects', idx, 'description', e.target.value)} />
                    <button onClick={() => handleEnhanceProject(idx)} disabled={aiLoading === `project-${idx}`} className="absolute right-2 top-2 p-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded-md transition-all" title="Enhance with AI">
                      {aiLoading === `project-${idx}` ? <Loader2 size={14} className="animate-spin"/> : <Sparkles size={14}/>}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <input placeholder="Repo Link" className={`p-2 rounded-lg text-xs bg-transparent outline-none ${isDark ? 'text-white' : 'text-gray-900'}`} value={proj.repoLink} onChange={e => updateArrayItem('projects', idx, 'repoLink', e.target.value)} />
                    <input placeholder="Demo Link" className={`p-2 rounded-lg text-xs bg-transparent outline-none ${isDark ? 'text-white' : 'text-gray-900'}`} value={proj.demoLink} onChange={e => updateArrayItem('projects', idx, 'demoLink', e.target.value)} />
                  </div>
                  <input 
                    placeholder="Tags (comma separated)" 
                    className={`w-full p-2 rounded-lg text-xs bg-transparent outline-none ${isDark ? 'text-white' : 'text-gray-900'}`} 
                    onBlur={e => updateArrayItem('projects', idx, 'tags', e.target.value.split(',').map(t => t.trim()))} 
                    defaultValue={proj.tags?.join(', ')} 
                  />
                </div>
              ))}
            </section>

          </div>
        </div>

        {/* RIGHT: LIVE PREVIEW (TEMPLATE AWARE) */}
        <div className={`w-full lg:w-1/2 ${previewBg} p-6 lg:p-10 overflow-y-auto h-[calc(100vh-4rem)] relative transition-colors duration-300`}>
          <div className="sticky top-0 z-10 flex justify-between items-center mb-6 pb-4 border-b border-white/5 backdrop-blur-md">
            <h3 className="text-xs uppercase tracking-widest text-indigo-400 font-bold flex items-center gap-2"><Eye size={14}/> Live Preview</h3>
            <span className="text-[10px] opacity-50 font-mono uppercase">{formData.template} Mode</span>
          </div>
          
          <div className={`${previewContainerClass} ${previewFontClass} border rounded-3xl p-8 shadow-2xl min-h-[800px] transition-all duration-500`}>
            
            {/* Hero Preview */}
            <div className="text-center mb-12">
              {formData.avatar_url ? (
                <img src={formData.avatar_url} alt="Preview" className="w-24 h-24 mx-auto rounded-full object-cover border-2 border-current opacity-80 mb-6 shadow-xl" />
              ) : (
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 mb-6 flex items-center justify-center text-3xl font-bold text-white shadow-xl">
                  {formData.name ? formData.name[0] : '?'}
                </div>
              )}
              <h1 className={`text-3xl font-black mb-3 tracking-tight ${formData.template === 'cyberpunk' ? 'uppercase tracking-widest' : ''}`}>{formData.name || 'Your Name'}</h1>
              <p className={`${previewAccentClass} font-medium mb-4`}>{formData.headline || 'Professional Headline'}</p>
              <p className={`opacity-80 italic max-w-md mx-auto leading-relaxed`}>{formData.bio || 'Your professional bio will appear here...'}</p>
              
              {formData.socials?.length > 0 && (
                <div className="flex justify-center gap-3 mt-8">
                  {formData.socials.map((s, i) => (
                    <div key={i} className={`p-2.5 rounded-xl bg-current opacity-10 hover:opacity-20 transition-opacity cursor-pointer`}>
                      {SOCIAL_PLATFORMS.find(p => p.id === s.platform)?.icon}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Skills Preview */}
            {formData.skills?.some(s => s.skills?.length > 0) && (
              <div className="mb-12">
                <h4 className={`text-xs uppercase tracking-widest mb-4 font-bold opacity-50`}>Tech Stack</h4>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.flatMap(s => s.skills || []).slice(0, 12).map((skill, i) => (
                    <span key={i} className={`px-3 py-1.5 rounded-lg text-xs font-medium border border-current opacity-20`}>{skill}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Education Preview */}
            {formData.education?.length > 0 && (
              <div className="mb-12">
                <h4 className={`text-xs uppercase tracking-widest mb-4 font-bold opacity-50 flex items-center gap-2`}>
                  <GraduationCap size={14}/> Education
                </h4>
                <div className="space-y-4">
                  {formData.education.map((edu, i) => (
                    <div key={i} className={`p-4 rounded-xl border-l-2 ${previewAccentClass.replace('text-', 'border-')} bg-current opacity-5`}>
                      <div className={`font-bold text-sm opacity-90`}>{edu.degree || 'Degree'}</div>
                      <div className={`text-xs opacity-60 mt-1`}>{edu.school || 'School'} • {edu.year || 'Year'}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Achievements Preview */}
            {formData.certificates?.length > 0 && (
              <div className="mb-12">
                <h4 className={`text-xs uppercase tracking-widest mb-4 font-bold opacity-50 flex items-center gap-2`}>
                  <Award size={14}/> Achievements
                </h4>
                <div className="flex flex-wrap gap-2">
                  {formData.certificates.map((cert, i) => (
                    <div key={i} className={`px-3 py-2 rounded-lg text-xs flex items-center gap-2 border border-current opacity-20`}>
                      <Award size={12} className={previewAccentClass}/>
                      <span className="opacity-80">{cert.title || 'Certificate'}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects Preview */}
            {formData.projects?.length > 0 && (
              <div className="space-y-6">
                 <h4 className={`text-xs uppercase tracking-widest mb-4 font-bold opacity-50 flex items-center gap-2`}>
                   <Code size={14}/> Featured Work
                 </h4>
                 <div className="grid grid-cols-1 gap-4">
                   {formData.projects.map((p, i) => (
                     <div key={i} className={`p-5 rounded-2xl border border-current opacity-10 hover:opacity-20 transition-opacity group`}>
                        <div className="flex justify-between items-start mb-2">
                           <div className={`font-bold text-base opacity-90`}>{p.title || 'Untitled Project'}</div>
                           <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              {p.repoLink && <ExternalLink size={14} className="text-gray-400 hover:text-white" />}
                              {p.demoLink && <Globe size={14} className="text-gray-400 hover:text-white" />}
                           </div>
                        </div>
                        <div className={`text-xs line-clamp-2 mb-3 opacity-70`}>{p.description || 'Project description...'}</div>
                        {p.tags?.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {p.tags.map((tag, j) => (
                              <span key={j} className={`text-[10px] px-2 py-0.5 rounded bg-current opacity-20 font-medium`}>#{tag}</span>
                            ))}
                          </div>
                        )}
                     </div>
                   ))}
                 </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}