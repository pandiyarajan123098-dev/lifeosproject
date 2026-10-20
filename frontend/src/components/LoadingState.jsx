import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingState({ message = 'Loading LifeOS...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 animate-fade-in">
      <div className="w-12 h-12 rounded-2xl bg-primary-light flex items-center justify-center text-primary mb-4 shadow-soft">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
      <p className="text-sm font-medium text-mainText">{message}</p>
      <p className="text-xs text-secondaryText mt-1">Please wait a moment...</p>
    </div>
  );
}
