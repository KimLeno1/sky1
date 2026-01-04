
import React, { useState } from 'react';
import { Flight } from '../types.ts';
import { Icons } from '../constants.tsx';
import { Button } from './Button.tsx';

interface ShareModalProps {
  flight: Flight;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ flight, onClose }) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = `https://skynet.travel/flight/${flight.id}`;
  const shareText = `Check out this flight on SkyNet: ${flight.airline} from ${flight.departureAirport} to ${flight.arrivalAirport} for $${flight.price}!`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareViaEmail = () => {
    window.location.href = `mailto:?subject=Amazing Flight Deal on SkyNet&body=${encodeURIComponent(shareText + " Check it out here: " + shareUrl)}`;
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        className="bg-white w-full max-w-md rounded-[48px] shadow-2xl overflow-hidden p-10 space-y-8 animate-in zoom-in-95 duration-500 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 text-slate-400 hover:text-slate-900 transition-colors"
        >
          ✕
        </button>

        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <Icons.Share />
          </div>
          <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Share Trip</h3>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Spread the news about this premium flight</p>
        </div>

        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex items-center gap-6">
          <div className="w-16 h-12 bg-white rounded-xl border border-slate-100 p-2 shadow-sm flex items-center justify-center">
            <img src={flight.logo} className="w-full h-full object-contain" alt={flight.airline} />
          </div>
          <div>
            <p className="text-lg font-black text-slate-900 leading-none">{flight.departureAirport} → {flight.arrivalAirport}</p>
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1">${flight.price} • {flight.airline}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={shareViaEmail}
            className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:bg-blue-50 hover:border-blue-200 transition-all group"
          >
            <div className="text-slate-400 group-hover:text-blue-600 mb-2">
              <Icons.Mail />
            </div>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-blue-600">Email</span>
          </button>
          
          <button 
            className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:bg-[#1DA1F2]/10 hover:border-[#1DA1F2]/20 transition-all group"
          >
            <div className="text-slate-400 group-hover:text-[#1DA1F2] mb-2">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
            </div>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-[#1DA1F2]">X / Twitter</span>
          </button>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Or Copy Link</label>
          <div className="relative">
            <input 
              readOnly
              className="w-full bg-slate-50 border border-slate-100 p-4 pr-32 rounded-2xl outline-none font-bold text-slate-800 transition-all text-sm"
              value={shareUrl}
            />
            <Button 
              size="sm" 
              className="absolute right-2 top-1/2 -translate-y-1/2"
              onClick={copyToClipboard}
            >
              {copied ? 'COPIED!' : 'COPY'}
            </Button>
          </div>
        </div>

        <Button variant="ghost" onClick={onClose} className="w-full">Close</Button>
      </div>
    </div>
  );
};
