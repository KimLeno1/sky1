
import React from 'react';
import { Icons } from '../constants.tsx';
import { Button } from './Button.tsx';

interface InsuranceModalProps {
  onClose: () => void;
  onSelect: (type: 'NONE' | 'BASIC' | 'PREMIUM', price: number) => void;
  currentType: 'NONE' | 'BASIC' | 'PREMIUM';
}

export const InsuranceModal: React.FC<InsuranceModalProps> = ({ onClose, onSelect, currentType }) => {
  const plans = [
    {
      id: 'NONE',
      name: 'No Protection',
      price: 0,
      description: 'You assume full responsibility for any travel disruptions or medical emergencies.',
      features: ['Standard baggage allowance', 'No refund on cancellation'],
      color: 'slate'
    },
    {
      id: 'BASIC',
      name: 'SkyNet Basic',
      price: 45,
      description: 'Reliable coverage for peace of mind during your domestic or regional journey.',
      features: ['Trip cancellation (up to $1,000)', 'Lost baggage ($500)', 'Emergency medical ($10k)'],
      color: 'blue'
    },
    {
      id: 'PREMIUM',
      name: 'Elite Shield',
      price: 95,
      description: 'Maximum security for global travelers. Covers everything from concierge help to medical evac.',
      features: ['Cancel for any reason (100% back)', 'Priority claim processing', 'Unlimited medical coverage'],
      color: 'emerald'
    }
  ];

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-6 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-4xl rounded-[64px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 relative flex flex-col md:flex-row h-full max-h-[85vh]">
        <div className="md:w-1/3 bg-slate-900 p-12 lg:p-16 flex flex-col justify-between text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-[100px] opacity-20 -translate-y-32 translate-x-32"></div>
          
          <div className="relative z-10">
            <div className="w-16 h-16 bg-blue-600 text-white rounded-[24px] flex items-center justify-center mb-8 shadow-xl shadow-blue-500/20">
              <Icons.Shield />
            </div>
            <h2 className="text-4xl lg:text-5xl font-black tracking-tighter uppercase leading-none mb-6">Protect Your <span className="text-blue-500">Voyage</span></h2>
            <p className="text-slate-400 font-medium leading-relaxed">Ensure a seamless experience by selecting a protection plan that matches your travel needs.</p>
          </div>

          <div className="relative z-10 pt-12">
            <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-slate-500 mb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
              Official Partner
            </div>
            <p className="text-[10px] font-black tracking-[0.3em] uppercase text-white/40">SKYNET SECURE NETWORK</p>
          </div>
        </div>

        <div className="flex-1 p-10 lg:p-16 overflow-y-auto custom-scrollbar bg-slate-50 flex flex-col gap-8">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] mb-4 text-center">Available Protection Tiers</h3>
          
          <div className="grid grid-cols-1 gap-6">
            {plans.map((plan) => (
              <div 
                key={plan.id}
                onClick={() => onSelect(plan.id as any, plan.price)}
                className={`bg-white p-8 rounded-[40px] border-2 transition-all cursor-pointer group flex flex-col md:flex-row justify-between items-center gap-8 ${
                  currentType === plan.id 
                  ? 'border-blue-600 shadow-xl shadow-blue-500/10' 
                  : 'border-slate-100 hover:border-blue-200'
                }`}
              >
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${plan.id === 'PREMIUM' ? 'bg-emerald-500' : plan.id === 'BASIC' ? 'bg-blue-500' : 'bg-slate-300'}`}></div>
                    <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight">{plan.name}</h4>
                  </div>
                  <p className="text-slate-500 text-xs font-medium leading-relaxed max-w-sm">{plan.description}</p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {plan.features.map((f, i) => (
                      <span key={i} className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-full text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="text-center md:text-right min-w-[120px]">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">One-time fee</p>
                  <p className="text-3xl font-black text-slate-900 tracking-tighter">${plan.price}</p>
                  <div className={`mt-4 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    currentType === plan.id 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-slate-100 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600'
                  }`}>
                    {currentType === plan.id ? 'SELECTED' : 'SELECT'}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-auto pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center md:text-left">
              Insurance fees are per passenger and non-refundable once selected.
            </p>
            <Button size="xl" onClick={onClose} className="w-full md:w-auto px-12">Close & Continue</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
