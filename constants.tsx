
import React from 'react';
import { Airport } from './types.ts';

export const APP_NAME = "SkyNet";

export const AIRPORTS: Airport[] = [
  // America - Top Hubs with Coords
  { code: 'JFK', name: 'John F. Kennedy International', city: 'New York', region: 'America', lat: 40.6413, lng: -73.7781 },
  { code: 'LAX', name: 'Los Angeles International', city: 'Los Angeles', region: 'America', lat: 33.9416, lng: -118.4085 },
  { code: 'SFO', name: 'San Francisco International', city: 'San Francisco', region: 'America', lat: 37.6213, lng: -122.3790 },
  { code: 'LGA', name: 'LaGuardia Airport', city: 'New York', region: 'America', lat: 40.7769, lng: -73.8740 },
  { code: 'ORD', name: 'O\'Hare International', city: 'Chicago', region: 'America', lat: 41.9742, lng: -87.9073 },
  { code: 'ATL', name: 'Hartsfield-Jackson Atlanta', city: 'Atlanta', region: 'America', lat: 33.6407, lng: -84.4277 },
  { code: 'MCO', name: 'Orlando International', city: 'Orlando', region: 'America', lat: 28.4312, lng: -81.3081 },
  { code: 'LAS', name: 'Harry Reid International', city: 'Las Vegas', region: 'America', lat: 36.0840, lng: -115.1537 },
  { code: 'DEN', name: 'Denver International', city: 'Denver', region: 'America', lat: 39.8561, lng: -104.6737 },
  { code: 'SEA', name: 'Seattle-Tacoma International', city: 'Seattle', region: 'America', lat: 47.4502, lng: -122.3088 },
  { code: 'DFW', name: 'Dallas/Fort Worth International', city: 'Dallas', region: 'America', lat: 32.8998, lng: -97.0403 },
  { code: 'BOS', name: 'Logan International', city: 'Boston', region: 'America', lat: 42.3656, lng: -71.0096 },
  { code: 'PHX', name: 'Phoenix Sky Harbor', city: 'Phoenix', region: 'America', lat: 33.4342, lng: -112.0080 },
  { code: 'IAH', name: 'George Bush Intercontinental', city: 'Houston', region: 'America', lat: 29.9902, lng: -95.3368 },
  { code: 'MSP', name: 'Minneapolis-Saint Paul', city: 'Minneapolis', region: 'America', lat: 44.8848, lng: -93.2223 },
  { code: 'DTW', name: 'Detroit Metropolitan', city: 'Detroit', region: 'America', lat: 42.2125, lng: -83.3533 },
  { code: 'TUS', name: 'Tucson International', city: 'Tucson', region: 'America', lat: 32.1161, lng: -110.9410 },
  { code: 'EWR', name: 'Newark Liberty International', city: 'Newark', region: 'America', lat: 40.6895, lng: -74.1745 },
  { code: 'SAN', name: 'San Diego International', city: 'San Diego', region: 'America', lat: 32.7338, lng: -117.1933 },
  { code: 'PHL', name: 'Philadelphia International', city: 'Philadelphia', region: 'America', lat: 39.8729, lng: -75.2437 },
  { code: 'DCA', name: 'Ronald Reagan Washington National', city: 'Washington', region: 'America', lat: 38.8512, lng: -77.0402 },
  { code: 'HOU', name: 'William P. Hobby', city: 'Houston', region: 'America', lat: 29.6454, lng: -95.2789 },
  { code: 'DAL', name: 'Dallas Love Field', city: 'Dallas', region: 'America', lat: 32.8471, lng: -96.8518 },
  { code: 'HNL', name: 'Daniel K. Inouye International', city: 'Honolulu', region: 'America', lat: 21.3156, lng: -157.9242 },
  { code: 'OGG', name: 'Kahului Airport', city: 'Maui', region: 'America', lat: 20.8986, lng: -156.4305 },
  { code: 'MIA', name: 'Miami International', city: 'Miami', region: 'America', lat: 25.7959, lng: -80.2870 },
  { code: 'FLL', name: 'Fort Lauderdale-Hollywood', city: 'Fort Lauderdale', region: 'America', lat: 26.0742, lng: -80.1506 },
  { code: 'CLT', name: 'Charlotte Douglas International', city: 'Charlotte', region: 'America', lat: 35.2144, lng: -80.9473 },
  { code: 'BNA', name: 'Nashville International', city: 'Nashville', region: 'America', lat: 36.1263, lng: -86.6774 },
  { code: 'AUS', name: 'Austin-Bergstrom International', city: 'Austin', region: 'America', lat: 30.1944, lng: -97.6700 },

  // Europe - Major Hubs
  { code: 'LHR', name: 'London Heathrow', city: 'London', region: 'Europe', lat: 51.4700, lng: -0.4543 },
  { code: 'CDG', name: 'Charles de Gaulle', city: 'Paris', region: 'Europe', lat: 49.0097, lng: 2.5479 },
  { code: 'FRA', name: 'Frankfurt Airport', city: 'Frankfurt', region: 'Europe', lat: 50.0379, lng: 8.5622 },
  { code: 'AMS', name: 'Amsterdam Schiphol', city: 'Amsterdam', region: 'Europe', lat: 52.3105, lng: 4.7683 },
  { code: 'MAD', name: 'Adolfo Suárez Madrid–Barajas', city: 'Madrid', region: 'Europe', lat: 40.4839, lng: -3.5680 },
];

export const Icons = {
  Plane: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-1.1.1-1.3.6l-.3.6c-.2.5 0 1.1.4 1.4l7 3.7-1.8 1.8L5 14.3c-.4 0-.8.2-1 .5l-.3.5c-.2.5 0 1.1.5 1.3l9 3.8c.3.1.6.1.9 0l.4-.1c.3-.1.5-.4.6-.7l.3-.6c.1-.3.1-.6 0-.9l-.3-.6z"/></svg>
  ),
  Send: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
  ),
  Search: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
  ),
  Users: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  ),
  Filter: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
  ),
  Briefcase: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
  ),
  ChevronRight: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
  ),
  Map: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/></svg>
  ),
  Star: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
  ),
  Building: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M8 10h.01"/><path d="M16 10h.01"/><path d="M8 14h.01"/><path d="M16 14h.01"/></svg>
  ),
  Bell: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
  ),
  Share: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/></svg>
  ),
  Shield: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
  ),
  Mail: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
  ),
};
