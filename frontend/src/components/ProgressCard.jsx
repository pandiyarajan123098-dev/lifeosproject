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
    <div className={`p-5 rounded-xl bg-white border border-cardBorder shadow-soft hover:shadow-card transition-shadow ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-secondaryText">
          {title}
        </span>
        {Icon && (
          <div className="w-9 h-9 rounded-lg bg-primary-light flex items-center justify-center text-primary shrink-0">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-2">
        <h4 className="text-2xl font-bold text-mainText tracking-tight">{value}</h4>
        {badgeText && (
          <span className={`text-xs px-2 py-0.5 font-medium rounded-full border ${badgeColors[badgeVariant] || badgeColors.violet}`}>
            {badgeText}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-1.5 text-xs text-secondaryText flex items-center gap-1">
          {subtitle}
        </p>
      )}
    </div>
  );
}
