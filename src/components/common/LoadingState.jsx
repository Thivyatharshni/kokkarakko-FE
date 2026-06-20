import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingState = ({ message = 'Loading...', size = 32 }) => (
  <div className="flex flex-col items-center justify-center p-12 w-full min-h-[300px]">
    <Loader2 className="animate-spin text-[#E50914] mb-4" size={size} />
    <p className="text-gray-500 font-medium">{message}</p>
  </div>
);

export default LoadingState;
