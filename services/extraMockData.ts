
import { Hotel } from '../types.ts';

const PRICE_MULTIPLIER = 1.0;

export const HOTEL_PHOTOS = [
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1200", // Luxury Resort Pool
  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=1200", // Modern Lobby
  "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1200", // Grand Hotel Exterior
  "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=1200", // Beachfront Suite
  "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&q=80&w=1200"  // Luxury Bedroom
];

export const generateHotels = (city: string): Hotel[] => {
  const hotelNames = [
    { name: 'Palace & Spa', price: 450, desc: 'Ultra-luxury experience with panoramic views.' },
    { name: 'Grand Continental', price: 280, desc: 'Modern business comfort in the heart of the city.' },
    { name: 'City Central Inn', price: 150, desc: 'Reliable and comfortable stay for explorers.' },
    { name: 'Travelers Lodge', price: 85, desc: 'Basic essentials for budget-conscious trips.' },
    { name: 'Roadside Budget', price: 45, desc: 'Simple, clean, and extremely affordable.' }
  ];

  return hotelNames.map((h, i) => ({
    id: `${city}-${5 - i}`,
    name: `${city} ${h.name}`,
    city: city,
    stars: 5 - i,
    pricePerNight: Math.floor(h.price * PRICE_MULTIPLIER),
    image: HOTEL_PHOTOS[i % HOTEL_PHOTOS.length],
    description: h.desc
  }));
};

export const TRENDING_DOMESTIC_ROUTES = [
  { 
    city: 'Los Angeles', 
    from: 'JFK', 
    price: Math.floor(288 * PRICE_MULTIPLIER).toString(), 
    img: 'https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?auto=format&fit=crop&q=80&w=800' 
  },
  { 
    city: 'Chicago', 
    from: 'LGA', 
    price: Math.floor(145 * PRICE_MULTIPLIER).toString(), 
    img: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&q=80&w=800' 
  },
  { 
    city: 'Orlando', 
    from: 'SFO', 
    price: Math.floor(210 * PRICE_MULTIPLIER).toString(), 
    img: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&q=80&w=800' 
  }
];

export const FEATURED_INTERNATIONAL_DESTINATIONS = [
  { 
    city: 'London', 
    price: Math.floor(645 * PRICE_MULTIPLIER).toString(), 
    img: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&q=80&w=800' 
  },
  { 
    city: 'Paris', 
    price: Math.floor(685 * PRICE_MULTIPLIER).toString(), 
    img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=800' 
  },
  { 
    city: 'Frankfurt', 
    price: Math.floor(599 * PRICE_MULTIPLIER).toString(), 
    img: 'https://images.unsplash.com/photo-1541613569553-332985dd016f?auto=format&fit=crop&q=80&w=800' 
  }
];
