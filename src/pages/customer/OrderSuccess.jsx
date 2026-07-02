import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const OrderSuccess = () => {
  const { orderNumber } = useParams();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center space-y-6">
        <div className="flex justify-center">
          <div className="bg-green-50 p-4 rounded-full">
            <CheckCircle size={64} className="text-green-500" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-gray-900">Order Placed Successfully!</h1>
          <p className="text-gray-500">Thank you for ordering with us. Your food is being prepared.</p>
        </div>

        <div className="bg-[#111111] text-white p-4 rounded-2xl">
          <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Token Number</p>
          <p className="text-2xl font-black mt-1 text-[#D90404]">{orderNumber || 'KKR-1001'}</p>
        </div>

        <p className="text-xs text-gray-500 font-semibold leading-relaxed max-w-xs mx-auto">
          Please remember your token number. You will need to present it while collecting your order.
        </p>

        <div className="pt-2">
          <Link
            to="/"
            className="block w-full bg-[#D90404] hover:bg-[#b80303] text-white font-bold py-3.5 px-4 rounded-2xl transition-colors text-center"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
