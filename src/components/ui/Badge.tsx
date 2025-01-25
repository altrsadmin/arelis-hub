import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

export function Badge({ children, variant = 'default' }: BadgeProps) {
  const variants = {
    default: 'bg-gray-100/80 backdrop-blur-sm text-gray-800 dark:bg-gray-700/80 dark:text-gray-300',
    success: 'bg-green-100/80 backdrop-blur-sm text-green-800 dark:bg-green-900/50 dark:text-green-400',
    warning: 'bg-yellow-100/80 backdrop-blur-sm text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-400',
    danger: 'bg-red-100/80 backdrop-blur-sm text-red-800 dark:bg-red-900/50 dark:text-red-400'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium shadow-sm ${variants[variant]} transition-all duration-200`}>
      {children}
    </span>
  );
}