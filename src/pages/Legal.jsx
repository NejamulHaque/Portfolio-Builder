import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Shield, FileText, Lock, Globe, Mail, CheckCircle2, Download } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Legal() {
  const { type } = useParams(); // 'privacy' or 'terms'
  const [activeTab, setActiveTab] = useState(type === 'terms' ? 'terms' : 'privacy');

  return (
    <div className="min-h-screen bg-[#050505] text-gray-300 font-sans flex flex-col selection:bg-indigo-500/30">
      
      <Helmet>
        <title>{activeTab === 'privacy' ? 'Privacy Policy' : 'Terms of Service'} | Portfolio Builder</title>
        <meta name="description" content="Read the Privacy Policy and Terms of Service for Portfolio Builder. Learn how we handle your developer data, protect your privacy, and ensure security." />
        <link rel="canonical" href={`https://builderr-ai.vercel.app/legal/${activeTab}`} />
      </Helmet>

      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-12 w-full">
        
        {/* Back navigation & Tab Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 px-3.5 py-2 rounded-xl border border-white/10 transition-colors w-fit"
          >
            <ArrowLeft size={14} /> Back to Homepage
          </Link>

          <div className="flex items-center bg-black/40 border border-white/10 rounded-2xl p-1 text-xs">
            <button
              onClick={() => setActiveTab('privacy')}
              className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all ${
                activeTab === 'privacy' 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Shield size={14} />
              <span>Privacy Policy</span>
            </button>

            <button
              onClick={() => setActiveTab('terms')}
              className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all ${
                activeTab === 'terms' 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <FileText size={14} />
              <span>Terms of Service</span>
            </button>
          </div>
        </div>
        
        <div className="p-6 sm:p-12 rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-xl shadow-2xl space-y-8">
          
          {/* Header Banner */}
          <div className="border-b border-white/10 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-widest mb-2">
                {activeTab === 'privacy' ? <Shield size={14} /> : <FileText size={14} />}
                <span>{activeTab === 'privacy' ? 'Data Privacy & Security Standard' : 'User Agreement & Terms'}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white">
                {activeTab === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
              </h1>
              <p className="text-xs text-gray-500 mt-2 font-mono">
                Effective Date: August 31, 2026 • Version 2.4.0
              </p>
            </div>

            <button 
              onClick={() => window.print()}
              className="px-3.5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-gray-300 flex items-center gap-2 transition-colors w-fit"
            >
              <Download size={14} />
              <span>Print / Save Copy</span>
            </button>
          </div>

          {/* Document Content */}
          <div className="space-y-8 text-sm leading-relaxed text-gray-300">
            {activeTab === 'privacy' ? (
              <>
                <section className="space-y-3">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-indigo-400" /> 1. Information We Collect
                  </h2>
                  <p>
                    When you register and build a portfolio with <strong>Portfolio Builder</strong>, we collect information you explicitly provide:
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-gray-400 text-xs sm:text-sm">
                    <li><strong>Account Credentials:</strong> Email address and authentication tokens via Supabase Auth.</li>
                    <li><strong>Profile Information:</strong> Full name, professional headline, biography, avatar image, and social media handles.</li>
                    <li><strong>Career History:</strong> Work experience, education history, technical certifications, and project repositories.</li>
                    <li><strong>Telemetry & Usage Data:</strong> Anonymized view counts, browser user-agents, and IP addresses to optimize server response times and mitigate abuse.</li>
                  </ul>
                </section>

                <section className="space-y-3">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Lock size={16} className="text-indigo-400" /> 2. How We Use & Protect Your Information
                  </h2>
                  <p>
                    Your information is utilized solely to render your public developer portfolio website, generate high-fidelity PDF resumes, and synthesize AI-assisted copywriting via the IRUS AI LLM engine.
                  </p>
                  <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-indigo-200">
                    🔒 <strong>Zero Data Selling Guarantee:</strong> We do not sell, rent, or monetize your developer personal data or code repositories to third parties or advertisers.
                  </div>
                </section>

                <section className="space-y-3">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Globe size={16} className="text-indigo-400" /> 3. Cookies & Local Storage Policy
                  </h2>
                  <p>
                    Portfolio Builder utilizes local storage and minimal session cookies strictly for session authentication, dark/light theme preferences, and telemetry performance. You can reset or clear these at any time in your browser settings.
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Shield size={16} className="text-indigo-400" /> 4. Your Rights (GDPR / CCPA / Global)
                  </h2>
                  <p>
                    You retain total ownership of your data. You possess the right to:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-gray-400 text-xs sm:text-sm">
                    <li>Export your complete portfolio data as a JSON file at any time with 1 click.</li>
                    <li>Update, modify, or unpublish your public URL.</li>
                    <li>Permanently delete your account and all associated database records.</li>
                  </ul>
                </section>

                <section className="space-y-3 border-t border-white/10 pt-6">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Mail size={16} className="text-indigo-400" /> 5. Contact Privacy Team
                  </h2>
                  <p className="text-xs text-gray-400">
                    If you have questions regarding this Privacy Policy or your data, please contact our Data Protection Officer at: <a href="mailto:nejamulhaque.works@gmail.com" className="text-indigo-400 font-bold hover:underline">nejamulhaque.works@gmail.com</a>.
                  </p>
                </section>
              </>
            ) : (
              <>
                <section className="space-y-3">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-indigo-400" /> 1. Acceptance of Terms
                  </h2>
                  <p>
                    By accessing, creating an account on, or utilizing <strong>Portfolio Builder</strong> (hosted at <a href="https://builderr-ai.vercel.app" className="text-indigo-400 hover:underline">https://builderr-ai.vercel.app</a>), you agree to be bound by these Terms of Service.
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Shield size={16} className="text-indigo-400" /> 2. Intellectual Property & User Ownership
                  </h2>
                  <p>
                    You retain 100% intellectual property ownership of all project repositories, descriptions, code samples, logos, and resumes you publish on Portfolio Builder. We claim no ownership over your creative work.
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Lock size={16} className="text-indigo-400" /> 3. Acceptable Use & Conduct
                  </h2>
                  <p>
                    Users agree not to utilize Portfolio Builder to publish malicious code, malware, fraudulent claims, illegal material, or phishing websites. Accounts violating acceptable use are subject to immediate termination.
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <FileText size={16} className="text-indigo-400" /> 4. AI-Generated Content Disclaimer
                  </h2>
                  <p>
                    AI generation tools (bios, headlines, project descriptions) are powered by large language models. While designed to enhance recruiter engagement, users are responsible for verifying accuracy before public release.
                  </p>
                </section>

                <section className="space-y-3">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-indigo-400" /> 5. Upgrades & UPI Transactions
                  </h2>
                  <p>
                    Pro memberships offer custom domains, unlimited deployments, and premium themes. UPI payments with valid transaction IDs (UTR) are manually verified and approved within 24 hours.
                  </p>
                </section>

                <section className="space-y-3 border-t border-white/10 pt-6">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Mail size={16} className="text-indigo-400" /> 6. Support & Inquiries
                  </h2>
                  <p className="text-xs text-gray-400">
                    For legal questions or enterprise inquiries, reach out to <a href="mailto:nejamulhaque.works@gmail.com" className="text-indigo-400 font-bold hover:underline">nejamulhaque.works@gmail.com</a>.
                  </p>
                </section>
              </>
            )}
          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}