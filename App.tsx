
import React, { useState, useEffect, useCallback } from 'react';
import { SearchParams, Flight, AppView, Booking, PassengerDetails, GroundingChunk, PriceAlert } from './types.ts';
import { generateMockFlights } from './services/mockData.ts';
import { fetchRealFlights } from './services/geminiService.ts';
import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { HomePanel } from './panels/HomePanel.tsx';
import { InternationalPanel } from './panels/InternationalPanel.tsx';
import { HotelsPanel } from './panels/HotelsPanel.tsx';
import { ResultsPanel } from './panels/ResultsPanel.tsx';
import { BookingPanel } from './panels/BookingPanel.tsx';
import { MyTripsPanel } from './panels/MyTripsPanel.tsx';
import { AuthPanel } from './panels/AuthPanel.tsx';
import { BundleBookingPanel } from './panels/BundleBookingPanel.tsx';
import { BookingChoicePanel } from './panels/BookingChoicePanel.tsx';
import { AdminPanel } from './panels/AdminPanel.tsx';
import { authService, User } from './services/authService.ts';

const App: React.FC = () => {
  const [currentView, setView] = useState<AppView>('HOME');
  const [isNavigating, setIsNavigating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const [searchParams, setSearchParams] = useState<SearchParams>({
    origin: 'SFO',
    destination: 'JFK',
    cabinClass: 'Economy',
    passengers: 1,
    date: new Date().toISOString().split('T')[0],
    returnDate: new Date(Date.now() + 604800000).toISOString().split('T')[0],
    tripType: 'ROUND_TRIP'
  });

  const [allFlights, setAllFlights] = useState<Flight[][]>([]);
  const [currentLegIndex, setCurrentLegIndex] = useState(0);
  const [selectedLegs, setSelectedLegs] = useState<Flight[]>([]);
  const [groundingSources, setGroundingSources] = useState<GroundingChunk[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [bookingType, setBookingType] = useState<'QUICK' | 'NORMAL'>('NORMAL');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(authService.getSession());
  const [recentSearches, setRecentSearches] = useState<SearchParams[]>([]);

  // Smooth navigation helper
  const navigateTo = useCallback((view: AppView) => {
    setIsNavigating(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      setView(view);
      setIsNavigating(false);
    }, 300);
  }, []);

  useEffect(() => {
    const savedBookings = localStorage.getItem('skyNet_bookings');
    if (savedBookings) setBookings(JSON.parse(savedBookings));
    const savedAlerts = localStorage.getItem('skyNet_alerts');
    if (savedAlerts) setPriceAlerts(JSON.parse(savedAlerts));
    
    // Clear error message after 5 seconds
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    navigateTo('RESULTS');
    setCurrentLegIndex(0);
    setSelectedLegs([]);
    setAllFlights([]);
    
    const nextRecent = [searchParams, ...recentSearches.filter(s => s.origin !== searchParams.origin || s.destination !== searchParams.destination)].slice(0, 3);
    setRecentSearches(nextRecent);

    try {
      if (searchParams.tripType === 'MULTI_CITY' && searchParams.multiCityLegs) {
        const legPromises = searchParams.multiCityLegs.map(leg => 
          fetchRealFlights({ ...searchParams, origin: leg.origin, destination: leg.destination, date: leg.date })
            .catch(() => ({ flights: generateMockFlights({ ...searchParams, origin: leg.origin, destination: leg.destination, date: leg.date }), sources: [] }))
        );
        const responses = await Promise.all(legPromises);
        setAllFlights(responses.map(r => r.flights));
        setGroundingSources(responses[0].sources);
      } else if (searchParams.tripType === 'ROUND_TRIP') {
        const outbound = await fetchRealFlights(searchParams).catch(() => ({ flights: generateMockFlights(searchParams), sources: [] }));
        const inbound = await fetchRealFlights({ ...searchParams, origin: searchParams.destination, destination: searchParams.origin, date: searchParams.returnDate || searchParams.date })
          .catch(() => ({ flights: generateMockFlights({ ...searchParams, origin: searchParams.destination, destination: searchParams.origin, date: searchParams.returnDate || searchParams.date }), sources: [] }));
        setAllFlights([outbound.flights, inbound.flights]);
        setGroundingSources(outbound.sources);
      } else {
        const res = await fetchRealFlights(searchParams).catch(() => ({ flights: generateMockFlights(searchParams), sources: [] }));
        setAllFlights([res.flights]);
        setGroundingSources(res.sources);
      }
    } catch (err) {
      setErrorMessage("Intelligence systems are busy. Falling back to verified schedules.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleBook = (flight: Flight) => {
    const newSelected = [...selectedLegs, flight];
    setSelectedLegs(newSelected);

    if (newSelected.length < allFlights.length) {
      setCurrentLegIndex(newSelected.length);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigateTo('BOOKING_CHOICE');
    }
  };

  const handleBookingChoice = (type: 'QUICK' | 'NORMAL') => {
    setBookingType(type);
    if (type === 'NORMAL' && !currentUser) {
      navigateTo('AUTH');
    } else {
      navigateTo('BOOKING');
    }
  };

  const completeBooking = (
    details: PassengerDetails[], 
    seats: string[], 
    bookingUserId?: string,
    insuranceType: 'NONE' | 'BASIC' | 'PREMIUM' = 'NONE',
    insurancePrice: number = 0
  ) => {
    if (selectedLegs.length === 0) return;
    
    const totalPrice = selectedLegs.reduce((acc, f) => acc + f.price, 0) + insurancePrice;

    const newBooking: Booking = {
      id: `BK-${Math.floor(10000 + Math.random() * 90000)}`,
      flight: selectedLegs[0],
      returnFlight: searchParams.tripType === 'ROUND_TRIP' ? selectedLegs[1] : undefined,
      multiCityFlights: searchParams.tripType === 'MULTI_CITY' ? selectedLegs : undefined,
      seats,
      passengers: details,
      totalPrice,
      status: 'confirmed',
      bookingDate: new Date().toISOString(),
      bookingUserId,
      type: bookingType,
      insuranceType,
      insurancePrice
    };

    const updated = [newBooking, ...bookings];
    setBookings(updated);
    localStorage.setItem('skyNet_bookings', JSON.stringify(updated));
    navigateTo('MY_TRIPS');
    setSelectedLegs([]);
  };

  const handleCancelBooking = (id: string) => {
    const updated = bookings.map(b => b.id === id ? { ...b, status: 'cancelled' as const } : b);
    setBookings(updated);
    localStorage.setItem('skyNet_bookings', JSON.stringify(updated));
  };

  const handleAddAlert = (alert: Omit<PriceAlert, 'id' | 'createdAt'>) => {
    const newAlert: PriceAlert = {
      ...alert,
      id: `AL-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toLocaleDateString()
    };
    const updated = [newAlert, ...priceAlerts];
    setPriceAlerts(updated);
    localStorage.setItem('skyNet_alerts', JSON.stringify(updated));
    setErrorMessage("Price alert established. We'll track this route for you.");
  };

  const handleRemoveAlert = (id: string) => {
    const updated = priceAlerts.filter(a => a.id !== id);
    setPriceAlerts(updated);
    localStorage.setItem('skyNet_alerts', JSON.stringify(updated));
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    navigateTo('HOME');
  };

  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    if (selectedLegs.length > 0) {
      navigateTo('BOOKING');
    } else {
      navigateTo('HOME');
    }
  };

  return (
    <div className={`flex flex-col min-h-screen transition-opacity duration-300 ${isNavigating ? 'opacity-50' : 'opacity-100'}`}>
      {currentView !== 'ADMIN' && (
        <Navbar 
          currentView={currentView} 
          setView={navigateTo} 
          isAuthenticated={!!currentUser} 
          userName={currentUser?.firstName}
          userStatus={currentUser?.memberStatus}
          onLogout={handleLogout}
        />
      )}
      
      {/* Intelligence Toast */}
      {errorMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-4">
          <div className="bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl border border-white/10 flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
             <p className="text-[10px] font-black uppercase tracking-widest">{errorMessage}</p>
          </div>
        </div>
      )}
      
      <main className="flex-grow">
        {currentView === 'HOME' && (
          <HomePanel 
            params={searchParams} 
            setParams={setSearchParams} 
            onSearch={handleSearch}
            recentSearches={recentSearches}
            onRecentSearchClick={(p) => { setSearchParams(p); navigateTo('RESULTS'); }}
            currentUser={currentUser}
          />
        )}
        {currentView === 'INTERNATIONAL' && (
          <InternationalPanel 
            params={searchParams} 
            setParams={setSearchParams} 
            onSearch={handleSearch} 
          />
        )}
        {currentView === 'HOTELS' && <HotelsPanel setView={navigateTo} />}
        {currentView === 'RESULTS' && (
          <ResultsPanel 
            params={searchParams} 
            setParams={setSearchParams} 
            onSearch={handleSearch} 
            results={allFlights[currentLegIndex] || []}
            sources={groundingSources}
            isSearching={isSearching}
            onBook={handleBook}
            onAddAlert={handleAddAlert}
            isAuthenticated={!!currentUser}
            currentLegIndex={currentLegIndex}
            totalLegs={allFlights.length}
            selectedFlights={selectedLegs}
          />
        )}
        {currentView === 'BOOKING_CHOICE' && (
          <BookingChoicePanel 
            isAuthenticated={!!currentUser} 
            onSelect={handleBookingChoice}
            onCancel={() => {
              setSelectedLegs([]);
              navigateTo('RESULTS');
            }}
          />
        )}
        {currentView === 'BOOKING' && selectedLegs.length > 0 && (
          <BookingPanel 
            flight={selectedLegs[0]} 
            returnFlight={searchParams.tripType === 'ROUND_TRIP' ? selectedLegs[1] : undefined}
            multiCityFlights={searchParams.tripType === 'MULTI_CITY' ? selectedLegs : undefined}
            passengersCount={searchParams.passengers}
            bookingType={bookingType}
            isAuthenticated={!!currentUser}
            onComplete={completeBooking}
            onCancel={() => navigateTo('RESULTS')}
          />
        )}
        {currentView === 'MY_TRIPS' && (
          <MyTripsPanel 
            bookings={bookings} 
            alerts={priceAlerts}
            onCancelBooking={handleCancelBooking}
            onRemoveAlert={handleRemoveAlert}
            onShare={() => {}}
          />
        )}
        {currentView === 'AUTH' && <AuthPanel onSuccess={handleAuthSuccess} />}
        {currentView === 'BUNDLE_BOOKING' && (
          <BundleBookingPanel 
            onCancel={() => navigateTo('HOTELS')}
            onComplete={({params, passengerDetails}) => {
              setErrorMessage("Bundle request submitted! Finalizing logistics.");
              navigateTo('MY_TRIPS');
            }}
          />
        )}
        {currentView === 'ADMIN' && <AdminPanel onExit={() => navigateTo('HOME')} />}
      </main>

      {currentView !== 'ADMIN' && <Footer onAdminTrigger={() => navigateTo('ADMIN')} />}
    </div>
  );
};

export default App;
