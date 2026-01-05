
import React, { useMemo, useEffect } from 'react';
import { Icons, AIRPORTS } from '../constants.tsx';
import { SearchParams, MultiCityLeg } from '../types.ts';
import { Button } from './Button.tsx';

interface SearchFormProps {
  params: SearchParams;
  setParams: (params: SearchParams) => void;
  onSearch: (e: React.FormEvent) => void;
  mode?: 'DOMESTIC' | 'INTERNATIONAL';
}

export const SearchForm: React.FC<SearchFormProps> = ({ params, setParams, onSearch, mode = 'DOMESTIC' }) => {
  const americanAirports = useMemo(() => AIRPORTS.filter(a => a.region === 'America'), []);
  const europeanAirports = useMemo(() => AIRPORTS.filter(a => a.region === 'Europe'), []);

  const validOrigins = americanAirports;
  const validDestinations = useMemo(() => {
    return mode === 'DOMESTIC' ? americanAirports : europeanAirports;
  }, [mode, americanAirports, europeanAirports]);

  useEffect(() => {
    const isOriginValid = validOrigins.some(a => a.code === params.origin);
    const isDestValid = validDestinations.some(a => a.code === params.destination);
    
    if (!isOriginValid || !isDestValid) {
      setParams({
        ...params,
        origin: validOrigins[0]?.code || 'SFO',
        destination: validDestinations[0]?.code || (mode === 'DOMESTIC' ? 'JFK' : 'LHR')
      });
    }
  }, [mode, validOrigins, validDestinations]);

  const addLeg = () => {
    const legs = params.multiCityLegs || [
      { origin: params.origin, destination: params.destination, date: params.date }
    ];
    if (legs.length >= 5) return;

    const lastLeg = legs[legs.length - 1];
    const newLeg: MultiCityLeg = {
      origin: lastLeg.destination,
      destination: validDestinations.find(d => d.code !== lastLeg.destination)?.code || 'LAX',
      date: lastLeg.date
    };
    setParams({ ...params, tripType: 'MULTI_CITY', multiCityLegs: [...legs, newLeg] });
  };

  const removeLeg = (index: number) => {
    const legs = params.multiCityLegs || [];
    if (legs.length <= 2) {
      setParams({ ...params, tripType: 'ONE_WAY', multiCityLegs: undefined });
      return;
    }
    const nextLegs = legs.filter((_, i) => i !== index);
    setParams({ ...params, multiCityLegs: nextLegs });
  };

  const updateLeg = (index: number, field: keyof MultiCityLeg, value: string) => {
    const legs = [...(params.multiCityLegs || [])];
    legs[index] = { ...legs[index], [field]: value };
    setParams({ ...params, multiCityLegs: legs });
  };

  const handleTripTypeChange = (type: SearchParams['tripType']) => {
    if (type === 'MULTI_CITY' && !params.multiCityLegs) {
      setParams({
        ...params,
        tripType: 'MULTI_CITY',
        multiCityLegs: [
          { origin: params.origin, destination: params.destination, date: params.date },
          { origin: params.destination, destination: 'LAX', date: params.date }
        ]
      });
    } else {
      setParams({ ...params, tripType: type });
    }
  };

  return (
    <div className="bg-white p-5 md:p-8 rounded-[24px] md:rounded-[32px] shadow-xl border border-slate-100 max-w-6xl mx-auto -mt-16 md:-mt-24 relative z-20 mx-4 md:mx-auto">
      <div className="flex flex-wrap gap-2 md:gap-4 mb-6 md:mb-8 border-b border-slate-50 pb-4 md:pb-6">
        <button 
          type="button"
          onClick={() => handleTripTypeChange('ROUND_TRIP')}
          className={`flex-1 md:flex-none px-4 md:px-6 py-2 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all ${params.tripType === 'ROUND_TRIP' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-900'}`}
        >
          Round Trip
        </button>
        <button 
          type="button"
          onClick={() => handleTripTypeChange('ONE_WAY')}
          className={`flex-1 md:flex-none px-4 md:px-6 py-2 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all ${params.tripType === 'ONE_WAY' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-900'}`}
        >
          One-way
        </button>
        <button 
          type="button"
          onClick={() => handleTripTypeChange('MULTI_CITY')}
          className={`flex-1 md:flex-none px-4 md:px-6 py-2 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all ${params.tripType === 'MULTI_CITY' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-900'}`}
        >
          Multi-city
        </button>
      </div>

      <form onSubmit={onSearch} className="space-y-4 md:space-y-6">
        {params.tripType === 'MULTI_CITY' ? (
          <div className="space-y-4">
            {params.multiCityLegs?.map((leg, idx) => (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end p-4 bg-slate-50 md:bg-transparent rounded-2xl md:rounded-none">
                <div className="md:col-span-1 flex items-center justify-start md:justify-center">
                   <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center font-black text-[10px]">
                     {idx + 1}
                   </div>
                </div>
                <div className="md:col-span-3 space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">From</label>
                  <select 
                    className="w-full bg-white md:bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none font-bold text-slate-800 text-sm"
                    value={leg.origin}
                    onChange={e => updateLeg(idx, 'origin', e.target.value)}
                  >
                    {validOrigins.map(a => <option key={a.code} value={a.code}>{a.city} ({a.code})</option>)}
                  </select>
                </div>
                <div className="md:col-span-3 space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">To</label>
                  <select 
                    className="w-full bg-white md:bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none font-bold text-slate-800 text-sm"
                    value={leg.destination}
                    onChange={e => updateLeg(idx, 'destination', e.target.value)}
                  >
                    {validDestinations.map(a => <option key={a.code} value={a.code}>{a.city} ({a.code})</option>)}
                  </select>
                </div>
                <div className="md:col-span-3 space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Date</label>
                  <input 
                    type="date"
                    className="w-full bg-white md:bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none font-bold text-slate-800 text-sm"
                    value={leg.date}
                    onChange={e => updateLeg(idx, 'date', e.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  {params.multiCityLegs!.length > 2 && (
                    <button 
                      type="button" 
                      onClick={() => removeLeg(idx)} 
                      className="text-red-500 text-[10px] font-black uppercase p-2"
                    >
                      REMOVE
                    </button>
                  )}
                </div>
              </div>
            ))}
            <div className="flex flex-col md:flex-row justify-between items-center pt-4 gap-4">
              <Button type="button" variant="outline" size="sm" onClick={addLeg} disabled={params.multiCityLegs!.length >= 5} className="w-full md:w-auto">
                + ADD LEG
              </Button>
              <div className="flex items-center gap-4 w-full md:w-auto">
                 <div className="flex-1 md:flex-none">
                    <input 
                      type="number" 
                      className="w-full md:w-20 bg-slate-50 border border-slate-200 p-3 rounded-xl font-bold"
                      value={params.passengers}
                      onChange={e => setParams({...params, passengers: parseInt(e.target.value) || 1})}
                    />
                 </div>
                 <Button type="submit" size="lg" className="flex-1 md:flex-none">
                    SEARCH ALL
                 </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3 md:gap-4 items-end">
            <div className="space-y-1.5 lg:col-span-1">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Origin</label>
              <select 
                className="w-full bg-slate-50 border border-slate-200 p-3 md:p-4 rounded-xl md:rounded-2xl outline-none font-bold text-slate-800 text-sm focus:ring-2 focus:ring-blue-500"
                value={params.origin}
                onChange={e => setParams({...params, origin: e.target.value})}
              >
                {validOrigins.map(a => <option key={a.code} value={a.code}>{a.city} ({a.code})</option>)}
              </select>
            </div>

            <div className="space-y-1.5 lg:col-span-1">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Destination</label>
              <select 
                className="w-full bg-slate-50 border border-slate-200 p-3 md:p-4 rounded-xl md:rounded-2xl outline-none font-bold text-slate-800 text-sm focus:ring-2 focus:ring-blue-500"
                value={params.destination}
                onChange={e => setParams({...params, destination: e.target.value})}
              >
                {validDestinations.map(a => (
                  <option key={a.code} value={a.code} disabled={a.code === params.origin}>
                    {a.city} ({a.code})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5 lg:col-span-1">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Depart</label>
              <input 
                type="date"
                className="w-full bg-slate-50 border border-slate-200 p-3 md:p-4 rounded-xl md:rounded-2xl outline-none font-bold text-slate-800 text-sm"
                value={params.date}
                min={new Date().toISOString().split('T')[0]}
                onChange={e => setParams({...params, date: e.target.value})}
              />
            </div>

            {params.tripType === 'ROUND_TRIP' && (
              <div className="space-y-1.5 lg:col-span-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Return</label>
                <input 
                  type="date"
                  className="w-full bg-slate-50 border border-slate-200 p-3 md:p-4 rounded-xl md:rounded-2xl outline-none font-bold text-slate-800 text-sm"
                  value={params.returnDate}
                  min={params.date}
                  onChange={e => setParams({...params, returnDate: e.target.value})}
                />
              </div>
            )}

            <div className={`grid grid-cols-2 gap-2 ${params.tripType === 'ONE_WAY' ? 'lg:col-span-2' : 'lg:col-span-1'}`}>
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Pax</label>
                <input 
                  type="number"
                  min="1"
                  className="w-full bg-slate-50 border border-slate-200 p-3 md:p-4 rounded-xl md:rounded-2xl outline-none font-bold text-slate-800"
                  value={params.passengers}
                  onChange={e => setParams({...params, passengers: parseInt(e.target.value) || 1})}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Class</label>
                <select 
                  className="w-full bg-slate-50 border border-slate-200 p-3 md:p-4 rounded-xl md:rounded-2xl outline-none font-bold text-slate-800 text-sm"
                  value={params.cabinClass}
                  onChange={e => setParams({...params, cabinClass: e.target.value as any})}
                >
                  <option value="Economy">Economy</option>
                  <option value="Premium">Premium</option>
                  <option value="Business">Business</option>
                  <option value="First">First</option>
                </select>
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full h-[52px] md:h-[60px] lg:col-span-1">
              SEARCH
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};
