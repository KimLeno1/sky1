
import React from 'react';
import { Icons } from '../constants.tsx';
import { Button } from '../components/Button.tsx';

interface BookingChoicePanelProps {
  isAuthenticated: boolean;
  onSelect: (type: 'QUICK' | 'NORMAL') => void;
  onCancel: () => void;
}

export const BookingChoicePanel: React.FC<BookingChoicePanelProps> = ({ isAuthenticated, onSelect, onCancel }) => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6 animate-in fade-in zoom-in-95 duration-500">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Quick Booking Card */}
        <div className="bg-white rounded-[48px] p-12 shadow-2xl border border-slate-100 flex flex-col items-center text-center space-y-8 hover:scale-[1.02] transition-transform cursor-pointer group" onClick={() => onSelect('QUICK')}>
          <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-[32px] flex items-center justify-center text-4xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-500">
            ⚡
          </div>
          <div className="space-y-3">
            <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Quick Booking</h3>
            <p className="text-slate-400 font-medium text-sm leading-relaxed">Book immediately without an account. Just provide your User ID to track rewards and offers.</p>
          </div>
          <Button size="lg" variant="outline" className="w-full">Select Quick Flow</Button>
        </div>

        {/* Normal Booking Card */}
        <div className="bg-slate-900 rounded-[48px] p-12 shadow-2xl border border-white/5 flex flex-col items-center text-center space-y-8 hover:scale-[1.02] transition-transform cursor-pointer group" onClick={() => onSelect('NORMAL')}>
          <div className="w-24 h-24 bg-white/5 text-blue-400 rounded-[32px] flex items-center justify-center text-4xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-500">
            {isAuthenticated ? '🛡️' : '🔑'}
          </div>
          <div className="space-y-3">
            <h3 className="text-3xl font-black text-white tracking-tighter uppercase">Normal Booking</h3>
            <p className="text-slate-400 font-medium text-sm leading-relaxed">
              {isAuthenticated 
                ? 'Book for yourself or others using your secure profile and saved preferences.' 
                : 'Sign in to access your saved travelers, payment methods, and exclusive member discounts.'}
            </p>
          </div>
          <Button size="lg" className="w-full bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/20">
            {isAuthenticated ? 'Proceed as Member' : 'Sign In to Book'}
          </Button>
        </div>

        <div className="md:col-span-2 text-center pt-8">
          <button onClick={onCancel} className="text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-slate-900 transition-colors">
            ← Cancel and Return to Results
          </button>
        </div>
      </div>
    </div>
  );
};
