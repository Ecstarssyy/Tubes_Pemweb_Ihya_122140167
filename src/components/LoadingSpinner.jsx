// src/components/LoadingSpinner.jsx
import React from 'react';

function LoadingSpinner({ size = 'md', message, className = '' }) {
  let spinnerSizeClass = 'h-8 w-8';
  if (size === 'sm') spinnerSizeClass = 'h-5 w-5';
  if (size === 'lg') spinnerSizeClass = 'h-12 w-12';

  return (
    <div className={`flex flex-col justify-center items-center py-8 text-center ${className}`}>
      <div 
        className={`animate-spin rounded-full ${spinnerSizeClass} border-b-2 border-t-2 border-brand-action`}
      ></div>
      {message && <p className="mt-3 text-sm text-brand-medium">{message}</p>}
    </div>
  );
}

export default LoadingSpinner;