import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getShopOrders } from '../../services/orderService';
import { getMenuBySlug } from '../../services/menuService';
import { Loader2, TrendingUp, Package, Clock, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, color, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between"
  >
    <div>
      <p className="text-gray-500 text-sm font-semibold mb-1">{title}</p>
      <h3 className="text-3xl font-black text-gray-900">{value}</h3>
    </div>
    <div className={`p-4 rounded-full ${color} bg-opacity-10`}>
      <Icon className={color.replace('bg-', 'text-')} size={24} />
    </div>
  </motion.div>
);

const Dashboard = () => {
  const { shop } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    revenue: 0,
    totalMenu: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!shop) return;
      try {
        const [ordersRes, menuRes] = await Promise.all([
          getShopOrders(shop._id),
          getMenuBySlug(shop.slug)
        ]);

        if (ordersRes.success) {
          const orders = ordersRes.data;
          const pending = orders.filter(o => o.status === 'Pending').length;
          const completed = orders.filter(o => o.status === 'Completed');
          const revenue = completed.reduce((acc, curr) => acc + curr.totalAmount, 0);

          setStats(prev => ({
            ...prev,
            totalOrders: orders.length,
            pendingOrders: pending,
            completedOrders: completed.length,
            revenue: revenue
          }));

          setRecentOrders(orders.slice(0, 5)); // Top 5 recent
        }

        if (menuRes.success) {
          setStats(prev => ({ ...prev, totalMenu: menuRes.data.length }));
        }

      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [shop]);

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-[#D90404]" size={32} /></div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value={`₹${stats.revenue}`} icon={TrendingUp} color="bg-green-500" delay={0.1} />
        <StatCard title="Total Orders" value={stats.totalOrders} icon={Package} color="bg-blue-500" delay={0.2} />
        <StatCard title="Pending Orders" value={stats.pendingOrders} icon={Clock} color="bg-orange-500" delay={0.3} />
        <StatCard title="Completed Orders" value={stats.completedOrders} icon={CheckCircle} color="bg-purple-500" delay={0.4} />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-sm">
              <tr>
                <th className="p-4 font-semibold">Order ID</th>
                <th className="p-4 font-semibold">Customer</th>
                <th className="p-4 font-semibold">Amount</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">No recent orders found.</td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-gray-900">{order.orderNumber}</td>
                    <td className="p-4 text-gray-600">{order.customerName}</td>
                    <td className="p-4 font-semibold text-[#D90404]">₹{order.totalAmount}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        order.status === 'Completed' ? 'bg-green-100 text-green-700' :
                        order.status === 'Pending' ? 'bg-orange-100 text-orange-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 text-gray-500 text-sm">
                      {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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

export default Dashboard;
