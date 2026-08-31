import React, { useState } from 'react';
import { 
  Globe, Mail, MapPin, ExternalLink, Code, Briefcase, 
  GraduationCap, Award, Sparkles, Send, Check
} from 'lucide-react';
import { FaGithub, FaLinkedin, FaTwitter, FaGlobe } from 'react-icons/fa';

const SOCIAL_ICONS = {
  github: <FaGithub size={18} />,
  linkedin: <FaLinkedin size={18} />,
  twitter: <FaTwitter size={18} />,
  website: <FaGlobe size={18} />
};

export default function PortfolioRenderer({ 
  data, 
  isDark = true, 
  previewMode = false,
  activeTagFilter = null,
  onTagFilter = null 
}) {
  const [selectedTag, setSelectedTag] = useState(activeTagFilter);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const template = data?.template || 'minimal';
  const name = data?.name || 'Your Name';
  const headline = data?.headline || 'Professional Headline';
  const bio = data?.bio || 'Write a captivating bio highlighting your expertise and vision...';
  const avatar = data?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff`;
  const location = data?.location || data?.contact?.location;
  const socials = data?.socials || [];
  const skills = data?.skills || [];
  const experience = data?.experience || [];
  const projects = data?.projects || [];
  const education = data?.education || [];
  const certificates = data?.certificates || [];
  const contact = data?.contact || {};

  // Handle Tag Filter
  const handleTagClick = (tag) => {
    const nextTag = selectedTag === tag ? null : tag;
    setSelectedTag(nextTag);
    if (onTagFilter) onTagFilter(nextTag);
  };

  // Filter projects by tag if selected
  const filteredProjects = selectedTag
    ? projects.filter(p => p.tags && p.tags.some(t => t.toLowerCase() === selectedTag.toLowerCase()))
    : projects;

  const copyEmail = () => {
    if (contact.email) {
      navigator.clipboard.writeText(contact.email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  // ==========================================
  // THEME CONFIGURATIONS (6 DISTINCT DESIGNS)
  // ==========================================

  // 1. MINIMAL
  let themeStyles = {
    wrapper: isDark ? 'bg-[#0a0a0f] text-gray-100' : 'bg-gray-50 text-gray-900',
    card: isDark ? 'bg-white/[0.03] border-white/10 hover:border-indigo-500/30' : 'bg-white border-gray-200 shadow-sm hover:border-indigo-500/50',
    accentText: isDark ? 'text-indigo-400' : 'text-indigo-600',
    accentBg: isDark ? 'bg-indigo-600' : 'bg-indigo-600',
    badge: isDark ? 'bg-white/5 border-white/10 text-gray-300' : 'bg-gray-100 border-gray-200 text-gray-700',
    subText: isDark ? 'text-gray-400' : 'text-gray-600',
    font: 'font-sans',
    border: isDark ? 'border-white/10' : 'border-gray-200',
  };

  // 2. CYBERPUNK
  if (template === 'cyberpunk') {
    themeStyles = {
      wrapper: 'bg-[#06060c] text-pink-50 selection:bg-pink-500 selection:text-black',
      card: 'bg-[#0d0d1a]/80 border-pink-500/20 hover:border-pink-500/60 shadow-[0_0_20px_rgba(236,72,153,0.05)] hover:shadow-[0_0_25px_rgba(236,72,153,0.15)]',
      accentText: 'text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400',
      accentBg: 'bg-gradient-to-r from-pink-500 to-purple-600',
      badge: 'bg-pink-500/10 border-pink-500/30 text-pink-300',
      subText: 'text-gray-400',
      font: 'font-mono',
      border: 'border-pink-500/20',
      extra: 'terminal-scanlines'
    };
  } 
  // 3. CORPORATE SLATE
  else if (template === 'corporate') {
    themeStyles = {
      wrapper: isDark ? 'bg-[#0b1329] text-slate-100' : 'bg-[#f8fafc] text-slate-800',
      card: isDark ? 'bg-slate-900/60 border-slate-700/50 hover:border-blue-400/40' : 'bg-white border-slate-200 shadow-sm hover:border-blue-400',
      accentText: isDark ? 'text-sky-400' : 'text-blue-700',
      accentBg: 'bg-blue-700',
      badge: isDark ? 'bg-blue-950/60 border-blue-800/40 text-blue-300' : 'bg-blue-50 border-blue-200 text-blue-800',
      subText: isDark ? 'text-slate-400' : 'text-slate-600',
      font: 'font-serif',
      border: isDark ? 'border-slate-800' : 'border-slate-200'
    };
  }
  // 4. RETRO TERMINAL (Hacker CLI)
  else if (template === 'terminal') {
    themeStyles = {
      wrapper: 'bg-[#050905] text-emerald-400 font-mono selection:bg-emerald-500 selection:text-black',
      card: 'bg-[#0a120a] border-emerald-500/30 hover:border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.08)]',
      accentText: 'text-emerald-300',
      accentBg: 'bg-emerald-600',
      badge: 'bg-emerald-950/60 border-emerald-500/30 text-emerald-400',
      subText: 'text-emerald-500/70',
      font: 'font-mono',
      border: 'border-emerald-500/30',
      extra: 'terminal-scanlines'
    };
  }
  // 5. GLASSMORPHISM LUXE
  else if (template === 'glassmorphism') {
    themeStyles = {
      wrapper: 'bg-[#070714] text-white',
      card: 'bg-white/[0.04] backdrop-blur-xl border-white/10 hover:border-purple-400/40 shadow-2xl',
      accentText: 'text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-pink-400',
      accentBg: 'bg-gradient-to-r from-purple-600 to-indigo-600',
      badge: 'bg-white/10 backdrop-blur-md border-white/15 text-purple-200',
      subText: 'text-gray-300',
      font: 'font-sans',
      border: 'border-white/10'
    };
  }
  // 6. CREATIVE BENTO
  else if (template === 'bento') {
    themeStyles = {
      wrapper: isDark ? 'bg-[#0a0714] text-gray-100' : 'bg-amber-50/40 text-gray-900',
      card: isDark ? 'bg-gradient-to-br from-white/[0.06] to-white/[0.02] border-white/10 hover:border-amber-400/40' : 'bg-white border-gray-200 shadow-md hover:border-amber-500',
      accentText: isDark ? 'text-amber-400' : 'text-amber-600',
      accentBg: 'bg-amber-500 text-black',
      badge: isDark ? 'bg-amber-400/10 border-amber-400/30 text-amber-300' : 'bg-amber-100 border-amber-200 text-amber-900',
      subText: isDark ? 'text-gray-400' : 'text-gray-600',
      font: 'font-sans',
      border: isDark ? 'border-white/10' : 'border-gray-200'
    };
  }

  return (
    <div className={`w-full min-h-full ${themeStyles.wrapper} ${themeStyles.font} ${themeStyles.extra || ''} p-4 sm:p-8 md:p-12 transition-all duration-300`}>
      
      {/* BACKGROUND DECORATIONS */}
      {template === 'glassmorphism' && (
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-[140px] animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-[140px] animate-pulse delay-1000"></div>
        </div>
      )}

      {template === 'terminal' && (
        <div className="mb-6 pb-2 border-b border-emerald-500/20 text-xs text-emerald-600 font-mono flex items-center justify-between">
          <span>PORTFOLIO_OS [Version 2.4.0] (x86_64-apple-darwin)</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span> ONLINE</span>
        </div>
      )}

      <div className="max-w-4xl mx-auto space-y-16">
        
        {/* --- HERO / IDENTITY SECTION --- */}
        <section className="text-center relative pt-4">
          
          {/* Avatar with dynamic styling */}
          <div className="relative inline-block mb-6 group">
            {avatar ? (
              <img
                src={avatar}
                alt={name}
                className={`w-28 h-28 sm:w-36 sm:h-36 rounded-3xl object-cover mx-auto shadow-2xl border-2 ${
                  template === 'cyberpunk'
                    ? 'border-pink-500/50 shadow-[0_0_30px_rgba(236,72,153,0.3)]'
                    : template === 'terminal'
                    ? 'border-emerald-500 rounded-none shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                    : template === 'corporate'
                    ? 'border-slate-300 rounded-full'
                    : 'border-white/20'
                }`}
              />
            ) : (
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-indigo-600 flex items-center justify-center text-4xl font-black text-white shadow-xl mx-auto">
                {name[0] || 'P'}
              </div>
            )}
            
            {template === 'terminal' && (
              <div className="absolute -bottom-2 right-0 bg-emerald-950 border border-emerald-500 text-[10px] px-2 py-0.5 font-bold">
                ROOT
              </div>
            )}
          </div>

          {/* Name & Headline */}
          <div className="space-y-3">
            {template === 'terminal' && (
              <div className="text-xs font-mono text-emerald-500 mb-1">
                &gt; user.identify()
              </div>
            )}

            <h1 className={`text-4xl sm:text-6xl font-black tracking-tight ${template === 'cyberpunk' ? 'uppercase tracking-wider' : ''}`}>
              {name}
            </h1>

            <p className={`text-lg sm:text-xl font-bold ${themeStyles.accentText} max-w-xl mx-auto`}>
              {headline}
            </p>

            {location && (
              <div className={`flex items-center justify-center gap-1.5 text-xs ${themeStyles.subText}`}>
                <MapPin size={14} className="shrink-0" />
                <span>{location}</span>
              </div>
            )}

            <p className={`text-sm sm:text-base leading-relaxed ${themeStyles.subText} max-w-2xl mx-auto pt-2 italic`}>
              "{bio}"
            </p>
          </div>

          {/* Socials & Contact Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            {socials.map((s, idx) => (
              <a
                key={idx}
                href={s.url || '#'}
                target="_blank"
                rel="noreferrer"
                className={`p-3 rounded-2xl border ${themeStyles.card} text-gray-300 hover:text-white transition-all flex items-center gap-2 text-xs font-bold`}
              >
                {SOCIAL_ICONS[s.platform] || <Globe size={18} />}
                <span className="capitalize">{s.platform}</span>
              </a>
            ))}

            {contact?.email && (
              <button
                onClick={copyEmail}
                className={`p-3 rounded-2xl border ${themeStyles.card} text-gray-300 hover:text-white transition-all flex items-center gap-2 text-xs font-bold`}
                title="Copy Email"
              >
                {copiedEmail ? <Check size={18} className="text-emerald-400" /> : <Mail size={18} />}
                <span>{copiedEmail ? 'Copied Email' : 'Email'}</span>
              </button>
            )}
          </div>
        </section>

        {/* --- WORK EXPERIENCE --- */}
        {experience.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl border ${themeStyles.card} ${themeStyles.accentText}`}>
                <Briefcase size={20} />
              </div>
              <h2 className="text-2xl font-black tracking-tight">Work Experience</h2>
            </div>

            <div className={`space-y-6 pl-4 border-l-2 ${themeStyles.border}`}>
              {experience.map((exp, i) => (
                <div key={i} className={`p-6 rounded-2xl border ${themeStyles.card} space-y-2 relative transition-all`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h3 className="text-lg font-bold">{exp.role || 'Software Engineer'}</h3>
                    <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${themeStyles.badge} w-fit`}>
                      {exp.duration || '2022 - Present'}
                    </span>
                  </div>
                  <div className={`text-sm font-semibold ${themeStyles.accentText}`}>{exp.company || 'Tech Company'}</div>
                  <p className={`text-sm ${themeStyles.subText} leading-relaxed pt-1`}>{exp.desc || 'Responsibilities and key accomplishments...'}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* --- FEATURED PROJECTS --- */}
        {projects.length > 0 && (
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl border ${themeStyles.card} ${themeStyles.accentText}`}>
                  <Code size={20} />
                </div>
                <h2 className="text-2xl font-black tracking-tight">Featured Projects</h2>
              </div>

              {/* Tag Filters */}
              {Array.from(new Set(projects.flatMap(p => p.tags || []))).length > 0 && (
                <div className="flex flex-wrap gap-1.5 items-center">
                  <button
                    onClick={() => handleTagClick(null)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                      selectedTag === null ? themeStyles.accentBg : themeStyles.badge
                    }`}
                  >
                    All
                  </button>
                  {Array.from(new Set(projects.flatMap(p => p.tags || []))).slice(0, 6).map((tag, i) => (
                    <button
                      key={i}
                      onClick={() => handleTagClick(tag)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                        selectedTag === tag ? themeStyles.accentBg : themeStyles.badge
                      }`}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredProjects.map((proj, i) => (
                <div 
                  key={i} 
                  className={`p-6 rounded-3xl border ${themeStyles.card} flex flex-col justify-between group transition-all`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-xl font-black tracking-tight group-hover:text-indigo-400 transition-colors">
                        {proj.title || 'Untitled Project'}
                      </h3>
                      <div className="flex items-center gap-1.5">
                        {proj.repoLink && (
                          <a
                            href={proj.repoLink}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                            title="GitHub Repository"
                          >
                            <FaGithub size={16} />
                          </a>
                        )}
                        {proj.demoLink && (
                          <a
                            href={proj.demoLink}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                            title="Live Demo"
                          >
                            <ExternalLink size={16} />
                          </a>
                        )}
                      </div>
                    </div>

                    <p className={`text-sm ${themeStyles.subText} leading-relaxed`}>
                      {proj.description || 'Project description and overview...'}
                    </p>
                  </div>

                  {proj.tags && proj.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-6 border-t border-white/5 mt-6">
                      {proj.tags.map((t, idx) => (
                        <span
                          key={idx}
                          onClick={() => handleTagClick(t)}
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-md cursor-pointer ${themeStyles.badge}`}
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* --- SKILLS & TECH STACK --- */}
        {skills.length > 0 && skills.some(s => s.skills?.length > 0) && (
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl border ${themeStyles.card} ${themeStyles.accentText}`}>
                <Sparkles size={20} />
              </div>
              <h2 className="text-2xl font-black tracking-tight">Tech Stack & Tools</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {skills.map((cat, i) => (
                <div key={i} className={`p-5 rounded-2xl border ${themeStyles.card} space-y-3`}>
                  <h3 className={`text-xs font-bold uppercase tracking-widest ${themeStyles.accentText}`}>
                    {cat.category || 'General'}
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {cat.skills?.map((skill, j) => (
                      <span
                        key={j}
                        className={`text-xs font-medium px-2.5 py-1 rounded-lg border ${themeStyles.badge}`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* --- EDUCATION & CERTIFICATES (DUAL COLUMN) --- */}
        {(education.length > 0 || certificates.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Education */}
            {education.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl border ${themeStyles.card} ${themeStyles.accentText}`}>
                    <GraduationCap size={18} />
                  </div>
                  <h3 className="text-xl font-bold">Education</h3>
                </div>
                <div className="space-y-3">
                  {education.map((edu, i) => (
                    <div key={i} className={`p-4 rounded-2xl border ${themeStyles.card}`}>
                      <div className="font-bold text-sm">{edu.degree || 'Degree Program'}</div>
                      <div className={`text-xs ${themeStyles.subText} mt-1`}>
                        {edu.school} {edu.year && `• ${edu.year}`}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Certificates */}
            {certificates.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl border ${themeStyles.card} ${themeStyles.accentText}`}>
                    <Award size={18} />
                  </div>
                  <h3 className="text-xl font-bold">Certificates & Awards</h3>
                </div>
                <div className="space-y-3">
                  {certificates.map((cert, i) => (
                    <div key={i} className={`p-4 rounded-2xl border ${themeStyles.card} flex items-center justify-between`}>
                      <div>
                        <div className="font-bold text-sm">{cert.title || 'Certification Title'}</div>
                        <div className={`text-xs ${themeStyles.subText} mt-0.5`}>
                          {cert.issuer} {cert.date && `• ${cert.date}`}
                        </div>
                      </div>
                      <Award size={16} className={`shrink-0 ${themeStyles.accentText}`} />
                    </div>
                  ))}
                </div>
              </section>
            )}

          </div>
        )}

        {/* --- CONTACT / CONNECT CARD --- */}
        {contact?.email && (
          <section className={`p-8 rounded-3xl border ${themeStyles.card} text-center space-y-6 relative overflow-hidden`}>
            <div className="max-w-md mx-auto space-y-2">
              <h3 className="text-2xl font-black tracking-tight">Let's Build Something Amazing</h3>
              <p className={`text-sm ${themeStyles.subText}`}>
                Open for full-time opportunities, high-impact consulting, and open-source collaborations.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={`mailto:${contact.email}`}
                className={`px-8 py-3.5 rounded-2xl font-bold text-sm ${themeStyles.accentBg} text-white shadow-xl flex items-center gap-2 transition-transform hover:scale-105`}
              >
                <Send size={16} /> Send Email
              </a>
              {contact.website && (
                <a
                  href={contact.website}
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-3.5 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 font-bold text-sm text-gray-300 hover:text-white flex items-center gap-2 transition-colors"
                >
                  <Globe size={16} /> Visit Website
                </a>
              )}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
