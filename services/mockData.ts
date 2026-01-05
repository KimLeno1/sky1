
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

// Reset Global Price Multiplier to 1.0 (Standard Rates)
const PRICE_MULTIPLIER = 1.0;

// Standard Fare Ranges (USD)
const FARE_RANGES = {
  UNDER_500: [[49, 120], [80, 160], [180, 350], [450, 900]],
  B500_1000: [[89, 190], [120, 240], [250, 500], [600, 1200]],
  B1000_1500: [[129, 280], [180, 380], [350, 750], [850, 1800]],
  OVER_1500: [[199, 450], [280, 550], [600, 1200], [1200, 3500]]
};

/**
 * SOURCE: Extracted from provided PNG for DTW to TUS route.
 * These are the exact baseline prices from the image.
 */
const VERIFIED_IMAGE_DATA = [
  { id: 'DL1234', airline: 'Delta Air Lines', price: 250, dep: '08:00 AM', arr: '10:30 AM', duration: '2h 30m', stops: 0, aircraft: 'Boeing 737-800' },
  { id: 'AA5678', airline: 'American Airlines', price: 265, dep: '09:15 AM', arr: '11:45 AM', duration: '2h 30m', stops: 0, aircraft: 'Airbus A321' },
  { id: 'F99012', airline: 'Frontier Airlines', price: 180, dep: '07:30 AM', arr: '10:00 AM', duration: '2h 30m', stops: 0, aircraft: 'Airbus A320' },
  { id: 'UA3456', airline: 'United Airlines', price: 270, dep: '10:00 AM', arr: '12:30 PM', duration: '2h 30m', stops: 1, aircraft: 'Boeing 737 Max 8' },
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
  // If specific route is DTW to TUS, return exact PNG data
  if (params.origin === 'DTW' && params.destination === 'TUS') {
    return VERIFIED_IMAGE_DATA.map(d => {
      const airlineMatch = AIRLINES.find(a => a.name === d.airline)!;
      return {
        id: d.id,
        airline: d.airline,
        logo: airlineMatch.logo,
        departureAirport: params.origin,
        arrivalAirport: params.destination,
        departureTime: d.dep,
        arrivalTime: d.arr,
        duration: d.duration,
        price: Math.floor(d.price * params.passengers),
        class: params.cabinClass,
        stops: d.stops,
        aircraftType: d.aircraft,
        baggageAllowance: '1 x 23kg Checked, 1 Carry-on',
        verifiedSchedule: true
      };
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

  const classIdx = { 'Economy': 0, 'Premium': 1, 'Business': 2, 'First': 3 }[params.cabinClass] || 0;
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
    const finalPrice = Math.floor(basePrice * params.passengers * PRICE_MULTIPLIER);

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
