
import React from 'react';
import { Flight } from '../types.ts';
import { Icons } from '../constants.tsx';
import { Button } from './Button.tsx';

interface FlightCardProps {
  flight: Flight & { verifiedSchedule?: boolean };
  onBook: (f: Flight) => void;
  onShowDetails: (f: Flight) => void;
  onShare: (f: Flight) => void;
  isBestValue?: boolean;
  isLoggedIn?: boolean;
}

export const FlightCard: React.FC<FlightCardProps> = ({ 
  flight, 
  onBook, 
  onShowDetails, 
  onShare, 
  isBestValue, 
  isLoggedIn = false 
}) => (
  <div 
    onClick={() => onShowDetails(flight)}
    className={`bg-white rounded-[32px] md:rounded-[48px] shadow-sm border ${isBestValue ? 'border-blue-200 ring-2 ring-blue-50' : 'border-slate-100'} p-6 md:p-10 hover:shadow-2xl hover:bg-slate-50/40 hover:border-blue-300 transition-all duration-500 group cursor-pointer relative overflow-hidden`}
  >
    {/* Dynamic Status Badges - Repositioned for mobile */}
    <div className="absolute top-0 right-4 md:right-14 flex gap-1 items-start">
      {flight.verifiedSchedule && (
        <div className="bg-slate-900 text-white text-[7px] md:text-[8px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] px-3 md:px-5 py-2 md:py-3 rounded-b-xl md:rounded-b-2xl shadow-xl z-30 transition-all flex items-center gap-1 md:gap-2">
          <span className="text-blue-400">★</span> Verified
        </div>
      )}
      {isBestValue && (
        <div className="bg-blue-600 text-white text-[7px] md:text-[8px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] px-3 md:px-5 py-2 md:py-3 rounded-b-xl md:rounded-b-2xl shadow-xl z-20 transition-all">
          Optimized
        </div>
      )}
    </div>

    <div className="flex flex-col lg:flex-row items-center justify-between gap-6 md:gap-12 relative z-10">
      {/* Carrier Info */}
      <div className="flex items-center gap-4 md:gap-8 w-full lg:w-auto">
        <div className="relative flex-shrink-0">
          <div className="w-16 h-16 md:w-24 md:h-24 bg-white rounded-[24px] md:rounded-[32px] flex items-center justify-center p-3 md:p-4 border border-slate-100 shadow-sm transition-transform duration-500 group-hover:scale-105">
            <img 
              src={flight.logo} 
              className="w-full h-full object-contain" 
              alt={flight.airline}
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(flight.airline)}&background=f1f5f9&color=64748b&bold=true`;
              }}
            />
          </div>
        </div>
        <div>
          <h3 className="font-extrabold text-slate-900 tracking-tight text-xl md:text-2xl leading-none mb-1 md:mb-2 group-hover:text-blue-600 transition-colors truncate max-w-[200px] md:max-w-none">{flight.airline}</h3>
          <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] md:tracking-[0.3em]">{flight.id} • <span className="text-blue-500">{flight.class}</span></p>
        </div>
      </div>

      {/* Flight Path */}
      <div className="flex-1 flex items-center justify-between gap-4 md:gap-10 w-full px-2 md:px-0">
        <div className="text-left md:text-center">
          <p className="text-2xl md:text-4xl font-extrabold text-slate-900 tracking-tighter mb-1">{flight.departureTime}</p>
          <div className="flex items-center md:justify-center gap-1.5 md:gap-2">
            <span className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-slate-300"></span>
            <p className="text-[10px] md:text-[11px] font-black text-slate-500 uppercase tracking-widest">{flight.departureAirport}</p>
          </div>
        </div>
        
        <div className="flex-1 flex flex-col items-center gap-2 md:gap-4 max-w-[150px] md:max-w-[200px]">
          <span className="text-[8px] md:text-[9px] font-black text-blue-600/60 uppercase tracking-[0.3em] md:tracking-[0.4em]">{flight.duration}</span>
          <div className="w-full h-[2px] md:h-[4px] bg-slate-100 relative rounded-full">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-600 bg-white p-1 rounded-full border border-blue-100 shadow-md transition-all duration-1000 group-hover:rotate-[360deg]">
              <Icons.Plane />
            </div>
          </div>
          <p className="text-[8px] md:text-[9px] text-slate-400 font-bold uppercase tracking-widest">
            {flight.stops === 0 ? 'Direct' : `${flight.stops} Stop`}
          </p>
        </div>

        <div className="text-right md:text-center">
          <p className="text-2xl md:text-4xl font-extrabold text-slate-900 tracking-tighter mb-1">{flight.arrivalTime}</p>
          <div className="flex items-center justify-end md:justify-center gap-1.5 md:gap-2">
            <p className="text-[10px] md:text-[11px] font-black text-slate-500 uppercase tracking-widest">{flight.arrivalAirport}</p>
            <span className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-slate-300"></span>
          </div>
        </div>
      </div>

      {/* Pricing & Booking */}
      <div className="flex items-center gap-4 md:gap-10 w-full lg:w-auto border-t lg:border-t-0 pt-6 lg:pt-0">
        <div className="text-left lg:text-right flex-1 lg:flex-none">
          <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Total</p>
          <p className={`text-3xl md:text-5xl font-extrabold tracking-tighter transition-all duration-500 ${isBestValue ? 'text-blue-600' : 'text-slate-900'}`}>
            ${flight.price}
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={(e) => {
              e.stopPropagation();
              onBook(flight);
            }} 
            size="lg" 
            className="px-8 md:px-14 min-w-[120px] md:min-w-[200px] rounded-2xl md:rounded-[28px]"
          >
            BOOK
          </Button>
        </div>
      </div>
    </div>
  </div>
);
