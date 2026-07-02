import { useState, useEffect } from 'react';
import { useCurrentShop } from '../../hooks/useCurrentShop';
import { getLiveOrders, updateOrderStatus } from '../../services/orderService';
import { Link } from 'react-router-dom';
import socket, { connectSocket, disconnectSocket } from '../../sockets/socket';
import toast from 'react-hot-toast';
import { BellRing, History } from 'lucide-react';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';
import { clientCache } from '../../utils/cache';

const STATUS_COLORS = {
  Pending: 'bg-orange-100 text-orange-700',
  Preparing: 'bg-blue-100 text-blue-700',
  Ready: 'bg-purple-100 text-purple-700',
  Completed: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700',
};

const SkeletonOrdersTable = () => (
  <div className="bg-white rounded-[16px] shadow-sm border border-gray-100 overflow-hidden w-full animate-pulse">
    <div className="p-6 border-b border-gray-100">
      <div className="h-6 bg-gray-200 rounded w-1/4"></div>
    </div>
    <div className="p-6 space-y-4">
      <div className="h-10 bg-gray-200 rounded w-full"></div>
      <div className="h-10 bg-gray-200 rounded w-full"></div>
      <div className="h-10 bg-gray-200 rounded w-full"></div>
      <div className="h-10 bg-gray-200 rounded w-full"></div>
    </div>
  </div>
);

const OrdersPage = () => {
  const { shopId, loading: shopLoading, error: shopError } = useCurrentShop();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async (forceLoad = false) => {
    if (!shopId) return;

    const cacheKey = `live_orders_${shopId}`;
    const cachedOrders = clientCache.get(cacheKey);

    if (cachedOrders) {
      setOrders(cachedOrders);
    }

    if (cachedOrders && !forceLoad) {
      setLoading(false);
    } else {
      setLoading(true);
    }

    setError(null);
    try {
      const res = await getLiveOrders(shopId);
      if (res.success) {
        setOrders(res.data);
        clientCache.set(cacheKey, res.data);
      } else {
        if (!cachedOrders) setError('Failed to fetch orders');
      }
    } catch (err) {
      if (!cachedOrders) setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!shopLoading && shopId) {
      fetchOrders();
      connectSocket();
      socket.emit('join-shop', shopId.toString());

      socket.on('new-order', (newOrder) => {
        const audio = new Audio('/notification.mp3');
        audio.play().catch(e => console.log('Audio play failed', e));
        
        toast.custom((t) => (
          <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-lg rounded-xl pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                    <BellRing className="text-[#D90404]" size={24} />
                  </div>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-bold text-gray-900">New Order Received! 🍗</p>
                  <p className="mt-1 text-sm text-gray-500">{newOrder.customerName} ordered {newOrder.items.length} items.</p>
                </div>
              </div>
            </div>
          </div>
        ), { duration: 5000 });

        setOrders(prev => {
          const updated = [newOrder, ...prev];
          clientCache.set(`live_orders_${shopId}`, updated);
          return updated;
        });
      });

      socket.on('order-status-updated', (updatedOrder) => {
        setOrders(prev => {
          if (updatedOrder.status === 'Cancelled' || updatedOrder.status === 'Completed') {
            const updated = prev.filter(o => o._id !== updatedOrder._id);
            clientCache.set(`live_orders_${shopId}`, updated);
            return updated;
          }
          const updated = prev.map(o => o._id === updatedOrder._id ? updatedOrder : o);
          clientCache.set(`live_orders_${shopId}`, updated);
          return updated;
        });
      });
    } else if (!shopLoading && !shopId) {
      setLoading(false);
    }

    return () => {
      socket.off('new-order');
      socket.off('order-status-updated');
      disconnectSocket();
    };
  }, [shopId, shopLoading]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await updateOrderStatus(orderId, newStatus);
      if (res.success) {
        toast.success(`Order marked as ${newStatus}`);
        setOrders(prev => {
          const updated = prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o);
          clientCache.set(`live_orders_${shopId}`, updated);
          return updated;
        });
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  if (shopLoading) return <LoadingState message="Loading orders..." />;
  if (shopError) return <ErrorState message={shopError} />;

  const displayOrders = orders;
  const isInitialLoading = loading && displayOrders.length === 0;

  if (error && !displayOrders.length) {
    return <ErrorState message={error} onRetry={() => fetchOrders(true)} />;
  }

  const formatOrderTime = (timestamp) => {
    const date = new Date(timestamp);
    const optionsDate = { timeZone: 'Asia/Kolkata', day: '2-digit', month: '2-digit', year: 'numeric' };
    const optionsTime = { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true };
    return {
      date: date.toLocaleDateString('en-GB', optionsDate),
      time: date.toLocaleTimeString('en-US', optionsTime)
    };
  };

  return (
    <div className="space-y-5 w-full max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-[28px] md:text-3xl font-bold text-gray-900 tracking-tight leading-tight truncate">Live Orders</h1>
        <Link 
          to="/owner/orders/history"
          className="w-full sm:w-auto h-11 md:h-12 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-[15px] px-5 rounded-xl flex items-center justify-center gap-2 transition-all"
        >
          <History size={20} /> Order History
        </Link>
      </div>
      
      {/* Table & Cards Container */}
      {isInitialLoading ? (
        <SkeletonOrdersTable />
      ) : (
        <div className="bg-white rounded-[16px] shadow-sm border border-gray-100 overflow-hidden w-full">
          {/* Desktop & Tablet Table View */}
          <div className="hidden lg:block overflow-x-auto w-full">
            <table className="w-full text-left whitespace-nowrap">
              <thead className="bg-gray-50 text-gray-500 text-sm">
                <tr>
                  <th className="p-4 font-semibold">Order ID</th>
                  <th className="p-4 font-semibold">Customer Details</th>
                  <th className="p-4 font-semibold">Order Items</th>
                  <th className="p-4 font-semibold">Total Amount</th>
                  <th className="p-4 font-semibold">Order Time</th>
                  <th className="p-4 font-semibold">Status Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {displayOrders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-10 text-center text-gray-500">No live orders</td>
                  </tr>
                ) : (
                  displayOrders.map(order => (
                    <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-bold text-gray-900">{order.orderNumber}</td>
                      <td className="p-4">
                        <p className="font-semibold text-gray-900">{order.customerName}</p>
                        <p className="text-sm text-gray-500">{order.customerMobile || order.customerPhone}</p>
                      </td>
                      <td className="p-4 text-sm whitespace-normal max-w-xs">
                        <ul className="list-disc pl-4 text-gray-600">
                          {order.items.map((item, idx) => (
                            <li key={idx} className="truncate">{item.quantity}x {item.name}</li>
                          ))}
                        </ul>
                      </td>
                      <td className="p-4 font-black text-[#E50914]">₹{order.totalAmount}</td>
                      <td className="p-4">
                        {order.createdAt ? (
                          <>
                            <p className="font-semibold text-gray-900">{formatOrderTime(order.createdAt).date}</p>
                            <p className="text-sm text-gray-500">{formatOrderTime(order.createdAt).time}</p>
                          </>
                        ) : (
                          <p className="text-gray-500">-</p>
                        )}
                      </td>
                      <td className="p-4">
                        <select 
                          value={order.status}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className={`min-h-[44px] px-4 py-2 rounded-xl text-sm font-bold border-0 outline-none cursor-pointer ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-700'}`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Preparing">Preparing</option>
                          <option value="Ready">Ready</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards View (< lg) */}
          <div className="lg:hidden divide-y divide-gray-100 p-[18px] space-y-3">
            {displayOrders.length === 0 ? (
              <p className="p-4 text-center text-gray-500 text-sm">No live orders</p>
            ) : (
              displayOrders.map(order => (
                <div key={order._id} className="py-3.5 first:pt-0 last:pb-0 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-gray-900 text-sm">{order.orderNumber}</span>
                    <span className="font-black text-[#E50914] text-base">₹{order.totalAmount}</span>
                  </div>

                  <div className="bg-gray-50 p-2.5 rounded-lg flex justify-between items-center text-sm">
                    <div>
                      <p className="font-bold text-gray-900">{order.customerName}</p>
                      <p className="text-xs text-gray-500">{order.customerMobile || order.customerPhone || 'No Phone'}</p>
                    </div>
                    {order.createdAt && (
                      <div className="text-right text-xs text-gray-500">
                        <p className="font-semibold text-gray-700">{formatOrderTime(order.createdAt).date}</p>
                        <p>{formatOrderTime(order.createdAt).time}</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Items Ordered:</p>
                    <ul className="space-y-1 text-sm bg-white border border-gray-100 p-2.5 rounded-lg">
                      {order.items.map((item, idx) => (
                        <li key={idx} className="flex justify-between font-medium text-gray-700">
                          <span>{item.quantity}x {item.name}</span>
                          {item.price && <span className="text-gray-400">₹{item.price * item.quantity}</span>}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2 border-t border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Update Status:</label>
                    <select 
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className={`w-full sm:w-auto h-[42px] px-3 rounded-lg text-sm font-bold border-0 outline-none cursor-pointer ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-700'}`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Preparing">Preparing</option>
                      <option value="Ready">Ready</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
