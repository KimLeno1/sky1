
import React from 'react';
import { SearchForm } from '../components/SearchForm.tsx';
import { SearchParams } from '../types.ts';
import { FEATURED_INTERNATIONAL_DESTINATIONS } from '../services/extraMockData.ts';

interface InternationalPanelProps {
  params: SearchParams;
  setParams: (p: SearchParams) => void;
  onSearch: (e: React.FormEvent) => void;
}

export const InternationalPanel: React.FC<InternationalPanelProps> = ({ params, setParams, onSearch }) => {
  return (
    <div className="animate-in fade-in slide-in-from-right-10 duration-700">
      <section className="relative h-[550px] flex items-center justify-center px-6 overflow-hidden bg-blue-950">
        <img 
          src="https://images.unsplash.com/photo-1550684848-86a5d8727436?auto=format&fit=crop&q=80&w=2000" 
          className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-screen" 
          alt="SkyNet Bird Illustration" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-transparent"></div>
        <div className="relative z-10 w-full max-w-4xl text-center space-y-6">
          <span className="text-blue-400 font-black tracking-[0.4em] uppercase text-xs">Transatlantic Journeys</span>
          <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter drop-shadow-2xl uppercase">
            CROSS THE <span className="text-blue-400">ATLANTIC</span>
          </h1>
          <p className="text-xl text-slate-200 font-medium max-w-2xl mx-auto">
            Experience the best of Europe with premium US carriers. Non-stop routes to London, Paris, and beyond.
          </p>
        </div>
      </section>

      <SearchForm params={params} setParams={setParams} onSearch={onSearch} mode="INTERNATIONAL" />
      
      <div className="max-w-6xl mx-auto py-24 px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight uppercase">FEATURED EUROPEAN CITIES</h2>
            <p className="text-slate-500 font-medium">Direct flights from major US hubs.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {FEATURED_INTERNATIONAL_DESTINATIONS.map((dest, i) => (
            <div key={i} className="group relative h-[450px] rounded-[48px] overflow-hidden shadow-2xl cursor-pointer">
              <img src={dest.img} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={dest.city} />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
              <div className="absolute bottom-10 left-10 right-10">
                <h3 className="text-4xl font-black text-white tracking-tighter mb-4 uppercase">{dest.city}</h3>
                <div className="flex justify-between items-center pt-6 border-t border-white/20">
                  <span className="text-white/60 text-[10px] font-black uppercase tracking-widest">Starts at</span>
                  <span className="text-3xl font-black text-blue-400">${dest.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
