import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import Button from './Button';

export default function ErrorMessage({
  title = 'Something went wrong',
  message,
  onRetry,
  className = '',
}) {
  return (
    <div
      className={`p-4 rounded-control border border-red-200 bg-red-50/80 text-red-900 flex items-start gap-3.5 animate-fade-in ${className}`}
    >
      <div className="p-1 rounded-full bg-red-100 text-red-600 shrink-0 mt-0.5">
        <AlertCircle className="w-5 h-5" />
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-red-800">{title}</h4>
        {message && <p className="text-xs text-red-700 mt-1 leading-relaxed">{message}</p>}
        {onRetry && (
          <div className="mt-3">
            <Button
              size="sm"
              variant="outline"
              onClick={onRetry}
              className="border-red-300 text-red-800 hover:bg-red-100"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1" />
              Try Again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
