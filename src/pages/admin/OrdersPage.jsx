import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getShopOrders, updateOrderStatus } from '../../services/orderService';
import socket, { connectSocket, disconnectSocket } from '../../sockets/socket';
import toast from 'react-hot-toast';
import { Loader2, BellRing } from 'lucide-react';

const STATUS_COLORS = {
  Pending: 'bg-orange-100 text-orange-700',
  Preparing: 'bg-blue-100 text-blue-700',
  Ready: 'bg-purple-100 text-purple-700',
  Completed: 'bg-green-100 text-green-700',
};

const OrdersPage = () => {
  const { shop } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    if (!shop) return;
    try {
      const res = await getShopOrders(shop._id);
      if (res.success) {
        setOrders(res.data);
      }
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    if (shop) {
      connectSocket();
      socket.emit('join-shop', shop._id.toString());

      socket.on('new-order', (newOrder) => {
        // Play notification sound
        const audio = new Audio('/notification.mp3');
        audio.play().catch(e => console.log('Audio play failed', e));
        
        toast.custom((t) => (
          <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-lg rounded-xl pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                    <BellRing className="text-[#E50914]" size={24} />
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
    }

    return () => {
      socket.off('new-order');
      disconnectSocket();
    };
  }, [shop]);

  const handleStatusChange = async (orderId, newStatus) => {
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

  if (loading) return <div className="flex justify-center mt-20"><Loader2 className="animate-spin text-[#E50914]" size={32} /></div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Live Orders</h1>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-sm">
            <tr>
              <th className="p-4 font-semibold">Order ID</th>
              <th className="p-4 font-semibold">Customer Details</th>
              <th className="p-4 font-semibold">Order Items</th>
              <th className="p-4 font-semibold">Total Amount</th>
              <th className="p-4 font-semibold">Status Update</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-10 text-center text-gray-500">No orders yet. Waiting for customers to scan!</td>
              </tr>
            ) : (
              orders.map(order => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="p-4 font-bold text-gray-900">{order.orderNumber}</td>
                  <td className="p-4">
                    <p className="font-semibold text-gray-900">{order.customerName}</p>
                    <p className="text-sm text-gray-500">{order.customerMobile}</p>
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
                    <select 
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className={`px-3 py-2 rounded-xl text-sm font-bold border-0 outline-none cursor-pointer ${STATUS_COLORS[order.status]}`}
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
  );
};

export default OrdersPage;
