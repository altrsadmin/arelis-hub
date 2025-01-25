import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  icon?: LucideIcon;
  loading?: boolean;
  children: React.ReactNode;
  fullWidth?: boolean;
}

export function Button({
  variant = 'primary',
  icon: Icon,
  loading,
  children,
  fullWidth,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-[#0099ff] text-gray-900 hover:bg-[#0099ff]/90 focus:ring-[#0099ff] dark:bg-[#2afbc6] dark:hover:bg-[#2afbc6]/90 dark:focus:ring-[#2afbc6] dark:text-gray-900 shadow-lg hover:shadow-xl transition-all duration-200',
    secondary: 'bg-gray-100/80 backdrop-blur-sm text-gray-700 hover:bg-gray-200/90 focus:ring-gray-300 dark:bg-gray-700/80 dark:text-gray-200 dark:hover:bg-gray-600/90 dark:focus:ring-gray-500 shadow-md hover:shadow-lg transition-all duration-200',
    ghost: 'text-gray-700 hover:bg-gray-100/20 focus:ring-gray-500 dark:text-gray-300 dark:hover:bg-white/10 backdrop-blur-sm transition-all duration-200'
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-gray-300 border-t-white" />
      ) : (
        <>
          {Icon && <Icon className="w-4 h-4 mr-2" />}
          {children}
        </>
      )}
    </button>
  );
}