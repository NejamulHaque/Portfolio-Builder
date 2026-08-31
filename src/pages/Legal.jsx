import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Shield, FileText } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Legal() {
  const { type } = useParams(); // 'privacy' or 'terms'
  const isPrivacy = type === 'privacy';

  return (
    <div className="min-h-screen bg-[#050505] text-gray-300 font-sans flex flex-col selection:bg-indigo-500/30">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-16 w-full">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white mb-8 bg-white/5 hover:bg-white/10 px-3 py-2 rounded-xl border border-white/10 transition-colors"
        >
          <ArrowLeft size={14} /> Back to Home
        </Link>
        
        <div className="p-8 sm:p-12 rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-xl shadow-2xl space-y-8">
          <div className="border-b border-white/10 pb-6">
            <div className="inline-flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-widest mb-2">
              {isPrivacy ? <Shield size={14} /> : <FileText size={14} />}
              <span>{isPrivacy ? 'Data Protection' : 'Legal Agreement'}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white">
              {isPrivacy ? 'Privacy Policy' : 'Terms of Service'}
            </h1>
            <p className="text-xs text-gray-500 mt-2 font-mono">Last updated: August 2026</p>
          </div>

          <div className="space-y-8 text-sm leading-relaxed text-gray-300">
            {isPrivacy ? (
              <>
                <section className="space-y-2">
                  <h2 className="text-lg font-bold text-white">1. Information We Collect</h2>
                  <p>We collect information you explicitly provide when creating an account, including your email address, full name, profile bio, work experience, project links, and avatar image. We also aggregate anonymized usage telemetry to improve performance.</p>
                </section>

                <section className="space-y-2">
                  <h2 className="text-lg font-bold text-white">2. How We Use Your Data</h2>
                  <p>Your data is used solely to generate your public portfolio website, render downloadable PDF resumes, and synthesize AI-assisted bios and project descriptions via the IRUS AI engine. We never sell your personal data to third parties.</p>
                </section>

                <section className="space-y-2">
                  <h2 className="text-lg font-bold text-white">3. Data Security & Storage</h2>
                  <p>We leverage Supabase enterprise infrastructure with row-level security (RLS) and end-to-end HTTPS encryption to ensure your developer data is safeguarded against unauthorized access.</p>
                </section>

                <section className="space-y-2">
                  <h2 className="text-lg font-bold text-white">4. Your Rights</h2>
                  <p>You maintain full control over your portfolio data. You can edit, export to JSON, or permanently delete your account and public portfolio at any time directly through your dashboard settings.</p>
                </section>
              </>
            ) : (
              <>
                <section className="space-y-2">
                  <h2 className="text-lg font-bold text-white">1. Acceptance of Terms</h2>
                  <p>By accessing or utilizing Portfolio.ai services, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use the service.</p>
                </section>

                <section className="space-y-2">
                  <h2 className="text-lg font-bold text-white">2. User Content & Ownership</h2>
                  <p>You retain 100% intellectual property ownership of all portfolios, project descriptions, resumes, and code samples you publish on the platform.</p>
                </section>

                <section className="space-y-2">
                  <h2 className="text-lg font-bold text-white">3. AI Content Assistance</h2>
                  <p>AI generation tools are provided to assist in copywriting. Users are encouraged to review AI-generated text for accuracy before publishing.</p>
                </section>

                <section className="space-y-2">
                  <h2 className="text-lg font-bold text-white">4. Pro Subscriptions & Payments</h2>
                  <p>Paid upgrades provide access to custom domain mapping, priority AI processing, and advanced templates. Payments are processed securely via UPI and verified by administrators.</p>
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