import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Zap, Layout, Share2, Star, Check, 
  Globe, Cpu, ShieldCheck, Sparkles, Play 
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden font-sans selection:bg-indigo-500/30">
      
      {/* --- BACKGROUND EFFECTS --- */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse delay-1000"></div>
        <div className="absolute top-[40%] left-[50%] w-[20%] h-[20%] bg-pink-600/10 rounded-full blur-[100px]"></div>
      </div>

      {/* --- NAVBAR --- */}
      <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#050505]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer">
  <img src="/logo.png" alt="Portfolio.ai Logo" className="w-8 h-8 object-contain" />
  <span className="font-bold text-xl tracking-tight hidden sm:block">
    Portfolio<span className="text-indigo-400">.ai</span>
  </span>
</div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#templates" className="hover:text-white transition-colors">Templates</a>
            <a href="/pricing" className="hover:text-white transition-colors">Pricing</a>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors hidden sm:block">
              Sign In
            </Link>
            <Link to="/register" className="px-5 py-2 bg-white text-black rounded-full text-sm font-bold hover:bg-gray-200 transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)]">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-20 pb-32 px-6 text-center max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-indigo-300 mb-8 backdrop-blur-sm">
            <Sparkles size={12} className="text-indigo-400" />
            <span>Powered by IRUS AI Engine</span>
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 leading-[1.1] max-w-4xl">
            Build Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 animate-gradient">
              Digital Legacy.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            The most advanced portfolio builder for developers. 
            Real-time preview, AI-generated content, and stunning themes.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 w-full sm:w-auto">
            <Link to="/register" className="group relative flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-full font-bold hover:bg-indigo-500 transition-all shadow-[0_0_30px_rgba(79,70,229,0.4)] overflow-hidden">
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <span className="relative z-10">Start Building Free</span>
              <ArrowRight className="relative z-10 group-hover:translate-x-1 transition-transform" size={20} />
            </Link>
            <button className="px-8 py-4 bg-white/5 border border-white/10 backdrop-blur-sm rounded-full font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2 group">
              <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20">
                <Play size={12} className="fill-white ml-0.5" />
              </div>
              Watch Demo
            </button>
          </div>
        </motion.div>

        {/* Floating Dashboard Mockup */}
        <motion.div 
          initial={{ opacity: 0, y: 60, scale: 0.95 }} 
          animate={{ opacity: 1, y: 0, scale: 1 }} 
          transition={{ delay: 0.4, duration: 1, type: "spring" }}
          className="mt-20 relative mx-auto max-w-5xl rounded-2xl border border-white/10 bg-white/5 p-2 backdrop-blur-xl shadow-2xl overflow-hidden group"
        >
          {/* Browser Header */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-black/20">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/20"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/20"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/20"></div>
            </div>
            <div className="flex-1 text-center">
              <div className="inline-block px-4 py-1 rounded-md bg-white/5 text-xs text-gray-500 border border-white/5">
                app.portfolio.ai/dashboard
              </div>
            </div>
          </div>
          
          {/* Dashboard Content Mockup */}
          <div className="bg-[#0a0a0a] rounded-xl overflow-hidden aspect-[16/9] relative flex">
             {/* Sidebar Mock */}
             <div className="w-64 border-r border-white/5 bg-white/[0.02] p-6 hidden md:block space-y-4">
                <div className="h-8 w-3/4 bg-white/10 rounded-lg animate-pulse"></div>
                <div className="space-y-2 mt-8">
                   <div className="h-4 w-full bg-white/5 rounded"></div>
                   <div className="h-4 w-5/6 bg-white/5 rounded"></div>
                   <div className="h-4 w-4/6 bg-white/5 rounded"></div>
                </div>
                <div className="absolute bottom-6 left-6 right-6">
                   <div className="h-10 w-full bg-indigo-500/20 rounded-lg border border-indigo-500/30"></div>
                </div>
             </div>
             
             {/* Main Content Mock */}
             <div className="flex-1 p-8 relative overflow-hidden">
                <div className="flex justify-between items-start mb-8">
                   <div className="space-y-3">
                      <div className="h-6 w-48 bg-white/10 rounded-lg"></div>
                      <div className="h-4 w-32 bg-white/5 rounded"></div>
                   </div>
                   <div className="flex gap-2">
                      <div className="h-8 w-8 rounded-full bg-white/10"></div>
                      <div className="h-8 w-24 bg-indigo-600 rounded-lg"></div>
                   </div>
                </div>
                
                {/* Cards Grid */}
                <div className="grid grid-cols-3 gap-4">
                   <div className="col-span-2 h-48 bg-gradient-to-br from-indigo-900/20 to-purple-900/20 rounded-2xl border border-white/5 p-6 flex flex-col justify-between">
                      <div className="w-12 h-12 rounded-full bg-indigo-500/20"></div>
                      <div className="space-y-2">
                         <div className="h-4 w-3/4 bg-white/10 rounded"></div>
                         <div className="h-3 w-1/2 bg-white/5 rounded"></div>
                      </div>
                   </div>
                   <div className="space-y-4">
                      <div className="h-22 bg-white/5 rounded-2xl border border-white/5 p-4 h-[180px] flex flex-col justify-between">
                         <div className="w-8 h-8 rounded-lg bg-pink-500/20"></div>
                         <div className="h-3 w-2/3 bg-white/10 rounded"></div>
                      </div>
                   </div>
                </div>
                
                {/* Floating AI Element */}
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 4 }}
                  className="absolute bottom-8 right-8 bg-black/80 backdrop-blur-md border border-indigo-500/30 p-4 rounded-2xl shadow-2xl flex items-center gap-3 max-w-xs"
                >
                   <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center">
                      <Cpu size={16} className="text-white" />
                   </div>
                   <div>
                      <div className="text-xs font-bold text-indigo-400">AI Assistant</div>
                      <div className="text-[10px] text-gray-400">Bio generated successfully!</div>
                   </div>
                </motion.div>
             </div>
          </div>
          
          {/* Glow behind mockup */}
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 -z-10"></div>
        </motion.div>
      </section>

      {/* --- SOCIAL PROOF --- */}
      <section className="py-10 border-y border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm text-gray-500 font-medium mb-8 uppercase tracking-widest">Trusted by developers at</p>
          <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {['Google', 'Microsoft', 'Stripe', 'Vercel', 'Netflix'].map((company) => (
              <span key={company} className="text-2xl font-bold text-white font-sans">{company}</span>
            ))}
          </div>
        </div>
      </section>

      {/* --- BENTO GRID FEATURES --- */}
      <section id="features" className="py-32 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Everything you need to <br/> <span className="text-indigo-400">stand out.</span></h2>
          <p className="text-gray-400 max-w-2xl mx-auto">Powerful tools designed for the modern developer. No code required.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
          {/* Large Card */}
          <div className="md:col-span-2 p-8 rounded-3xl bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-white/10 relative overflow-hidden group hover:border-indigo-500/30 transition-colors">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <Zap size={120} />
            </div>
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400 mb-4">
                <Zap size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Real-Time AI Engine</h3>
                <p className="text-gray-400 max-w-md">Watch your portfolio build itself. Our AI analyzes your skills and generates professional bios instantly.</p>
              </div>
            </div>
          </div>

          {/* Tall Card */}
          <div className="row-span-2 p-8 rounded-3xl bg-white/5 border border-white/10 relative overflow-hidden group hover:border-pink-500/30 transition-colors">
             <div className="absolute inset-0 bg-gradient-to-b from-pink-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
             <div className="relative z-10 h-full flex flex-col">
                <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center text-pink-400 mb-4">
                  <Layout size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2">Dynamic Themes</h3>
                <p className="text-gray-400 text-sm mb-8">Switch between Minimalist, Cyberpunk, and Corporate modes with one click.</p>
                
                {/* Theme Preview Mini */}
                <div className="mt-auto space-y-3">
                   <div className="flex gap-2">
                      <div className="h-12 flex-1 rounded-lg bg-gray-800 border border-white/10"></div>
                      <div className="h-12 flex-1 rounded-lg bg-[#0f0f11] border border-pink-500/30"></div>
                      <div className="h-12 flex-1 rounded-lg bg-blue-50 border border-blue-200"></div>
                   </div>
                </div>
             </div>
          </div>

          {/* Standard Card */}
          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 group hover:border-green-500/30 transition-colors">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center text-green-400 mb-4">
              <Globe size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Custom Domains</h3>
            <p className="text-gray-400 text-sm">Connect your own domain name for a truly professional presence.</p>
          </div>

          {/* Standard Card */}
          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 group hover:border-yellow-500/30 transition-colors">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center text-yellow-400 mb-4">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Enterprise Security</h3>
            <p className="text-gray-400 text-sm">Your data is encrypted and secure. We never sell your information.</p>
          </div>
        </div>
      </section>

      {/* --- TEMPLATE SHOWCASE --- */}
      <section id="templates" className="py-20 px-6 max-w-7xl mx-auto">
         <div className="flex justify-between items-end mb-12">
            <div>
               <h2 className="text-3xl font-bold mb-2">Start with a template</h2>
               <p className="text-gray-400">Choose from our professionally designed themes.</p>
            </div>
            <Link to="/register" className="hidden md:flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-medium">
               View all templates <ArrowRight size={16} />
            </Link>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Minimalist", desc: "Clean & Simple", color: "from-gray-800 to-gray-900", accent: "bg-white" },
              { name: "Cyberpunk", desc: "Neon & Dark", color: "from-[#0f0f11] to-[#1a1a2e]", accent: "bg-pink-500" },
              { name: "Corporate", desc: "Professional", color: "from-blue-50 to-indigo-100", accent: "bg-blue-600" },
            ].map((template, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -8 }}
                className="group relative rounded-2xl overflow-hidden border border-white/10 bg-white/5 cursor-pointer"
              >
                <div className={`aspect-[4/3] bg-gradient-to-br ${template.color} flex items-center justify-center relative p-8`}>
                   {/* Mockup UI */}
                   <div className={`w-full h-full rounded-lg ${template.name === 'Corporate' ? 'bg-white' : 'bg-black/40'} backdrop-blur-sm border ${template.name === 'Corporate' ? 'border-gray-200' : 'border-white/10'} p-6 flex flex-col gap-4 shadow-2xl`}>
                      <div className={`w-16 h-16 rounded-full ${template.accent} opacity-80 mb-2`}></div>
                      <div className={`h-3 w-1/2 ${template.name === 'Corporate' ? 'bg-gray-300' : 'bg-white/20'} rounded`}></div>
                      <div className={`h-2 w-3/4 ${template.name === 'Corporate' ? 'bg-gray-200' : 'bg-white/10'} rounded`}></div>
                      <div className="mt-auto flex gap-2">
                         <div className={`h-8 w-20 ${template.accent} rounded opacity-80`}></div>
                         <div className={`h-8 w-20 ${template.name === 'Corporate' ? 'bg-gray-200' : 'bg-white/10'} rounded`}></div>
                      </div>
                   </div>
                   
                   {/* Hover Overlay */}
                   <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                      <span className="px-6 py-2 bg-white text-black rounded-full font-bold text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform">Use Template</span>
                   </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-1 text-white">{template.name}</h3>
                  <p className="text-sm text-gray-500">{template.desc}</p>
                </div>
              </motion.div>
            ))}
         </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-32 px-6 relative overflow-hidden">
         <div className="absolute inset-0 bg-indigo-600/10 blur-[100px] -z-10"></div>
         <div className="max-w-4xl mx-auto text-center bg-gradient-to-b from-white/10 to-white/5 border border-white/10 rounded-[3rem] p-12 backdrop-blur-xl">
            <h2 className="text-4xl md:text-6xl font-black mb-6">Ready to build your legacy?</h2>
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">Join thousands of developers who have upgraded their career with Portfolio.ai.</p>
            <Link to="/register" className="inline-flex items-center gap-2 px-10 py-5 bg-white text-black rounded-full font-bold text-lg hover:bg-gray-200 transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)]">
               Get Started for Free <ArrowRight size={24} />
            </Link>
            <p className="mt-6 text-sm text-gray-500">No credit card required • Cancel anytime</p>
         </div>
      </section>
      {/* FAQ Section */}
<section className="py-20 px-6 max-w-4xl mx-auto">
  <h2 className="text-3xl font-bold text-center mb-12 text-white">Frequently Asked Questions</h2>
  <div className="space-y-4">
    {[
      { q: "Is Portfolio.ai free?", a: "Yes, our core builder is completely free to use. We offer premium templates and custom domains in our Pro plan." },
      { q: "Can I use my own domain?", a: "Absolutely. You can connect any custom domain (e.g., name.com) to your portfolio in the settings." },
      { q: "How does the AI work?", a: "We use advanced LLMs to help you write professional bios and project descriptions based on your skills." },
      { q: "Do I need to know how to code?", a: "Not at all. Our editor is visual and intuitive, designed for everyone." }
    ].map((faq, i) => (
      <details key={i} className="group bg-white/5 border border-white/10 rounded-xl p-6 [&_summary::-webkit-details-marker]:hidden cursor-pointer">
        <summary className="flex items-center justify-between font-medium text-white text-lg">
          {faq.q}
          <span className="transition group-open:rotate-180">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-indigo-400"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
          </span>
        </summary>
        <p className="text-gray-400 mt-4 leading-relaxed">
          {faq.a}
        </p>
      </details>
    ))}
  </div>
</section>

      {/* --- FOOTER --- */}
      <footer className="border-t border-white/5 py-12 px-6 bg-[#020202]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-white rounded flex items-center justify-center text-black font-bold text-xs">P</div>
            <span className="font-bold text-sm text-gray-300">Portfolio.ai</span>
          </div>
          <div className="text-sm text-gray-600">
            &copy; 2024 Portfolio Builder Inc. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm text-gray-500">
            <a href="/legal/privacy" className="hover:text-white transition-colors">Privacy</a>
            <a href="/legal/terms" className="hover:text-white transition-colors">Terms</a>
            <a href="https://twitter.com/Nejamul_Haque_" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Twitter</a>
          </div>
        </div>
      </footer>
    </div>
  );
}