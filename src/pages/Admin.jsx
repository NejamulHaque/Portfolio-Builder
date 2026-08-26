import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Clock, RefreshCw, Shield, Users } from 'lucide-react';

export default function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hardcoded Admin Check (Replace with your email)
  const isAdmin = user?.email === 'nejamulhaque.works@gmail.com';

  useEffect(() => {
    if (!isAdmin) { navigate('/'); return; }
    fetchRequests();
    
    // Auto-refresh every 5 seconds
    const interval = setInterval(fetchRequests, 5000);
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
    } catch (err) {
      alert('Failed to update');
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-3xl font-bold flex items-center gap-3"><Shield className="text-indigo-500" /> Admin Dashboard</h1>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Auto-syncing...
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-white/5 text-gray-400 text-sm uppercase tracking-wider">
              <tr>
                <th className="p-4">User Email</th>
                <th className="p-4">Plan</th>
                <th className="p-4">Transaction ID</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 font-medium">{req.user_email}</td>
                  <td className="p-4">{req.plan}</td>
                  <td className="p-4 font-mono text-sm text-indigo-300">{req.transaction_id}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-1 w-fit
                      ${req.status === 'approved' ? 'bg-green-500/20 text-green-400' : 
                        req.status === 'rejected' ? 'bg-red-500/20 text-red-400' : 
                        'bg-yellow-500/20 text-yellow-400'}`}>
                      {req.status === 'approved' ? <CheckCircle size={12}/> : req.status === 'rejected' ? <XCircle size={12}/> : <Clock size={12}/>}
                      {req.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {req.status === 'pending' && (
                      <div className="flex justify-end gap-2">
                        <button onClick={() => updateStatus(req.id, 'approved')} className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30"><CheckCircle size={18}/></button>
                        <button onClick={() => updateStatus(req.id, 'rejected')} className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"><XCircle size={18}/></button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {requests.length === 0 && <tr><td colSpan="5" className="p-8 text-center text-gray-500">No requests found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}