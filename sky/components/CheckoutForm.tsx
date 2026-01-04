
import React, { useState, useEffect } from 'react';
import { Flight, PassengerDetails } from '../types.ts';
import { Button } from './Button.tsx';

interface CheckoutFormProps {
  flight: Flight;
  seats: string[];
  passengersCount: number;
  bookingType: 'QUICK' | 'NORMAL';
  isAuthenticated: boolean;
  onComplete: (details: PassengerDetails[], bookingUserId?: string) => void;
  onBack: () => void;
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({ 
  flight, 
  seats, 
  passengersCount, 
  bookingType,
  isAuthenticated,
  onComplete, 
  onBack 
}) => {
  const [bookingFor, setBookingFor] = useState<'SELF' | 'OTHER'>('SELF');
  const [bookingUserId, setBookingUserId] = useState('');
  const [details, setDetails] = useState<PassengerDetails[]>(
    Array.from({ length: passengersCount }).map(() => ({
      firstName: '',
      lastName: '',
      email: '',
      passportNumber: ''
    }))
  );

  // Auto-fill first traveler if Normal Booking + SELF
  useEffect(() => {
    if (bookingType === 'NORMAL' && bookingFor === 'SELF' && isAuthenticated) {
      const next = [...details];
      next[0] = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@skynet.com',
        passportNumber: 'SN-0098231'
      };
      setDetails(next);
      setBookingUserId('SN-7721-JD'); // Mock user's own ID
    }
  }, [bookingType, bookingFor, isAuthenticated]);

  const updatePassenger = (idx: number, field: keyof PassengerDetails, val: string) => {
    const next = [...details];
    next[idx] = { ...next[idx], [field]: val };
    setDetails(next);
  };

  const handleConfirmPay = () => {
    onComplete(details, bookingUserId);
  };

  const isFormValid = details.every(p => p.firstName && p.lastName && p.email && p.passportNumber) && 
                      (bookingType === 'QUICK' ? bookingUserId.length > 0 : true) &&
                      (bookingFor === 'OTHER' ? bookingUserId.length > 0 : true);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-8 duration-500 relative">
      <div className="bg-white p-12 rounded-[48px] shadow-2xl border border-slate-100 space-y-10">
        <div className="border-b pb-8 flex flex-col md:flex-row justify-between items-start gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${bookingType === 'QUICK' ? 'bg-amber-100 text-amber-600 border border-amber-200' : 'bg-blue-100 text-blue-600 border border-blue-200'}`}>
                {bookingType} BOOKING
              </span>
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Traveler Details</h2>
            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-1">
              Step 2 of 3 • {flight.departureAirport} to {flight.arrivalAirport}
            </p>
          </div>
          <div className="w-16 h-16 p-2 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center justify-center">
            <img src={flight.logo} alt={flight.airline} className="w-full h-full object-contain" />
          </div>
        </div>

        {/* Booking Logic Section */}
        <div className="bg-slate-50 p-8 rounded-[32px] border border-slate-100 space-y-8">
          {bookingType === 'NORMAL' && (
            <div className="flex gap-4">
              <button 
                onClick={() => setBookingFor('SELF')}
                className={`flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest border transition-all ${bookingFor === 'SELF' ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-200' : 'bg-white border-slate-200 text-slate-400'}`}
              >
                Booking for Myself
              </button>
              <button 
                onClick={() => setBookingFor('OTHER')}
                className={`flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest border transition-all ${bookingFor === 'OTHER' ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-200' : 'bg-white border-slate-200 text-slate-400'}`}
              >
                Booking for Others
              </button>
            </div>
          )}

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
              {bookingFor === 'SELF' && bookingType === 'NORMAL' ? 'Your Personal User ID' : 'Target User ID (for tracking/bonuses)'}
            </label>
            <input 
              className={`w-full bg-white border border-slate-100 p-5 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-800 transition-all ${bookingFor === 'SELF' && bookingType === 'NORMAL' ? 'opacity-50 cursor-not-allowed' : ''}`}
              placeholder="e.g. SN-8821-XP"
              value={bookingUserId}
              disabled={bookingFor === 'SELF' && bookingType === 'NORMAL'}
              onChange={e => setBookingUserId(e.target.value)}
            />
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-1">
              {bookingType === 'QUICK' ? 'Required for guest tracking and one-time offers.' : 'Used to sync booking with the traveler\'s rewards account.'}
            </p>
          </div>
        </div>

        <div className="space-y-12">
          {details.map((p, i) => (
            <div key={i} className="space-y-6">
              <div className="flex items-center gap-4">
                <span className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-black text-sm">{i + 1}</span>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">Traveler {i + 1} <span className="text-slate-300 ml-4">Seat {seats[i]}</span></h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">First Name</label>
                  <input 
                    className="w-full bg-slate-50 border border-slate-100 p-5 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-800 transition-all"
                    placeholder="E.g. John"
                    value={p.firstName}
                    onChange={e => updatePassenger(i, 'firstName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Last Name</label>
                  <input 
                    className="w-full bg-slate-50 border border-slate-100 p-5 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-800 transition-all"
                    placeholder="E.g. Doe"
                    value={p.lastName}
                    onChange={e => updatePassenger(i, 'lastName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Email</label>
                  <input 
                    type="email"
                    className="w-full bg-slate-50 border border-slate-100 p-5 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-800 transition-all"
                    placeholder="john@example.com"
                    value={p.email}
                    onChange={e => updatePassenger(i, 'email', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Passport No.</label>
                  <input 
                    className="w-full bg-slate-50 border border-slate-100 p-5 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-800 transition-all"
                    placeholder="A12345678"
                    value={p.passportNumber}
                    onChange={e => updatePassenger(i, 'passportNumber', e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-10 border-t flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Trip Subtotal</p>
            <p className="text-4xl font-black text-blue-600 tracking-tighter">${flight.price}</p>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <Button variant="ghost" onClick={onBack}>Back</Button>
            <Button 
              disabled={!isFormValid}
              onClick={handleConfirmPay}
              size="xl"
              className="flex-1 md:flex-none shadow-2xl"
            >
              PROCEED TO PAYMENT
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
