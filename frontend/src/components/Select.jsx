import React from 'react';

export default function Select({
  label,
  id,
  options = [],
  error,
  helperText,
  required = false,
  className = '',
  value,
  onChange,
  placeholder = 'Select an option',
  ...props
}) {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={selectId} className="block text-xs font-semibold text-mainText uppercase tracking-wider mb-1.5">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative rounded-control shadow-sm">
        <select
          id={selectId}
          value={value}
          onChange={onChange}
          required={required}
          className={`block w-full rounded-control text-sm bg-white border py-2.5 px-3.5 min-h-[42px] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:bg-gray-100 disabled:text-gray-400 ${
            error
              ? 'border-red-400 text-red-900 focus:ring-red-400/20 focus:border-red-500'
              : 'border-cardBorder text-mainText hover:border-primary-300'
          }`}
          {...props}
        >
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {options.map((opt) => {
            const optVal = typeof opt === 'object' ? opt.value : opt;
            const optLabel = typeof opt === 'object' ? opt.label : opt;
            return (
              <option key={optVal} value={optVal}>
                {optLabel}
              </option>
            );
          })}
        </select>
      </div>
      {error && <p className="mt-1 text-xs text-red-600 animate-fade-in font-medium">{error}</p>}
      {helperText && !error && <p className="mt-1 text-xs text-secondaryText">{helperText}</p>}
    </div>
  );
}
