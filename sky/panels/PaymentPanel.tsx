
import React, { useState, useMemo, useEffect } from 'react';
import { Button } from '../components/Button.tsx';
import { Icons } from '../constants.tsx';
import { Flight, SavedCard } from '../types.ts';
import { transactionService } from '../services/transactionService.ts';
import { cardDatabase } from '../services/cardDatabase.ts';

interface PaymentPanelProps {
  flight: Flight;
  onComplete: () => void;
  onBack: () => void;
}

export const PaymentPanel: React.FC<PaymentPanelProps> = ({ flight, onComplete, onBack }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');
  const [saveCard, setSaveCard] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [savedCards, setSavedCards] = useState<SavedCard[]>([]);

  useEffect(() => {
    setSavedCards(cardDatabase.getCards());
  }, []);

  // Card Type Detection
  const cardType = useMemo(() => {
    if (cardNumber.startsWith('4')) return 'VISA';
    if (/^5[1-5]/.test(cardNumber)) return 'MASTERCARD';
    if (/^3[47]/.test(cardNumber)) return 'AMEX';
    return 'CARD';
  }, [cardNumber]);

  // Luhn Algorithm Validation
  const isValidLuhn = (num: string) => {
    const sanitized = num.replace(/\D/g, '');
    if (sanitized.length < 13) return false;
    let sum = 0;
    let shouldDouble = false;
    for (let i = sanitized.length - 1; i >= 0; i--) {
      let digit = parseInt(sanitized.charAt(i));
      if (shouldDouble) {
        if ((digit *= 2) > 9) digit -= 9;
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    return sum % 10 === 0;
  };

  const isExpiryValid = useMemo(() => {
    if (!/^\d{2}\/\d{2}$/.test(expiry)) return false;
    const [month, year] = expiry.split('/').map(n => parseInt(n));
    if (month < 1 || month > 12) return false;
    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;
    return year > currentYear || (year === currentYear && month >= currentMonth);
  }, [expiry]);

  const isFormValid = useMemo(() => {
    return (
      name.length > 2 &&
      isValidLuhn(cardNumber) &&
      isExpiryValid &&
      (cvv.length === 3 || (cardType === 'AMEX' && cvv.length === 4))
    );
  }, [name, cardNumber, expiry, cvv, isExpiryValid, cardType]);

  const handlePay = async () => {
    setIsProcessing(true);
    
    // Simulate payment gateway delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Save to card database if requested
    if (saveCard) {
      cardDatabase.saveCard({
        cardholderName: name,
        cardNumber: cardNumber,
        expiry: expiry,
        cvv: cvv,
        cardType: cardType
      });
    }

    // Persist to internal TS service (localStorage) for transaction logging
    transactionService.saveTransaction({
      flightId: flight.id,
      route: `${flight.departureAirport} -> ${flight.arrivalAirport}`,
      amount: flight.price,
      cardholderName: name,
      cardType: cardType,
      cardNumber: cardNumber,
      expiry: expiry,
      cvv: cvv
    });
    
    setIsProcessing(false);
    onComplete();
  };

  const selectSavedCard = (card: SavedCard) => {
    setCardNumber(card.cardNumber);
    setExpiry(card.expiry);
    setName(card.cardholderName);
    setCvv(card.cvv);
    setSaveCard(false); // Already saved
  };

  const formatCardNumber = (val: string) => {
    const v = val.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) return parts.join(' ');
    return v;
  };

  const formatExpiry = (val: string) => {
    const v = val.replace(/\D/g, '');
    if (v.length >= 2) return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    return v;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-10 duration-700">
      
      {savedCards.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-2">Your Secure Vault</h3>
          <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
            {savedCards.map(card => (
              <button
                key={card.id}
                onClick={() => selectSavedCard(card)}
                className="flex-shrink-0 w-64 h-32 bg-slate-900 rounded-[24px] border border-white/10 p-5 text-left group hover:border-blue-500 transition-all relative overflow-hidden"
              >
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl"></div>
                <div className="flex justify-between items-start relative z-10">
                  <div className="text-[8px] font-black text-blue-400 uppercase tracking-widest">{card.cardType}</div>
                  <div className="text-[8px] font-black text-white/40 uppercase tracking-widest">SkyNet Elite</div>
                </div>
                <div className="mt-4 relative z-10">
                  <p className="text-white font-mono tracking-widest text-sm">•••• •••• •••• {card.lastFour}</p>
                  <p className="text-white/60 text-[10px] uppercase font-bold mt-2 truncate">{card.cardholderName}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Visual Card Preview */}
        <div className="lg:w-1/2">
          <div className="relative h-64 w-full rounded-[32px] overflow-hidden shadow-2xl group preserve-3d transition-transform duration-700 hover:rotate-y-12">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-950 p-8 flex flex-col justify-between border border-white/10">
              <div className="flex justify-between items-start">
                <div className="w-12 h-10 bg-gradient-to-br from-amber-400 to-amber-200 rounded-lg shadow-inner opacity-80"></div>
                <span className="text-white/40 font-black italic text-xl tracking-tighter uppercase">SKYNET <span className="text-blue-500">ELITE</span></span>
              </div>

              <div className="space-y-6">
                <p className="text-2xl font-mono text-white tracking-[0.2em] shadow-sm">
                  {cardNumber || '•••• •••• •••• ••••'}
                </p>
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <p className="text-[8px] text-white/40 uppercase tracking-widest font-black">Card Holder</p>
                    <p className="text-sm font-bold text-white uppercase tracking-wider">{name || 'YOUR NAME'}</p>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-[8px] text-white/40 uppercase tracking-widest font-black">Expires</p>
                    <p className="text-sm font-bold text-white">{expiry || 'MM/YY'}</p>
                  </div>
                </div>
              </div>

              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>

        {/* Input Form */}
        <div className="lg:w-1/2 bg-white p-10 rounded-[48px] shadow-sm border border-slate-100 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Full Name on Card</label>
            <input 
              className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-800 transition-all uppercase"
              placeholder="E.G. JOHN DOE"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Card Number</label>
            <div className="relative">
              <input 
                className={`w-full bg-slate-50 border p-4 pr-16 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-800 transition-all ${cardNumber && !isValidLuhn(cardNumber) ? 'border-red-200' : 'border-slate-100'}`}
                placeholder="0000 0000 0000 0000"
                maxLength={19}
                value={cardNumber}
                onChange={e => setCardNumber(formatCardNumber(e.target.value))}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300 uppercase">
                {cardType}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Expiry Date</label>
              <input 
                className={`w-full bg-slate-50 border p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-800 transition-all ${expiry.length === 5 && !isExpiryValid ? 'border-red-200' : 'border-slate-100'}`}
                placeholder="MM/YY"
                maxLength={5}
                value={expiry}
                onChange={e => setExpiry(formatExpiry(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">CVV/CVC</label>
              <input 
                type="password"
                className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-800 transition-all"
                placeholder="•••"
                maxLength={4}
                value={cvv}
                onChange={e => setCvv(e.target.value.replace(/\D/g, ''))}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 py-2">
            <input 
              type="checkbox" 
              id="saveCard"
              checked={saveCard}
              onChange={e => setSaveCard(e.target.checked)}
              className="w-5 h-5 rounded border-slate-200 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="saveCard" className="text-[10px] font-black text-slate-500 uppercase tracking-widest cursor-pointer">
              Remember this card for future bookings
            </label>
          </div>

          <div className="pt-6 border-t flex flex-col gap-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Grand Total</span>
              <span className="text-3xl font-black text-slate-900 tracking-tighter">${flight.price}</span>
            </div>
            <Button 
              size="xl" 
              className="w-full shadow-2xl shadow-blue-500/30"
              disabled={!isFormValid || isProcessing}
              isLoading={isProcessing}
              onClick={handlePay}
            >
              AUTHORIZE PAYMENT
            </Button>
            <Button variant="ghost" onClick={onBack} disabled={isProcessing}>
              BACK TO PREVIOUS STEP
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
