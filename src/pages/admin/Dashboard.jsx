import { useState, useEffect } from 'react';
import { useCurrentShop } from '../../hooks/useCurrentShop';
import { getDashboardAnalytics } from '../../services/analyticsService';
import { DEMO_MODE, DEMO_DASHBOARD_DATA } from '../../utils/demoData';
import { UtensilsCrossed, MenuIcon, DollarSign, ShoppingBag, Package, Clock, TrendingUp } from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';

const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
    <div>
      <p className="text-gray-500 text-sm font-semibold mb-1">{title}</p>
      <h3 className="text-3xl font-black text-gray-900">{value}</h3>
      {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
    </div>
    <div className={`p-4 rounded-full ${color} bg-opacity-10`}>
      <Icon className={color.replace('bg-', 'text-')} size={24} />
    </div>
  </div>
);

const Dashboard = () => {
  const { shopSlug, shopId, loading: shopLoading, error: shopError } = useCurrentShop();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    if (!shopId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getDashboardAnalytics(shopId);
      if (res.success) {
        setData(res.data);
      } else {
        setError('Failed to fetch dashboard data');
      }
    } catch (err) {
      setError(err.message || 'Error loading dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!shopLoading && shopId) {
      fetchDashboardData();
    } else if (!shopLoading && !shopId) {
      setLoading(false);
    }
  }, [shopId, shopLoading]);

  if (shopLoading || loading) return <LoadingState message="Loading dashboard..." />;
  if (shopError) return <ErrorState message={shopError} />;
  if (error && !DEMO_MODE) return <ErrorState message={error} onRetry={fetchDashboardData} />;
  
  const displayData = (DEMO_MODE || !data || data.totalProducts === 0) ? DEMO_DASHBOARD_DATA : data;

  if (!displayData) return <ErrorState message="No dashboard data found" />;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Business Overview</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Menu Items" value={displayData.totalProducts} icon={UtensilsCrossed} color="bg-red-500" />
        <StatCard title="Total Categories" value={displayData.totalCategories} icon={MenuIcon} color="bg-blue-500" />
        <StatCard title="Today's Orders" value={displayData.todayOrders} icon={ShoppingBag} color="bg-purple-500" />
        <StatCard title="Revenue Today" value={`₹${displayData.todayRevenue}`} icon={DollarSign} color="bg-emerald-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Insights */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-center">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Insights</h2>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
                <Package className="text-green-500" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Most Viewed Product</p>
                <p className="font-bold text-gray-900">{displayData.mostViewedProduct || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                <MenuIcon className="text-blue-500" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Top Category</p>
                <p className="font-bold text-gray-900">{displayData.topCategory || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center">
                <Clock className="text-orange-500" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Pending Orders</p>
                <p className="font-bold text-gray-900">{displayData.pendingOrders}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center">
                <TrendingUp className="text-purple-500" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Latest Order</p>
                <p className="font-bold text-gray-900">
                  {displayData.latestOrder ? `#${displayData.latestOrder.orderNumber}` : 'No orders'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Orders Trend */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Weekly Orders</h2>
          <div className="w-full min-h-[250px] flex-grow">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={displayData.weeklyOrdersChart} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dx={-10} allowDecimals={false} />
                <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Revenue Trend */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Weekly Revenue (₹)</h2>
          <div className="w-full min-h-[250px] flex-grow">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={displayData.weeklyRevenueChart} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dx={-10} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
