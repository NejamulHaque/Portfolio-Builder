import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../lib/supabaseClient';
import { 
  Sun, Moon, Copy, Check, Eye as EyeIcon, Download, 
  Home, QrCode, Loader2, Globe
} from 'lucide-react';
import PortfolioRenderer from '../components/PortfolioRenderer';
import QRCodeModal from '../components/QRCodeModal';
import { SAMPLE_PROFILES } from '../data/sampleProfiles';

export default function PublicPortfolio() {
  const { username } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(true);
  const [copied, setCopied] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);

  useEffect(() => {
    async function fetchPortfolio() {
      try {
        const { data: userData, error } = await supabase
          .from('portfolios')
          .select('*')
          .eq('username', username)
          .single();
          
        let parsedData = null;

        if (userData && !error) {
          parsedData = {
            ...userData,
            skills: typeof userData.skills === 'string' ? JSON.parse(userData.skills) : userData.skills || [],
            projects: typeof userData.projects === 'string' ? JSON.parse(userData.projects) : userData.projects || [],
            experience: typeof userData.experience === 'string' ? JSON.parse(userData.experience) : userData.experience || [],
            education: typeof userData.education === 'string' ? JSON.parse(userData.education) : userData.education || [],
            certificates: typeof userData.certificates === 'string' ? JSON.parse(userData.certificates) : userData.certificates || [],
            contact: typeof userData.contact === 'string' ? JSON.parse(userData.contact) : userData.contact || {},
            socials: typeof userData.socials === 'string' ? JSON.parse(userData.socials) : userData.socials || []
          };
        }

        // Intelligently hydrate with default preset if profile was created without details or is Nejamul
        const isNejamul = username === 'nejamulhaque' || username === 'nejamul';
        const hasMinimalData = !parsedData || (!parsedData.skills?.length && !parsedData.projects?.length && !parsedData.experience?.length);

        if (isNejamul || hasMinimalData) {
          const fallback = isNejamul || !parsedData ? SAMPLE_PROFILES.nejamul : SAMPLE_PROFILES[username] || SAMPLE_PROFILES.nejamul;
          parsedData = {
            ...fallback,
            ...(parsedData || {}),
            name: parsedData?.name || fallback.name,
            headline: (parsedData?.headline && parsedData.headline !== 'DevSecOps Engineer' && parsedData.headline !== 'Hi') ? parsedData.headline : fallback.headline,
            bio: (parsedData?.bio && parsedData.bio !== 'Hi' && parsedData.bio.length > 10) ? parsedData.bio : fallback.bio,
            avatar_url: parsedData?.avatar_url || fallback.avatar_url,
            location: parsedData?.location || fallback.location,
            skills: parsedData?.skills?.length ? parsedData.skills : fallback.skills,
            experience: parsedData?.experience?.length ? parsedData.experience : fallback.experience,
            projects: parsedData?.projects?.length ? parsedData.projects : fallback.projects,
            education: parsedData?.education?.length ? parsedData.education : fallback.education,
            certificates: parsedData?.certificates?.length ? parsedData.certificates : fallback.certificates,
            socials: parsedData?.socials?.length ? parsedData.socials : fallback.socials,
            contact: { ...fallback.contact, ...(parsedData?.contact || {}) },
            template: parsedData?.template || fallback.template
          };
        }
        
        setData(parsedData);
        setIsDark(parsedData.theme !== 'light');
        
        if (userData?.id) {
          try {
            await supabase.rpc('increment_views', { portfolio_id: userData.id });
          } catch (_) {
            // Ignore RPC failure if increment_views is not defined in DB
          }
        }
      } catch (err) { 
        console.error(err);
        if (username === 'nejamulhaque' || username === 'nejamul') {
          setData(SAMPLE_PROFILES.nejamul);
          setIsDark(true);
        } else if (SAMPLE_PROFILES[username]) {
          setData(SAMPLE_PROFILES[username]);
          setIsDark(true);
        }
      } finally { 
        setLoading(false); 
      }
    }
    if (username) fetchPortfolio();
  }, [username]);

  const handleDownloadPDF = () => {
    // Native print is crisp, vector-rendered, preserves clickable links, and supports modern CSS without canvas oklch errors
    window.print();
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs text-gray-400 font-mono">Loading developer portfolio...</span>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-indigo-400 mb-6">
          <Globe size={32} />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">Portfolio Not Found</h1>
        <p className="text-gray-400 max-w-md mb-8 text-sm">
          No portfolio published under <span className="text-indigo-400 font-mono font-bold">@{username}</span> yet.
        </p>
        <div className="flex gap-4">
          <Link to="/" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold text-sm transition-colors flex items-center gap-2">
            <Home size={16} /> Back Home
          </Link>
          <Link to="/register" className="px-6 py-3 bg-white/10 hover:bg-white/15 rounded-xl font-bold text-sm transition-colors">
            Claim @{username}
          </Link>
        </div>
      </div>
    );
  }

  const currentUrl = window.location.href;

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#050505]' : 'bg-gray-50'} transition-colors duration-300 relative`}>
      
      {/* Dynamic SEO Meta */}
      <Helmet>
        <title>{data.name} | {data.headline || 'Developer Portfolio'}</title>
        <meta name="description" content={data.bio || `${data.name}'s professional developer portfolio.`} />
        <meta property="og:title" content={`${data.name} | Portfolio Builder`} />
        <meta property="og:description" content={data.headline || data.bio} />
        <meta property="og:image" content={data.avatar_url || '/logo.png'} />
        <meta property="og:url" content={currentUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${data.name} - Developer Portfolio`} />
        <meta name="twitter:description" content={data.headline || data.bio} />
      </Helmet>

      {/* FLOATING TOP GLASS CONTROLS NAVBAR */}
      <nav className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-2xl print:hidden">
        <div className={`backdrop-blur-xl border rounded-2xl px-4 py-2.5 flex items-center justify-between shadow-2xl transition-all ${
          isDark ? 'bg-black/75 border-white/10 text-white' : 'bg-white/85 border-gray-200 text-gray-900'
        }`}>
          
          <Link 
            to="/" 
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors" 
            title="Portfolio Builder Homepage"
          >
            <Home size={18} />
          </Link>

          {/* Views count */}
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-gray-400">
            <EyeIcon size={13} className="text-indigo-400" />
            <span>{data.views || 1} views</span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button 
              onClick={() => setIsDark(!isDark)} 
              className={`p-2 rounded-xl transition-all ${isDark ? 'bg-white/5 hover:bg-white/10 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
              title="Toggle Light / Dark Mode"
            >
              {isDark ? <Sun size={16}/> : <Moon size={16}/>}
            </button>

            <button 
              onClick={() => setQrModalOpen(true)} 
              className={`p-2 rounded-xl transition-all ${isDark ? 'bg-white/5 hover:bg-white/10 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
              title="QR Code & Social Share"
            >
              <QrCode size={16}/>
            </button>

            <button 
              onClick={copyToClipboard} 
              className={`p-2 rounded-xl transition-all relative ${isDark ? 'bg-white/5 hover:bg-white/10 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
              title="Copy URL"
            >
              {copied ? <Check size={16} className="text-emerald-400"/> : <Copy size={16}/>}
            </button>

            <button 
              onClick={handleDownloadPDF} 
              disabled={pdfGenerating}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-lg shadow-indigo-600/30"
            >
              {pdfGenerating ? <Loader2 size={14} className="animate-spin" /> : <Download size={14}/>}
              <span className="hidden sm:inline">{pdfGenerating ? 'Printing...' : 'Resume PDF'}</span>
            </button>
          </div>

        </div>
      </nav>

      {/* PORTFOLIO RENDER BODY */}
      <main id="portfolio-content" className="pt-24 pb-20">
        <PortfolioRenderer 
          data={data} 
          isDark={isDark} 
        />
      </main>

      {/* PUBLIC FOOTER */}
      <footer className={`py-10 border-t text-center px-6 print:hidden ${
        isDark ? 'border-white/5 text-gray-500' : 'border-gray-200 text-gray-400'
      }`}>
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-xs font-mono">Built & Hosted with</span>
          <Link to="/" className="text-xs font-bold text-indigo-400 hover:underline">Portfolio Builder</Link>
        </div>
        <p className="text-[10px] uppercase font-bold tracking-widest opacity-60">&copy; {new Date().getFullYear()} All Rights Reserved</p>
      </footer>

      {/* QR Code Share Modal */}
      <QRCodeModal 
        isOpen={qrModalOpen} 
        onClose={() => setQrModalOpen(false)} 
        url={currentUrl}
        title={`Share ${data.name}'s Portfolio`}
      />

    </div>
  );
}