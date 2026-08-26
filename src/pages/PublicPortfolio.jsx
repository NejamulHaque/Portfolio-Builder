import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../lib/supabaseClient';
import { motion } from 'framer-motion';
import { 
  Globe, Mail, MapPin, ExternalLink, Download, ArrowLeft, 
  Code, Briefcase, GraduationCap, Sun, Moon, Copy, Check, Eye as EyeIcon, Award, Home
} from 'lucide-react';
import html2pdf from 'html2pdf.js';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa'; 

const SOCIAL_ICONS = { github: <FaGithub size={20} />, linkedin: <FaLinkedin size={20} />, twitter: <FaTwitter size={20} />, website: <Globe size={20} /> };

export default function PublicPortfolio() {
  const { username } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchPortfolio() {
      try {
        const { data: userData, error } = await supabase.from('portfolios').select('*').eq('username', username).single();
        if (error) throw error;
        
        const parsedData = {
          ...userData,
          skills: typeof userData.skills === 'string' ? JSON.parse(userData.skills) : userData.skills || [],
          projects: typeof userData.projects === 'string' ? JSON.parse(userData.projects) : userData.projects || [],
          experience: typeof userData.experience === 'string' ? JSON.parse(userData.experience) : userData.experience || [],
          education: typeof userData.education === 'string' ? JSON.parse(userData.education) : userData.education || [],
          certificates: typeof userData.certificates === 'string' ? JSON.parse(userData.certificates) : userData.certificates || [],
          contact: typeof userData.contact === 'string' ? JSON.parse(userData.contact) : userData.contact || {},
          socials: typeof userData.socials === 'string' ? JSON.parse(userData.socials) : userData.socials || []
        };
        
        setData(parsedData);
        // Initialize theme from DB
        setIsDark(parsedData.theme !== 'light');
        
        if (userData) supabase.rpc('increment_views', { portfolio_id: userData.id }).catch(() => {});
      } catch (err) { console.error(err); } finally { setLoading(false); }
    }
    if (username) fetchPortfolio();
  }, [username]);

  const handleDownloadPDF = () => {
    const element = document.getElementById('portfolio-content');
    if (!element) {
      alert("Could not find content to print.");
      return;
    }
    
    const opt = {
      margin: 0.5,
      filename: `${data?.name || 'portfolio'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    // Visual feedback
    const btn = document.getElementById('pdf-btn');
    const originalText = btn.innerHTML;
    btn.innerHTML = 'Generating...';
    
    html2pdf().set(opt).from(element).save().then(() => {
      btn.innerHTML = originalText;
    }).catch(err => {
      console.error(err);
      alert("Failed to generate PDF.");
      btn.innerHTML = originalText;
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // FIX: Go to Home instead of navigate(-1) which fails on new tabs
  const goBack = () => {
    navigate('/');
  };

  if (loading) return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center"><div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div></div>;
  if (!data) return <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center"><h1 className="text-4xl font-bold">Not Found</h1><button onClick={() => navigate('/')} className="mt-4 px-6 py-2 bg-indigo-600 rounded">Home</button></div>;

  // --- DYNAMIC TEMPLATE STYLES ---
  let containerClass = 'bg-[#0a0a0a] text-white';
  let cardClass = 'bg-white/5 border-white/10';
  let accentClass = 'text-indigo-400';
  let fontClass = 'font-sans';

  if (data.template === 'cyberpunk') {
    containerClass = isDark ? 'bg-[#050505] text-white' : 'bg-gray-900 text-white'; // Cyberpunk is always dark-ish
    cardClass = 'bg-white/5 border-pink-500/20';
    accentClass = 'text-pink-500';
    fontClass = 'font-mono';
  } else if (data.template === 'corporate') {
    containerClass = isDark ? 'bg-slate-900 text-white' : 'bg-blue-50 text-slate-800';
    cardClass = isDark ? 'bg-white/5 border-white/10' : 'bg-white border-blue-100 shadow-sm';
    accentClass = 'text-blue-600';
    fontClass = 'font-serif';
  } else {
    // Minimal
    containerClass = isDark ? 'bg-[#0a0a0a] text-white' : 'bg-white text-gray-900';
    cardClass = isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200';
    accentClass = 'text-indigo-600';
  }

  const textMuted = isDark ? 'text-gray-400' : 'text-gray-600';
  const navBg = isDark ? 'bg-black/60 border-white/10' : 'bg-white/80 border-gray-200 shadow-lg';

  return (
    <div className={`min-h-screen ${containerClass} ${fontClass} transition-colors duration-300`}>
<Helmet>
  <title>Portfolio.ai - Build Your Developer Legacy</title>
  <meta name="description" content="The most advanced AI-powered portfolio builder for developers. Create stunning portfolios in minutes." />
  <link rel="canonical" href="https://portfolio.builder.vercel.app/" />
</Helmet>

      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-2xl print:hidden">
        <div className={`${navBg} backdrop-blur-xl border rounded-2xl px-4 py-3 flex items-center justify-between shadow-2xl`}>
          <button onClick={goBack} className={`p-2 rounded-xl ${textMuted} hover:bg-indigo-500/10 hover:text-indigo-500 transition-colors`} title="Go Home">
            <Home size={20} />
          </button>
          
          <div className="flex items-center gap-2">
             <span className={`text-xs font-bold uppercase tracking-widest ${textMuted} flex items-center gap-1`}><EyeIcon size={12}/> {data.views || 0}</span>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => setIsDark(!isDark)} className={`p-2 rounded-xl ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'} transition-all`}>
              {isDark ? <Sun size={18}/> : <Moon size={18}/>}
            </button>
            <button onClick={copyToClipboard} className={`p-2 rounded-xl ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'} transition-all relative group`}>
              {copied ? <Check size={18} className="text-green-500"/> : <Copy size={18}/>}
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {copied ? 'Copied!' : 'Copy Link'}
              </span>
            </button>
            <button id="pdf-btn" onClick={handleDownloadPDF} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2">
              <Download size={14}/> Resume
            </button>
          </div>
        </div>
      </nav>

      <main id="portfolio-content" className="max-w-5xl mx-auto px-6 pt-32 pb-24 space-y-32">
        <section className="text-center relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative inline-block mb-10 group">
            <div className={`absolute inset-0 bg-indigo-500 blur-3xl opacity-20 group-hover:opacity-30 transition-opacity rounded-full`}></div>
            <img 
              src={data.avatar_url || `https://ui-avatars.com/api/?name=${data.name}&background=6366f1&color=fff`} 
              alt={data.name}
              className={`w-36 h-36 rounded-[2.5rem] object-cover border-2 ${isDark ? 'border-white/10' : 'border-gray-200'} shadow-2xl relative z-10`}
            />
          </motion.div>
          
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className={`text-6xl md:text-8xl font-black tracking-tighter mb-6 ${data.template === 'cyberpunk' ? 'uppercase tracking-widest' : ''}`}>
            {data.name}
          </motion.h1>
          
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className={`text-xl md:text-2xl ${textMuted} max-w-2xl mx-auto leading-relaxed mb-10 italic`}>
            "{data.bio}"
          </motion.p>

          <div className="flex justify-center gap-4">
            {data.socials?.map((social, i) => (
              <a key={i} href={social.url} target="_blank" rel="noreferrer" 
                className={`p-3 ${cardClass} border rounded-2xl hover:bg-indigo-500/10 hover:border-indigo-500/50 transition-all ${textMuted} hover:text-indigo-500`}>
                {SOCIAL_ICONS[social.platform] || <Globe size={20} />}
              </a>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-7 space-y-24">
             {data.experience?.length > 0 && (
                <motion.section initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                  <div className="flex items-center gap-4 mb-12">
                    <div className={`p-3 rounded-2xl ${cardClass} border ${accentClass}`}><Briefcase size={24} /></div>
                    <h2 className="text-3xl font-black uppercase tracking-tight">Experience</h2>
                  </div>
                  <div className={`space-y-12 relative pl-8 border-l ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                    {data.experience.map((exp, i) => (
                      <div key={i} className="relative group">
                        <div className={`absolute -left-[41px] top-1 w-4 h-4 rounded-full ${isDark ? 'bg-[#0a0a0a]' : 'bg-white'} border-2 border-indigo-500 group-hover:bg-indigo-500 transition-colors`}></div>
                        <span className={`text-xs font-bold uppercase tracking-widest ${accentClass}`}>{exp.duration}</span>
                        <h3 className="text-xl font-bold mt-1">{exp.role}</h3>
                        <p className={`${textMuted} font-medium`}>{exp.company}</p>
                        <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-600'} leading-relaxed mt-4 ${cardClass} border p-4 rounded-2xl`}>{exp.desc}</p>
                      </div>
                    ))}
                  </div>
                </motion.section>
             )}

             {data.education?.length > 0 && (
                <motion.section initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                  <div className="flex items-center gap-4 mb-10">
                    <div className={`p-3 rounded-2xl ${cardClass} border ${accentClass}`}><GraduationCap size={24} /></div>
                    <h2 className="text-3xl font-black uppercase tracking-tight">Education</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {data.education.map((edu, i) => (
                      <div key={i} className={`p-6 ${cardClass} border rounded-3xl hover:bg-indigo-500/5 transition-colors`}>
                        <span className={`text-[10px] font-bold ${textMuted} block mb-2`}>{edu.year}</span>
                        <h3 className="font-bold text-lg mb-1">{edu.degree}</h3>
                        <p className={`text-sm ${textMuted}`}>{edu.school}</p>
                      </div>
                    ))}
                  </div>
                </motion.section>
             )}

             {data.certificates?.length > 0 && (
                <motion.section initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                  <div className="flex items-center gap-4 mb-10">
                    <div className={`p-3 rounded-2xl ${cardClass} border ${accentClass}`}><Award size={24} /></div>
                    <h2 className="text-3xl font-black uppercase tracking-tight">Achievements</h2>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    {data.certificates.map((cert, i) => (
                      <div key={i} className={`px-6 py-4 ${cardClass} border rounded-xl flex items-center gap-3`}>
                        <div className={`p-2 bg-indigo-500/10 rounded-lg ${accentClass}`}><Award size={20}/></div>
                        <div>
                          <div className="font-bold text-sm">{cert.title}</div>
                          <div className={`text-xs ${textMuted}`}>{cert.issuer} • {cert.date}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.section>
             )}
          </div>

          <div className="lg:col-span-5 space-y-12">
             <motion.section initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <h2 className={`text-xl font-black uppercase tracking-widest flex items-center gap-2 mb-8 ${accentClass}`}>
                  <span className={`w-8 h-[2px] ${accentClass.replace('text-', 'bg-')}`}></span> Tech Stack
                </h2>
                <div className="space-y-6">
                  {data.skills?.map((stack, i) => (
                    <div key={i} className={`p-6 ${cardClass} border rounded-3xl`}>
                      <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] mb-4 ${accentClass} opacity-80`}>{stack.category}</h3>
                      <div className="flex flex-wrap gap-2">
                        {stack.skills?.map((skill, j) => (
                          <span key={j} className={`text-xs font-bold px-3 py-1.5 rounded-lg ${isDark ? 'bg-black/40 border-white/10 text-gray-300' : 'bg-gray-100 border-gray-200 text-gray-700'} border`}>{skill}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
             </motion.section>

             <motion.section initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className={`p-8 ${isDark ? 'bg-gradient-to-br from-white/10 to-transparent' : 'bg-gradient-to-br from-gray-100 to-white'} border ${isDark ? 'border-white/10' : 'border-gray-200'} rounded-[2.5rem] relative overflow-hidden`}>
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-indigo-500 blur-3xl opacity-20"></div>
                <h3 className="text-xl font-black mb-4">Let's Connect</h3>
                <div className="space-y-4 mb-8">
                  {data.contact?.email && (
                    <a href={`mailto:${data.contact.email}`} className={`flex items-center gap-3 text-sm ${textMuted} hover:text-indigo-500 transition-colors`}>
                      <div className={`p-2 rounded-lg ${isDark ? 'bg-white/5' : 'bg-gray-200'}`}><Mail size={16} /></div> {data.contact.email}
                    </a>
                  )}
                  {data.contact?.location && (
                    <div className={`flex items-center gap-3 text-sm ${textMuted}`}>
                      <div className={`p-2 rounded-lg ${isDark ? 'bg-white/5' : 'bg-gray-200'}`}><MapPin size={16} /></div> {data.contact.location}
                    </div>
                  )}
                </div>
                <a href={`mailto:${data.contact?.email}`} className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center justify-center gap-2 transition-all shadow-xl">
                  Reach Out <ExternalLink size={18} />
                </a>
             </motion.section>
          </div>
        </div>

        {data.projects?.length > 0 && (
          <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={`pt-24 border-t ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
            <h2 className="text-5xl font-black tracking-tighter mb-16 italic uppercase">Selected Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {data.projects.map((proj, i) => (
                <div key={i} className={`group p-8 ${cardClass} border rounded-[3rem] hover:bg-indigo-500/5 transition-all hover:-translate-y-2 flex flex-col h-full`}>
                  <div className="flex items-start justify-between mb-8">
                    <div className={`p-4 rounded-2xl ${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-100 border-gray-200'} border ${accentClass}`}><Code size={24} /></div>
                    <div className="flex gap-2">
                      {proj.repoLink && <a href={proj.repoLink} target="_blank" rel="noreferrer" className={`p-2 ${isDark ? 'bg-black/40 border-white/5' : 'bg-gray-100 border-gray-200'} border rounded-xl ${textMuted} hover:text-indigo-500`}><FaGithub size={18} /></a>}
                      {proj.demoLink && <a href={proj.demoLink} target="_blank" rel="noreferrer" className={`p-2 ${isDark ? 'bg-black/40 border-white/5' : 'bg-gray-100 border-gray-200'} border rounded-xl ${textMuted} hover:text-indigo-500`}><ExternalLink size={18} /></a>}
                    </div>
                  </div>
                  <h3 className="text-2xl font-black mb-4 group-hover:text-indigo-500 transition-colors uppercase">{proj.title}</h3>
                  <p className={`${textMuted} text-sm leading-relaxed mb-8 flex-grow`}>{proj.description}</p>
                  <div className={`flex flex-wrap gap-2 pt-6 border-t ${isDark ? 'border-white/5' : 'border-gray-200'}`}>
                    {proj.tags?.map((tag, j) => (
                      <span key={j} className={`text-[10px] font-black uppercase tracking-widest ${accentClass} opacity-70`}>#{tag}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}
      </main>
      
      <footer className={`py-12 border-t ${isDark ? 'border-white/5' : 'border-gray-200'} text-center px-6 print:hidden`}>
        <p className={`text-[10px] uppercase font-bold tracking-[0.4em] ${textMuted} mb-4`}>Built with Portfolio Builder</p>
      </footer>
    </div>
  );
}