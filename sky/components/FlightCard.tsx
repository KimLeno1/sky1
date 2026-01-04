
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
    className={`bg-white rounded-[48px] shadow-sm border ${isBestValue ? 'border-blue-200 ring-2 ring-blue-50' : 'border-slate-100'} p-8 md:p-10 hover:shadow-2xl hover:bg-slate-50/40 hover:border-blue-300 hover:-translate-y-2 transition-all duration-500 group cursor-pointer relative overflow-hidden`}
  >
    {/* Dynamic Status Badges */}
    <div className="absolute top-0 right-14 flex gap-1 items-start">
      {flight.verifiedSchedule && (
        <div className="bg-slate-900 text-white text-[8px] font-black uppercase tracking-[0.3em] px-5 py-3 rounded-b-2xl shadow-xl z-30 transition-all group-hover:px-7 flex items-center gap-2">
          <span className="text-blue-400">★</span> Intelligence Verified
        </div>
      )}
      {isBestValue && (
        <div className="bg-blue-600 text-white text-[8px] font-black uppercase tracking-[0.3em] px-5 py-3 rounded-b-2xl shadow-xl z-20 group-hover:translate-y-1 transition-all">
          Optimized Rate
        </div>
      )}
    </div>

    <div className="flex flex-col xl:flex-row items-center justify-between gap-12 relative z-10">
      {/* Carrier Info */}
      <div className="flex items-center gap-8 min-w-[300px] w-full xl:w-auto">
        <div className="relative">
          <div className="w-24 h-24 bg-white rounded-[32px] flex items-center justify-center p-4 border border-slate-100 shadow-sm group-hover:scale-110 transition-transform duration-500">
            <img 
              src={flight.logo} 
              className="w-full h-full object-contain" 
              alt={flight.airline}
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(flight.airline)}&background=f1f5f9&color=64748b&bold=true`;
              }}
            />
          </div>
          <div className="absolute -inset-2 bg-blue-500/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
        <div>
          <h3 className="font-extrabold text-slate-900 tracking-tight text-2xl leading-none mb-2 group-hover:text-blue-600 transition-colors">{flight.airline}</h3>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{flight.id} • <span className="text-blue-500">{flight.class}</span></p>
        </div>
      </div>

      {/* Flight Path */}
      <div className="flex-1 flex items-center justify-between gap-10 w-full">
        <div className="text-center">
          <p className="text-4xl font-extrabold text-slate-900 tracking-tighter mb-1">{flight.departureTime}</p>
          <div className="flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
            <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest">{flight.departureAirport}</p>
          </div>
        </div>
        
        <div className="flex-1 flex flex-col items-center gap-4 max-w-[200px]">
          <span className="text-[9px] font-black text-blue-600/60 uppercase tracking-[0.4em] transition-all group-hover:text-blue-600 group-hover:tracking-[0.5em]">{flight.duration}</span>
          <div className="w-full h-[4px] bg-slate-100 relative rounded-full">
            <div className="absolute top-0 left-0 h-full bg-blue-500 animate-pulse w-full rounded-full opacity-20"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-600 bg-white p-1.5 rounded-full border-2 border-blue-100 shadow-lg scale-125 group-hover:rotate-[360deg] transition-all duration-1000">
              <Icons.Plane />
            </div>
          </div>
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
            {flight.stops === 0 ? 'Direct Route' : `${flight.stops} Stopover`}
          </p>
        </div>

        <div className="text-center">
          <p className="text-4xl font-extrabold text-slate-900 tracking-tighter mb-1">{flight.arrivalTime}</p>
          <div className="flex items-center justify-center gap-2">
            <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest">{flight.arrivalAirport}</p>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
          </div>
        </div>
      </div>

      {/* Pricing & Booking */}
      <div className="flex items-center gap-10 w-full xl:w-auto border-t xl:border-t-0 pt-8 xl:pt-0">
        <div className="text-right flex-1 xl:flex-none">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Itinerary Total</p>
          <p className={`text-5xl font-extrabold tracking-tighter transition-all duration-500 ${isBestValue ? 'text-blue-600 scale-105' : 'text-slate-900 group-hover:text-blue-600'}`}>
            ${flight.price}
          </p>
        </div>
        <div className="flex gap-4">
          <Button 
            onClick={(e) => {
              e.stopPropagation();
              onBook(flight);
            }} 
            size="xl" 
            className="px-14 min-w-[200px] shadow-2xl hover:scale-105 transition-all rounded-[28px]"
          >
            RESERVE
          </Button>
        </div>
      </div>
    </div>
  </div>
);
