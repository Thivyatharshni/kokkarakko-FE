import React from 'react';
import { PackageOpen } from 'lucide-react';

const EmptyState = ({ title = 'No Data Found', message = 'There is currently no data to display.', actionButton }) => (
  <div className="flex flex-col items-center justify-center p-12 w-full min-h-[300px] bg-gray-50 rounded-2xl border border-dashed border-gray-200">
    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
      <PackageOpen className="text-gray-400" size={32} />
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-500 text-center max-w-md mb-6">{message}</p>
    {actionButton && <div>{actionButton}</div>}
  </div>
);

export default EmptyState;
