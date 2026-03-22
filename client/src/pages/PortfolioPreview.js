import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase/config';
import { 
  Github, 
  Linkedin, 
  Twitter, 
  ExternalLink, 
  Globe, 
  Briefcase, 
  GraduationCap, 
  Instagram, 
  Youtube, 
  MessageCircle,
  Download,
  Code,
  ArrowLeft,
  ChevronRight,
  Hash,
  Mail,
  Phone,
  MapPin,
  Award
} from 'lucide-react';

const THEMES = {
  indigo: {
    bg: 'from-indigo-950 via-black to-purple-950',
    accent: 'text-indigo-400',
    border: 'border-indigo-500/30',
    glow: 'bg-indigo-500',
    button: 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20'
  },
  emerald: {
    bg: 'from-emerald-950 via-black to-teal-950',
    accent: 'text-emerald-400',
    border: 'border-emerald-500/30',
    glow: 'bg-emerald-500',
    button: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20'
  },
  rose: {
    bg: 'from-rose-950 via-black to-pink-950',
    accent: 'text-rose-400',
    border: 'border-rose-500/30',
    glow: 'bg-rose-500',
    button: 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/20'
  },
  amber: {
    bg: 'from-amber-950 via-black to-orange-950',
    accent: 'text-amber-400',
    border: 'border-amber-500/30',
    glow: 'bg-amber-500',
    button: 'bg-amber-600 hover:bg-amber-700 shadow-amber-500/20'
  },
  neon: {
    bg: 'from-fuchsia-950 via-black to-cyan-950',
    accent: 'text-fuchsia-400',
    border: 'border-fuchsia-500/30',
    glow: 'bg-fuchsia-500',
    button: 'bg-fuchsia-600 hover:bg-fuchsia-700 shadow-fuchsia-500/20'
  },
  ocean: {
    bg: 'from-cyan-950 via-black to-blue-950',
    accent: 'text-cyan-400',
    border: 'border-cyan-500/30',
    glow: 'bg-cyan-500',
    button: 'bg-cyan-600 hover:bg-cyan-700 shadow-cyan-500/20'
  },
  monolith: {
    bg: 'from-slate-950 via-black to-zinc-950',
    accent: 'text-slate-300',
    border: 'border-slate-500/30',
    glow: 'bg-slate-500',
    button: 'bg-slate-600 hover:bg-slate-700 shadow-slate-500/20'
  }
};

const SOCIAL_ICONS = {
  github: <Github size={20} />,
  linkedin: <Linkedin size={20} />,
  twitter: <Twitter size={20} />,
  instagram: <Instagram size={20} />,
  youtube: <Youtube size={20} />,
  website: <Globe size={20} />,
  discord: <MessageCircle size={20} />
};

const PRINT_STYLES = `
@media print {
  nav, footer, .no-print { display: none !important; }
  body { background: white !important; color: black !important; }
  .min-h-screen { background: white !important; min-height: 0 !important; }
  main { padding-top: 2rem !important; }
  section { page-break-inside: avoid; margin-bottom: 2rem !important; }
  h1, h2, h3, h4 { color: black !important; background: none !important; -webkit-text-fill-color: initial !important; }
  p, span, div { color: #333 !important; }
  .bg-white\\/5, .bg-white\\/10, .bg-black\\/40, .bg-white\\[0\\.03\\] { 
    background: white !important; 
    border: 1px solid #ddd !important; 
    box-shadow: none !important; 
    backdrop-filter: none !important; 
    color: black !important;
  }
  .border-white\\/10, .border-white\\/5 { border-color: #eee !important; }
  img { filter: grayscale(100%); border-radius: 1rem !important; }
  .text-6xl, .text-8xl { text-align: left !important; font-size: 3rem !important; margin-bottom: 1rem !important; }
  .italic { border: none !important; padding: 0 !important; }
  a { text-decoration: none !important; color: black !important; }
}
`;

export default function PortfolioPreview() {
  const { username } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPortfolio() {
      try {
        const { data: fetchedData, error } = await supabase
          .from('portfolios')
          .select('*')
          .eq('username', username)
          .single();

        if (error) throw error;

        if (fetchedData) {
          // Migration/Fallbacks for rendering
          const mappedData = {
            ...fetchedData,
            avatarUrl: fetchedData.avatar_url || '',
            skillStacks: fetchedData.skill_stacks || [
              { category: 'Skills', skills: fetchedData.skills || [] }
            ],
            certificates: fetchedData.certificates || [],
            contact: fetchedData.contact || { email: '', phone: '', location: '' }
          };
          setData(mappedData);

          // Increment view count via RPC
          try {
            await supabase.rpc('increment_portfolio_views', { portfolio_id: fetchedData.id });
          } catch (rpcErr) {
            console.error("Non-critical: RPC error incrementing views:", rpcErr);
          }
        }
      } catch (err) {
        console.error("Error fetching portfolio from Supabase:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPortfolio();
  }, [username]);

  if (loading) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center space-y-4">
      <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
      <p className="text-gray-500 font-medium animate-pulse">Fetching Digital Identity...</p>
    </div>
  );

  if (!data) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-4xl font-black text-white mb-4">404: Identity Not Found</h1>
      <p className="text-gray-500 max-w-md mb-8">This portfolio hash doesn't exist in our datacenters or has been deactivated.</p>
      <button onClick={() => navigate('/')} className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors">Return to Base</button>
    </div>
  );

  const theme = THEMES[data.theme] || THEMES.indigo;

  return (
    <div className={`min-h-screen bg-gradient-to-b ${theme.bg} text-white font-sans selection:bg-white/20 overflow-x-hidden`}>
      <style>{PRINT_STYLES}</style>
      
      {/* Floating Action Bar */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-2xl">
        <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-2xl px-6 py-3 flex items-center justify-between shadow-2xl">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-xl transition-colors text-gray-400 hover:text-white">
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${theme.glow.replace('bg-', 'bg-')} animate-pulse`}></div>
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Live Portfolio</span>
          </div>
          <button onClick={() => window.print()} className={`px-4 py-2 ${theme.button} text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2`}>
            <Download size={14} /> Resume
          </button>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 pt-32 pb-24 space-y-32">
        
        {/* Hero Section */}
        <section className="text-center relative">
          <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 ${theme.glow} rounded-full filter blur-[120px] opacity-20 -z-10`}></div>
          
          <div className="relative inline-block mb-10 group">
             {data.avatarUrl || data.github ? (
               <img 
                src={data.avatarUrl || `https://github.com/${data.github.split('/').pop()}.png`} 
                alt="Profile" 
                className={`w-36 h-36 rounded-[2.5rem] object-cover border-2 ${theme.border} shadow-2xl relative z-10 transition-transform duration-500 group-hover:scale-105`}
                onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=" + data.name + "&background=random"; }}
               />
             ) : (
               <div className={`w-36 h-36 rounded-[2.5rem] bg-white/5 border-2 ${theme.border} flex items-center justify-center text-gray-500`}>
                  <Code size={48} />
               </div>
             )}
             <div className={`absolute -inset-4 ${theme.glow} opacity-0 group-hover:opacity-10 blur-2xl rounded-full transition-opacity duration-500`}></div>
          </div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500">
            {data.name}
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-10 font-medium italic whitespace-pre-wrap">
            "{data.bio}"
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            {data.socials.map((social, i) => (
               <a 
                key={i} 
                href={social.url.startsWith('http') ? social.url : `https://${social.url}`} 
                target="_blank" 
                rel="noreferrer" 
                className="p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all text-gray-400 hover:text-white"
               >
                 {SOCIAL_ICONS[social.platform] || <Globe size={20} />}
               </a>
            ))}
          </div>
        </section>

        {/* Career & Tech Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Left Column: Experience & Education */}
          <div className="lg:col-span-7 space-y-24">
            
            {/* Experience */}
            {data.experience?.length > 0 && (
              <section>
                <div className="flex items-center gap-4 mb-12">
                   <div className={`p-3 rounded-2xl bg-white/5 border border-white/10 ${theme.accent}`}>
                      <Briefcase size={24} />
                   </div>
                   <h2 className="text-3xl font-black uppercase tracking-tight">Experience</h2>
                </div>
                
                <div className="space-y-12 relative pl-8 border-l border-white/5">
                   {data.experience.map((exp, i) => (
                     <div key={i} className="relative group">
                        <div className={`absolute -left-[41px] top-1 w-4 h-4 rounded-full bg-black border-2 ${theme.border} ${theme.glow.replace('bg-', 'group-hover:bg-')} transition-colors`}></div>
                        <div className="space-y-2">
                           <span className={`text-xs font-bold uppercase tracking-widest ${theme.accent}`}>{exp.duration}</span>
                           <h3 className="text-xl font-bold text-white">{exp.role}</h3>
                           <p className="text-gray-400 font-medium">{exp.company}</p>
                           <p className="text-sm text-gray-500 leading-relaxed mt-4 bg-white/5 border border-white/5 p-4 rounded-2xl italic whitespace-pre-wrap">
                             {exp.desc}
                           </p>
                        </div>
                     </div>
                   ))}
                </div>
              </section>
            )}

            {/* Academic */}
            {data.education?.length > 0 && (
              <section>
                <div className="flex items-center gap-4 mb-10">
                   <div className={`p-3 rounded-2xl bg-white/5 border border-white/10 ${theme.accent}`}>
                      <GraduationCap size={24} />
                   </div>
                   <h2 className="text-3xl font-black uppercase tracking-tight">Academic</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {data.education.map((edu, i) => (
                     <div key={i} className="p-6 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-colors group">
                        <span className="text-[10px] font-bold text-gray-500 block mb-2">{edu.year}</span>
                        <h3 className="font-bold text-lg mb-1 group-hover:text-white transition-colors">{edu.degree}</h3>
                        <p className="text-sm text-gray-400">{edu.school}</p>
                     </div>
                   ))}
                </div>
              </section>
            )}

            {/* Certificates */}
            {data.certificates?.length > 0 && (
              <section>
                <div className="flex items-center gap-4 mb-10">
                   <div className={`p-3 rounded-2xl bg-white/5 border border-white/10 ${theme.accent}`}>
                      <Award size={24} />
                   </div>
                   <h2 className="text-3xl font-black uppercase tracking-tight">Certifications</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {data.certificates.map((cert, i) => (
                     <div key={i} className="p-6 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-colors group relative">
                        <span className="text-[10px] font-bold text-gray-500 block mb-2">{cert.year}</span>
                        <h3 className="font-bold text-lg mb-1 group-hover:text-white transition-colors">{cert.title}</h3>
                        <p className="text-sm text-gray-400 mb-4">{cert.issuer}</p>
                         {cert.link && (
                          <a href={cert.link.startsWith('http') ? cert.link : `https://${cert.link}`} target="_blank" rel="noreferrer" className={`text-xs font-bold ${theme.accent} flex items-center gap-1 hover:underline`}>
                            View Credential <ExternalLink size={12} />
                          </a>
                        )}
                     </div>
                   ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column: Stacks & Mini Info */}
          <div className="lg:col-span-5 space-y-12">
             
             {/* FAANG Skill Stacks */}
             <section className="space-y-8">
               <h2 className="text-xl font-black uppercase tracking-widest flex items-center gap-2">
                  <span className={`w-8 h-[2px] ${theme.glow.replace('bg-', 'bg-')}`}></span>
                  The Stack
               </h2>
               <div className="space-y-6">
                  {data.skillStacks.filter(s => s.skills?.length > 0).map((stack, i) => (
                    <div key={i} className="p-6 bg-white/[0.03] border border-white/10 rounded-3xl">
                       <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] mb-4 ${theme.accent} opacity-80`}>
                         {stack.category}
                       </h3>
                       <div className="flex flex-wrap gap-2">
                          {stack.skills.map((skill, j) => (
                            <span key={j} className="text-xs font-bold px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-gray-300">
                              {skill}
                            </span>
                          ))}
                       </div>
                    </div>
                  ))}
               </div>
             </section>

             {/* Connection Card */}
             <section className="p-8 bg-gradient-to-br from-white/10 to-transparent border border-white/10 rounded-[2.5rem] relative overflow-hidden group">
                <div className={`absolute -bottom-10 -right-10 w-32 h-32 ${theme.glow} blur-3xl opacity-20 transition-transform group-hover:scale-150`}></div>
                <h3 className="text-xl font-black mb-4">Let's Connect</h3>
                <p className="text-sm text-gray-400 mb-8 leading-relaxed">Impressive identity decoded. Interested in collaboration or full-time opportunities?</p>
                
                <div className="space-y-4 mb-8">
                  {data.contact?.email && (
                    <a href={`mailto:${data.contact.email}`} className="flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-colors group/link">
                      <div className={`p-2 rounded-lg bg-white/5 group-hover/link:${theme.glow} transition-colors`}>
                        <Mail size={16} />
                      </div>
                      {data.contact.email}
                    </a>
                  )}
                  {data.contact?.phone && (
                    <a href={`tel:${data.contact.phone}`} className="flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-colors group/link">
                      <div className={`p-2 rounded-lg bg-white/5 group-hover/link:${theme.glow} transition-colors`}>
                        <Phone size={16} />
                      </div>
                      {data.contact.phone}
                    </a>
                  )}
                  {data.contact?.location && (
                    <div className="flex items-center gap-3 text-sm text-gray-400">
                      <div className="p-2 rounded-lg bg-white/5">
                        <MapPin size={16} />
                      </div>
                      {data.contact.location}
                    </div>
                  )}
                </div>

                <a href={data.socials.find(s => s.platform === 'linkedin')?.url || `mailto:${data.contact?.email}`} className={`w-full py-4 rounded-2xl ${theme.button} text-white font-bold flex items-center justify-center gap-2 transition-all shadow-xl`}>
                   Reach Out <ChevronRight size={18} />
                </a>
             </section>
          </div>
        </div>

        {/* Projects Section - Full Width */}
        <section className="pt-24 border-t border-white/10">
           <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
              <div>
                <h2 className="text-5xl font-black tracking-tighter mb-4 italic uppercase">Selected Works</h2>
                <p className="text-gray-500 font-medium">Engineered solutions and digital artifacts.</p>
              </div>
              <div className="h-[2px] flex-grow bg-gradient-to-r from-white/10 to-transparent mx-8 mb-6 hidden md:block"></div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {data.projects.map((proj, i) => (
                <div key={i} className="group p-8 bg-white/5 border border-white/10 rounded-[3rem] hover:bg-white/[0.08] transition-all hover:-translate-y-2 flex flex-col h-full">
                   <div className="flex items-start justify-between mb-8">
                      <div className={`p-4 rounded-2xl bg-white/5 border border-white/10 ${theme.accent}`}>
                         <Code size={24} />
                      </div>
                      <div className="flex gap-2">
                        {proj.repoLink && (
                          <a href={proj.repoLink} target="_blank" rel="noreferrer" className="p-2 bg-black/40 border border-white/5 rounded-xl text-gray-400 hover:text-white transition-colors">
                            <Github size={18} />
                          </a>
                        )}
                        {proj.demoLink && (
                          <a href={proj.demoLink} target="_blank" rel="noreferrer" className="p-2 bg-black/40 border border-white/5 rounded-xl text-gray-400 hover:text-white transition-colors">
                            <ExternalLink size={18} />
                          </a>
                        )}
                      </div>
                   </div>
                   
                   <h3 className="text-2xl font-black mb-4 group-hover:text-white transition-colors uppercase">{proj.title}</h3>
                   <p className="text-gray-400 text-sm leading-relaxed mb-8 flex-grow whitespace-pre-wrap">
                     {proj.description}
                   </p>
                   
                   <div className="flex flex-wrap gap-2 pt-6 border-t border-white/5">
                      {proj.tags?.map((tag, j) => (
                        <span key={j} className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-1">
                          <Hash size={10} className={theme.accent} /> {tag}
                        </span>
                      ))}
                   </div>
                </div>
              ))}
           </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 text-center px-6">
         <p className="text-[10px] uppercase font-bold tracking-[0.4em] text-gray-600 mb-4">
           Digital Signature [ {data.username} ]
         </p>
         <div className="w-12 h-1 bg-white/10 mx-auto rounded-full"></div>
      </footer>
    </div>
  );
}