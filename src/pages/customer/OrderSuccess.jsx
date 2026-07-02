import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, AlertTriangle, Copy } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const OrderSuccess = () => {
  const { orderNumber } = useParams();
  const token = orderNumber || 'KKR-1001';

  const handleCopyToken = () => {
    navigator.clipboard.writeText(token);
    toast.success('Token copied successfully.', {
      icon: '📋',
      style: {
        background: '#111111',
        color: '#ffffff',
      }
    });
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 flex flex-col justify-center items-center px-4 py-4 sm:py-8 overflow-x-hidden">
      <div className="max-w-md w-full bg-white p-5 sm:p-8 rounded-3xl shadow-sm border border-gray-100 text-center space-y-4 sm:space-y-6 mx-auto">
        <div className="flex justify-center">
          <div className="bg-green-50 p-3 sm:p-4 rounded-full">
            <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-green-500" />
          </div>
        </div>
        
        <div className="space-y-1.5 sm:space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">Order Placed Successfully!</h1>
          <p className="text-gray-500 text-xs sm:text-sm font-medium">Thank you for ordering with us. Your food is being prepared.</p>
        </div>

        {/* Animated Token Card */}
        <motion.div 
          animate={{
            scale: [1, 1.02, 1],
            boxShadow: [
              '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
              '0 0 20px rgba(217,4,4,0.18), 0 4px 6px -1px rgba(0,0,0,0.1)',
              '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)'
            ]
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="bg-[#111111] text-white p-4 sm:p-6 rounded-2xl border border-neutral-800"
        >
          <p className="text-[9px] sm:text-[10px] text-gray-400 uppercase tracking-widest font-black">Token Number</p>
          <p className="text-2xl sm:text-4xl font-black mt-1 sm:mt-1.5 text-[#D90404] tracking-wider select-all whitespace-nowrap overflow-hidden text-ellipsis">
            {token}
          </p>
        </motion.div>

        {/* Copy Button (Full Width) */}
        <div className="pt-0.5">
          <button
            onClick={handleCopyToken}
            className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2.5 sm:py-3.5 px-4 rounded-xl transition-all active:scale-95 text-[10px] sm:text-xs uppercase tracking-wider"
          >
            <Copy size={13} />
            <span>Copy Token</span>
          </button>
        </div>

        {/* Important Warning Alert */}
        <div className="bg-amber-50 border-l-4 border-amber-500 rounded-r-2xl p-3.5 sm:p-4 text-left space-y-1.5 sm:space-y-2">
          <div className="flex items-center gap-1.5 sm:gap-2 text-amber-800 font-black text-[9px] sm:text-[10px] uppercase tracking-wider">
            <AlertTriangle size={13} className="text-amber-600 shrink-0" />
            <span>Important Notice</span>
          </div>
          <div className="text-amber-900 text-[11px] sm:text-xs font-semibold leading-relaxed space-y-1">
            <p>Please save or remember your Token Number.</p>
            <p>You must present this token while collecting your order.</p>
            <p>We recommend taking a screenshot before leaving this page.</p>
          </div>
        </div>

        <div className="pt-1">
          <Link
            to="/"
            className="block w-full bg-[#D90404] hover:bg-[#b80303] text-white font-bold py-3 sm:py-3.5 px-4 rounded-2xl transition-colors text-center uppercase tracking-wider text-[10px] sm:text-xs"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
