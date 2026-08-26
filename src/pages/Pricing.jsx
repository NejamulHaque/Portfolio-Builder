import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, QrCode, Loader2, ShieldCheck } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

const PLANS = [
  { name: "Starter", price: "₹0", period: "/forever", features: ["1 Portfolio", "Basic Themes"], cta: "Start Free", popular: false },
  { name: "Pro Developer", price: "₹99", period: "/mo", features: ["Unlimited Portfolios", "Custom Domain", "AI Features", "Priority Support"], cta: "Upgrade to Pro", popular: true },
  { name: "Team", price: "₹299", period: "/mo", features: ["10 Members", "White Label", "API Access"], cta: "Contact Sales", popular: false }
];

export default function Pricing() {
  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [utr, setUtr] = useState('');
  const [step, setStep] = useState(1); // 1: Pay, 2: Success
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleBuyClick = (plan) => {
    if (plan.price === "₹0") { navigate('/register'); return; }
    if (!user) { navigate('/login'); return; }
    setSelectedPlan(plan);
    setStep(1);
    setShowModal(true);
  };

  const handleConfirmPayment = async () => {
  if (!utr.trim()) {
    alert("Please enter the Transaction ID (UTR)");
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
      transaction_id: utr
    });

    if (error) throw error;

    // 2. Send Background Notification (Fixed for ISO-8859-1 compliance)
    // We remove emojis from the Title header and keep the body simple
    const notificationTitle = "New Payment Request"; // No emojis here!
    const notificationBody = `User: ${user.email}\nPlan: ${selectedPlan.name}\nUTR: ${utr}\n\nGo to Admin Dashboard to approve.`;

    await fetch('https://ntfy.sh/nejamul_portfolio_admin', {
      method: 'POST',
      body: notificationBody,
      headers: {
        'Title': notificationTitle,
        'Priority': 'high',
        'Content-Type': 'text/plain; charset=utf-8' // Explicitly set charset
      }
    });

    // 3. Show Success State
    setStep(2);
    
  } catch (err) {
    console.error(err);
    alert("Failed to submit. Please try again.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans pb-20">
      {/* Navbar */}
      <nav className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
           <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center font-bold text-xs">PB</div>
           <span className="font-bold text-xl tracking-tight">Portfolio<span className="text-indigo-400">.ai</span></span>
        </Link>
        <div className="flex gap-4">
          {user ? <Link to="/dashboard" className="text-sm font-medium text-gray-400 hover:text-white">Dashboard</Link> : <Link to="/login" className="text-sm font-medium text-gray-400 hover:text-white">Sign In</Link>}
        </div>
      </nav>

      <section className="text-center pt-16 pb-20 px-6 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-6">Simple pricing for <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">every developer.</span></h1>
        <p className="text-xl text-gray-400">Pay via UPI. Instant activation after admin verification.</p>
      </section>

      <section className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">
        {PLANS.map((plan, index) => (
          <div key={index} className={`relative p-8 rounded-3xl border backdrop-blur-xl flex flex-col ${plan.popular ? 'border-indigo-500 bg-indigo-500/10 scale-105 z-10 shadow-[0_0_30px_rgba(99,102,241,0.15)]' : 'border-white/10 bg-white/5'}`}>
            {plan.popular && <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-indigo-600 text-white text-xs font-bold uppercase rounded-full">Most Popular</div>}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1"><span className="text-4xl font-black text-white">{plan.price}</span><span className="text-gray-500">{plan.period}</span></div>
            </div>
            <ul className="space-y-4 mb-8 flex-grow">
              {plan.features.map((f, i) => <li key={i} className="flex items-start gap-3 text-sm text-gray-300"><Check size={18} className="text-indigo-400 shrink-0 mt-0.5" />{f}</li>)}
            </ul>
            <button onClick={() => handleBuyClick(plan)} className={`w-full py-4 rounded-xl font-bold text-center transition-all ${plan.popular ? 'bg-indigo-600 hover:bg-indigo-500 text-white' : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'}`}>{plan.cta}</button>
          </div>
        ))}
      </section>

      {/* MODAL */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-[#1a1a1a] border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden">
              <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white z-10"><X size={24}/></button>
              
              {step === 1 ? (
                <>
                  <h2 className="text-2xl font-bold text-white mb-2">Upgrade to {selectedPlan?.name}</h2>
                  <p className="text-gray-400 mb-6">Scan to pay <span className="text-white font-bold">{selectedPlan?.price}</span></p>
                  
                  <div className="bg-white p-4 rounded-2xl mb-6 flex justify-center">
                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=nejamulhaque@upi&pn=PortfolioAI&am=${selectedPlan?.price.replace('₹', '')}&cu=INR`} alt="QR" className="w-48 h-48 object-contain" />
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Transaction ID (UTR)</label>
                      <input type="text" value={utr} onChange={(e) => setUtr(e.target.value)} placeholder="Enter 12-digit UTR" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none" />
                    </div>
                    <button onClick={handleConfirmPayment} disabled={loading} className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50">
                      {loading ? <Loader2 className="animate-spin" size={20}/> : <ShieldCheck size={20}/>} Confirm Payment
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="text-green-500" size={32} />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Request Submitted!</h2>
                  <p className="text-gray-400 mb-6">Your payment is being verified. You will see "Pro" status on your profile shortly.</p>
                  <button onClick={() => { setShowModal(false); navigate('/profile'); }} className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold">Check Profile Status</button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}