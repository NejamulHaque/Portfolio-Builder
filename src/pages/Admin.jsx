import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { 
  CheckCircle, XCircle, Clock, RefreshCw, Shield, 
  DollarSign, Search, ArrowLeft, Check, X
} from 'lucide-react';
import { useToast } from '../components/Toast';

export default function Admin() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all'); // all, pending, approved, rejected
  const [searchQuery, setSearchQuery] = useState('');

  // Hardcoded Admin Check (Replace with your email or admin check)
  const isAdmin = user?.email === 'nejamulhaque.works@gmail.com' || user?.email === 'nejamulhaque05@gmail.com';

  useEffect(() => {
    if (!isAdmin) { 
      // navigate('/'); 
    }
    fetchRequests();
    
    // Auto-refresh every 10 seconds
    const interval = setInterval(fetchRequests, 10000);
    return () => clearInterval(interval);
  }, [user]);

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const { error } = await supabase.from('subscriptions').update({ status: newStatus }).eq('id', id);
      if (error) throw error;
      setRequests(requests.map(req => req.id === id ? { ...req, status: newStatus } : req));
      toast.success(`Subscription marked as ${newStatus}!`);
    } catch (err) {
      toast.error('Failed to update status: ' + err.message);
    }
  };

  // Filtered requests
  const filteredRequests = requests.filter(req => {
    const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
    const matchesSearch = !searchQuery || 
      (req.user_email && req.user_email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (req.transaction_id && req.transaction_id.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const pendingCount = requests.filter(r => r.status === 'pending').length;
  const approvedCount = requests.filter(r => r.status === 'approved').length;
  const totalRevenue = approvedCount * 99; // Estimated

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 sm:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2.5">
                <Shield className="text-indigo-400" /> Admin Portal
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">Manage subscription verification and revenue</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={fetchRequests} 
              className="px-3.5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-gray-300 flex items-center gap-2 transition-colors"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>
            <Link 
              to="/dashboard" 
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-bold transition-colors"
            >
              Dashboard
            </Link>
          </div>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-1">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Clock size={14} /> Pending Requests
            </div>
            <div className="text-3xl font-black text-white">{pendingCount}</div>
            <p className="text-[10px] text-gray-500">Requires manual UPI UTR verification</p>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-1">
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <CheckCircle size={14} /> Active Pro Users
            </div>
            <div className="text-3xl font-black text-white">{approvedCount}</div>
            <p className="text-[10px] text-gray-500">Total approved subscribers</p>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-1">
            <div className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <DollarSign size={14} /> Total Revenue
            </div>
            <div className="text-3xl font-black text-white">₹{totalRevenue.toLocaleString()}</div>
            <p className="text-[10px] text-gray-500">Cumulative verified earnings</p>
          </div>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/[0.02] border border-white/10 p-4 rounded-2xl">
          
          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search email or UTR..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 outline-none focus:border-indigo-500"
            />
          </div>

          {/* Status Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0">
            {['all', 'pending', 'approved', 'rejected'].map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-colors ${
                  statusFilter === status 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-white/5 hover:bg-white/10 text-gray-400'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Subscription Requests Table */}
        <div className="bg-white/[0.02] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider border-b border-white/5">
                <tr>
                  <th className="p-4 sm:p-5">User Email</th>
                  <th className="p-4 sm:p-5">Plan</th>
                  <th className="p-4 sm:p-5">Transaction ID (UTR)</th>
                  <th className="p-4 sm:p-5">Status</th>
                  <th className="p-4 sm:p-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-sans">
                {filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-white/[0.03] transition-colors">
                    <td className="p-4 sm:p-5 font-medium text-white">{req.user_email}</td>
                    <td className="p-4 sm:p-5 text-gray-300">{req.plan}</td>
                    <td className="p-4 sm:p-5 font-mono text-xs text-indigo-300 font-bold">{req.transaction_id}</td>
                    <td className="p-4 sm:p-5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase inline-flex items-center gap-1.5
                        ${req.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                          req.status === 'rejected' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 
                          'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                        {req.status === 'approved' ? <CheckCircle size={12}/> : req.status === 'rejected' ? <XCircle size={12}/> : <Clock size={12}/>}
                        <span>{req.status}</span>
                      </span>
                    </td>
                    <td className="p-4 sm:p-5 text-right">
                      {req.status === 'pending' ? (
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => updateStatus(req.id, 'approved')} 
                            className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
                            title="Approve Payment"
                          >
                            <Check size={14}/> Approve
                          </button>
                          <button 
                            onClick={() => updateStatus(req.id, 'rejected')} 
                            className="px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
                            title="Reject Payment"
                          >
                            <X size={14}/> Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-500 italic">No action needed</span>
                      )}
                    </td>
                  </tr>
                ))}

                {filteredRequests.length === 0 && (
                  <tr>
                    <td colSpan="5" className="p-12 text-center text-gray-500">
                      No subscription requests found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}