
import React, { useState, useMemo } from 'react';
import { AIRPORTS, Icons } from '../constants.tsx';
import { Button } from '../components/Button.tsx';
import { SearchParams, PassengerDetails } from '../types.ts';

// Added BundleBookingPanelProps interface to fix "Cannot find name 'BundleBookingPanelProps'" error.
interface BundleBookingPanelProps {
  onComplete: (data: { params: SearchParams; passengerDetails: PassengerDetails[] }) => void;
  onCancel: () => void;
}

export const BundleBookingPanel: React.FC<BundleBookingPanelProps> = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState(1);
  // Fix: Added missing tripType property to satisfy SearchParams interface
  const [params, setParams] = useState<SearchParams>({
    origin: 'SFO',
    destination: 'JFK',
    passengers: 1,
    cabinClass: 'Economy',
    date: new Date().toISOString().split('T')[0],
    tripType: 'ONE_WAY'
  });

  const [passengerDetails, setPassengerDetails] = useState<PassengerDetails[]>([{
    firstName: '',
    lastName: '',
    email: '',
    passportNumber: ''
  }]);

  const americanAirports = useMemo(() => AIRPORTS.filter(a => a.region === 'America'), []);

  const handleNext = () => {
    if (step < 2) setStep(step + 1);
    else onComplete({ params, passengerDetails });
  };

  const updatePassenger = (idx: number, field: keyof PassengerDetails, val: string) => {
    const next = [...passengerDetails];
    next[idx] = { ...next[idx], [field]: val };
    setPassengerDetails(next);
  };

  const isFormValid = step === 1 
    ? params.origin && params.destination && params.date
    : passengerDetails.every(p => p.firstName && p.lastName && p.email);

  return (
    <div className="min-h-screen bg-slate-50 py-20 px-6 animate-in fade-in slide-in-from-bottom-10 duration-700">
      <div className="max-w-4xl mx-auto">
        <div className="bg-slate-900 rounded-[56px] overflow-hidden shadow-2xl border border-white/5 relative">
          {/* Discount Badge */}
          <div className="absolute top-12 right-12 bg-blue-600 text-white px-8 py-3 rounded-2xl shadow-xl shadow-blue-500/30 z-20">
            <p className="text-[10px] font-black uppercase tracking-[0.3em]">Exclusive Bundle</p>
            <p className="text-3xl font-black tracking-tighter">25% OFF</p>
          </div>

          <div className="p-16 lg:p-24 space-y-12">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 p-2 rounded-xl text-white">
                  <Icons.Plane />
                </div>
                <h1 className="text-5xl font-black text-white tracking-tighter uppercase leading-none">THE SKYNET BUNDLE</h1>
              </div>
              <p className="text-slate-400 font-medium text-lg max-w-lg">Flight + Luxury Hotel. All-inclusive, premium convenience.</p>
            </div>

            {/* Stepper */}
            <div className="flex items-center gap-8">
              {[1, 2].map(s => (
                <div key={s} className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm transition-all ${step >= s ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-800 text-slate-500 border border-slate-700'}`}>
                    {s}
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${step >= s ? 'text-white' : 'text-slate-600'}`}>
                    {s === 1 ? 'Trip Selection' : 'Traveler Info'}
                  </span>
                  {s === 1 && <div className="w-12 h-[2px] bg-slate-800"></div>}
                </div>
              ))}
            </div>

            {step === 1 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-500">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Depart From (USA)</label>
                  <select 
                    className="w-full bg-slate-800 border border-slate-700 text-white p-5 rounded-3xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold appearance-none"
                    value={params.origin}
                    onChange={e => setParams({...params, origin: e.target.value})}
                  >
                    {americanAirports.map(a => <option key={a.code} value={a.code}>{a.city} ({a.code})</option>)}
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Destination (USA)</label>
                  <select 
                    className="w-full bg-slate-800 border border-slate-700 text-white p-5 rounded-3xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold appearance-none"
                    value={params.destination}
                    onChange={e => setParams({...params, destination: e.target.value})}
                  >
                    {americanAirports.map(a => (
                      <option key={a.code} value={a.code} disabled={a.code === params.origin}>
                        {a.city} ({a.code})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Departure Date</label>
                  <input 
                    type="date"
                    className="w-full bg-slate-800 border border-slate-700 text-white p-5 rounded-3xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold"
                    value={params.date}
                    onChange={e => setParams({...params, date: e.target.value})}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Cabin Class</label>
                  <select 
                    className="w-full bg-slate-800 border border-slate-700 text-white p-5 rounded-3xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold appearance-none"
                    value={params.cabinClass}
                    onChange={e => setParams({...params, cabinClass: e.target.value as any})}
                  >
                    <option value="Economy">Economy</option>
                    <option value="Business">Business</option>
                    <option value="First">First</option>
                  </select>
                </div>
              </div>
            ) : (
              <div className="space-y-8 animate-in fade-in duration-500">
                {passengerDetails.map((p, i) => (
                  <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">First Name</label>
                      <input 
                        className="w-full bg-slate-800 border border-slate-700 text-white p-5 rounded-3xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold"
                        placeholder="John"
                        value={p.firstName}
                        onChange={e => updatePassenger(i, 'firstName', e.target.value)}
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Last Name</label>
                      <input 
                        className="w-full bg-slate-800 border border-slate-700 text-white p-5 rounded-3xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold"
                        placeholder="Doe"
                        value={p.lastName}
                        onChange={e => updatePassenger(i, 'lastName', e.target.value)}
                      />
                    </div>
                    <div className="md:col-span-2 space-y-3">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Email Address</label>
                      <input 
                        type="email"
                        className="w-full bg-slate-800 border border-slate-700 text-white p-5 rounded-3xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold"
                        placeholder="john@example.com"
                        value={p.email}
                        onChange={e => updatePassenger(i, 'email', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
              <button 
                onClick={step === 1 ? onCancel : () => setStep(1)}
                className="text-slate-500 font-black text-[10px] uppercase tracking-widest hover:text-white transition-colors"
              >
                {step === 1 ? '← ABANDON BUNDLE' : '← BACK TO SELECTION'}
              </button>
              <Button 
                size="xl" 
                disabled={!isFormValid}
                onClick={handleNext}
                className="px-20 py-6 bg-white text-slate-950 hover:bg-slate-100 hover:scale-105 active:scale-95 transition-all shadow-2xl"
              >
                {step === 1 ? 'PROCEED TO DETAILS' : 'CONFIRM BUNDLE BOOKING'}
              </Button>
            </div>
          </div>

          {/* Brand bird drawing background overlay */}
          <div className="absolute left-0 bottom-0 w-64 h-64 opacity-5 pointer-events-none p-12 overflow-hidden flex items-center justify-center -translate-x-12 translate-y-12">
            <img 
              src="https://images.unsplash.com/photo-1550684848-86a5d8727436?auto=format&fit=crop&q=80&w=2000" 
              className="w-full h-full object-contain brightness-0 invert"
              alt="SkyNet Bird Graphic"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
