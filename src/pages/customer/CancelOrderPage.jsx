import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Search, XCircle, CheckCircle2, AlertTriangle, Clock, Receipt } from 'lucide-react';
import { verifyOrderCancellation, cancelOrder } from '../../services/orderService';
import toast from 'react-hot-toast';

const CancelOrderPage = () => {
  const navigate = useNavigate();

  // Form inputs
  const [orderNumber, setOrderNumber] = useState('');
  const [customerMobile, setCustomerMobile] = useState('');

  // States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [verifiedOrder, setVerifiedOrder] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0); // in seconds
  const [cancellationComplete, setCancellationComplete] = useState(false);

  // Countdown timer for 5 minutes window
  useEffect(() => {
    if (!verifiedOrder || cancellationComplete) return;

    const calculateTimeRemaining = () => {
      const createdTime = new Date(verifiedOrder.createdAt).getTime();
      const elapsedMs = Date.now() - createdTime;
      const remainingMs = 5 * 60 * 1000 - elapsedMs;
      return Math.max(0, Math.floor(remainingMs / 1000));
    };

    setTimeRemaining(calculateTimeRemaining());

    const interval = setInterval(() => {
      const remaining = calculateTimeRemaining();
      setTimeRemaining(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [verifiedOrder, cancellationComplete]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!orderNumber.trim() || !customerMobile.trim()) {
      setError('Please fill in both fields.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMsg('');
    setVerifiedOrder(null);

    try {
      const res = await verifyOrderCancellation(orderNumber.trim(), customerMobile.trim());
      if (res.success && res.data) {
        setVerifiedOrder(res.data);
        setSuccessMsg(res.message || 'Order verified successfully.');
        toast.success('Order verified successfully.');
      } else {
        setError(res.message || 'Invalid Order Number or Mobile Number.');
        toast.error('Verification failed');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Invalid Order Number or Mobile Number.');
      toast.error('Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!verifiedOrder) return;

    setLoading(true);
    setError('');

    try {
      const res = await cancelOrder(verifiedOrder.orderNumber, verifiedOrder.customerMobile);
      if (res.success) {
        setCancellationComplete(true);
        toast.success('Order cancelled successfully.');
      } else {
        setError(res.message || 'Failed to cancel the order.');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to cancel the order.');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-[#0A0A0A] min-h-screen text-white font-sans flex flex-col items-center py-10 px-4">
      {/* Header / Navigation */}
      <div className="w-full max-w-md mb-8">
        <motion.button
          onClick={() => navigate(-1)}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 text-gray-400 hover:text-white font-bold text-sm uppercase tracking-wider transition-colors group"
        >
          <span className="p-2 rounded-full bg-[#1A1A1A] border border-[#2d2d2d] group-hover:bg-[#252525] group-hover:border-[#E50914]/40 transition-all">
            <ArrowLeft className="w-4 h-4" />
          </span>
          <span>Go Back</span>
        </motion.button>
      </div>

      <div className="w-full max-w-md bg-[#141414] border border-[#222] rounded-[2rem] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#E50914] opacity-5 blur-[80px] -z-10"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#E50914] opacity-5 blur-[80px] -z-10"></div>

        <h1 className="text-2xl sm:text-3xl font-black text-center mb-6 tracking-tight">
          Cancel Your Order
        </h1>

        {/* STEP 1: Search Form */}
        {!verifiedOrder && !cancellationComplete && (
          <motion.form
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSearch}
            className="space-y-5"
          >
            <div>
              <label htmlFor="orderNumber" className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                Order Number
              </label>
              <input
                id="orderNumber"
                type="text"
                placeholder="e.g. KKR-0001"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                className="w-full bg-[#0D0D0D] border border-[#222] focus:border-[#E50914] rounded-xl py-3 px-4 outline-none text-white transition-all font-medium"
                required
              />
            </div>

            <div>
              <label htmlFor="customerMobile" className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                Mobile Number
              </label>
              <input
                id="customerMobile"
                type="tel"
                placeholder="e.g. 9876543210"
                value={customerMobile}
                onChange={(e) => setCustomerMobile(e.target.value)}
                className="w-full bg-[#0D0D0D] border border-[#222] focus:border-[#E50914] rounded-xl py-3 px-4 outline-none text-white transition-all font-medium"
                required
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-3 bg-red-950/20 border border-red-500/20 rounded-xl flex items-start gap-2.5 text-red-400 text-xs font-semibold leading-relaxed"
              >
                <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-[#E50914] hover:bg-[#CC0812] disabled:bg-gray-800 disabled:text-gray-500 font-black uppercase tracking-wider text-sm py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-500/10 cursor-pointer"
            >
              {loading ? (
                <span>Verifying...</span>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Search Order</span>
                </>
              )}
            </motion.button>
          </motion.form>
        )}

        {/* STEP 2: Order Verified Details */}
        {verifiedOrder && !cancellationComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            {successMsg && (
              <div className="p-3 bg-emerald-950/20 border border-emerald-500/20 rounded-xl flex items-center gap-2.5 text-emerald-400 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Display Countdown Banner */}
            {timeRemaining > 0 ? (
              <div className="p-4 bg-orange-950/20 border border-orange-500/20 rounded-xl flex items-center justify-between gap-3 text-orange-400">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 shrink-0 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider">Time to cancel</span>
                </div>
                <span className="text-base font-black font-mono bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
                  {formatTime(timeRemaining)}
                </span>
              </div>
            ) : (
              <div className="p-4 bg-red-950/20 border border-red-500/20 rounded-xl flex items-center gap-2.5 text-red-400">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <span className="text-xs font-bold uppercase tracking-wider">This order can no longer be cancelled.</span>
              </div>
            )}

            {/* Order Items Summary */}
            <div className="border border-[#222] bg-[#0D0D0D] rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 border-b border-[#222] pb-3 text-gray-400">
                <Receipt className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Your Order ({verifiedOrder.orderNumber})</span>
              </div>

              <div className="divide-y divide-[#222]/50">
                {verifiedOrder.items.map((item, idx) => (
                  <div key={idx} className="py-2.5 first:pt-0 last:pb-0 flex justify-between items-baseline text-sm font-semibold">
                    <span className="text-gray-300">
                      {item.name} <span className="text-xs text-gray-500 ml-1">×{item.quantity}</span>
                    </span>
                    <span className="text-white">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#222] pt-3 flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Grand Total</span>
                <span className="text-lg font-black text-[#E50914]">₹{verifiedOrder.totalAmount}</span>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-950/20 border border-red-500/20 rounded-xl flex items-start gap-2.5 text-red-400 text-xs font-semibold leading-relaxed">
                <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {timeRemaining > 0 ? (
              <motion.button
                onClick={handleCancelOrder}
                disabled={loading}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-[#E50914] hover:bg-[#CC0812] disabled:bg-gray-800 disabled:text-gray-500 font-black uppercase tracking-wider text-sm py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-500/10 cursor-pointer"
              >
                {loading ? 'Processing...' : 'Cancel Order'}
              </motion.button>
            ) : (
              <div className="text-center py-2 text-xs font-bold uppercase tracking-wider text-red-500/60">
                Cancellation Window Closed
              </div>
            )}
          </motion.div>
        )}

        {/* Cancellation Success View */}
        {cancellationComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8 space-y-6"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 mb-2">
              <CheckCircle2 size={36} />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-white">Order Cancelled</h2>
              <p className="text-gray-400 text-sm font-semibold max-w-xs mx-auto leading-relaxed">
                Your order has been cancelled successfully.
              </p>
            </div>

            <motion.button
              onClick={() => navigate('/')}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-[#1A1A1A] hover:bg-[#252525] border border-[#2d2d2d] hover:border-gray-700 text-white font-bold uppercase tracking-wider text-xs py-3 px-6 rounded-xl transition-all cursor-pointer"
            >
              Back to Home
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CancelOrderPage;
