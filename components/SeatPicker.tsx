
import React, { useState, useEffect, useMemo } from 'react';
import { Button } from './Button.tsx';

interface SeatPickerProps {
  passengers: number;
  cabinClass: string;
  onConfirm: (seats: string[]) => void;
  onBack: () => void;
}

export const SeatPicker: React.FC<SeatPickerProps> = ({ passengers, cabinClass, onConfirm, onBack }) => {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  
  const normalizedClass = useMemo(() => {
    if (cabinClass === 'First') return 'First Class';
    if (cabinClass === 'Business') return 'Business Class';
    if (cabinClass === 'Premium') return 'Premium Economy';
    return 'Economy';
  }, [cabinClass]);

  const takenSeats = useMemo(() => {
    const taken = new Set<string>();
    for (let r = 1; r <= 25; r++) {
      ['A', 'B', 'C', 'D', 'E', 'F'].forEach(c => {
        if (Math.random() < 0.3) taken.add(`${r}${c}`);
      });
    }
    return taken;
  }, []);

  const sections = [
    { 
      name: 'First Class', 
      rows: [1, 2], 
      color: 'bg-amber-500/5', 
      borderColor: 'border-amber-200/50',
      textColor: 'text-amber-700',
      dotColor: 'bg-amber-500',
      icon: '👑' 
    },
    { 
      name: 'Business Class', 
      rows: [3, 4, 5, 6], 
      color: 'bg-indigo-500/5', 
      borderColor: 'border-indigo-200/50',
      textColor: 'text-indigo-700',
      dotColor: 'bg-indigo-500',
      icon: '💼' 
    },
    { 
      name: 'Premium Economy', 
      rows: [7, 8, 9, 10], 
      color: 'bg-blue-500/5', 
      borderColor: 'border-blue-200/50',
      textColor: 'text-blue-700',
      dotColor: 'bg-blue-500',
      icon: '✨' 
    },
    { 
      name: 'Economy', 
      rows: Array.from({ length: 15 }, (_, i) => i + 11), 
      color: 'bg-slate-500/5', 
      borderColor: 'border-slate-200/50',
      textColor: 'text-slate-600',
      dotColor: 'bg-slate-400',
      icon: '💺' 
    }
  ];

  const cols = ['A', 'B', 'C', 'D', 'E', 'F'];

  const toggleSeat = (id: string, sectionName: string) => {
    if (takenSeats.has(id)) {
      setFeedback(`Occupied`);
      return;
    }

    if (sectionName !== normalizedClass) {
      setFeedback(`Restricted`);
      return;
    }
    
    if (selectedSeats.includes(id)) {
      setSelectedSeats(prev => prev.filter(s => s !== id));
    } else if (selectedSeats.length < passengers) {
      setSelectedSeats(prev => [...prev, id]);
    } else {
      setFeedback(`Max ${passengers}`);
    }
  };

  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 1500);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  const getSeatStyles = (row: number, id: string, sectionName: string) => {
    const isSelected = selectedSeats.includes(id);
    const isTaken = takenSeats.has(id);
    const isRestricted = sectionName !== normalizedClass;

    if (isTaken) return 'bg-slate-100 border-slate-200 text-slate-300 cursor-not-allowed opacity-40';
    if (isSelected) return 'bg-blue-600 border-blue-600 text-white z-10 font-black shadow-lg shadow-blue-500/40';
    if (isRestricted) return 'bg-slate-50 border-slate-100 text-slate-200 cursor-not-allowed grayscale opacity-30';

    if (row <= 2) return 'bg-white border-amber-200 text-amber-700';
    if (row <= 6) return 'bg-white border-indigo-200 text-indigo-700';
    if (row <= 10) return 'bg-white border-blue-200 text-blue-700';
    return 'bg-white border-slate-200 text-slate-500';
  };

  return (
    <div className="bg-white p-4 md:p-12 rounded-[32px] md:rounded-[56px] shadow-2xl border border-slate-100 max-w-4xl mx-auto space-y-6 md:space-y-12 relative overflow-hidden">
      {/* Small Toast Feedback */}
      {feedback && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[200]">
          <div className="bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-2xl border border-white/10">
            {feedback}
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-8 border-b pb-6 md:pb-10">
        <div className="text-center md:text-left">
          <h2 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight flex flex-wrap items-center justify-center md:justify-start gap-2">
            SELECT SEATS <span className="text-blue-600 text-[10px] bg-blue-50 px-3 py-1 rounded-full border border-blue-100 uppercase">{passengers} NEEDED</span>
          </h2>
          <p className="text-slate-400 font-bold uppercase text-[9px] tracking-widest mt-1">
            Cabin: <span className="text-blue-600">{normalizedClass}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 rounded-xl border border-emerald-100">
            <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
            <span className="text-[9px] font-black text-emerald-700 uppercase">Available</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-100">
            <div className="w-2 h-2 rounded-full bg-slate-200"></div>
            <span className="text-[9px] font-black text-slate-400 uppercase">Locked</span>
          </div>
        </div>
      </div>

      {/* Seat Map Area - Mobile Scrollable */}
      <div className="relative bg-slate-50/50 rounded-[24px] md:rounded-[48px] p-4 md:p-12 border border-slate-100">
        <div className="flex justify-center mb-8 md:mb-16">
          <div className="w-48 md:w-80 h-10 md:h-20 bg-white border border-slate-200 rounded-t-[100px] md:rounded-t-[140px] flex items-end justify-center pb-2 md:pb-4 border-b-0">
            <span className="text-[8px] md:text-[10px] font-black text-slate-300 uppercase tracking-widest">COCKPIT</span>
          </div>
        </div>

        {/* This container allows horizontal scrolling on small phones */}
        <div className="overflow-x-auto hide-scrollbar-mobile">
          <div className="min-w-[320px] max-h-[500px] md:max-h-[650px] overflow-y-auto custom-scrollbar pr-2 md:pr-6">
            <div className="flex flex-col items-center gap-10 md:gap-14">
              {sections.map((section) => (
                <div 
                  key={section.name} 
                  className={`w-full p-4 md:p-8 rounded-[24px] md:rounded-[40px] border-2 border-dashed transition-all duration-500 ${
                    section.name === normalizedClass 
                    ? `${section.borderColor} ${section.color}` 
                    : 'border-slate-100 bg-slate-50/20 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3 md:gap-6 mb-6 md:mb-10">
                    <div className="text-xl md:text-2xl">{section.icon}</div>
                    <div className="flex flex-col">
                      <span className={`text-[10px] md:text-[12px] font-black uppercase tracking-widest ${section.name === normalizedClass ? section.textColor : 'text-slate-400'}`}>
                        {section.name}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 md:gap-6 items-center">
                    {section.rows.map((rowNum) => (
                      <div key={rowNum} className="flex gap-4 md:gap-6 items-center">
                        <span className="w-6 md:w-10 text-center text-[9px] md:text-[11px] font-black text-slate-300">
                          {rowNum}
                        </span>
                        <div className="flex gap-2 md:gap-3">
                          {cols.map((c, i) => {
                            const id = `${rowNum}${c}`;
                            const isAisle = i === 3;
                            return (
                              <React.Fragment key={c}>
                                {isAisle && <div className="w-4 md:w-16"></div>}
                                <button
                                  onClick={() => toggleSeat(id, section.name)}
                                  disabled={takenSeats.has(id)}
                                  className={`w-8 h-8 md:w-14 md:h-14 rounded-lg md:rounded-2xl flex items-center justify-center text-[10px] md:text-xs font-black transition-all border-2 ${getSeatStyles(rowNum, id, section.name)}`}
                                >
                                  {takenSeats.has(id) ? '✕' : (selectedSeats.includes(id) ? '✓' : c)}
                                </button>
                              </React.Fragment>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center pt-6 md:pt-10 border-t border-slate-100 gap-6">
        <Button variant="ghost" onClick={onBack} className="text-slate-400 font-black text-[10px] hidden md:block">
          ← BACK
        </Button>
        
        <div className="flex flex-col items-center">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Selected</p>
          <div className="flex flex-wrap justify-center gap-2">
            {selectedSeats.length > 0 ? (
              selectedSeats.map(s => (
                <span key={s} className="px-3 py-1.5 bg-blue-600 text-white rounded-xl text-[10px] font-black shadow-md">
                  {s}
                </span>
              ))
            ) : (
              <span className="text-slate-200 font-black text-[9px] uppercase italic">None selected</span>
            )}
          </div>
        </div>

        <Button 
          disabled={selectedSeats.length !== passengers}
          onClick={() => onConfirm(selectedSeats)}
          size="lg"
          className="w-full md:w-auto px-10 md:px-20"
        >
          {selectedSeats.length === passengers ? 'CONFIRM' : `${passengers - selectedSeats.length} REMAINING`}
        </Button>
      </div>
    </div>
  );
};
