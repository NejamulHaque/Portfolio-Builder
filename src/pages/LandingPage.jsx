import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Zap, Star, 
  Globe, Cpu, Sparkles, 
  Smartphone, FileText, Download, QrCode, Palette,
  Eye, ChevronDown
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PortfolioRenderer from '../components/PortfolioRenderer';
import { SAMPLE_PROFILES } from '../data/sampleProfiles';

const TEMPLATE_OPTIONS = [
  { id: 'minimal', name: 'Minimalist', desc: 'Clean, modern typography', badge: 'Popular', color: 'from-gray-700 to-gray-900', accent: 'bg-white' },
  { id: 'cyberpunk', name: 'Cyberpunk', desc: 'Neon glow & matrix vibe', badge: 'Trending', color: 'from-[#0d0d1a] to-[#250b2c]', accent: 'bg-pink-500' },
  { id: 'corporate', name: 'Corporate', desc: 'Executive slate & serif', badge: 'Professional', color: 'from-blue-950 to-slate-900', accent: 'bg-blue-600' },
  { id: 'terminal', name: 'Terminal Hacker', desc: 'Retro CLI monospace', badge: 'Dev Favorite', color: 'from-[#051005] to-[#0a1f0a]', accent: 'bg-emerald-500' },
  { id: 'glassmorphism', name: 'Glass Luxe', desc: 'Frosted blur & ambient light', badge: 'New', color: 'from-[#120e2e] to-[#241242]', accent: 'bg-purple-500' },
  { id: 'bento', name: 'Creative Bento', desc: 'Modular grid & playful tags', badge: 'Creative', color: 'from-[#1f1505] to-[#2b1e0a]', accent: 'bg-amber-500' }
];

export default function LandingPage() {
  const [selectedPersona, setSelectedPersona] = useState('nejamul');
  const [activeTemplate, setActiveTemplate] = useState('cyberpunk');
  const [openFaq, setOpenFaq] = useState(null);

  const currentProfile = {
    ...SAMPLE_PROFILES[selectedPersona || 'nejamul'],
    template: activeTemplate
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden font-sans selection:bg-indigo-500/30 selection:text-white">
      
      {/* Background Animated Gradient Mesh */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/15 rounded-full blur-[140px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/15 rounded-full blur-[140px] animate-pulse delay-1000"></div>
        <div className="absolute top-[40%] left-[45%] w-[30%] h-[30%] bg-pink-600/10 rounded-full blur-[120px]"></div>
      </div>

      {/* --- NAVBAR --- */}
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className="relative pt-16 sm:pt-24 pb-20 px-4 sm:px-6 text-center max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-indigo-300 mb-8 backdrop-blur-md shadow-inner">
            <Sparkles size={14} className="text-indigo-400 animate-spin" />
            <span>Next-Gen AI Portfolio Builder 2.0</span>
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
            <span className="text-gray-400">6+ Designer Themes</span>
          </div>
          
          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[1.08] max-w-5xl">
            Build Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 animate-gradient">
              Digital Legacy.
            </span>
          </h1>
          
          {/* Subtext */}
          <p className="text-base sm:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            The all-in-one developer portfolio ecosystem. Real-time preview, AI-assisted bio and project writing, downloadable PDF resumes, and 100% mobile-ready themes.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <Link 
              to="/register" 
              className="w-full sm:w-auto group relative flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold transition-all shadow-[0_0_35px_rgba(79,70,229,0.4)] overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <span className="relative z-10">Start Building Free</span>
              <ArrowRight className="relative z-10 group-hover:translate-x-1 transition-transform" size={18} />
            </Link>

            <a 
              href="#playground" 
              className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md rounded-2xl font-bold text-gray-200 hover:text-white transition-all flex items-center justify-center gap-2"
            >
              <Sparkles size={18} className="text-indigo-400" />
              <span>Test Interactive Demo</span>
            </a>
          </div>

          {/* Social Proof Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 mt-16 max-w-4xl w-full border-t border-white/5 pt-10">
            <div>
              <div className="text-2xl sm:text-3xl font-black text-white">25,000+</div>
              <div className="text-xs text-gray-500 font-medium uppercase tracking-wider mt-1">Portfolios Built</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-indigo-400">6+</div>
              <div className="text-xs text-gray-500 font-medium uppercase tracking-wider mt-1">Designer Themes</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-purple-400">&lt; 3 Mins</div>
              <div className="text-xs text-gray-500 font-medium uppercase tracking-wider mt-1">Average Setup Time</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-pink-400">4.9 / 5.0</div>
              <div className="text-xs text-gray-500 font-medium uppercase tracking-wider mt-1">Developer Rating</div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* --- INTERACTIVE LIVE DEMO PLAYGROUND --- */}
      <section id="playground" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto scroll-mt-24">
        
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-3">
            <Sparkles size={14} /> Interactive Live Playground
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">
            Test drive the portfolio builder <br className="hidden sm:block" />
            <span className="text-indigo-400">right here, right now.</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto text-sm sm:text-base">
            Switch developer roles or themes below to see the live portfolio render immediately without signing up.
          </p>
        </div>

        {/* Playground Controls Bar */}
        <div className="bg-[#0e0e14] border border-white/10 rounded-3xl p-4 sm:p-6 mb-8 backdrop-blur-xl shadow-2xl space-y-4">
          
          {/* Persona Selectors */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-gray-400 tracking-wider">
              <span>Sample Profile:</span>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'nejamul', label: 'Nejamul Haque (DevSecOps)' },
                  { id: 'fullstack', label: 'Full Stack Engineer' },
                  { id: 'ai', label: 'AI Specialist' },
                  { id: 'designer', label: 'Product Designer' },
                ].map(p => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPersona(p.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      selectedPersona === p.id 
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
                        : 'bg-white/5 hover:bg-white/10 text-gray-300'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Template Selector Pills */}
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-gray-400 tracking-wider overflow-x-auto max-w-full pb-2 lg:pb-0 custom-scrollbar">
              <span>Theme:</span>
              <div className="flex gap-2">
                {TEMPLATE_OPTIONS.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTemplate(t.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                      activeTemplate === t.id
                        ? 'bg-white text-black shadow-lg'
                        : 'bg-white/5 hover:bg-white/10 text-gray-300'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${t.accent}`}></span>
                    <span>{t.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Live Simulator Viewport */}
        <div className="relative rounded-3xl border border-white/10 bg-[#08080c] shadow-2xl overflow-hidden">
          
          {/* Browser Top Bar */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-white/10 bg-[#0d0d14]">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/60"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500/60"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500/60"></div>
            </div>

            <div className="px-4 py-1 rounded-lg bg-black/40 border border-white/5 text-xs text-gray-400 font-mono flex items-center gap-2">
              <span className="text-emerald-400">https://</span>
              <span>builderr-ai.vercel.app/portfolio/{currentProfile.username}</span>
            </div>

            <Link
              to="/register"
              className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
            >
              <span>Use This Template</span>
              <ArrowRight size={12} />
            </Link>
          </div>

          {/* Rendered Portfolio inside Simulator */}
          <div className="max-h-[620px] overflow-y-auto custom-scrollbar">
            <PortfolioRenderer 
              data={currentProfile} 
              isDark={true}
              previewMode={true} 
            />
          </div>

        </div>

      </section>

      {/* --- HOW IT WORKS (3 STEPS) --- */}
      <section className="py-24 px-4 sm:px-6 max-w-7xl mx-auto border-t border-white/5">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-bold mb-4">
            How it works in <span className="text-indigo-400">3 simple steps</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto text-sm sm:text-base">
            From zero to an industry-ready live developer portfolio in under 3 minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          
          {/* Step 1 */}
          <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-indigo-500/40 transition-colors relative space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-black text-xl">
              1
            </div>
            <h3 className="text-xl font-bold text-white">Choose Your Theme</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Select from 6+ professionally engineered themes tailored for frontend, backend, AI, systems, and design specialists.
            </p>
            <div className="flex gap-2 pt-2">
              <span className="text-[10px] font-mono px-2 py-1 rounded bg-white/5 text-gray-400">#Minimal</span>
              <span className="text-[10px] font-mono px-2 py-1 rounded bg-pink-500/10 text-pink-300">#Cyberpunk</span>
              <span className="text-[10px] font-mono px-2 py-1 rounded bg-emerald-500/10 text-emerald-300">#Terminal</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-purple-500/40 transition-colors relative space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-black text-xl">
              2
            </div>
            <h3 className="text-xl font-bold text-white">AI Writing Assistant</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Let the built-in IRUS AI engine draft punchy professional bios, headline summaries, and impressive project impact bullet points.
            </p>
            <div className="inline-flex items-center gap-1.5 text-xs text-purple-300 font-medium">
              <Sparkles size={14} /> Auto-generate in 1 click
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-pink-500/40 transition-colors relative space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-pink-500/20 text-pink-400 flex items-center justify-center font-black text-xl">
              3
            </div>
            <h3 className="text-xl font-bold text-white">Publish & Export PDF</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Instantly deploy to your personal vanity URL, generate scannable QR codes for resumes, or export to a pixel-perfect PDF.
            </p>
            <div className="inline-flex items-center gap-1.5 text-xs text-pink-300 font-medium">
              <Download size={14} /> PDF Resume Ready
            </div>
          </div>

        </div>
      </section>

      {/* --- TEMPLATES SHOWCASE GALLERY --- */}
      <section id="templates" className="py-24 px-4 sm:px-6 max-w-7xl mx-auto scroll-mt-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-widest mb-2">
              <Palette size={14} /> Curated Styles
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold">6+ Designer Templates</h2>
            <p className="text-gray-400 text-sm sm:text-base mt-2">Switch effortlessly at any time with zero content loss.</p>
          </div>

          <Link
            to="/register"
            className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-bold text-sm"
          >
            <span>Explore all in editor</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TEMPLATE_OPTIONS.map((t, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -6 }}
              className="group rounded-3xl border border-white/10 bg-white/[0.02] overflow-hidden flex flex-col justify-between hover:border-indigo-500/40 transition-all cursor-pointer"
              onClick={() => {
                setActiveTemplate(t.id);
                const el = document.getElementById('playground');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {/* Preview Thumbnail Graphic */}
              <div className={`h-48 bg-gradient-to-br ${t.color} p-6 flex flex-col justify-between relative overflow-hidden`}>
                <div className="flex justify-between items-center">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${t.accent} text-black font-mono`}>
                    {t.badge}
                  </span>
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-white/30"></span>
                    <span className="w-2 h-2 rounded-full bg-white/30"></span>
                  </div>
                </div>

                {/* Miniature Mock layout */}
                <div className="p-4 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 space-y-2 shadow-xl">
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full ${t.accent}`}></div>
                    <div className="h-2 w-20 bg-white/40 rounded"></div>
                  </div>
                  <div className="h-1.5 w-full bg-white/20 rounded"></div>
                  <div className="h-1.5 w-2/3 bg-white/15 rounded"></div>
                </div>

                {/* Hover overlay button */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                  <span className="px-4 py-2 rounded-xl bg-white text-black font-bold text-xs flex items-center gap-1.5">
                    <Eye size={14} /> Preview Theme
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="p-6">
                <h3 className="font-bold text-lg text-white mb-1">{t.name}</h3>
                <p className="text-xs text-gray-400">{t.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- BENTO GRID ADVANCED FEATURES --- */}
      <section id="features" className="py-24 px-4 sm:px-6 max-w-7xl mx-auto border-t border-white/5 scroll-mt-24">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-widest mb-3">
            <Zap size={14} /> Supercharged Platform
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold mb-4">
            Everything you need to <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              stand out to top recruiters.
            </span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto text-sm sm:text-base">
            Engineered with enterprise precision. Built for developers, designers, and innovators.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Large AI Card */}
          <div className="md:col-span-2 p-8 rounded-3xl bg-gradient-to-br from-indigo-950/30 via-purple-950/20 to-black border border-white/10 relative overflow-hidden group hover:border-indigo-500/40 transition-colors">
            <div className="relative z-10 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <Cpu size={24} />
              </div>
              <h3 className="text-2xl font-bold">Deep AI Content Generator</h3>
              <p className="text-gray-400 text-sm max-w-lg leading-relaxed">
                Stuck on your summary? Our neural generator inspects your technical skills, past jobs, and repositories to generate compelling, tailored descriptions that capture recruiter attention.
              </p>
              <div className="p-4 rounded-2xl bg-black/50 border border-white/10 font-mono text-xs text-indigo-300 max-w-md">
                &gt; "Architected high-throughput microservices using Go and Kafka, cutting latency by 45%."
              </div>
            </div>
          </div>

          {/* Card 2: PDF Resume Exporter */}
          <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-pink-500/40 transition-colors space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-pink-500/20 text-pink-400 flex items-center justify-center">
              <FileText size={24} />
            </div>
            <h3 className="text-xl font-bold">1-Click PDF Resume</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Export your entire portfolio directly into a clean, executive A4 PDF resume ready for job applications.
            </p>
          </div>

          {/* Card 3: 100% Responsive & Viewport Switcher */}
          <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-emerald-500/40 transition-colors space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Smartphone size={24} />
            </div>
            <h3 className="text-xl font-bold">100% Mobile Ready</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Every theme adapts seamlessly across mobile phones, tablets, laptops, and ultra-wide displays.
            </p>
          </div>

          {/* Card 4: QR Code & Sharing */}
          <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-amber-500/40 transition-colors space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <QrCode size={24} />
            </div>
            <h3 className="text-xl font-bold">Instant QR Code Sharing</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Generate scannable QR codes for your business cards, email signatures, and resume headers.
            </p>
          </div>

          {/* Card 5: Custom Domain & SEO */}
          <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-blue-500/40 transition-colors space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <Globe size={24} />
            </div>
            <h3 className="text-xl font-bold">SEO & Custom Domains</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Pre-configured OpenGraph social cards, XML sitemaps, and custom domain routing for maximum discoverability.
            </p>
          </div>

        </div>
      </section>

      {/* --- DEVELOPER WALL OF LOVE & TESTIMONIALS --- */}
      <section className="py-24 px-4 sm:px-6 max-w-7xl mx-auto border-t border-white/5">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-pink-400 font-bold text-xs uppercase tracking-widest mb-3">
            <Star size={14} className="fill-pink-400" /> Wall of Love
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold">Loved by developers worldwide</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: "Marcus Vance",
              role: "Senior Frontend Lead @ YC Alum",
              avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
              quote: "The Cyberpunk theme landed me 3 interviews in a week. Recruiters specifically commented on how clean and futuristic my portfolio was."
            },
            {
              name: "Priya Sharma",
              role: "AI Systems Engineer @ Berlin",
              avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
              quote: "The AI bio generator nailed my complex ML research summary in 10 seconds. Saved me hours of resume tweaking!"
            },
            {
              name: "David Kim",
              role: "Full Stack Engineer @ FinTech",
              avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
              quote: "Having real-time preview plus one-click PDF resume export in the same tool is an absolute superpower."
            }
          ].map((t, i) => (
            <div key={i} className="p-8 rounded-3xl bg-white/[0.02] border border-white/10 flex flex-col justify-between space-y-6">
              <div className="flex gap-1 text-amber-400">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} size={16} className="fill-amber-400" />
                ))}
              </div>
              <p className="text-sm text-gray-300 leading-relaxed italic">"{t.quote}"</p>
              <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover border border-white/10" />
                <div>
                  <div className="font-bold text-sm text-white">{t.name}</div>
                  <div className="text-xs text-gray-500">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- FAQ SECTION ACCORDION --- */}
      <section id="faq" className="py-24 px-4 sm:px-6 max-w-4xl mx-auto border-t border-white/5 scroll-mt-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-gray-400 text-sm sm:text-base">Everything you need to know about Portfolio Builder</p>
        </div>

        <div className="space-y-4">
          {[
            {
              q: "Is Portfolio Builder free to get started?",
              a: "Yes! Our core builder, all 6 designer templates, real-time live preview, and basic AI bio tools are 100% free forever. We also offer a Pro Developer upgrade for unlimited deployments and custom domains."
            },
            {
              q: "Can I connect my own custom domain?",
              a: "Yes. Pro plan users can attach custom domains (e.g., yourname.dev or yourname.com) directly to their portfolio with automated SSL certificates."
            },
            {
              q: "How does the AI generator work?",
              a: "We utilize advanced LLM architectures via the IRUS AI engine to synthesize your technical skills and job experience into recruiter-optimized bios, punchy headlines, and impactful project descriptions."
            },
            {
              q: "Can I download my portfolio as a PDF resume?",
              a: "Absolutely! Every portfolio includes a built-in 'Download Resume' button that renders an A4-optimized, professional resume print."
            },
            {
              q: "Can I backup or export my data?",
              a: "Yes. You can export your full portfolio data to a JSON file at any time from your dashboard or profile settings, and restore it whenever you like."
            }
          ].map((faq, i) => (
            <div
              key={i}
              className="bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden transition-colors"
            >
              <button
                onClick={() => toggleFaq(i)}
                className="w-full p-6 text-left font-bold text-white text-base sm:text-lg flex items-center justify-between gap-4"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  size={20}
                  className={`text-indigo-400 shrink-0 transition-transform duration-200 ${
                    openFaq === i ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <AnimatePresence>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-6 pb-6 text-sm text-gray-400 leading-relaxed border-t border-white/5 pt-4"
                  >
                    {faq.a}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* --- CTA BANNER --- */}
      <section className="py-24 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-indigo-600/10 blur-[120px] -z-10"></div>
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-b from-white/10 to-white/5 border border-white/15 rounded-[3rem] p-8 sm:p-16 backdrop-blur-2xl shadow-2xl">
          <h2 className="text-3xl sm:text-6xl font-black mb-6 tracking-tight">
            Ready to upgrade your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              developer career?
            </span>
          </h2>
          <p className="text-base sm:text-xl text-gray-400 mb-10 max-w-xl mx-auto">
            Join thousands of software engineers, architects, and designers who build their public portfolios with Portfolio Builder.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-10 py-5 bg-white text-black hover:bg-gray-200 rounded-full font-bold text-base sm:text-lg transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:scale-105"
          >
            <span>Start Building for Free</span>
            <ArrowRight size={20} />
          </Link>
          <p className="mt-6 text-xs text-gray-500 font-medium">No credit card required • Instant access</p>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <Footer />

    </div>
  );
}