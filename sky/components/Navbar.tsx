
import React, { useState } from 'react';
import { Icons, APP_NAME } from '../constants.tsx';
import { AppView } from '../types.ts';
import { Button } from './Button.tsx';

interface NavbarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  isAuthenticated?: boolean;
  userName?: string;
  userStatus?: string;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  currentView, 
  setView, 
  isAuthenticated, 
  userName, 
  userStatus,
  onLogout 
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (view: AppView) => {
    setView(view);
    setMobileMenuOpen(false);
    setShowUserMenu(false);
  };

  return (
    <nav className="bg-white/90 backdrop-blur-xl sticky top-0 z-50 border-b border-slate-200 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => handleNav('HOME')}
        >
          <div className="bg-blue-600 p-2.5 rounded-2xl text-white group-hover:rotate-12 group-hover:scale-110 transition-all shadow-lg shadow-blue-500/20">
            <Icons.Plane />
          </div>
          <span className="text-2xl font-extrabold tracking-tighter text-slate-900 uppercase">{APP_NAME}</span>
        </div>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex gap-10 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
          <button 
            onClick={() => handleNav('HOME')}
            className={`hover:text-blue-600 transition-colors relative pb-1 ${currentView === 'HOME' ? 'text-blue-600' : ''}`}
          >
            Domestic
            {currentView === 'HOME' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full"></span>}
          </button>
          <button 
            onClick={() => handleNav('INTERNATIONAL')}
            className={`hover:text-blue-600 transition-colors relative pb-1 ${currentView === 'INTERNATIONAL' ? 'text-blue-600' : ''}`}
          >
            International
            {currentView === 'INTERNATIONAL' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full"></span>}
          </button>
          <button 
            onClick={() => handleNav('HOTELS')}
            className={`hover:text-blue-600 transition-colors relative pb-1 ${currentView === 'HOTELS' ? 'text-blue-600' : ''}`}
          >
            Hotels
            {currentView === 'HOTELS' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full"></span>}
          </button>
          <button 
            onClick={() => isAuthenticated ? handleNav('MY_TRIPS') : handleNav('AUTH')}
            className={`hover:text-blue-600 transition-colors relative pb-1 ${currentView === 'MY_TRIPS' ? 'text-blue-600' : ''}`}
          >
            Trips
            {currentView === 'MY_TRIPS' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full"></span>}
          </button>
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="relative">
              <div 
                className="flex items-center gap-3 pl-6 border-l border-slate-100 cursor-pointer group"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <div className="w-10 h-10 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-white font-black text-xs group-hover:bg-blue-600 transition-all shadow-lg">
                  {userName?.substring(0, 1).toUpperCase()}
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-[10px] font-black text-slate-900 leading-none uppercase">{userName}</p>
                  <p className="text-[8px] font-black text-blue-500 tracking-widest mt-1 uppercase">{userStatus || 'Explorer'}</p>
                </div>
              </div>

              {showUserMenu && (
                <div className="absolute top-full right-0 mt-6 w-56 bg-white rounded-[32px] shadow-2xl border border-slate-100 p-3 animate-in fade-in slide-in-from-top-4 duration-300">
                  <div className="p-4 border-b border-slate-50 mb-2">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Account Hub</p>
                  </div>
                  <button 
                    onClick={() => handleNav('MY_TRIPS')}
                    className="w-full text-left p-4 rounded-2xl text-[10px] font-black text-slate-600 uppercase tracking-widest hover:bg-slate-50 hover:text-blue-600 transition-all"
                  >
                    Itineraries
                  </button>
                  <button 
                    onClick={() => { onLogout?.(); setShowUserMenu(false); }}
                    className="w-full text-left p-4 rounded-2xl text-[10px] font-black text-red-500 uppercase tracking-widest hover:bg-red-50 transition-all"
                  >
                    Terminate Session
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden md:block">
              <Button 
                variant="secondary" 
                size="md" 
                onClick={() => handleNav('AUTH')}
                className="rounded-2xl px-8"
              >
                Sign In
              </Button>
            </div>
          )}

          {/* Mobile Menu Trigger */}
          <button 
            className="md:hidden w-12 h-12 flex items-center justify-center bg-slate-100 rounded-2xl"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-100 p-8 flex flex-col gap-6 animate-in slide-in-from-top-4">
           <button onClick={() => handleNav('HOME')} className="text-left font-black uppercase tracking-widest text-sm text-slate-900">Domestic Flights</button>
           <button onClick={() => handleNav('INTERNATIONAL')} className="text-left font-black uppercase tracking-widest text-sm text-slate-900">International</button>
           <button onClick={() => handleNav('HOTELS')} className="text-left font-black uppercase tracking-widest text-sm text-slate-900">Hotels</button>
           <button onClick={() => handleNav('MY_TRIPS')} className="text-left font-black uppercase tracking-widest text-sm text-slate-900">My Trips</button>
           {!isAuthenticated && (
             <Button variant="primary" className="w-full py-4 mt-4" onClick={() => handleNav('AUTH')}>Sign In</Button>
           )}
        </div>
      )}
    </nav>
  );
};
