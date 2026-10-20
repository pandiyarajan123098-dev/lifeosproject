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
      className={`inline-flex items-center gap-3 cursor-pointer select-none min-h-[40px] ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
    >
      <div className="relative shrink-0">
        <input
          id={checkboxId}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange && onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div
          className={`w-5 h-5 rounded-[6px] border transition-all duration-150 flex items-center justify-center ${
            checked
              ? 'bg-primary border-primary text-white shadow-soft'
              : 'bg-white border-cardBorder hover:border-primary-400'
          } peer-focus-visible:ring-2 peer-focus-visible:ring-primary/40 peer-focus-visible:ring-offset-1`}
        >
          {checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
        </div>
      </div>
      {label && <span className="text-sm font-medium text-mainText leading-snug">{label}</span>}
    </label>
  );
}
