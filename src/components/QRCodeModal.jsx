import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, Download, Share2, ExternalLink, QrCode } from 'lucide-react';
import { FaLinkedin, FaTwitter, FaWhatsapp } from 'react-icons/fa';

export default function QRCodeModal({ isOpen, onClose, url, title = 'Share Portfolio' }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}&bgcolor=ffffff&color=000000&margin=2`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(qrImageUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `portfolio-qr-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      window.open(qrImageUrl, '_blank');
    }
  };

  const encodedUrl = encodeURIComponent(url);
  const shareText = encodeURIComponent(`Check out my developer portfolio built with Portfolio Builder: ${url}`);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-[#111116] border border-white/10 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <QrCode size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{title}</h3>
              <p className="text-xs text-gray-400">Share your live portfolio anywhere</p>
            </div>
          </div>

          {/* QR Container */}
          <div className="bg-white p-4 rounded-2xl shadow-inner flex flex-col items-center justify-center mb-6">
            <img
              src={qrImageUrl}
              alt="Portfolio QR Code"
              className="w-48 h-48 sm:w-56 sm:h-56 object-contain rounded-lg"
            />
            <span className="text-[10px] text-gray-500 font-mono mt-2 font-medium">Scan with camera to view live</span>
          </div>

          {/* Link Copy Box */}
          <div className="flex items-center gap-2 p-2 bg-white/5 border border-white/10 rounded-xl mb-6">
            <input
              type="text"
              readOnly
              value={url}
              className="bg-transparent text-xs text-gray-300 px-2 flex-1 outline-none truncate font-mono"
            />
            <button
              onClick={copyToClipboard}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0"
            >
              {copied ? <Check size={14} className="text-white" /> : <Copy size={14} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>

          {/* Social Share Buttons */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <a
              href={`https://twitter.com/intent/tweet?text=${shareText}`}
              target="_blank"
              rel="noreferrer"
              className="p-3 rounded-xl bg-white/5 hover:bg-sky-500/20 hover:text-sky-400 border border-white/10 text-gray-400 transition-all flex items-center justify-center"
              title="Share on Twitter / X"
            >
              <FaTwitter size={18} />
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
              target="_blank"
              rel="noreferrer"
              className="p-3 rounded-xl bg-white/5 hover:bg-blue-600/20 hover:text-blue-400 border border-white/10 text-gray-400 transition-all flex items-center justify-center"
              title="Share on LinkedIn"
            >
              <FaLinkedin size={18} />
            </a>
            <a
              href={`https://api.whatsapp.com/send?text=${shareText}`}
              target="_blank"
              rel="noreferrer"
              className="p-3 rounded-xl bg-white/5 hover:bg-emerald-500/20 hover:text-emerald-400 border border-white/10 text-gray-400 transition-all flex items-center justify-center"
              title="Share on WhatsApp"
            >
              <FaWhatsapp size={18} />
            </a>
            <button
              onClick={handleDownload}
              className="p-3 rounded-xl bg-white/5 hover:bg-indigo-500/20 hover:text-indigo-400 border border-white/10 text-gray-400 transition-all flex items-center justify-center"
              title="Download QR Image"
            >
              <Download size={18} />
            </button>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="w-full py-3 bg-white/10 hover:bg-white/15 text-white font-bold rounded-xl text-sm transition-colors"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
