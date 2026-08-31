import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, X, Loader2, ShieldCheck, ArrowRight, 
  Sparkles, Copy, CheckCircle2 
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { Helmet } from 'react-helmet-async';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Pricing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'annual'
  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [utr, setUtr] = useState('');
  const [step, setStep] = useState(1); // 1: Pay, 2: Success
  const [copiedUpi, setCopiedUpi] = useState(false);

  const PLANS = [
    { 
      name: "Starter", 
      price: "₹0", 
      period: "/forever", 
      desc: "Perfect for students & beginners launching their first portfolio.",
      features: [
        "1 Public Portfolio URL", 
        "6 Designer Templates", 
        "Basic AI Bio Generator", 
        "Standard PDF Resume Export",
        "Community Support"
      ], 
      cta: user ? "Current Free Plan" : "Start Free", 
      popular: false 
    },
    { 
      name: "Pro Developer", 
      price: billingCycle === 'monthly' ? "₹99" : "₹950", 
      period: billingCycle === 'monthly' ? "/mo" : "/yr", 
      desc: "Designed for ambitious engineers & freelancers aiming to stand out.",
      features: [
        "Everything in Starter",
        "Unlimited Portfolio Deployments", 
        "Custom Domain Mapping (SSL Included)", 
        "Priority High-Speed AI Engine", 
        "Interactive Analytics & Visitor Tracking",
        "Custom QR Code & Branding",
        "Priority 24/7 Support"
      ], 
      cta: "Upgrade to Pro", 
      popular: true 
    },
    { 
      name: "Team & Agency", 
      price: billingCycle === 'monthly' ? "₹299" : "₹2,800", 
      period: billingCycle === 'monthly' ? "/mo" : "/yr", 
      desc: "For developer agencies, bootcamps, and dev teams.",
      features: [
        "Everything in Pro Developer",
        "Up to 10 Team Portfolios", 
        "White-label / Remove Branding", 
        "Team Analytics Dashboard",
        "Export API & Webhook Access",
        "Dedicated Account Manager"
      ], 
      cta: "Get Team Plan", 
      popular: false 
    }
  ];

  const handleBuyClick = (plan) => {
    if (plan.price === "₹0") {
      if (user) navigate('/dashboard');
      else navigate('/register');
      return;
    }
    if (!user) {
      toast.info('Please sign in to proceed with upgrading.');
      navigate('/login');
      return;
    }
    setSelectedPlan(plan);
    setStep(1);
    setUtr('');
    setShowModal(true);
  };

  const copyUpiId = () => {
    navigator.clipboard.writeText('nejamulhaque@upi');
    setCopiedUpi(true);
    toast.success('UPI ID copied to clipboard!');
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleConfirmPayment = async () => {
    if (!utr.trim()) {
      toast.error('Please enter the 12-digit Transaction ID (UTR)');
      return;
    }

    setLoading(true);
    try {
      // 1. Save to Database
      const { error } = await supabase.from('subscriptions').insert({
        user_id: user.id,
        user_email: user.email,
        plan: selectedPlan.name,
        status: 'pending',
        transaction_id: utr.trim()
      });

      if (error) throw error;

      // 2. Notification to ntfy admin channel
      const notificationTitle = "New Payment Request";
      const notificationBody = `User: ${user.email}\nPlan: ${selectedPlan.name}\nUTR: ${utr}\nCycle: ${billingCycle}`;

      fetch('https://ntfy.sh/nejamul_portfolio_admin', {
        method: 'POST',
        body: notificationBody,
        headers: {
          'Title': notificationTitle,
          'Priority': 'high',
          'Content-Type': 'text/plain; charset=utf-8'
        }
      }).catch(() => {});

      // 3. Show Success State
      setStep(2);
      toast.success('Payment details submitted for verification!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to submit payment details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans flex flex-col selection:bg-indigo-500/30 selection:text-white">
      
      <Helmet>
        <title>Pricing & Plans | Portfolio Builder</title>
        <meta name="description" content="Affordable plans for developers. Start for free or upgrade to Pro Developer for custom domains, priority AI, and unlimited portfolio views." />
        <link rel="canonical" href="https://builderr-ai.vercel.app/pricing" />
      </Helmet>

      {/* Navbar */}
      <Navbar />

      {/* Hero Header */}
      <section className="text-center pt-16 sm:pt-20 pb-12 px-4 sm:px-6 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-6">
          <Sparkles size={14} /> Transparent & Flexible Plans
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-6">
          Simple pricing for <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
            every developer.
          </span>
        </h1>
        
        <p className="text-base sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10">
          Unlock your full developer potential with custom domain support, unlimited portfolios, and premium AI features. Instant activation via UPI.
        </p>

        {/* Monthly / Annual Toggle */}
        <div className="inline-flex items-center gap-3 p-1.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              billingCycle === 'monthly' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'
            }`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setBillingCycle('annual')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              billingCycle === 'annual' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'
            }`}
          >
            <span>Annual Billing</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] uppercase font-bold">
              Save 20%
            </span>
          </button>
        </div>
      </section>

      {/* Pricing Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-3 gap-8 pb-24">
        {PLANS.map((plan, index) => (
          <div 
            key={index} 
            className={`relative p-8 rounded-3xl border flex flex-col justify-between transition-all duration-300 ${
              plan.popular 
                ? 'border-indigo-500 bg-gradient-to-b from-indigo-950/40 via-[#0e0e18] to-black shadow-[0_0_40px_rgba(99,102,241,0.2)] md:-translate-y-2' 
                : 'border-white/10 bg-white/[0.02] hover:border-white/20'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                Most Popular
              </div>
            )}

            <div>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-xs text-gray-400 leading-relaxed min-h-[36px]">{plan.desc}</p>
              </div>

              <div className="flex items-baseline gap-1 mb-8 pb-6 border-b border-white/5">
                <span className="text-4xl sm:text-5xl font-black text-white">{plan.price}</span>
                <span className="text-sm font-medium text-gray-500">{plan.period}</span>
              </div>

              <ul className="space-y-3.5 mb-8">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-3 text-xs sm:text-sm text-gray-300">
                    <CheckCircle2 size={16} className="text-indigo-400 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button 
              onClick={() => handleBuyClick(plan)} 
              className={`w-full py-4 rounded-2xl font-bold text-xs sm:text-sm text-center transition-all flex items-center justify-center gap-2 ${
                plan.popular 
                  ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30' 
                  : 'bg-white/10 hover:bg-white/15 text-white border border-white/10'
              }`}
            >
              <span>{plan.cta}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        ))}
      </section>

      {/* PAYMENT MODAL */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 15 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.95, opacity: 0, y: 15 }} 
              className="bg-[#111116] border border-white/10 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative overflow-hidden"
            >
              <button 
                onClick={() => setShowModal(false)} 
                className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <X size={18}/>
              </button>
              
              {step === 1 ? (
                <>
                  <div className="mb-6">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">Upgrade Plan</span>
                    <h2 className="text-2xl font-bold text-white mt-1">Pay for {selectedPlan?.name}</h2>
                    <p className="text-xs text-gray-400 mt-1">
                      Scan the QR code with any UPI app (GPay, PhonePe, Paytm) to pay <span className="text-white font-bold">{selectedPlan?.price}</span>.
                    </p>
                  </div>
                  
                  {/* QR Code Container */}
                  <div className="bg-white p-4 rounded-2xl mb-4 flex flex-col items-center justify-center shadow-inner">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=upi://pay?pa=nejamulhaque@upi&pn=PortfolioAI&am=${selectedPlan?.price.replace(/[^0-9]/g, '')}&cu=INR`} 
                      alt="UPI QR Code" 
                      className="w-44 h-44 object-contain rounded-lg" 
                    />
                    <span className="text-[10px] text-gray-500 font-mono mt-2 font-medium">Scan to pay exact amount</span>
                  </div>

                  {/* Copy UPI Box */}
                  <div className="flex items-center justify-between p-2.5 bg-white/5 border border-white/10 rounded-xl mb-4 text-xs">
                    <span className="font-mono text-gray-300">UPI ID: <strong className="text-white">nejamulhaque@upi</strong></span>
                    <button onClick={copyUpiId} className="px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-indigo-300 font-bold flex items-center gap-1">
                      {copiedUpi ? <Check size={12}/> : <Copy size={12}/>}
                      {copiedUpi ? 'Copied' : 'Copy'}
                    </button>
                  </div>

                  {/* Transaction ID Input */}
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
                        12-Digit Transaction Reference (UTR)
                      </label>
                      <input 
                        type="text" 
                        value={utr} 
                        onChange={(e) => setUtr(e.target.value)} 
                        placeholder="e.g. 423891048291" 
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-xs font-mono focus:border-indigo-500 outline-none" 
                      />
                    </div>
                    
                    <button 
                      onClick={handleConfirmPayment} 
                      disabled={loading} 
                      className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 disabled:opacity-50 transition-all shadow-lg shadow-indigo-600/30"
                    >
                      {loading ? <Loader2 className="animate-spin" size={16}/> : <ShieldCheck size={16}/>} 
                      <span>Submit Payment for Approval</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
                    <Check className="text-emerald-400" size={32} />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Request Submitted!</h2>
                  <p className="text-xs text-gray-400 mb-6 leading-relaxed">
                    Your transaction ID has been recorded. Admin verifies payments within 1 hour. You will see the Pro badge on your profile.
                  </p>
                  <button 
                    onClick={() => { setShowModal(false); navigate('/profile'); }} 
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-colors"
                  >
                    View Profile Status
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <Footer />

    </div>
  );
}