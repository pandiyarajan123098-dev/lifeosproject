import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Button({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  onClick,
  ...props
}) {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-control transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

  const variantStyles = {
    primary:
      'bg-primary hover:bg-primary-dark text-white shadow-soft hover:shadow-hover focus-visible:ring-primary',
    secondary:
      'bg-primary-light hover:bg-primary-200 text-primary-dark border border-primary-200/60 focus-visible:ring-primary',
    outline:
      'border border-primary text-primary hover:bg-primary-light/40 focus-visible:ring-primary bg-white',
    ghost:
      'text-mainText hover:bg-primary-light/50 hover:text-primary-dark focus-visible:ring-primary',
    danger:
      'bg-red-600 hover:bg-red-700 text-white shadow-sm focus-visible:ring-red-500',
    success:
      'bg-success hover:bg-green-700 text-white shadow-sm focus-visible:ring-success',
  };

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 min-h-[36px] gap-1.5',
    md: 'text-sm px-4 py-2 min-h-[42px] gap-2',
    lg: 'text-sm sm:text-base px-6 py-2.5 min-h-[46px] gap-2.5 font-semibold',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant] || variantStyles.primary} ${
        sizeStyles[size] || sizeStyles.md
      } ${className}`}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
      {children}
    </button>
  );
}
