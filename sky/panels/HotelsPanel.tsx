
import React, { useState, useMemo, useEffect } from 'react';
import { AIRPORTS, Icons } from '../constants.tsx';
import { Button } from '../components/Button.tsx';
import { fetchRealHotels } from '../services/geminiService.ts';
import { Hotel, AppView } from '../types.ts';

interface HotelsPanelProps {
  setView: (view: AppView) => void;
}

export const HotelsPanel: React.FC<HotelsPanelProps> = ({ setView }) => {
  const domesticCities = useMemo(() => 
    Array.from(new Set(AIRPORTS.filter(a => a.region === 'America').map(a => a.city))).sort(),
  []);

  const [selectedCity, setSelectedCity] = useState(domesticCities[0]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadHotels = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchRealHotels(selectedCity);
        setHotels(data);
      } catch (err) {
        setError("Unable to load real hotels at this time. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    loadHotels();
  }, [selectedCity]);

  return (
    <div className="max-w-7xl mx-auto py-20 px-6 animate-in fade-in duration-700">
      <div className="mb-16 space-y-4">
        <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase">PREMIUM STAYS</h1>
        <p className="text-slate-500 font-medium text-lg">Curated accommodations for every domestic destination.</p>
        
        <div className="flex flex-wrap gap-3 pt-6">
          {domesticCities.map(city => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              disabled={isLoading}
              className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                selectedCity === city 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 scale-105' 
                : 'bg-white text-slate-400 hover:bg-slate-50 border border-slate-100'
              } disabled:opacity-50`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white rounded-[32px] border border-slate-100 overflow-hidden animate-pulse">
              <div className="h-48 bg-slate-100"></div>
              <div className="p-8 space-y-4">
                <div className="h-6 bg-slate-100 rounded w-3/4"></div>
                <div className="h-4 bg-slate-100 rounded w-full"></div>
                <div className="h-4 bg-slate-100 rounded w-5/6"></div>
                <div className="pt-6 border-t border-slate-50 flex justify-between">
                  <div className="h-10 bg-slate-100 rounded w-16"></div>
                  <div className="h-10 bg-slate-100 rounded w-24"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-20 bg-white rounded-[40px] border-2 border-dashed border-slate-100">
          <p className="text-xl font-black text-slate-300 uppercase">{error}</p>
          <Button onClick={() => setSelectedCity(selectedCity)} variant="outline" className="mt-6">RETRY SEARCH</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
          {hotels.map((hotel) => (
            <div key={hotel.id} className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-slate-100 hover:shadow-2xl transition-all group flex flex-col h-full">
              <div className="relative h-48 overflow-hidden">
                <img src={hotel.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={hotel.name} />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-xl shadow-sm">
                  <div className="flex gap-0.5 text-amber-500">
                    {Array.from({ length: hotel.stars }).map((_, i) => <Icons.Star key={i} />)}
                  </div>
                </div>
              </div>
              
              <div className="p-8 flex flex-col flex-1 space-y-4">
                <div className="flex-1">
                  <h3 className="text-xl font-black text-slate-900 leading-tight mb-2 uppercase tracking-tight">{hotel.name}</h3>
                  <p className="text-slate-400 text-xs font-medium leading-relaxed line-clamp-3">{hotel.description}</p>
                </div>
                
                <div className="pt-6 border-t border-slate-50 flex justify-between items-end">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Typical Rate</p>
                    <p className="text-3xl font-black text-blue-600 tracking-tighter">${hotel.pricePerNight}</p>
                  </div>
                  <Button size="sm" variant="outline" className="h-10">BOOK ROOM</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-24 p-12 bg-slate-900 rounded-[48px] overflow-hidden relative min-h-[300px] flex items-center">
        {/* Stylized Bird Drawing Background */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-full opacity-10 pointer-events-none p-12 overflow-hidden flex items-center justify-center">
          <img 
            src="https://images.unsplash.com/photo-1550684848-86a5d8727436?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-contain brightness-0 invert"
            alt="SkyNet Bird Graphic"
          />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12 w-full">
          <div className="space-y-4 text-center md:text-left max-w-xl">
            <h2 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">BUNDLE & SAVE UP TO 25%</h2>
            <p className="text-slate-400 font-medium text-lg leading-relaxed">Combine your premium stay with a SkyNet flight for exclusive member-only rates and priority boarding.</p>
          </div>
          <Button 
            size="xl" 
            onClick={() => setView('BUNDLE_BOOKING')}
            className="bg-emerald-500 text-white hover:bg-emerald-600 hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-emerald-500/20"
          >
            BOOK NOW
          </Button>
        </div>
      </div>
    </div>
  );
};
