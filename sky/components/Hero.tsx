
import React from 'react';

export const Hero: React.FC = () => (
  <section className="relative h-[450px] flex items-center justify-center px-6 overflow-hidden bg-slate-900">
    <img 
      src="https://images.unsplash.com/photo-1550684848-86a5d8727436?auto=format&fit=crop&q=80&w=2000" 
      className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-screen" 
      alt="SkyNet Bird Illustration" 
    />
    <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-slate-900/40 to-slate-900/80"></div>
    
    <div className="relative z-10 w-full max-w-4xl text-center space-y-6">
      <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter drop-shadow-2xl">
        WHERE TO <span className="text-blue-400">NEXT?</span>
      </h1>
      <p className="text-xl text-slate-200 font-medium max-w-2xl mx-auto">
        Your journey, meticulously planned. Premium routes at your fingertips.
      </p>
    </div>
  </section>
);
