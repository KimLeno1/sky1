
import { Flight, SearchParams, Airport } from '../types.ts';
import { AIRPORTS } from '../constants.tsx';

export const AIRLINES = [
  { name: 'American Airlines', code: 'AA', logo: 'https://logos-world.net/wp-content/uploads/2025/05/Logo-American-Airlines.jpg' },
  { name: 'Delta Air Lines', code: 'DL', logo: 'https://logos-world.net/wp-content/uploads/2021/08/Delta-Logo.png' },
  { name: 'United Airlines', code: 'UA', logo: 'https://logos-world.net/wp-content/uploads/2020/11/United-Airlines-Logo.png' },
  { name: 'Southwest Airlines', code: 'WN', logo: 'https://logos-world.net/wp-content/uploads/2020/10/Southwest-Airlines-Logo.png' },
  { name: 'Alaska Airlines', code: 'AS', logo: 'https://logos-world.net/wp-content/uploads/2021/02/Alaska-Airlines-Logo.png' },
  { name: 'Spirit Airlines', code: 'NK', logo: 'https://logos-world.net/wp-content/uploads/2025/05/Logo-Spirit-Airlines.jpg' },
  { name: 'Frontier Airlines', code: 'F9', logo: 'https://logos-world.net/wp-content/uploads/2025/05/Logo-Frontier-Airlines.jpg' },
  { name: 'JetBlue Airways', code: 'B6', logo: 'https://logos-world.net/wp-content/uploads/2025/05/Logo-JetBlue-Airways.jpg' },
  { name: 'Allegiant Air', code: 'G4', logo: 'https://logos-world.net/wp-content/uploads/2025/05/Logo-Allegiant-Air.jpg' },
  { name: 'Hawaiian Airlines', code: 'HA', logo: 'https://logos-world.net/wp-content/uploads/2025/05/Logo-Hawaiian-Airlines.jpg' },
];

const TRANSATLANTIC_CAPABLE = ['AA', 'DL', 'UA', 'B6'];

const FARE_RANGES = {
  UNDER_500: [[49, 150], [70, 180], [150, 300], [300, 800]],
  B500_1000: [[70, 200], [100, 260], [200, 450], [400, 1000]],
  B1000_1500: [[90, 270], [130, 350], [280, 550], [500, 1200]],
  OVER_1500: [[120, 350], [160, 420], [350, 700], [600, 1600]]
};

/**
 * PRODUCTION DIRECTIVE: Prices for DTW -> TUS are doubled (100% increase) as per strategic pricing rules.
 */
const DTW_TUS_VERIFIED_DATA = [
  // United Column
  { id: 'UA-DTW-1', airline: 'United Airlines', price: 1000, dep: '06:00', arr: '08:30', aircraft: 'Airbus A320' },
  { id: 'UA-DTW-2', airline: 'United Airlines', price: 1080, dep: '08:15', arr: '10:45', aircraft: 'Boeing 737-800' },
  { id: 'UA-DTW-3', airline: 'United Airlines', price: 800, dep: '11:30', arr: '14:00', aircraft: 'Embraer 175' },
  { id: 'UA-DTW-4', airline: 'United Airlines', price: 400, dep: '14:45', arr: '17:15', aircraft: 'Airbus A319' },
  { id: 'UA-DTW-5', airline: 'United Airlines', price: 400, dep: '18:00', arr: '20:30', aircraft: 'Boeing 737-900' },
  
  // Southwest Column
  { id: 'WN-DTW-1', airline: 'Southwest Airlines', price: 800, dep: '07:30', arr: '10:00', aircraft: 'Boeing 737-700' },
  { id: 'WN-DTW-2', airline: 'Southwest Airlines', price: 800, dep: '09:45', arr: '12:15', aircraft: 'Boeing 737-800' },
  { id: 'WN-DTW-3', airline: 'Southwest Airlines', price: 400, dep: '12:00', arr: '14:30', aircraft: 'Boeing 737 Max 8' },
  { id: 'WN-DTW-4', airline: 'Southwest Airlines', price: 800, dep: '15:30', arr: '18:00', aircraft: 'Boeing 737-700' },
  { id: 'WN-DTW-5', airline: 'Southwest Airlines', price: 1196, dep: '19:15', arr: '21:45', aircraft: 'Boeing 737-800' },

  // American Airlines Column
  { id: 'AA-DTW-1', airline: 'American Airlines', price: 1200, dep: '06:45', arr: '09:15', aircraft: 'Airbus A321' },
  { id: 'AA-DTW-2', airline: 'American Airlines', price: 800, dep: '10:30', arr: '13:00', aircraft: 'Boeing 737-800' },
  { id: 'AA-DTW-3', airline: 'American Airlines', price: 1200, dep: '13:15', arr: '15:45', aircraft: 'Airbus A319' },
  { id: 'AA-DTW-4', airline: 'American Airlines', price: 1000, dep: '16:00', arr: '18:30', aircraft: 'Boeing 737 Max 8' },
  { id: 'AA-DTW-5', airline: 'American Airlines', price: 1200, dep: '21:00', arr: '23:30', aircraft: 'Airbus A321' },

  // Delta Column
  { id: 'DL-DTW-1', airline: 'Delta Air Lines', price: 4000, dep: '08:00', arr: '10:30', aircraft: 'Airbus A321neo' },
  { id: 'DL-DTW-2', airline: 'Delta Air Lines', price: 2800, dep: '12:45', arr: '15:15', aircraft: 'Boeing 757-200' },
  { id: 'DL-DTW-3', airline: 'Delta Air Lines', price: 10000, dep: '17:30', arr: '20:00', aircraft: 'Airbus A321neo' },
  { id: 'DL-DTW-4', airline: 'Delta Air Lines', price: 4000, dep: '23:45', arr: '02:15', aircraft: 'Boeing 737-900' },
  { id: 'DL-DTW-5', airline: 'Delta Air Lines', price: 6000, dep: '02:45', arr: '05:15', aircraft: 'Airbus A319' },
];

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3958.8;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export const generateMockFlights = (params: SearchParams): Flight[] => {
  if (params.origin === 'DTW' && params.destination === 'TUS') {
    return DTW_TUS_VERIFIED_DATA.map(d => {
      const airlineMatch = AIRLINES.find(a => a.name === d.airline)!;
      return {
        id: d.id,
        airline: d.airline,
        logo: airlineMatch.logo,
        departureAirport: 'DTW',
        arrivalAirport: 'TUS',
        departureTime: d.dep,
        arrivalTime: d.arr,
        duration: '4h 30m',
        price: Math.floor(d.price * params.passengers),
        class: params.cabinClass,
        stops: 0,
        aircraftType: d.aircraft,
        baggageAllowance: '2 x 23kg Checked, 1 Carry-on',
        verifiedSchedule: true
      } as Flight & { verifiedSchedule: boolean };
    }).sort((a, b) => a.price - b.price);
  }

  const origin = AIRPORTS.find(a => a.code === params.origin);
  const destination = AIRPORTS.find(a => a.code === params.destination);
  
  if (!origin || !destination) return [];

  const distance = getDistance(origin.lat, origin.lng, destination.lat, destination.lng);
  
  let band: number[][];
  if (distance < 500) band = FARE_RANGES.UNDER_500;
  else if (distance < 1000) band = FARE_RANGES.B500_1000;
  else if (distance < 1500) band = FARE_RANGES.B1000_1500;
  else band = FARE_RANGES.OVER_1500;

  const classIdx = { 'Economy': 1, 'Premium': 2, 'Business': 3, 'First': 3 }[params.cabinClass] || 1;
  const range = band[classIdx];
  
  const isTransatlantic = origin.region !== destination.region;
  const availableAirlines = isTransatlantic 
    ? AIRLINES.filter(a => TRANSATLANTIC_CAPABLE.includes(a.code))
    : AIRLINES.filter(() => true);

  return Array.from({ length: 12 }, (_, i) => {
    const airline = availableAirlines[i % availableAirlines.length];
    const depTime = (6 + i * 1.5) % 24;
    const durationHours = isTransatlantic ? Math.floor(distance / 450) + 1 : Math.max(1, Math.floor(distance / 400));
    
    let basePrice = Math.floor(range[0] + Math.random() * (range[1] - range[0]));
    basePrice = Math.floor(basePrice * 1.44); 

    const finalPrice = Math.floor(basePrice * params.passengers);

    return {
      id: `${airline.code}${Math.floor(100 + Math.random() * 899)}`,
      airline: airline.name,
      logo: airline.logo,
      departureAirport: params.origin,
      arrivalAirport: params.destination,
      departureTime: `${Math.floor(depTime).toString().padStart(2, '0')}:${(depTime % 1 * 60).toString().padStart(2, '0')}`,
      arrivalTime: `${Math.floor((depTime + durationHours) % 24).toString().padStart(2, '0')}:${((depTime + durationHours) % 1 * 60).toString().padStart(2, '0')}`,
      duration: `${durationHours}h ${Math.floor(Math.random()*6)*10}m`,
      price: finalPrice,
      class: params.cabinClass,
      stops: distance > 2800 ? 1 : 0,
      aircraftType: distance > 2000 ? 'Boeing 787-9 Dreamliner' : 'Airbus A321neo',
      baggageAllowance: distance > 1500 ? '2 x 23kg Checked, 1 Carry-on' : '1 x 23kg Checked, 1 Carry-on'
    };
  }).sort((a, b) => a.price - b.price);
};
