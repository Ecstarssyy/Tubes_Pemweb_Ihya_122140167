// src/components/ErrorMessage.jsx
import React from 'react';
import { XCircle, AlertTriangle } from 'lucide-react';

function ErrorMessage({ message, onClose }) {
  if (!message) return null;

  return (
    <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative flex items-start shadow-sm" role="alert">
      <AlertTriangle className="h-5 w-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" aria-hidden="true" />
      <div className="flex-grow">
        <strong className="font-semibold text-red-800">Oops! Terjadi Kesalahan</strong>
        <p className="text-sm text-red-700 mt-0.5">{message}</p>
      </div>
      {onClose && (
        <button
          className="ml-4 -mt-1 -mr-1 p-1 text-red-500 hover:text-red-700 rounded-md hover:bg-red-100 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
          onClick={onClose}
          aria-label="Tutup pesan error"
        >
          <XCircle className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;