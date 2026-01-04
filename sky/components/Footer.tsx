
import React, { useState } from 'react';
import { Icons, APP_NAME } from '../constants.tsx';

interface FooterProps {
  onAdminTrigger?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onAdminTrigger }) => {
  const [clicks, setClicks] = useState(0);
  const [lastClick, setLastClick] = useState(0);

  const handleAdminClick = () => {
    const now = Date.now();
    // If clicks happen within 2 seconds of each other
    if (now - lastClick < 2000) {
      const newClicks = clicks + 1;
      setClicks(newClicks);
      if (newClicks >= 5) {
        onAdminTrigger?.();
        setClicks(0); // Reset after trigger
      }
    } else {
      setClicks(1); // Reset counter if too slow
    }
    setLastClick(now);
  };

  return (
    <footer className="bg-slate-950 text-white py-20 px-6 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-center md:text-left">
        <div className="md:col-span-2 space-y-6">
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="bg-blue-600 p-2 rounded-xl"><Icons.Plane /></div>
            <span className="text-3xl font-black tracking-tighter uppercase">{APP_NAME}</span>
          </div>
          <p className="text-slate-500 font-medium max-w-sm mx-auto md:mx-0">
            A premium flight booking experience designed for modern travelers. Discover the world with smarter searching and seamless logistics.
          </p>
        </div>
        <div className="space-y-6">
          <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">Platform</h4>
          <ul className="space-y-4 text-slate-500 font-bold text-sm uppercase">
            <li><a href="#" className="hover:text-white transition-colors">Flights</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Seat Maps</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Rewards</a></li>
          </ul>
        </div>
        <div className="space-y-6">
          <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">Help</h4>
          <ul className="space-y-4 text-slate-500 font-bold text-sm uppercase">
            <li><a href="#" className="hover:text-white transition-colors">Safety</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto pt-12 mt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-600 text-xs font-bold tracking-widest uppercase">
        <span>&copy; <span 
          onClick={handleAdminClick} 
          className="cursor-default select-none hover:text-blue-400 transition-colors duration-300"
          title="SkyNet System Year"
        >2025</span> SKYNET INTERNATIONAL.</span>
        <div className="flex gap-8">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Cookies</a>
        </div>
      </div>
    </footer>
  );
};
