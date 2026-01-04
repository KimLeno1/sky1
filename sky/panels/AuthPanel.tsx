
import React, { useState } from 'react';
import { Button } from '../components/Button.tsx';
import { Icons } from '../constants.tsx';
import { authService } from '../services/authService.ts';

interface AuthPanelProps {
  onSuccess: (user: any) => void;
}

export const AuthPanel: React.FC<AuthPanelProps> = ({ onSuccess }) => {
  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Artificial delay for "database" processing
    await new Promise(resolve => setTimeout(resolve, 800));

    if (mode === 'LOGIN') {
      const result = authService.login(email, password);
      if (result.success) {
        onSuccess(result.user);
      } else {
        setError(result.message);
      }
    } else {
      const result = authService.register({
        email,
        password,
        firstName,
        lastName,
        passportNumber: `SN-TMP-${Math.floor(100000 + Math.random() * 900000)}`
      });
      if (result.success) {
        onSuccess(result.user);
      } else {
        setError(result.message);
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6 relative overflow-hidden bg-slate-950">
      <img 
        src="https://images.unsplash.com/photo-1550684848-86a5d8727436?auto=format&fit=crop&q=80&w=2000" 
        className="absolute inset-0 w-full h-full object-cover opacity-10 animate-pulse duration-[10000ms] mix-blend-screen"
        alt="SkyNet Bird Illustration"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-transparent to-slate-950/80"></div>

      <div className="relative z-10 w-full max-w-[1100px] flex flex-col lg:flex-row bg-white/5 backdrop-blur-2xl rounded-[48px] border border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-700">
        <div className="lg:w-1/2 p-12 lg:p-20 flex flex-col justify-between bg-blue-600/10">
          <div>
            <div className="flex items-center gap-3 mb-12 cursor-pointer" onClick={() => window.location.reload()}>
              <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-xl shadow-blue-500/20">
                <Icons.Plane />
              </div>
              <span className="text-3xl font-black tracking-tighter text-white uppercase">SKYNET</span>
            </div>
            <h2 className="text-5xl lg:text-6xl font-black text-white tracking-tighter leading-tight mb-8">
              {mode === 'LOGIN' ? 'WELCOME BACK, EXPLORER.' : 'JOIN THE ELITE JOURNEY.'}
            </h2>
            <p className="text-blue-200/60 text-lg font-medium max-w-sm leading-relaxed">
              Unlock premium routes, member-only fares, and seamless travel management across the globe.
            </p>
          </div>
          
          <div className="mt-12 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">✓</div>
              <p className="text-white font-bold text-xs uppercase tracking-widest">Persistent User Data</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">✓</div>
              <p className="text-white font-bold text-xs uppercase tracking-widest">Priority Seat Selection</p>
            </div>
          </div>
        </div>

        <div className="lg:w-1/2 bg-white p-12 lg:p-20 flex flex-col justify-center">
          <div className="mb-10">
            <h3 className="text-3xl font-black text-slate-900 tracking-tight uppercase mb-2">
              {mode === 'LOGIN' ? 'Sign In' : 'Create Account'}
            </h3>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">
              {mode === 'LOGIN' ? "Don't have an account?" : "Already a member?"}
              <button 
                onClick={() => { setMode(mode === 'LOGIN' ? 'REGISTER' : 'LOGIN'); setError(null); }}
                className="text-blue-600 ml-2 hover:underline transition-all"
              >
                {mode === 'LOGIN' ? 'Register Now' : 'Sign In'}
              </button>
            </p>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-2">
              <span className="text-red-500 text-lg">⚠️</span>
              <p className="text-[10px] font-black text-red-600 uppercase tracking-widest">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {mode === 'REGISTER' && (
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">First Name</label>
                  <input 
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-800 transition-all"
                    placeholder="John"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Last Name</label>
                  <input 
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-800 transition-all"
                    placeholder="Doe"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Email Address</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">@</span>
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 p-4 pl-10 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-800 transition-all"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Password</label>
                {mode === 'LOGIN' && (
                  <button type="button" className="text-[9px] font-black text-blue-600 uppercase tracking-widest hover:underline">Forgot?</button>
                )}
              </div>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-800 transition-all"
                  placeholder="••••••••"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {mode === 'REGISTER' && (
              <label className="flex items-start gap-3 cursor-pointer group">
                <input type="checkbox" required className="mt-1 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                <span className="text-[10px] font-bold text-slate-400 leading-relaxed group-hover:text-slate-600 transition-colors">
                  I agree to the <span className="text-blue-600 underline">Terms of Service</span> and <span className="text-blue-600 underline">Privacy Policy</span>.
                </span>
              </label>
            )}

            <Button 
              type="submit" 
              size="xl" 
              className="w-full shadow-2xl mt-4"
              isLoading={isLoading}
            >
              {mode === 'LOGIN' ? 'SIGN IN TO SKYNET' : 'CREATE FREE ACCOUNT'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
