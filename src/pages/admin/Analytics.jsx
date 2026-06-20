import { useState, useEffect } from 'react';
import { useCurrentShop } from '../../hooks/useCurrentShop';
import { getShopAnalytics } from '../../services/analyticsService';
import { getQRAnalytics } from '../../services/qrService';
import { DEMO_MODE, DEMO_ANALYTICS_DATA, DEMO_QR_ANALYTICS_DATA } from '../../utils/demoData';
import { ScanLine, Clock, Activity, Target } from 'lucide-react';
import { 
  BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';

const COLORS = ['#E50914', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#f43f5e', '#84cc16', '#06b6d4'];
const PIE_COLORS = ['#E50914', '#111111', '#4b5563', '#9ca3af', '#d1d5db'];

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
    <div>
      <p className="text-gray-500 text-sm font-semibold mb-1">{title}</p>
      <h3 className="text-3xl font-black text-gray-900">{value}</h3>
    </div>
    <div className={`p-4 rounded-full ${color} bg-opacity-10`}>
      <Icon className={color.replace('bg-', 'text-')} size={24} />
    </div>
  </div>
);

const Analytics = () => {
  const { shopId, shopSlug, loading: shopLoading, error: shopError } = useCurrentShop();
  const [data, setData] = useState(null);
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = async () => {
    if (!shopSlug || !shopId) return;
    setLoading(true);
    setError(null);
    try {
      const [shopRes, qrRes] = await Promise.allSettled([
        getShopAnalytics(shopSlug),
        getQRAnalytics(shopId)
      ]);

      if (shopRes.status === 'fulfilled' && shopRes.value.success) {
        setData(shopRes.value.data);
      } else {
        throw new Error('Failed to fetch analytics');
      }

      if (qrRes.status === 'fulfilled' && qrRes.value.success) {
        setQrData(qrRes.value.data);
      }
    } catch (err) {
      setError(err.message || 'Error loading analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!shopLoading && shopSlug && shopId) {
      fetchAnalytics();
    } else if (!shopLoading && (!shopSlug || !shopId)) {
      setLoading(false);
    }
  }, [shopSlug, shopId, shopLoading]);

  if (shopLoading || loading) return <LoadingState message="Loading analytics data..." />;
  if (shopError) return <ErrorState message={shopError} />;
  if (error && !DEMO_MODE) return <ErrorState message={error} onRetry={fetchAnalytics} />;
  
  const displayData = (DEMO_MODE || !data || !data.charts) ? DEMO_ANALYTICS_DATA : data;
  const displayQrData = (DEMO_MODE || !qrData) ? DEMO_QR_ANALYTICS_DATA : qrData;

  if (!displayData || !displayData.charts) return <EmptyState title="No Analytics Data" message="There is no analytics data available for this shop." />;

  const { metrics, charts } = displayData;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Daily QR Scans" value={displayQrData?.dailyScans || metrics.dailyScans} icon={ScanLine} color="bg-red-500" />
        <StatCard title="Weekly QR Scans" value={displayQrData?.weeklyScans || metrics.weeklyScans} icon={Activity} color="bg-blue-500" />
        <StatCard title="Monthly QR Scans" value={metrics.monthlyScans} icon={Target} color="bg-purple-500" />
        <StatCard title="Peak Traffic Hour" value={metrics.peakHour} icon={Clock} color="bg-orange-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* QR Scan Trend (Last 7 Days) */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col lg:col-span-2">
          <h2 className="text-xl font-bold text-gray-900 mb-6">QR Scan Trend (Last 7 Days)</h2>
          <div className="w-full min-h-[300px] flex-grow">
            {!displayQrData?.scansPerDay?.length ? (
               <div className="flex items-center justify-center h-full text-gray-500">No scan trend data available</div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={displayQrData.scansPerDay} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dx={-10} allowDecimals={false} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Line type="monotone" dataKey="scans" stroke="#E50914" strokeWidth={3} dot={{ fill: '#E50914', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Most Viewed Products */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Most Viewed Products (Top 10)</h2>
          <div className="w-full min-h-[300px] flex-grow">
            {!charts.mostViewed?.length ? (
               <div className="flex items-center justify-center h-full text-gray-500">No analytics data available</div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart layout="vertical" data={charts.mostViewed} margin={{ top: 0, right: 20, left: 20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#4b5563', fontSize: 12, fontWeight: 500 }} width={120} />
                  <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="views" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20}>
                    {charts.mostViewed.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Most Ordered Products */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Most Ordered Products (Top 10)</h2>
          <div className="w-full min-h-[300px] flex-grow">
            {!charts.mostOrdered?.length ? (
              <div className="flex items-center justify-center h-full text-gray-500">No analytics data available</div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart layout="vertical" data={charts.mostOrdered} margin={{ top: 0, right: 20, left: 20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#4b5563', fontSize: 12, fontWeight: 500 }} width={120} />
                  <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="orders" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20}>
                    {charts.mostOrdered.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Customer Traffic Trend */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col lg:col-span-2">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Customer Traffic Trend (Hourly)</h2>
          <div className="w-full min-h-[300px] flex-grow">
            {!charts.trafficTrend?.length ? (
              <div className="flex items-center justify-center h-full text-gray-500">No analytics data available</div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={charts.trafficTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dx={-10} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Area type="monotone" dataKey="traffic" stroke="#a855f7" strokeWidth={3} fillOpacity={1} fill="url(#colorTraffic)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Category Performance */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Category Distribution</h2>
          <div className="w-full min-h-[300px] flex-grow">
            {!charts.categoryPerformance?.length ? (
              <div className="flex items-center justify-center h-full text-gray-500">No analytics data available</div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={charts.categoryPerformance}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {charts.categoryPerformance.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Scan Source Analytics */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Scan Source Analytics</h2>
          <div className="w-full min-h-[300px] flex-grow">
            {!charts.scanSource?.length ? (
               <div className="flex items-center justify-center h-full text-gray-500">No analytics data available</div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={charts.scanSource}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    <Cell fill="#E50914" />
                    <Cell fill="#111111" />
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
