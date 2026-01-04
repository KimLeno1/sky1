
import React from 'react';
import { Flight } from '../types.ts';
import { Icons } from '../constants.tsx';
import { Button } from './Button.tsx';

interface FlightDetailsModalProps {
  flight: Flight | null;
  onClose: () => void;
  onBook: (f: Flight) => void;
}

export const FlightDetailsModal: React.FC<FlightDetailsModalProps> = ({ flight, onClose, onBook }) => {
  if (!flight) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
      <div 
        className="bg-white w-full max-w-2xl rounded-[48px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-48 bg-slate-900 overflow-hidden flex items-center justify-center">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 to-transparent z-0"></div>
          
          {/* Brand bird drawing header graphic */}
          <img 
            src="https://images.unsplash.com/photo-1550684848-86a5d8727436?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover opacity-20 brightness-0 invert relative z-10"
            alt="SkyNet Bird Graphic"
          />
          
          <button 
            onClick={onClose}
            className="absolute top-8 right-8 w-12 h-12 bg-white/20 backdrop-blur-md hover:bg-white/40 text-white rounded-2xl flex items-center justify-center transition-all z-20"
          >
            ✕
          </button>
          
          <div className="absolute bottom-8 left-10 flex items-center gap-4 z-20">
            <div className="w-16 h-16 bg-white rounded-2xl p-2 flex items-center justify-center shadow-lg">
              <img src={flight.logo} className="w-full h-full object-contain" alt={flight.airline} />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white tracking-tighter uppercase leading-none mb-1">{flight.airline}</h2>
              <p className="text-[10px] font-black text-blue-300 uppercase tracking-[0.3em]">{flight.id} • Flight Details</p>
            </div>
          </div>
        </div>

        <div className="p-10 space-y-10">
          <div className="grid grid-cols-2 gap-10">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="text-blue-600"><Icons.Plane /></div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aircraft Type</h4>
              </div>
              <p className="font-black text-slate-900 text-lg">{flight.aircraftType}</p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-slate-400">
                <Icons.Briefcase />
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Baggage Allowance</h4>
              </div>
              <p className="font-black text-slate-900 text-lg">{flight.baggageAllowance}</p>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-4">Itinerary</h4>
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <div className="flex gap-6 items-center">
                  <div className="text-center">
                    <p className="text-2xl font-black text-slate-900">{flight.departureTime}</p>
                    <p className="text-[10px] font-black text-blue-500">{flight.departureAirport}</p>
                  </div>
                  <div className="w-16 h-[2px] bg-slate-100 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-black text-slate-900">{flight.arrivalTime}</p>
                    <p className="text-[10px] font-black text-blue-500">{flight.arrivalAirport}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-black text-slate-900">{flight.duration}</p>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Time</p>
                </div>
              </div>

              {flight.stops > 0 && (
                <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100 flex items-center gap-4">
                  <div className="w-10 h-10 bg-amber-500 text-white rounded-xl flex items-center justify-center text-xs">
                    !
                  </div>
                  <div>
                    <p className="text-xs font-black text-amber-900 uppercase tracking-widest">1h 45m Layover</p>
                    <p className="text-[10px] font-bold text-amber-700 uppercase opacity-60">Connection at Chicago (ORD)</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="pt-8 border-t flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pricing</p>
              <p className="text-4xl font-black text-blue-600 tracking-tighter">${flight.price}</p>
            </div>
            <div className="flex gap-4">
              <Button variant="ghost" onClick={onClose}>Close</Button>
              <Button onClick={() => onBook(flight)} size="lg">BOOK THIS FLIGHT</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
