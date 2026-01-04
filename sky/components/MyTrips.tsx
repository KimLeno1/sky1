
import React from 'react';
import { Booking, Flight } from '../types.ts';
import { Icons } from '../constants.tsx';
import { Button } from './Button.tsx';

interface MyTripsProps {
  bookings: Booking[];
  onCancelBooking: (id: string) => void;
  onShare: (flight: Flight) => void;
}

export const MyTrips: React.FC<MyTripsProps> = ({ bookings, onCancelBooking, onShare }) => {
  const handleCancelRequest = (id: string) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this flight? This action cannot be undone and your seat will be released immediately."
    );
    if (confirmCancel) {
      onCancelBooking(id);
    }
  };

  const renderLeg = (f: Flight, label: string, isLast: boolean) => (
    <div key={f.id} className={`space-y-4 ${!isLast ? 'pb-8 border-b border-slate-50' : ''} pt-6`}>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center p-2 border border-slate-100 shadow-sm">
          <img src={f.logo} className="w-full h-full object-contain" alt={f.airline} />
        </div>
        <div>
          <span className="font-black text-slate-800 tracking-tight text-lg uppercase">{f.airline}</span>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-8">
        <div className="text-left">
          <p className="text-2xl font-black text-slate-900 tracking-tighter">{f.departureTime}</p>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{f.departureAirport}</p>
        </div>
        <div className="flex-1 flex flex-col items-center gap-1 min-w-[60px]">
          <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">{f.duration}</span>
          <div className="w-full h-[2px] bg-slate-100 relative"></div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black text-slate-900 tracking-tighter">{f.arrivalTime}</p>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{f.arrivalAirport}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto py-4 px-0 animate-in fade-in duration-500">
      {bookings.length === 0 ? (
        <div className="bg-white rounded-[40px] p-20 text-center border-2 border-dashed border-slate-100">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mx-auto mb-6">
            <Icons.Briefcase />
          </div>
          <h3 className="text-2xl font-black text-slate-300">NO ACTIVE BOOKINGS</h3>
          <p className="text-slate-400 mt-2">The world is waiting. Book your first flight today!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map(booking => (
            <div 
              key={booking.id} 
              className={`bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative ${booking.status === 'cancelled' ? 'opacity-60 grayscale-[0.8]' : ''}`}
            >
              <div className={`absolute top-0 right-0 px-6 py-2.5 text-[9px] font-black rounded-bl-2xl uppercase tracking-widest z-10 shadow-sm ${
                booking.status === 'cancelled' ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'
              }`}>
                {booking.status}
              </div>

              <div className="flex flex-col md:flex-row justify-between gap-8">
                <div className="flex-1 space-y-4">
                  <div className="pb-4">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Confirmation: {booking.id}</p>
                  </div>

                  {booking.multiCityFlights ? (
                    booking.multiCityFlights.map((f, i) => renderLeg(f, `Leg ${i + 1}`, i === booking.multiCityFlights!.length - 1))
                  ) : (
                    <>
                      {renderLeg(booking.flight, booking.returnFlight ? 'Outbound' : 'One-way Trip', !booking.returnFlight)}
                      {booking.returnFlight && renderLeg(booking.returnFlight, 'Return Leg', true)}
                    </>
                  )}
                </div>

                <div className="w-[1px] bg-slate-50 hidden md:block"></div>

                <div className="flex flex-col justify-between items-end min-w-[200px] gap-6">
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Assigned Seats</p>
                    <div className="flex flex-wrap justify-end gap-1">
                      {booking.seats.map(s => (
                        <span key={s} className="px-2 py-0.5 bg-slate-100 rounded-md text-[10px] font-black text-slate-600">{s}</span>
                      ))}
                    </div>
                    <div className="mt-8">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Paid</p>
                      <p className="text-4xl font-black text-blue-600 tracking-tighter">${booking.totalPrice}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {booking.status !== 'cancelled' ? (
                      <Button variant="ghost" size="sm" onClick={() => handleCancelRequest(booking.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                        Cancel
                      </Button>
                    ) : (
                      <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest italic pr-2">Booking Inactive</span>
                    )}
                    
                    <button 
                      onClick={() => onShare(booking.flight)}
                      className="text-slate-400 hover:text-blue-600 transition-colors p-2.5 rounded-xl hover:bg-blue-50 border border-slate-50"
                      title="Share Itinerary"
                    >
                      <Icons.Share />
                    </button>
                    
                    <Button variant="outline" size="sm" className={`border-slate-200 text-slate-600 ${booking.status === 'cancelled' ? 'cursor-not-allowed opacity-50' : 'hover:border-blue-500 hover:text-blue-600'}`} disabled={booking.status === 'cancelled'}>
                      MANAGE
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
