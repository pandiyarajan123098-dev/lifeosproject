import React from 'react';

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
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-mainText uppercase tracking-wider mb-1.5">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative rounded-lg shadow-sm">
        {LeftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-secondaryText">
            <LeftIcon className="w-4 h-4" />
          </div>
        )}
        <input
          id={inputId}
          type={type}
          required={required}
          className={`block w-full rounded-lg text-sm bg-white border transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-gray-100 disabled:text-gray-400 placeholder:text-gray-400 ${
            LeftIcon ? 'pl-10' : 'pl-3.5'
          } ${RightIcon ? 'pr-10' : 'pr-3.5'} py-2.5 ${
            error
              ? 'border-red-400 text-red-900 focus:ring-red-400 focus:border-red-400'
              : 'border-cardBorder text-mainText hover:border-primary-300'
          }`}
          {...props}
        />
        {RightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-secondaryText">
            <RightIcon className="w-4 h-4" />
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-600 animate-fade-in">{error}</p>}
      {helperText && !error && <p className="mt-1 text-xs text-secondaryText">{helperText}</p>}
    </div>
  );
}
