
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
  
  // Normalize cabin class names for matching
  const normalizedClass = useMemo(() => {
    if (cabinClass === 'First') return 'First Class';
    if (cabinClass === 'Business') return 'Business Class';
    if (cabinClass === 'Premium') return 'Premium Economy';
    return 'Economy';
  }, [cabinClass]);

  // Simulate some seats being already occupied
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
      setFeedback(`Seat ${id} is already occupied`);
      return;
    }

    // Restriction Logic
    if (sectionName !== normalizedClass) {
      setFeedback(`Restricted: Upgrade to ${sectionName} to select this seat`);
      return;
    }
    
    if (selectedSeats.includes(id)) {
      setSelectedSeats(prev => prev.filter(s => s !== id));
      setFeedback(`Seat ${id} removed`);
    } else if (selectedSeats.length < passengers) {
      setSelectedSeats(prev => [...prev, id]);
      setFeedback(`Seat ${id} selected`);
    } else {
      setFeedback(`Max ${passengers} seats allowed for this booking`);
    }
  };

  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 2500);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  const getSeatStyles = (row: number, id: string, sectionName: string) => {
    const isSelected = selectedSeats.includes(id);
    const isTaken = takenSeats.has(id);
    const isRestricted = sectionName !== normalizedClass;

    if (isTaken) {
      return 'bg-slate-100 border-slate-200 text-slate-300 cursor-not-allowed opacity-50';
    }

    if (isSelected) {
      return 'bg-blue-600 border-blue-600 text-white animate-seat-selection ring-4 ring-blue-500/30 z-10 font-black shadow-blue-500/50';
    }

    if (isRestricted) {
      return 'bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed grayscale-[0.8] opacity-60';
    }

    // Class-specific active styles
    if (row <= 2) return 'bg-white border-amber-200 text-amber-700 hover:bg-amber-50 hover:border-amber-400 shadow-sm';
    if (row <= 6) return 'bg-white border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:border-indigo-400 shadow-sm';
    if (row <= 10) return 'bg-white border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-400 shadow-sm';
    
    return 'bg-white border-emerald-200/60 text-slate-500 hover:bg-blue-50 hover:border-blue-300 shadow-sm ring-1 ring-emerald-500/10 transition-all duration-300';
  };

  return (
    <div className="bg-white p-6 md:p-12 rounded-[56px] shadow-2xl border border-slate-100 max-w-4xl mx-auto space-y-12 animate-in zoom-in-95 duration-700 relative">
      {/* Toast Feedback */}
      {feedback && (
        <div className="fixed top-32 left-1/2 -translate-x-1/2 z-[100] pointer-events-none">
          <div className={`px-6 py-3 rounded-2xl shadow-2xl border text-xs font-black uppercase tracking-widest animate-toast ${feedback.includes('Restricted') ? 'bg-red-600 text-white border-red-500' : 'bg-slate-900 text-white border-white/10'}`}>
            {feedback}
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-b pb-10">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            SELECT SEATS <span className="text-blue-600 text-sm bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100">{passengers} REQUIRED</span>
          </h2>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-2">
            Your Ticket: <span className="text-blue-600 font-black px-2 py-0.5 bg-blue-50 rounded-lg">{normalizedClass}</span>
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          <div className="flex items-center gap-2.5 px-4 py-2 bg-emerald-50 rounded-2xl border border-emerald-100 transition-all shadow-sm">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm"></div>
            <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Available</span>
          </div>
          <div className="flex items-center gap-2.5 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-200"></div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Restricted</span>
          </div>
        </div>
      </div>

      <div className="relative bg-slate-50/50 rounded-[48px] p-8 md:p-12 border border-slate-100 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-white to-transparent pointer-events-none z-10"></div>
        
        <div className="flex justify-center mb-16 relative z-20">
          <div className="w-80 h-20 bg-white border border-slate-200 rounded-t-[140px] shadow-sm flex flex-col items-center justify-end pb-4 border-b-0">
            <div className="w-16 h-1.5 bg-slate-100 rounded-full mb-1"></div>
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em] pl-[0.5em]">COCKPIT</span>
          </div>
        </div>

        <div className="max-h-[650px] overflow-y-auto custom-scrollbar pr-6 relative z-0">
          <div className="flex flex-col items-center gap-14">
            {sections.map((section) => (
              <div 
                key={section.name} 
                className={`w-full p-8 rounded-[40px] border-2 border-dashed transition-all duration-500 ${
                  section.name === normalizedClass 
                  ? `${section.borderColor} ${section.color} ring-2 ring-blue-500/10` 
                  : 'border-slate-100 bg-slate-50/30 opacity-60'
                }`}
              >
                <div className="flex items-center gap-6 mb-10">
                  <div className={`p-3 rounded-2xl shadow-sm border text-2xl bg-white ${section.name === normalizedClass ? 'border-blue-100' : 'border-slate-100 grayscale'}`}>
                    {section.icon}
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className={`text-[12px] font-black uppercase tracking-[0.3em] ${section.name === normalizedClass ? section.textColor : 'text-slate-400'}`}>
                        {section.name}
                      </span>
                      {section.name !== normalizedClass && (
                        <span className="text-[8px] font-black bg-slate-200 text-slate-500 px-2 py-0.5 rounded-md uppercase tracking-widest">Locked</span>
                      )}
                    </div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Rows {section.rows[0]} - {section.rows[section.rows.length-1]}</span>
                  </div>
                  <div className={`h-[2px] flex-1 rounded-full ${section.name === normalizedClass ? section.dotColor : 'bg-slate-200'} opacity-10`}></div>
                </div>

                <div className="flex flex-col gap-6 items-center">
                  {section.rows.map((rowNum) => (
                    <div key={rowNum} className="flex gap-6 items-center group">
                      <span className={`w-10 text-center text-[11px] font-black transition-colors ${section.name === normalizedClass ? 'text-slate-300 group-hover:text-blue-500' : 'text-slate-200'}`}>
                        {rowNum.toString().padStart(2, '0')}
                      </span>
                      <div className="flex gap-3">
                        {cols.map((c, i) => {
                          const id = `${rowNum}${c}`;
                          const isAisle = i === 3;
                          const isRestricted = section.name !== normalizedClass;
                          return (
                            <React.Fragment key={c}>
                              {isAisle && <div className="w-16 flex items-center justify-center">
                                <div className="w-[2px] h-full bg-slate-300/10 rounded-full"></div>
                              </div>}
                              <button
                                onClick={() => toggleSeat(id, section.name)}
                                disabled={takenSeats.has(id)}
                                className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center text-xs font-black transition-all border-2 relative overflow-hidden ${getSeatStyles(rowNum, id, section.name)}`}
                              >
                                {isRestricted && !takenSeats.has(id) && (
                                  <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                                  </div>
                                )}
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

        <div className="flex justify-center mt-16 relative z-20">
          <div className="w-80 h-10 bg-slate-200/30 rounded-b-full"></div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center pt-10 border-t border-slate-100 gap-10">
        <Button variant="ghost" onClick={onBack} className="text-slate-400 hover:text-slate-800 tracking-[0.2em] font-black">
          ← BACK TO RESULTS
        </Button>
        
        <div className="flex flex-col items-center flex-1">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Confirmed Selection</p>
          <div className="flex flex-wrap justify-center gap-3">
            {selectedSeats.length > 0 ? (
              selectedSeats.map(s => (
                <span key={s} className="px-5 py-2.5 bg-blue-600 text-white rounded-2xl text-[11px] font-black shadow-xl shadow-blue-200 animate-in zoom-in-50">
                  SEAT {s}
                </span>
              ))
            ) : (
              <span className="text-slate-300 font-black text-[10px] uppercase italic tracking-[0.3em] opacity-50">Awaiting selection...</span>
            )}
          </div>
        </div>

        <Button 
          disabled={selectedSeats.length !== passengers}
          onClick={() => onConfirm(selectedSeats)}
          size="xl"
          className="px-20 w-full md:w-auto shadow-2xl hover:translate-y-[-2px] transition-transform"
        >
          {selectedSeats.length === passengers ? 'CONFIRM & PROCEED' : `SELECT ${passengers - selectedSeats.length} MORE`}
        </Button>
      </div>
    </div>
  );
};
