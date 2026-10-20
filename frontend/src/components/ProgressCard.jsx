import React from 'react';

export default function ProgressCard({
  title,
  value,
  subtitle,
  icon: Icon,
  badgeText,
  badgeVariant = 'violet',
  className = '',
}) {
  const badgeColors = {
    violet: 'bg-primary-light text-primary-dark border-primary-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
  };

  return (
    <div
      className={`p-4 sm:p-5 rounded-card bg-white border border-cardBorder shadow-soft hover:shadow-card transition-all duration-200 ${className}`}
    >
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-secondaryText truncate">
          {title}
        </span>
        {Icon && (
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-control bg-primary-light flex items-center justify-center text-primary shrink-0">
            <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-baseline gap-2">
        <h4 className="text-xl sm:text-2xl lg:text-3xl font-bold text-mainText tracking-tight">
          {value}
        </h4>
        {badgeText && (
          <span
            className={`text-[10px] sm:text-xs px-2 py-0.5 font-semibold rounded-full border shrink-0 ${
              badgeColors[badgeVariant] || badgeColors.violet
            }`}
          >
            {badgeText}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-1.5 text-xs text-secondaryText leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
