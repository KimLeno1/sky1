
import React, { useState, useMemo } from 'react';
import { SeatPicker } from '../components/SeatPicker.tsx';
import { CheckoutForm } from '../components/CheckoutForm.tsx';
import { PaymentPanel } from './PaymentPanel.tsx';
import { InsuranceModal } from '../components/InsuranceModal.tsx';
import { Flight, PassengerDetails } from '../types.ts';
import { Icons } from '../constants.tsx';
import { Button } from '../components/Button.tsx';

interface BookingPanelProps {
  flight: Flight;
  returnFlight?: Flight;
  multiCityFlights?: Flight[];
  passengersCount: number;
  bookingType: 'QUICK' | 'NORMAL';
  isAuthenticated: boolean;
  onComplete: (details: PassengerDetails[], seats: string[], bookingUserId?: string, insuranceType?: 'NONE' | 'BASIC' | 'PREMIUM', insurancePrice?: number) => void;
  onCancel: () => void;
}

type Step = 'SEATS' | 'PASSENGERS' | 'INSURANCE' | 'PAYMENT';

export const BookingPanel: React.FC<BookingPanelProps> = ({ 
  flight, 
  returnFlight,
  multiCityFlights,
  passengersCount, 
  bookingType,
  isAuthenticated,
  onComplete, 
  onCancel 
}) => {
  const [step, setStep] = useState<Step>('SEATS');
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [passengerDetails, setPassengerDetails] = useState<PassengerDetails[]>([]);
  const [bookingUserId, setBookingUserId] = useState<string | undefined>();
  const [insuranceType, setInsuranceType] = useState<'NONE' | 'BASIC' | 'PREMIUM'>('NONE');
  const [insurancePrice, setInsurancePrice] = useState(0);
  const [showInsuranceModal, setShowInsuranceModal] = useState(false);

  const handleSeatsConfirm = (seats: string[]) => {
    setSelectedSeats(seats);
    setStep('PASSENGERS');
  };

  const handlePassengersConfirm = (details: PassengerDetails[], userId?: string) => {
    setPassengerDetails(details);
    setBookingUserId(userId);
    setStep('INSURANCE');
  };

  const handleInsuranceSelect = (type: 'NONE' | 'BASIC' | 'PREMIUM', price: number) => {
    setInsuranceType(type);
    setInsurancePrice(price * passengersCount);
  };

  const handlePaymentComplete = () => {
    onComplete(passengerDetails, selectedSeats, bookingUserId, insuranceType, insurancePrice);
  };

  const allFlights = useMemo(() => {
    if (multiCityFlights) return multiCityFlights;
    if (returnFlight) return [flight, returnFlight];
    return [flight];
  }, [flight, returnFlight, multiCityFlights]);

  const totalBookingPrice = useMemo(() => {
    return allFlights.reduce((acc, f) => acc + f.price, 0) + insurancePrice;
  }, [allFlights, insurancePrice]);

  const steps: Step[] = ['SEATS', 'PASSENGERS', 'INSURANCE', 'PAYMENT'];
  const currentStepIdx = steps.indexOf(step);

  return (
    <div className="py-20 px-6">
      <div className="max-w-4xl mx-auto mb-16">
        <div className="flex justify-center mb-12">
          <div className="flex items-center gap-4">
            {steps.map((s, i) => (
              <React.Fragment key={s}>
                <div className={`w-3 h-3 rounded-full transition-all duration-500 ${currentStepIdx >= i ? 'bg-blue-600 scale-125 ring-4 ring-blue-100 shadow-lg' : 'bg-slate-200'}`}></div>
                {i < steps.length - 1 && (
                  <div className={`w-16 h-[2px] transition-colors duration-500 ${currentStepIdx > i ? 'bg-blue-600' : 'bg-slate-100'}`}></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm space-y-4">
           <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 px-2">Itinerary Summary</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {allFlights.map((f, i) => (
               <div key={i} className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex items-center gap-4 group hover:bg-white hover:shadow-md transition-all">
                 <div className="w-10 h-10 p-1.5 bg-white rounded-xl border border-slate-100 flex items-center justify-center">
                    <img src={f.logo} className="w-full h-full object-contain" alt={f.airline} />
                 </div>
                 <div className="flex-1">
                    <p className="text-[9px] font-black uppercase text-blue-500 tracking-widest">Flight {i + 1}</p>
                    <p className="font-black text-slate-900 text-sm uppercase">{f.departureAirport} → {f.arrivalAirport}</p>
                 </div>
                 <div className="text-right">
                    <p className="text-sm font-black text-slate-900">${f.price}</p>
                 </div>
               </div>
             ))}
           </div>
        </div>
      </div>
      
      {step === 'SEATS' && (
        <SeatPicker passengers={passengersCount} cabinClass={flight.class} onConfirm={handleSeatsConfirm} onBack={onCancel} />
      )}

      {step === 'PASSENGERS' && (
        <CheckoutForm 
          flight={{...flight, price: totalBookingPrice}} 
          seats={selectedSeats} 
          passengersCount={passengersCount}
          bookingType={bookingType}
          isAuthenticated={isAuthenticated}
          onComplete={handlePassengersConfirm}
          onBack={() => setStep('SEATS')}
        />
      )}

      {step === 'INSURANCE' && (
        <div className="max-w-4xl mx-auto space-y-10 animate-in slide-in-from-bottom-8 duration-500">
          <div className="bg-white p-12 rounded-[48px] shadow-2xl border border-slate-100 space-y-10">
            <div className="text-center space-y-4">
               <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-4 text-2xl">
                 <Icons.Shield />
               </div>
               <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Protect Your Trip</h2>
            </div>

            <div 
              onClick={() => setShowInsuranceModal(true)}
              className="bg-slate-50 p-10 rounded-[40px] border-2 border-dashed border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 transition-all cursor-pointer group"
            >
              <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="text-center md:text-left">
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                    {insuranceType === 'NONE' ? 'Click to add insurance' : `${insuranceType} Protection Active`}
                  </h3>
                </div>
                <div className="flex items-center gap-6">
                  {insuranceType !== 'NONE' && (
                    <div className="text-right">
                       <p className="text-2xl font-black text-blue-600 tracking-tighter">+${insurancePrice}</p>
                    </div>
                  )}
                  <div className="bg-white px-8 py-4 rounded-2xl border border-slate-100 text-[10px] font-black uppercase tracking-widest shadow-sm">
                    {insuranceType === 'NONE' ? 'CHOOSE PLAN' : 'CHANGE PLAN'}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-10 border-t flex flex-col md:flex-row justify-between items-center gap-8">
               <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Trip Value</p>
                  <p className="text-4xl font-black text-slate-900 tracking-tighter">${totalBookingPrice}</p>
               </div>
               <div className="flex gap-4 w-full md:w-auto">
                 <Button variant="ghost" onClick={() => setStep('PASSENGERS')}>Back</Button>
                 <Button size="xl" onClick={() => setStep('PAYMENT')} className="flex-1 md:flex-none">CONTINUE TO PAYMENT</Button>
               </div>
            </div>
          </div>
          
          {showInsuranceModal && (
            <InsuranceModal currentType={insuranceType} onClose={() => setShowInsuranceModal(false)} onSelect={(type, price) => handleInsuranceSelect(type, price)} />
          )}
        </div>
      )}

      {step === 'PAYMENT' && (
        <PaymentPanel flight={{...flight, price: totalBookingPrice}} onComplete={handlePaymentComplete} onBack={() => setStep('INSURANCE')} />
      )}
    </div>
  );
};
