
export interface Airport {
  code: string;
  name: string;
  city: string;
  region: 'America' | 'Europe';
  lat: number;
  lng: number;
}

export interface MultiCityLeg {
  origin: string;
  destination: string;
  date: string;
}

export interface SearchParams {
  origin: string;
  destination: string;
  cabinClass: 'Economy' | 'Premium' | 'Business' | 'First';
  passengers: number;
  date: string;
  returnDate?: string;
  tripType: 'ONE_WAY' | 'ROUND_TRIP' | 'MULTI_CITY';
  multiCityLegs?: MultiCityLeg[];
}

export interface Flight {
  id: string;
  airline: string;
  logo: string;
  departureAirport: string;
  arrivalAirport: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  class: string;
  stops: number;
  aircraftType: string;
  baggageAllowance: string;
}

export interface PriceAlert {
  id: string;
  origin: string;
  destination: string;
  targetPrice: number;
  currentPrice: number;
  cabinClass: string;
  createdAt: string;
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface FlightSearchResponse {
  flights: Flight[];
  sources: GroundingChunk[];
}

export interface Hotel {
  id: string;
  name: string;
  city: string;
  stars: number;
  pricePerNight: number;
  image: string;
  description: string;
}

export interface Booking {
  id: string;
  flight: Flight; // For One-way
  returnFlight?: Flight; // For Round-trip
  multiCityFlights?: Flight[]; // For Multi-city
  seats: string[];
  passengers: PassengerDetails[];
  totalPrice: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  bookingDate: string;
  bookingUserId?: string;
  type: 'QUICK' | 'NORMAL';
  insuranceType?: 'NONE' | 'BASIC' | 'PREMIUM';
  insurancePrice?: number;
}

export interface PassengerDetails {
  firstName: string;
  lastName: string;
  email: string;
  passportNumber: string;
}

export interface SavedCard {
  id: string;
  cardholderName: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
  cardType: string;
  lastFour: string;
}

export type AppView = 'HOME' | 'RESULTS' | 'BOOKING_CHOICE' | 'BOOKING' | 'MY_TRIPS' | 'INTERNATIONAL' | 'HOTELS' | 'AUTH' | 'BUNDLE_BOOKING' | 'ADMIN';
