
import React, { useState } from 'react';
import { Hero } from '../components/Hero.tsx';
import { SearchForm } from '../components/SearchForm.tsx';
import { SearchParams } from '../types.ts';
import { TRENDING_DOMESTIC_ROUTES } from '../services/extraMockData.ts';
import { AIRLINES } from '../services/mockData.ts';
import { Icons } from '../constants.tsx';
import { Button } from '../components/Button.tsx';
import { User } from '../services/authService.ts';

interface HomePanelProps {
  params: SearchParams;
  setParams: (p: SearchParams) => void;
  onSearch: (e: React.FormEvent) => void;
  recentSearches: SearchParams[];
  onRecentSearchClick: (p: SearchParams) => void;
  currentUser?: User | null;
}

export const HomePanel: React.FC<HomePanelProps> = ({ 
  params, 
  setParams, 
  onSearch, 
  recentSearches, 
  onRecentSearchClick,
  currentUser 
}) => {
  const [showLoyaltyModal, setShowLoyaltyModal] = useState(false);

  return (
    <div className="animate-in fade-in slide-in-from-left-10 duration-700 pb-20">
      <Hero />
      <SearchForm params={params} setParams={setParams} onSearch={onSearch} mode="DOMESTIC" />
      
      <div className="max-w-6xl mx-auto py-12 px-6">
        
        {/* Personal Member Card - Only visible when logged in */}
        {currentUser && (
          <div className="mb-12 animate-in slide-in-from-top-4 duration-700">
            <div className="bg-slate-900 rounded-[32px] p-8 text-white flex flex-col md:flex-row items-center justify-between shadow-2xl border border-white/5 relative overflow-hidden group">
              {/* Background deco */}
              <div className="absolute top-0 right-0 w-64 h-full bg-blue-600/10 blur-[100px] rounded-full group-hover:bg-blue-600/20 transition-all duration-700"></div>
              
              <div className="flex items-center gap-8 relative z-10">
                 <div className="relative">
                   <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-3xl shadow-xl shadow-blue-500/20 group-hover:scale-110 transition-transform duration-500">
                     <Icons.Shield />
                   </div>
                   <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-4 border-slate-900 rounded-full animate-pulse"></div>
                 </div>
                 <div>
                   <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-400 mb-1">Authenticated Explorer</p>
                   <h3 className="text-3xl font-black tracking-tighter uppercase">{currentUser.firstName} {currentUser.lastName}</h3>
                   <div className="flex items-center gap-3 mt-1">
                      <span className="text-[9px] font-black bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full border border-blue-500/30 uppercase tracking-widest">
                        {currentUser.memberStatus} Status
                      </span>
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Since {new Date(currentUser.joinedDate).getFullYear()}</span>
                   </div>
                 </div>
              </div>

              <div className="mt-8 md:mt-0 text-center md:text-right relative z-10">
                 <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-2">Unique Membership ID</p>
                 <div className="bg-white/5 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 group-hover:border-blue-500/50 transition-all">
                    <p className="font-mono text-xl md:text-2xl font-black tracking-[0.2em] text-white group-hover:text-blue-400 transition-colors">
                      {currentUser.id}
                    </p>
                 </div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Searches Section */}
        {recentSearches.length > 0 && (
          <section className="mb-24 animate-in fade-in slide-in-from-top-4 duration-700 delay-200">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
              <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Continue Your Search</h2>
            </div>
            
            <div className="flex flex-wrap gap-4">
              {recentSearches.map((search, idx) => (
                <button
                  key={idx}
                  onClick={() => onRecentSearchClick(search)}
                  className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group text-left min-w-[240px] flex items-center justify-between gap-6"
                >
                  <div className="space-y-1">
                    <p className="text-xl font-black text-slate-900 tracking-tighter uppercase">
                      {search.origin} <span className="text-blue-500 mx-1">→</span> {search.destination}
                    </p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {new Date(search.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • {search.cabinClass}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Icons.ChevronRight />
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        <div className="space-y-32">
          {/* Trending Routes Section */}
          <section>
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-4xl font-black text-slate-900 tracking-tight uppercase">TRENDING DOMESTIC</h2>
                <p className="text-slate-500 font-medium">Explore major hubs and secondary gems across America.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {TRENDING_DOMESTIC_ROUTES.map((route, i) => (
                <div key={i} className="group relative h-96 rounded-[40px] overflow-hidden shadow-2xl cursor-pointer">
                  <img src={route.img} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={route.city} />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                  <div className="absolute bottom-8 left-8 right-8">
                    <h3 className="text-3xl font-black text-white tracking-tighter mb-2 uppercase">{route.city}</h3>
                    <div className="flex justify-between items-center pt-4 border-t border-white/20">
                      <span className="text-white/60 text-[10px] font-black uppercase tracking-widest">From {route.from}</span>
                      <span className="text-2xl font-black text-blue-400">${route.price}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Loyalty Promotion Card */}
          <section className="relative">
            <div className="bg-slate-900 rounded-[56px] overflow-hidden shadow-2xl border border-white/5 p-12 md:p-20 flex flex-col md:flex-row items-center justify-between gap-12 group">
              {/* Background Decorative Element */}
              <div className="absolute top-0 right-0 w-full h-full opacity-[0.03] pointer-events-none overflow-hidden">
                <div className="absolute -right-20 -top-20 w-96 h-96 bg-blue-500 rounded-full blur-[100px]"></div>
                <div className="absolute right-40 bottom-10 w-64 h-64 bg-emerald-500 rounded-full blur-[100px]"></div>
              </div>

              <div className="relative z-10 flex-1 space-y-8 text-center md:text-left">
                <div className="inline-flex items-center gap-3 bg-blue-500/10 border border-blue-500/20 px-6 py-2 rounded-full">
                  <div className="text-blue-400 animate-bounce">
                    <Icons.Plane />
                  </div>
                  <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">SkyNet Elite Loyalty</span>
                </div>
                
                <div className="space-y-4">
                  <h2 className="text-5xl lg:text-7xl font-black text-white tracking-tighter leading-none">
                    FREQUENT FLYERS <br />
                    <span className="text-blue-500">GET 50% OFF</span>
                  </h2>
                  <p className="text-slate-400 font-medium text-lg max-w-xl mx-auto md:mx-0">
                    Join our SkyPass program. Book 3 flights in a quarter and unlock half-price travel on your next premium booking.
                  </p>
                </div>

                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  <Button size="xl" className="shadow-2xl shadow-blue-500/20 px-12 group-hover:scale-105 transition-transform">
                    JOIN SKYPASS
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="text-white hover:bg-white/5 border border-white/10 px-8"
                    onClick={() => setShowLoyaltyModal(true)}
                  >
                    LEARN MORE
                  </Button>
                </div>
              </div>

              <div className="relative z-10 hidden lg:block">
                <div className="w-80 h-80 relative flex items-center justify-center">
                  {/* Visual Representation of 50% Off */}
                  <div className="absolute inset-0 bg-blue-600 rounded-full opacity-20 animate-ping"></div>
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 w-64 h-64 rounded-[48px] rotate-12 flex flex-col items-center justify-center shadow-2xl relative">
                    <span className="text-8xl font-black text-white tracking-tighter">-50%</span>
                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest mt-2">Loyalty Reward</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Airline Partners Section */}
          <section className="pt-16 border-t border-slate-100">
            <div className="text-center mb-16">
              <h2 className="text-xs font-black text-blue-600 uppercase tracking-[0.4em] mb-4">Our Partners</h2>
              <h3 className="text-3xl font-black text-slate-900 tracking-tighter">FLY WITH THE WORLD'S BEST</h3>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
              {AIRLINES.slice(0, 10).map((airline) => (
                <div key={airline.code} className="flex justify-center p-4">
                  <img 
                    src={airline.logo} 
                    alt={airline.name} 
                    className="h-12 w-auto object-contain"
                    title={airline.name}
                  />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Loyalty Discount Modal */}
      {showLoyaltyModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[64px] shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-500">
            {/* Close Button */}
            <button 
              onClick={() => setShowLoyaltyModal(false)}
              className="absolute top-10 right-10 w-12 h-12 bg-slate-100 text-slate-400 hover:text-slate-900 rounded-full flex items-center justify-center transition-all z-20"
            >
              ✕
            </button>

            <div className="p-12 md:p-16 space-y-12">
              <div className="space-y-4 text-center md:text-left">
                <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100">
                   <div className="text-blue-600"><Icons.Star /></div>
                   <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">SkyNet Legacy Reward</span>
                </div>
                <h3 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">
                  THE HALF-FARE <br /><span className="text-blue-600">MANIFESTO</span>
                </h3>
                <p className="text-slate-500 font-medium text-lg leading-relaxed">
                  The 50% SkyNet discount is reserved for our most disciplined aviators. To qualify for a single-use Half-Fare token, you must complete the <span className="text-slate-900 font-black italic">"Triple-Jump Trials"</span>.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-50 p-8 rounded-[40px] border border-slate-100 space-y-4 hover:border-blue-200 transition-colors group">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-xl shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">⚡</div>
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Phase 1: Triple Hubs</h4>
                  <p className="text-[10px] font-bold text-slate-400 leading-relaxed">
                    Complete 3 separate itineraries in 90 days, each consisting of at least <span className="text-slate-900">2 connecting flights</span> (no direct routes).
                  </p>
                </div>
                
                <div className="bg-slate-50 p-8 rounded-[40px] border border-slate-100 space-y-4 hover:border-blue-200 transition-colors group">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-xl shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">🕒</div>
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Phase 2: Dawn Patrol</h4>
                  <p className="text-[10px] font-bold text-slate-400 leading-relaxed">
                    At least two of your qualifying departures must occur between <span className="text-slate-900">3:00 AM and 4:15 AM</span> local time.
                  </p>
                </div>

                <div className="bg-slate-50 p-8 rounded-[40px] border border-slate-100 space-y-4 hover:border-blue-200 transition-colors group">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-xl shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">💎</div>
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Phase 3: Elite Spend</h4>
                  <p className="text-[10px] font-bold text-slate-400 leading-relaxed">
                    Spend a minimum of <span className="text-slate-900">$1,500</span> purely on in-flight SkyHigh™ upgrades (Wifi, Extra-Legroom, or Vintage Champagnes).
                  </p>
                </div>

                <div className="bg-slate-50 p-8 rounded-[40px] border border-slate-100 space-y-4 hover:border-blue-200 transition-colors group">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-xl shadow-sm border border-slate-100 group-hover:scale-110 transition-transform"></div>
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Phase 4: Precision</h4>
                  <p className="text-[10px] font-bold text-slate-400 leading-relaxed">
                    Perform digital check-ins for all 3 trips within <span className="text-slate-900">60 seconds</span> of the check-in window opening (24h before).
                  </p>
                </div>
              </div>

              <div className="pt-6 flex flex-col items-center gap-6">
                 <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em] text-center">
                   Success Rate: 0.04% among Gold Members
                 </p>
                 <Button size="xl" onClick={() => setShowLoyaltyModal(false)} className="px-16 w-full md:w-auto shadow-2xl shadow-blue-500/30">
                   ACCEPT THE CHALLENGE
                 </Button>
              </div>
            </div>

            {/* Aesthetic Detail */}
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-100 rounded-full blur-[100px] opacity-50"></div>
          </div>
        </div>
      )}
    </div>
  );
};
