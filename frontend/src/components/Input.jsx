import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function Input({
  label,
  id,
  type = 'text',
  error,
  helperText,
  required = false,
  className = '',
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  const isPassword = type === 'password';
  const effectiveType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-mainText uppercase tracking-wider mb-1.5">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative rounded-control shadow-sm">
        {LeftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-secondaryText">
            <LeftIcon className="w-4 h-4" />
          </div>
        )}
        <input
          id={inputId}
          type={effectiveType}
          required={required}
          className={`block w-full rounded-control text-sm bg-white border transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:bg-gray-100 disabled:text-gray-400 placeholder:text-gray-400 ${
            LeftIcon ? 'pl-10' : 'pl-3.5'
          } ${isPassword || RightIcon ? 'pr-10' : 'pr-3.5'} py-2.5 min-h-[42px] ${
            error
              ? 'border-red-400 text-red-900 focus:ring-red-400/20 focus:border-red-500'
              : 'border-cardBorder text-mainText hover:border-primary-300'
          }`}
          {...props}
        />
        {isPassword ? (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-secondaryText hover:text-primary transition-colors focus:outline-none"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        ) : RightIcon ? (
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-secondaryText">
            <RightIcon className="w-4 h-4" />
          </div>
        ) : null}
      </div>
      {error && <p className="mt-1 text-xs text-red-600 animate-fade-in font-medium">{error}</p>}
      {helperText && !error && <p className="mt-1 text-xs text-secondaryText">{helperText}</p>}
    </div>
  );
}
