import { useState, useEffect } from 'react';
import { useCurrentShop } from '../../hooks/useCurrentShop';
import { getDashboardAnalytics } from '../../services/analyticsService';
import { getLiveOrders } from '../../services/orderService';
import { DEMO_MODE, DEMO_DASHBOARD_DATA, DEMO_ORDERS_DATA } from '../../utils/demoData';
import { UtensilsCrossed, MenuIcon, DollarSign, ShoppingBag, Package, Clock, TrendingUp, XCircle } from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';
import { clientCache } from '../../utils/cache';

const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
  <div className="bg-white rounded-[16px] h-[110px] md:h-auto p-4 sm:p-5 md:p-6 shadow-sm border border-gray-100 flex items-center justify-between w-full overflow-hidden">
    <div className="overflow-hidden pr-2">
      <p className="text-gray-500 text-xs sm:text-sm font-semibold mb-0.5 truncate">{title}</p>
      <h3 className="text-2xl sm:text-3xl font-black text-gray-900 truncate">{value}</h3>
      {subtitle && <p className="text-xs text-gray-400 mt-0.5 truncate">{subtitle}</p>}
    </div>
    <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full ${color} bg-opacity-10 flex items-center justify-center flex-shrink-0`}>
      <Icon className={color.replace('bg-', 'text-')} size={22} />
    </div>
  </div>
);

const SkeletonCard = () => (
  <div className="bg-white rounded-[16px] h-[110px] p-5 shadow-sm border border-gray-100 flex items-center justify-between w-full animate-pulse">
    <div className="space-y-2 flex-1">
      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      <div className="h-8 bg-gray-200 rounded w-1/3"></div>
    </div>
    <div className="w-12 h-12 rounded-full bg-gray-200"></div>
  </div>
);

const SkeletonChart = () => (
  <div className="bg-white rounded-[16px] shadow-sm border border-gray-100 p-5 w-full animate-pulse space-y-4">
    <div className="h-6 bg-gray-200 rounded w-1/4"></div>
    <div className="h-[220px] md:h-[300px] bg-gray-150 rounded w-full"></div>
  </div>
);

const SkeletonTable = () => (
  <div className="bg-white rounded-[16px] shadow-sm border border-gray-100 overflow-hidden w-full animate-pulse">
    <div className="p-5 border-b border-gray-100">
      <div className="h-6 bg-gray-200 rounded w-1/5"></div>
    </div>
    <div className="p-5 space-y-4">
      <div className="h-8 bg-gray-200 rounded w-full"></div>
      <div className="h-8 bg-gray-200 rounded w-full"></div>
      <div className="h-8 bg-gray-200 rounded w-full"></div>
    </div>
  </div>
);

const Dashboard = () => {
  const { shopSlug, shopId, loading: shopLoading, error: shopError } = useCurrentShop();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);

  const fetchDashboardData = async (forceLoad = false) => {
    if (!shopId) return;

    const cacheKeyData = `dashboard_${shopId}`;
    const cacheKeyOrders = `recent_orders_${shopId}`;

    const cachedData = clientCache.get(cacheKeyData);
    const cachedOrders = clientCache.get(cacheKeyOrders);

    if (cachedData) {
      setData(cachedData);
    }
    if (cachedOrders) {
      setRecentOrders(cachedOrders);
    }

    if (cachedData && cachedOrders && !forceLoad) {
      setLoading(false);
    } else {
      setLoading(true);
    }
    
    setError(null);
    
    try {
      // Parallelize independent analytics and orders API calls
      const [res, ordersRes] = await Promise.all([
        getDashboardAnalytics(shopId),
        DEMO_MODE 
          ? Promise.resolve({ success: true, data: DEMO_ORDERS_DATA.slice(0, 5) }) 
          : getLiveOrders(shopId)
      ]);

      if (res.success) {
        setData(res.data);
        clientCache.set(cacheKeyData, res.data);
      } else {
        if (!cachedData) setError('Failed to fetch dashboard data');
      }

      if (ordersRes.success) {
        const sliced = ordersRes.data.slice(0, 5);
        setRecentOrders(sliced);
        clientCache.set(cacheKeyOrders, sliced);
      } else {
        if (!cachedOrders) setRecentOrders([]);
      }
    } catch (err) {
      console.error(err);
      if (!cachedData && !cachedOrders) {
        setError(err.message || 'Error loading dashboard');
      }
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

  if (shopLoading) return <LoadingState message="Loading dashboard..." />;
  if (shopError) return <ErrorState message={shopError} />;
  
  const displayData = DEMO_MODE ? DEMO_DASHBOARD_DATA : data;
  const isInitialLoading = loading && !displayData;

  if (error && !DEMO_MODE && !displayData) {
    return <ErrorState message={error} onRetry={() => fetchDashboardData(true)} />;
  }

  return (
    <div className="space-y-5 md:space-y-6 w-full max-w-full overflow-hidden">
      <div className="flex items-center justify-between">
        <h1 className="text-[28px] md:text-3xl font-bold text-gray-900 tracking-tight leading-tight truncate">Business Overview</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 w-full">
        {isInitialLoading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
            <StatCard title="Total Menu Items" value={displayData.totalProducts} icon={UtensilsCrossed} color="bg-red-500" />
            <StatCard title="Total Categories" value={displayData.totalCategories} icon={MenuIcon} color="bg-blue-500" />
            <StatCard title="Today's Orders" value={displayData.todayOrders} icon={ShoppingBag} color="bg-purple-500" />
            <StatCard title="Revenue Today" value={`₹${displayData.todayRevenue}`} icon={DollarSign} color="bg-emerald-500" />
          </>
        )}
      </div>

      {/* Inventory Overview */}
      <div className="space-y-3">
        <h2 className="text-xl font-extrabold text-gray-900 leading-none">Inventory Status</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 w-full">
          {isInitialLoading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            <>
              <StatCard title="Total Products" value={displayData.totalProducts} icon={UtensilsCrossed} color="bg-blue-500" />
              <StatCard title="Total Stock Units" value={displayData.totalStockUnits ?? 0} icon={Package} color="bg-indigo-500" />
              <StatCard title="Low Stock Items" value={displayData.lowStockItems ?? 0} icon={Clock} color="bg-orange-500" />
              <StatCard title="Out of Stock Items" value={displayData.outOfStockItems ?? 0} icon={XCircle} color="bg-red-500" />
            </>
          )}
        </div>
      </div>

      {/* Quick Insights Row */}
      {!isInitialLoading && (
        <div className="bg-white rounded-[16px] p-4 sm:p-5 md:p-6 shadow-sm border border-gray-100 w-full overflow-hidden">
          <h2 className="text-[22px] font-bold text-gray-900 mb-4 sm:mb-6">Quick Insights</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="flex items-center gap-3.5 overflow-hidden">
              <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                <Package className="text-green-500" size={20} />
              </div>
              <div className="overflow-hidden flex flex-col">
                <p className="font-bold text-gray-900 text-sm sm:text-base truncate">{displayData.mostViewedProduct || 'N/A'}</p>
                <p className="text-xs sm:text-sm text-gray-500 truncate mt-0.5">Most Viewed Product</p>
              </div>
            </div>
            <div className="flex items-center gap-3.5 overflow-hidden">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                <MenuIcon className="text-blue-500" size={20} />
              </div>
              <div className="overflow-hidden flex flex-col">
                <p className="font-bold text-gray-900 text-sm sm:text-base truncate">{displayData.topCategory || 'N/A'}</p>
                <p className="text-xs sm:text-sm text-gray-500 truncate mt-0.5">Top Category</p>
              </div>
            </div>
            <div className="flex items-center gap-3.5 overflow-hidden">
              <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0">
                <Clock className="text-orange-500" size={20} />
              </div>
              <div className="overflow-hidden flex flex-col">
                <p className="font-bold text-gray-900 text-sm sm:text-base truncate">{displayData.pendingOrders}</p>
                <p className="text-xs sm:text-sm text-gray-500 truncate mt-0.5">Pending Orders</p>
              </div>
            </div>
            <div className="flex items-center gap-3.5 overflow-hidden">
              <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="text-purple-500" size={20} />
              </div>
              <div className="overflow-hidden flex flex-col">
                <p className="font-bold text-gray-900 text-sm sm:text-base truncate">
                  {displayData.latestOrder ? `#${displayData.latestOrder.orderNumber}` : 'No orders'}
                </p>
                <p className="text-xs sm:text-sm text-gray-500 truncate mt-0.5">Latest Order</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        {isInitialLoading ? (
          <>
            <SkeletonChart />
            <SkeletonChart />
          </>
        ) : (
          <>
            {/* Weekly Orders Trend */}
            <div className="bg-white rounded-[16px] shadow-sm border border-gray-100 p-4 sm:p-5 md:p-6 flex flex-col w-full overflow-hidden">
              <h2 className="text-[22px] font-bold text-gray-900 mb-4 sm:mb-6">Weekly Orders</h2>
              <div className="w-full h-[220px] md:h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={displayData.weeklyOrdersChart} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dx={-10} allowDecimals={false} />
                    <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={28} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Weekly Revenue Trend */}
            <div className="bg-white rounded-[16px] shadow-sm border border-gray-100 p-4 sm:p-5 md:p-6 flex flex-col w-full overflow-hidden">
              <h2 className="text-[22px] font-bold text-gray-900 mb-4 sm:mb-6">Weekly Revenue (₹)</h2>
              <div className="w-full h-[220px] md:h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={displayData.weeklyRevenueChart} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dx={-10} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-[16px] shadow-sm border border-gray-100 overflow-hidden w-full">
        {isInitialLoading ? (
          <SkeletonTable />
        ) : (
          <>
            <div className="p-4 sm:p-5 md:p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-[22px] font-bold text-gray-900">Recent Orders</h2>
            </div>

            {/* Desktop & Tablet Table View */}
            <div className="hidden md:block overflow-x-auto w-full">
              <table className="w-full text-left whitespace-nowrap">
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
                      <td colSpan="5" className="p-8">
                        <div className="flex flex-col items-center justify-center text-center">
                          <ShoppingBag className="text-gray-300 mb-2" size={32} />
                          <p className="text-sm text-gray-500 font-semibold">No recent orders found</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    recentOrders.map((order) => (
                      <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4 font-medium text-gray-900">{order.orderNumber}</td>
                        <td className="p-4 text-gray-600 truncate max-w-[200px]">{order.customerName}</td>
                        <td className="p-4 font-semibold text-[#E50914]">₹{order.totalAmount}</td>
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

            {/* Mobile Cards View */}
            <div className="md:hidden divide-y divide-gray-100 p-4 space-y-3.5">
              {recentOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <ShoppingBag className="text-gray-300 mb-2" size={32} />
                  <p className="text-sm text-gray-500 font-semibold">No recent orders found</p>
                </div>
              ) : (
                recentOrders.map((order) => (
                  <div key={order._id} className="pt-3.5 first:pt-0 flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-900 text-sm">{order.orderNumber}</span>
                      <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                        order.status === 'Completed' ? 'bg-green-100 text-green-700' :
                        order.status === 'Pending' ? 'bg-orange-100 text-orange-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 truncate max-w-[180px]">{order.customerName}</span>
                      <span className="font-black text-[#E50914] text-[15px]">₹{order.totalAmount}</span>
                    </div>
                    <div className="text-[11px] text-gray-400">
                      {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
