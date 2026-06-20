import React from 'react';
import { AlertCircle } from 'lucide-react';

const ErrorState = ({ message = 'Something went wrong.', onRetry }) => (
  <div className="flex flex-col items-center justify-center p-12 w-full min-h-[300px] bg-red-50 rounded-2xl border border-red-100">
    <AlertCircle className="text-red-500 mb-4" size={48} />
    <h3 className="text-xl font-bold text-gray-900 mb-2">Oops!</h3>
    <p className="text-gray-600 text-center max-w-md mb-6">{message}</p>
    {onRetry && (
      <button 
        onClick={onRetry}
        className="px-6 py-2 bg-white border border-red-200 text-red-600 rounded-xl font-semibold hover:bg-red-50 transition-colors"
      >
        Try Again
      </button>
    )}
  </div>
);

export default ErrorState;
