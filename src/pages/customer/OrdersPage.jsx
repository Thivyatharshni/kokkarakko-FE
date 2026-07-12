import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ShoppingBag, Loader2, AlertTriangle } from 'lucide-react';
import { getCustomerOrders, cancelOrder } from '../../services/orderService';
import toast from 'react-hot-toast';
import SEO from '../../components/common/SEO';
import socket, { connectSocket, disconnectSocket } from '../../sockets/socket';

const OrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmCancelOrder, setConfirmCancelOrder] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [now, setNow] = useState(Date.now());

  // Dynamic ticking to re-evaluate the 5-minute cancellation window in real time
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const fetchOrders = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    const storedOrders = localStorage.getItem('customer_orders');
    if (!storedOrders) {
      setOrders([]);
      setLoading(false);
      return;
    }

    let parsedOrders = [];
    try {
      parsedOrders = JSON.parse(storedOrders);
    } catch (e) {
      parsedOrders = [];
    }

    if (!Array.isArray(parsedOrders) || parsedOrders.length === 0) {
      setOrders([]);
      setLoading(false);
      return;
    }

    try {
      const response = await getCustomerOrders(parsedOrders);
      if (response.success && response.data) {
        // Active orders returned by backend (newest first)
        setOrders(response.data);

        // Sync with localStorage: remove any orders that are no longer returned as active by backend
        const activeOrderNumbers = new Set(response.data.map(o => o.orderNumber));
        const cleanedOrders = parsedOrders.filter(o => activeOrderNumbers.has(o.orderNumber));
        localStorage.setItem('customer_orders', JSON.stringify(cleanedOrders));
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error('Failed to fetch active customer orders:', error);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(true);

    // Poll for status updates every 15 seconds as a fallback
    const interval = setInterval(() => {
      fetchOrders(false);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    connectSocket();

    // Listen to real-time status updates (Completed/Cancelled auto-removes card or updates state status)
    socket.on('order-status-updated', (updatedOrder) => {
      setOrders((prevOrders) => {
        const orderExists = prevOrders.some(o => o._id === updatedOrder._id);
        if (!orderExists) return prevOrders;

        // If the order status becomes Completed or Cancelled, remove it
        if (updatedOrder.status === 'Completed' || updatedOrder.status === 'Cancelled') {
          // Remove from local storage
          const storedOrders = localStorage.getItem('customer_orders');
          if (storedOrders) {
            try {
              const parsed = JSON.parse(storedOrders);
              const cleaned = parsed.filter(o => o.orderNumber !== updatedOrder.orderNumber);
              localStorage.setItem('customer_orders', JSON.stringify(cleaned));
            } catch (e) {
              console.error('Failed to update localStorage:', e);
            }
          }
          return prevOrders.filter(o => o._id !== updatedOrder._id);
        }

        // Just update state
        return prevOrders.map(o => o._id === updatedOrder._id ? updatedOrder : o);
      });
    });

    return () => {
      socket.off('order-status-updated');
      disconnectSocket();
    };
  }, []);



  const handleCancelClick = (order) => {
    setConfirmCancelOrder(order);
  };

  const handleConfirmCancel = async () => {
    if (!confirmCancelOrder) return;
    setCancelling(true);

    try {
      const mobileNumber = confirmCancelOrder.customerMobile || confirmCancelOrder.customerPhone || confirmCancelOrder.mobile;
      const res = await cancelOrder(confirmCancelOrder.orderNumber, mobileNumber);
      if (res.success) {
        toast.success('Order cancelled successfully.', { icon: '🗑️' });

        // Remove immediately from state list
        setOrders((prev) => prev.filter(o => o.orderNumber !== confirmCancelOrder.orderNumber));

        // Sync with local storage
        const storedOrders = localStorage.getItem('customer_orders');
        if (storedOrders) {
          try {
            const parsed = JSON.parse(storedOrders);
            const cleaned = parsed.filter(o => o.orderNumber !== confirmCancelOrder.orderNumber);
            localStorage.setItem('customer_orders', JSON.stringify(cleaned));
          } catch (e) {
            console.error('Failed to clean localStorage after cancel:', e);
          }
        }
      } else {
        toast.error(res.message || 'Failed to cancel the order.');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to cancel the order.');
    } finally {
      setCancelling(false);
      setConfirmCancelOrder(null);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  if (loading) {
    return (
      <div className="bg-[#0A0A0A] min-h-screen flex flex-col items-center justify-center text-white">
        <Loader2 className="animate-spin text-[#E50914] mb-4" size={40} />
        <p className="font-bold tracking-widest uppercase text-xs text-gray-400">Loading Orders...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#0A0A0A] min-h-screen text-white font-sans pb-16 relative">
      <SEO 
        title="Your Orders | Kokkarakko Crispy Chicken"
        description="Track your active orders, check preparation status, and find pickup token numbers at Kokkarakko Crispy Chicken."
      />
      
      {/* Confirmation Dialog Overlay */}
      <AnimatePresence>
        {confirmCancelOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-[#141414] border border-[#222] rounded-3xl p-6 w-full max-w-sm text-center shadow-2xl space-y-6"
            >
              <div className="text-amber-500 bg-amber-500/10 border border-amber-500/20 p-4 rounded-full w-14 h-14 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6 animate-pulse" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">Cancel Order?</h3>
                <p className="text-xs text-gray-400 font-semibold leading-relaxed">
                  Are you sure you want to cancel this order? This action cannot be undone.
                </p>
              </div>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => setConfirmCancelOrder(null)} 
                  disabled={cancelling}
                  className="flex-1 bg-[#1A1A1A] hover:bg-[#252525] border border-[#2d2d2d] py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  No
                </button>
                <button 
                  onClick={handleConfirmCancel} 
                  disabled={cancelling}
                  className="flex-1 bg-[#E50914] hover:bg-[#CC0812] py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  {cancelling ? (
                    <>
                      <Loader2 className="animate-spin w-4 h-4" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <span>Yes, Cancel Order</span>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="px-6 py-5 max-w-[1100px] mx-auto border-b border-[#222] flex items-center gap-4">
        <motion.div whileTap={{ scale: 0.9 }} className="inline-block">
          <button 
            onClick={() => {
              navigate('/');
            }} 
            className="p-2 hover:bg-[#1A1A1A] rounded-full transition-colors text-gray-400 hover:text-white block cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </motion.div>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Your Orders</h1>
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Active Orders</p>
        </div>
      </div>

      <div className="max-w-[1100px] mx-auto px-6 mt-8">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
            <div className="bg-[#141414] p-6 rounded-full border border-[#222]">
              <ShoppingBag className="w-12 h-12 text-gray-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white mb-1">No active orders yet</h2>
              <p className="text-gray-500 text-sm max-w-xs mx-auto">Browse our menu to place your first order.</p>
            </div>
            <button 
              onClick={() => {
                const activeSlug = localStorage.getItem('customer_shop_slug') || 'kokkarakko-fried-chicken';
                navigate(`/menu/${activeSlug}`);
              }} 
              className="bg-[#E50914] hover:bg-[#CC0812] text-white font-bold py-3.5 px-8 rounded-full transition-colors inline-flex items-center gap-2 shadow-lg shadow-red-500/10 text-sm"
            >
              Explore Menu
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {orders.map((order) => {
                const createdTime = new Date(order.createdAt).getTime();
                const isCancelable = (now - createdTime) <= 5 * 60 * 1000;

                return (
                  <motion.div
                    key={order._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="bg-[#141414] border border-[#222] hover:border-[#333] transition-all rounded-3xl p-6 flex flex-col justify-between shadow-xl relative overflow-hidden"
                  >
                    <div>
                      {/* Token & Placed Time Header */}
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Token Number</span>
                          <h3 className="text-xl font-black text-white mt-0.5 tracking-tight">{order.orderNumber}</h3>
                        </div>
                        <div className="text-right">
                          <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest block">Placed at</span>
                          <span className="block text-sm font-bold text-gray-300 mt-0.5">{formatTime(order.createdAt)}</span>
                        </div>
                      </div>

                      {/* Shop Name */}
                      {order.shopId && (
                        <div className="mb-4">
                          <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest block">Restaurant</span>
                          <span className="text-xs font-bold text-gray-300">{order.shopId.shopName}</span>
                        </div>
                      )}

                      {/* Items Section */}
                      <div className="border-t border-b border-[#222] py-4 my-2 space-y-2">
                        {order.items.map((item) => (
                          <div key={item._id} className="flex justify-between items-center text-sm font-medium">
                            <span className="text-gray-300">
                              {item.name} <span className="text-xs font-black text-gray-500 ml-1">x{item.quantity}</span>
                            </span>
                            <span className="text-white font-bold">₹{item.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Total Amount Row */}
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Grand Total</span>
                      <span className="block text-lg font-black text-[#E50914]">₹{order.totalAmount}</span>
                    </div>

                    {/* Action Area (Cancel Order Button) */}
                    {isCancelable && (
                      <div className="mt-4 pt-4 border-t border-[#222]/50 flex justify-start">
                        <motion.button
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleCancelClick(order)}
                          className="bg-[#E50914] hover:bg-[#CC0812] text-white font-bold py-2 px-4 rounded-xl transition-colors text-[11px] uppercase tracking-wider shadow-md shadow-red-500/10 cursor-pointer"
                        >
                          Cancel Order
                        </motion.button>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
