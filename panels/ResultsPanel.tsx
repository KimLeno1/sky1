
import React, { useMemo, useState, useEffect } from 'react';
import { SearchForm } from '../components/SearchForm.tsx';
import { FlightCard } from '../components/FlightCard.tsx';
import { FlightDetailsModal } from '../components/FlightDetailsModal.tsx';
import { ShareModal } from '../components/ShareModal.tsx';
import { Flight, SearchParams, GroundingChunk, PriceAlert } from '../types.ts';
import { AIRPORTS, Icons } from '../constants.tsx';
import { Button } from '../components/Button.tsx';

interface ResultsPanelProps {
  params: SearchParams;
  setParams: (p: SearchParams) => void;
  onSearch: (e: React.FormEvent) => void;
  results: Flight[];
  sources?: GroundingChunk[];
  isSearching: boolean;
  onBook: (f: Flight) => void;
  onAddAlert: (alert: Omit<PriceAlert, 'id' | 'createdAt'>) => void;
  isAuthenticated: boolean;
  currentLegIndex: number;
  totalLegs: number;
  selectedFlights: Flight[];
}

export const ResultsPanel: React.FC<ResultsPanelProps> = ({ 
  params, 
  setParams, 
  onSearch, 
  results, 
  sources = [],
  isSearching, 
  onBook,
  onAddAlert,
  isAuthenticated,
  currentLegIndex,
  totalLegs,
  selectedFlights
}) => {
  const [detailFlight, setDetailFlight] = useState<Flight | null>(null);
  const [shareFlight, setShareFlight] = useState<Flight | null>(null);
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(10000);

  const destAirport = useMemo(() => AIRPORTS.find(a => a.code === params.destination), [params.destination]);
  const mode = destAirport?.region === 'Europe' ? 'INTERNATIONAL' : 'DOMESTIC';

  const { absMin, absMax } = useMemo(() => {
    if (results.length === 0) return { absMin: 0, absMax: 10000 };
    const prices = results.map(r => r.price);
    return { 
      absMin: Math.floor(Math.min(...prices)), 
      absMax: Math.ceil(Math.max(...prices)) 
    };
  }, [results]);

  useEffect(() => {
    setMinPrice(absMin);
    setMaxPrice(absMax);
  }, [absMin, absMax]);

  const filteredResults = useMemo(() => {
    return results.filter(f => f.price >= minPrice && f.price <= maxPrice);
  }, [results, minPrice, maxPrice]);

  const cheapestPrice = useMemo(() => {
    if (filteredResults.length === 0) return Infinity;
    return Math.min(...filteredResults.map(f => f.price));
  }, [filteredResults]);

  const handleSetAlert = () => {
    onAddAlert({
      origin: params.origin,
      destination: params.destination,
      targetPrice: Math.floor(cheapestPrice * 0.9),
      currentPrice: cheapestPrice,
      cabinClass: params.cabinClass
    });
    setShowAlertDialog(false);
  };

  const currentLegLabel = useMemo(() => {
    if (params.tripType === 'ONE_WAY') return 'Select Flight';
    if (params.tripType === 'ROUND_TRIP') return currentLegIndex === 0 ? 'Select Outbound' : 'Select Return';
    return `Select Flight: Leg ${currentLegIndex + 1} of ${totalLegs}`;
  }, [params.tripType, currentLegIndex, totalLegs]);

  return (
    <div className="max-w-5xl mx-auto py-20 px-6 space-y-12 animate-in slide-in-from-bottom-4 duration-500">
      <SearchForm params={params} setParams={setParams} onSearch={onSearch} mode={mode} />
      
      {isSearching ? (
        <div className="space-y-8 animate-pulse pt-12">
          <div className="h-10 bg-slate-100 w-64 rounded-xl"></div>
          {[1, 2, 3, 4].map(i => <div key={i} className="h-40 bg-white rounded-[32px] border border-slate-100"></div>)}
        </div>
      ) : results.length > 0 ? (
        <div className="space-y-8">
          
          {/* Multi-city / Round-trip Progress Header */}
          {totalLegs > 1 && (
            <div className="bg-slate-900 rounded-[32px] p-8 text-white shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-[100px] opacity-20 -translate-y-1/2 translate-x-1/2"></div>
               <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                 <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-400 mb-2">Step {currentLegIndex + 1} of {totalLegs}</p>
                    <h2 className="text-3xl font-black tracking-tighter uppercase">{currentLegLabel}</h2>
                 </div>
                 <div className="flex gap-2">
                    {selectedFlights.map((f, i) => (
                      <div key={i} className="bg-white/10 px-4 py-2 rounded-xl border border-white/5 backdrop-blur-md flex items-center gap-3 animate-in zoom-in-50">
                        <img src={f.logo} className="w-5 h-5 object-contain filter brightness-0 invert" alt={f.airline} />
                        <span className="text-[10px] font-black tracking-widest uppercase">{f.departureAirport}→{f.arrivalAirport}</span>
                      </div>
                    ))}
                 </div>
               </div>
            </div>
          )}

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-slate-100 pb-8 gap-6">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Available Fares</h2>
                <Button 
                  variant="outline" 
                  size="md" 
                  onClick={() => setShowAlertDialog(true)}
                  className="flex items-center gap-2 border-blue-100 bg-blue-50/30 text-blue-600 hover:bg-blue-600 hover:text-white"
                >
                  <Icons.Bell /> TRACK PRICES
                </Button>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm w-full md:w-auto min-w-[320px]">
              <div className="flex items-center gap-2 mb-4">
                <Icons.Filter />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Price Filter</span>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                    <span className="text-slate-400">Min: <span className="text-blue-600">${minPrice}</span></span>
                    <span className="text-slate-400">Max: <span className="text-blue-600">${maxPrice}</span></span>
                  </div>
                  <div className="relative h-6 flex items-center">
                    <input 
                      type="range" min={absMin} max={absMax} value={minPrice}
                      onChange={(e) => setMinPrice(Math.min(Number(e.target.value), maxPrice))}
                      className="absolute w-full h-1 bg-slate-100 rounded-full appearance-none cursor-pointer accent-blue-600 z-10"
                    />
                    <input 
                      type="range" min={absMin} max={absMax} value={maxPrice}
                      onChange={(e) => setMaxPrice(Math.max(Number(e.target.value), minPrice))}
                      className="absolute w-full h-1 bg-transparent rounded-full appearance-none cursor-pointer accent-blue-600 z-20 pointer-events-auto"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {filteredResults.map(f => (
              <FlightCard 
                key={f.id} 
                flight={f} 
                onBook={onBook} 
                onShare={(flight) => setShareFlight(flight)}
                onShowDetails={(flight) => setDetailFlight(flight)}
                isBestValue={f.price === cheapestPrice}
                isLoggedIn={isAuthenticated}
              />
            ))}
          </div>

          {/* Sources Grounding Display */}
          {sources.length > 0 && (
            <div className="mt-16 pt-12 border-t border-slate-100 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Intelligence Verification Sources</h3>
              </div>
              <div className="flex flex-wrap gap-4">
                {sources.map((source, idx) => source.web && (
                  <a 
                    key={idx} 
                    href={source.web.uri} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-white px-5 py-3 rounded-2xl border border-slate-100 shadow-sm text-[9px] font-black text-slate-500 uppercase tracking-widest hover:border-blue-400 hover:text-blue-600 transition-all flex items-center gap-2"
                  >
                    <span className="w-1 h-1 rounded-full bg-slate-300 group-hover:bg-blue-600"></span>
                    {source.web.title || "Search Result Source"}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-40 bg-white rounded-[40px] border-2 border-dashed border-slate-100">
          <p className="text-2xl font-black text-slate-300 italic uppercase">No routes found</p>
          <p className="text-slate-400 text-sm mt-2">Try adjusting your search filters or dates.</p>
        </div>
      )}

      {detailFlight && (
        <FlightDetailsModal 
          flight={detailFlight} 
          onClose={() => setDetailFlight(null)} 
          onBook={(f) => { setDetailFlight(null); onBook(f); }}
        />
      )}

      {shareFlight && (
        <ShareModal flight={shareFlight} onClose={() => setShareFlight(null)} />
      )}
    </div>
  );
};
