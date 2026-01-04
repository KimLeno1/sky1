
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  isLoading, 
  disabled,
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-bold transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest";
  
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20",
    secondary: "bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-900/10",
    outline: "bg-transparent border-2 border-slate-200 text-slate-600 hover:border-blue-600 hover:text-blue-600",
    ghost: "bg-transparent text-slate-400 hover:text-slate-900"
  };

  const sizes = {
    sm: "px-4 py-2 text-[10px] rounded-lg",
    md: "px-6 py-3 text-xs rounded-xl",
    lg: "px-8 py-4 text-sm rounded-2xl",
    xl: "px-10 py-5 text-base rounded-[24px]"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin h-4 w-4 mr-3 border-2 border-white/20 border-t-white rounded-full" viewBox="0 0 24 24"></svg>
      ) : null}
      {children}
    </button>
  );
};
