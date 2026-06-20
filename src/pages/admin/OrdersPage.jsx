import { useState, useEffect } from 'react';
import { useCurrentShop } from '../../hooks/useCurrentShop';
import { getLiveOrders, updateOrderStatus } from '../../services/orderService';
import { DEMO_MODE, DEMO_ORDERS_DATA } from '../../utils/demoData';
import { Link } from 'react-router-dom';
import socket, { connectSocket, disconnectSocket } from '../../sockets/socket';
import toast from 'react-hot-toast';
import { BellRing, History } from 'lucide-react';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';

const STATUS_COLORS = {
  Pending: 'bg-orange-100 text-orange-700',
  Preparing: 'bg-blue-100 text-blue-700',
  Ready: 'bg-purple-100 text-purple-700',
  Completed: 'bg-green-100 text-green-700',
};

const OrdersPage = () => {
  const { shopId, loading: shopLoading, error: shopError } = useCurrentShop();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    if (!shopId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getLiveOrders(shopId);
      if (res.success) {
        setOrders(res.data);
      } else {
        setError('Failed to fetch orders');
      }
    } catch (err) {
      setError('An unexpected error occurred');
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

        setOrders(prev => [newOrder, ...prev]);
      });
    } else if (!shopLoading && !shopId) {
      setLoading(false);
    }

    return () => {
      socket.off('new-order');
      disconnectSocket();
    };
  }, [shopId, shopLoading]);

  const handleStatusChange = async (orderId, newStatus) => {
    if (orderId.startsWith('demo-')) {
      toast.error("Cannot modify demo orders. Please add real orders.");
      return;
    }
    try {
      const res = await updateOrderStatus(orderId, newStatus);
      if (res.success) {
        toast.success(`Order marked as ${newStatus}`);
        setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };


  if (shopLoading || loading) return <LoadingState message="Loading orders..." />;
  if (shopError) return <ErrorState message={shopError} />;
  if (error && !DEMO_MODE) return <ErrorState message={error} onRetry={fetchOrders} />;

  const displayOrders = (DEMO_MODE || orders.length === 0) ? DEMO_ORDERS_DATA : orders;

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
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Live Orders</h1>
        <Link 
          to="/owner/orders/history"
          className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2.5 px-5 rounded-xl flex items-center gap-2 transition-all"
        >
          <History size={20} /> Order History
        </Link>
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
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
                <td colSpan="5" className="p-10 text-center text-gray-500">No orders yet. Waiting for customers to scan!</td>
              </tr>
            ) : (
              displayOrders.map(order => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="p-4 font-bold text-gray-900">{order.orderNumber}</td>
                  <td className="p-4">
                    <p className="font-semibold text-gray-900">{order.customerName}</p>
                    <p className="text-sm text-gray-500">{order.customerMobile || order.customerPhone}</p>
                  </td>
                  <td className="p-4 text-sm">
                    <ul className="list-disc pl-4 text-gray-600">
                      {order.items.map((item, idx) => (
                        <li key={idx}>{item.quantity}x {item.name}</li>
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
                      className={`px-3 py-2 rounded-xl text-sm font-bold border-0 outline-none cursor-pointer ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-700'}`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Preparing">Preparing</option>
                      <option value="Ready">Ready</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
