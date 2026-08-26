import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function Legal() {
  const { type } = useParams(); // 'privacy' or 'terms'
  const isPrivacy = type === 'privacy';

  return (
    <div className="min-h-screen bg-[#050505] text-gray-300 font-sans py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 mb-12 transition-colors">
          <ArrowLeft size={16} /> Back to Home
        </Link>
        
        <h1 className="text-4xl font-bold text-white mb-8">
          {isPrivacy ? 'Privacy Policy' : 'Terms of Service'}
        </h1>
        <p className="text-sm text-gray-500 mb-12">Last updated: August 27, 2024</p>

        <div className="space-y-8 prose prose-invert prose-lg max-w-none">
          {isPrivacy ? (
            <>
              <section>
                <h2 className="text-xl font-semibold text-white mb-4">1. Information We Collect</h2>
                <p>We collect information you provide directly to us, such as when you create an account (email, name) or upload a profile photo. We also automatically collect certain information about your device when you visit our site.</p>
              </section>
              <section>
                <h2 className="text-xl font-semibold text-white mb-4">2. How We Use Information</h2>
                <p>We use the information to provide, maintain, and improve our services, specifically to generate your portfolio pages and AI-assisted content.</p>
              </section>
              <section>
                <h2 className="text-xl font-semibold text-white mb-4">3. Data Security</h2>
                <p>We use Supabase and industry-standard encryption to protect your data. However, no method of transmission over the Internet is 100% secure.</p>
              </section>
            </>
          ) : (
            <>
              <section>
                <h2 className="text-xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
                <p>By accessing or using Portfolio.ai, you agree to be bound by these Terms of Service.</p>
              </section>
              <section>
                <h2 className="text-xl font-semibold text-white mb-4">2. User Content</h2>
                <p>You retain ownership of the content you upload (bio, projects, images). You grant us a license to display this content on your public portfolio page.</p>
              </section>
              <section>
                <h2 className="text-xl font-semibold text-white mb-4">3. AI Generated Content</h2>
                <p>Our AI features are provided "as is". We are not responsible for the accuracy or appropriateness of AI-generated text.</p>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}