import React from 'react';

function ErrorMessage({ message, onClose }) {
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
      <span className="block sm:inline">{message}</span>
      {onClose && (
        <button
          className="absolute top-0 bottom-0 right-0 px-4 py-3"
          onClick={onClose}
        >
          <span className="text-2xl">&times;</span>
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;
