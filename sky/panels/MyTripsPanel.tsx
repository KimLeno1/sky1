
import React, { useState } from 'react';
import { MyTrips } from '../components/MyTrips.tsx';
import { Booking, PriceAlert, Flight } from '../types.ts';
import { Icons } from '../constants.tsx';
import { Button } from '../components/Button.tsx';

interface MyTripsPanelProps {
  bookings: Booking[];
  alerts: PriceAlert[];
  onCancelBooking: (id: string) => void;
  onRemoveAlert: (id: string) => void;
  onShare: (f: Flight) => void;
}

export const MyTripsPanel: React.FC<MyTripsPanelProps> = ({ 
  bookings, 
  alerts, 
  onCancelBooking, 
  onRemoveAlert,
  onShare
}) => {
  const [activeTab, setActiveTab] = useState<'BOOKINGS' | 'ALERTS'>('BOOKINGS');

  return (
    <div className="max-w-5xl mx-auto py-12 px-6 animate-in fade-in duration-500">
      <div className="mb-12 flex flex-col md:flex-row justify-between items-center gap-8">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">TRAVEL HUB</h2>
          <p className="text-slate-500 font-medium">Manage your active itineraries and route tracking.</p>
        </div>
        
        <div className="flex bg-white p-2 rounded-[24px] border border-slate-100 shadow-sm">
          <button 
            onClick={() => setActiveTab('BOOKINGS')}
            className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'BOOKINGS' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:text-slate-800'}`}
          >
            My Trips ({bookings.length})
          </button>
          <button 
            onClick={() => setActiveTab('ALERTS')}
            className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'ALERTS' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:text-slate-800'}`}
          >
            Price Alerts ({alerts.length})
          </button>
        </div>
      </div>

      {activeTab === 'BOOKINGS' ? (
        <MyTrips bookings={bookings} onCancelBooking={onCancelBooking} onShare={onShare} />
      ) : (
        <div className="space-y-6">
          {alerts.length === 0 ? (
            <div className="bg-white rounded-[40px] p-20 text-center border-2 border-dashed border-slate-100">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mx-auto mb-6">
                <Icons.Bell />
              </div>
              <h3 className="text-2xl font-black text-slate-300">NO ACTIVE ALERTS</h3>
              <p className="text-slate-400 mt-2">Track your dream destinations and we'll let you know when prices drop.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {alerts.map(alert => (
                <div key={alert.id} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-all relative group overflow-hidden">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h4 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">{alert.origin} &rarr; {alert.destination}</h4>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{alert.cabinClass} • Tracking since {alert.createdAt}</p>
                    </div>
                    <div className="bg-blue-50 text-blue-600 w-12 h-12 rounded-2xl flex items-center justify-center">
                      <Icons.Bell />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Target Price</p>
                      <p className="text-2xl font-black text-emerald-600 tracking-tighter">${alert.targetPrice}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Current Best</p>
                      <p className="text-2xl font-black text-slate-900 tracking-tighter">${alert.currentPrice}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-6 border-t border-slate-50">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic">
                      {alert.currentPrice <= alert.targetPrice ? '✅ Goal Reached!' : `Waiting for $${alert.currentPrice - alert.targetPrice} drop`}
                    </p>
                    <button 
                      onClick={() => onRemoveAlert(alert.id)}
                      className="text-red-500 font-black text-[10px] uppercase tracking-widest hover:text-red-700 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
