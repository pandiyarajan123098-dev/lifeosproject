import React from 'react';
import { Check } from 'lucide-react';

export default function Checkbox({
  checked = false,
  onChange,
  label,
  id,
  disabled = false,
  className = '',
}) {
  const checkboxId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <label
      htmlFor={checkboxId}
      className={`inline-flex items-center gap-2.5 cursor-pointer select-none ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
    >
      <div className="relative">
        <input
          id={checkboxId}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange && onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div
          className={`w-5 h-5 rounded border transition-all duration-150 flex items-center justify-center ${
            checked
              ? 'bg-primary border-primary text-white shadow-sm'
              : 'bg-white border-cardBorder hover:border-primary-400'
          } peer-focus:ring-2 peer-focus:ring-primary/40`}
        >
          {checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
        </div>
      </div>
      {label && <span className="text-sm font-medium text-mainText">{label}</span>}
    </label>
  );
}
