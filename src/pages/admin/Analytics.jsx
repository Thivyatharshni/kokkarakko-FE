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
import { clientCache } from '../../utils/cache';

const COLORS = ['#E50914', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#f43f5e', '#84cc16', '#06b6d4'];
const PIE_COLORS = ['#E50914', '#111111', '#4b5563', '#9ca3af', '#d1d5db'];

const StatCard = ({ title, value, icon: Icon, color, isPeakHour }) => (
  <div className="bg-white rounded-[16px] h-[110px] md:h-auto p-4 sm:p-5 md:p-6 shadow-sm border border-gray-100 flex items-center justify-between overflow-hidden">
    <div className="overflow-hidden pr-2 flex-1 min-w-0">
      <p className={`text-gray-500 font-semibold mb-0.5 truncate ${isPeakHour ? 'text-[16px]' : 'text-xs sm:text-sm'}`}>{title}</p>
      <h3 className={`font-bold text-gray-900 leading-[1.2] ${
        isPeakHour 
          ? 'text-[24px] md:text-[32px] sm:text-[26px] break-words' 
          : 'text-2xl sm:text-3xl font-black truncate'
      }`}>
        {value}
      </h3>
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

const EmptyChart = ({ message = "No data available" }) => (
  <div className="flex flex-col items-center justify-center h-full min-h-[180px] py-6 text-center">
    <Activity className="text-gray-300 mb-2" size={32} />
    <p className="text-sm text-gray-500 font-semibold">{message}</p>
  </div>
);

const cleanPeakHour = (val) => {
  if (!val) return '';
  const ampmMatch = val.match(/(AM|PM)/i);
  const ampm = ampmMatch ? ampmMatch[0] : '';
  const timeMatch = val.match(/^(\d{2}:\d{2})/);
  if (timeMatch && ampm) {
    let [hour, minute] = timeMatch[1].split(':');
    let hr = parseInt(hour);
    if (hr > 12) hr = hr - 12;
    return `${String(hr).padStart(2, '0')}:${minute} ${ampm}`;
  }
  return val;
};

const Analytics = () => {
  const { shopId, shopSlug, loading: shopLoading, error: shopError } = useCurrentShop();
  const [data, setData] = useState(null);
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = async (forceLoad = false) => {
    if (!shopSlug || !shopId) return;

    const cacheKeyShop = `shop_analytics_${shopSlug}`;
    const cacheKeyQr = `qr_analytics_${shopId}`;

    const cachedShop = clientCache.get(cacheKeyShop);
    const cachedQr = clientCache.get(cacheKeyQr);

    if (cachedShop) {
      setData(cachedShop);
    }
    if (cachedQr) {
      setQrData(cachedQr);
    }

    if (cachedShop && cachedQr && !forceLoad) {
      setLoading(false);
    } else {
      setLoading(true);
    }

    setError(null);
    try {
      const [shopRes, qrRes] = await Promise.allSettled([
        getShopAnalytics(shopSlug),
        getQRAnalytics(shopId)
      ]);

      if (shopRes.status === 'fulfilled' && shopRes.value.success) {
        setData(shopRes.value.data);
        clientCache.set(cacheKeyShop, shopRes.value.data);
      } else {
        if (!cachedShop) throw new Error('Failed to fetch analytics');
      }

      if (qrRes.status === 'fulfilled' && qrRes.value.success) {
        setQrData(qrRes.value.data);
        clientCache.set(cacheKeyQr, qrRes.value.data);
      }
    } catch (err) {
      if (!cachedShop) {
        setError(err.message || 'Error loading analytics');
      }
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

  if (shopLoading) return <LoadingState message="Loading analytics data..." />;
  if (shopError) return <ErrorState message={shopError} />;

  const displayData = DEMO_MODE ? DEMO_ANALYTICS_DATA : data;
  const displayQrData = DEMO_MODE ? DEMO_QR_ANALYTICS_DATA : qrData;
  const isInitialLoading = loading && !displayData;

  if (error && !DEMO_MODE && !displayData) {
    return <ErrorState message={error} onRetry={() => fetchAnalytics(true)} />;
  }

  if (!isInitialLoading && (!displayData || !displayData.charts)) {
    return <EmptyState title="No Analytics Data" message="There is no analytics data available for this shop." />;
  }

  const metrics = displayData?.metrics || {};
  const charts = displayData?.charts || {};

  return (
    <div className="space-y-5 md:space-y-6 w-full max-w-full overflow-hidden pb-10">
      <div className="flex items-center justify-between">
        <h1 className="text-[28px] md:text-3xl font-bold text-gray-900 tracking-tight leading-tight truncate">Analytics</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full">
        {isInitialLoading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
            <StatCard title="Daily QR Scans" value={displayQrData?.dailyScans || metrics.dailyScans} icon={ScanLine} color="bg-red-500" />
            <StatCard title="Weekly QR Scans" value={displayQrData?.weeklyScans || metrics.weeklyScans} icon={Activity} color="bg-blue-500" />
            <StatCard title="Monthly QR Scans" value={metrics.monthlyScans} icon={Target} color="bg-purple-500" />
            <StatCard title="Peak Traffic Hour" value={cleanPeakHour(metrics.peakHour)} icon={Clock} color="bg-orange-500" isPeakHour={true} />
          </>
        )}
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 w-full">
        {isInitialLoading ? (
          <>
            <SkeletonChart />
            <SkeletonChart />
            <SkeletonChart />
            <SkeletonChart />
            <SkeletonChart />
            <SkeletonChart />
          </>
        ) : (
          <>
            {/* QR Scan Trend */}
            <div className="bg-white rounded-[16px] shadow-sm border border-gray-100 p-4 sm:p-5 md:p-6 flex flex-col w-full overflow-hidden">
              <h2 className="text-[22px] font-bold text-gray-900 mb-4 sm:mb-6">QR Scan Trend (Last 7 Days)</h2>
              <div className="w-full h-[220px] lg:h-[320px] md:h-[300px]">
                {!displayQrData?.scansPerDay?.length ? (
                   <EmptyChart message="No scan trend data available" />
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={displayQrData.scansPerDay} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 11 }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 11 }} dx={-5} allowDecimals={false} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Line type="monotone" dataKey="scans" stroke="#E50914" strokeWidth={3} dot={{ fill: '#E50914', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Customer Traffic Trend */}
            <div className="bg-white rounded-[16px] shadow-sm border border-gray-100 p-4 sm:p-5 md:p-6 flex flex-col w-full overflow-hidden">
              <h2 className="text-[22px] font-bold text-gray-900 mb-4 sm:mb-6">Customer Traffic Trend (Hourly)</h2>
              <div className="w-full h-[220px] lg:h-[320px] md:h-[300px]">
                {!charts.trafficTrend?.length ? (
                  <EmptyChart message="No analytics data available" />
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={charts.trafficTrend} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 11 }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 11 }} dx={-5} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Area type="monotone" dataKey="traffic" stroke="#a855f7" strokeWidth={3} fillOpacity={1} fill="url(#colorTraffic)" />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Most Viewed Products */}
            <div className="bg-white rounded-[16px] shadow-sm border border-gray-100 p-4 sm:p-5 md:p-6 flex flex-col w-full overflow-hidden">
              <h2 className="text-[22px] font-bold text-gray-900 mb-4 sm:mb-6">Most Viewed Products (Top 10)</h2>
              <div className="w-full h-[220px] md:h-[300px]">
                {!charts.mostViewed?.length ? (
                   <EmptyChart message="No analytics data available" />
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart layout="vertical" data={charts.mostViewed} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                      <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 11 }} />
                      <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#4b5563', fontSize: 11, fontWeight: 500 }} width={75} />
                      <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Bar dataKey="views" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={18}>
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
            <div className="bg-white rounded-[16px] shadow-sm border border-gray-100 p-4 sm:p-5 md:p-6 flex flex-col w-full overflow-hidden">
              <h2 className="text-[22px] font-bold text-gray-900 mb-4 sm:mb-6">Most Ordered Products (Top 10)</h2>
              <div className="w-full h-[220px] md:h-[300px]">
                {!charts.mostOrdered?.length ? (
                  <EmptyChart message="No analytics data available" />
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart layout="vertical" data={charts.mostOrdered} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                      <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 11 }} />
                      <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#4b5563', fontSize: 11, fontWeight: 500 }} width={75} />
                      <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Bar dataKey="orders" fill="#10b981" radius={[0, 4, 4, 0]} barSize={18}>
                        {charts.mostOrdered.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Category Performance */}
            <div className="bg-white rounded-[16px] shadow-sm border border-gray-100 p-4 sm:p-5 md:p-6 flex flex-col w-full overflow-hidden">
              <h2 className="text-[22px] font-bold text-gray-900 mb-4 sm:mb-6">Category Distribution</h2>
              <div className="w-full h-[220px] md:h-[300px]">
                {!charts.categoryPerformance?.length ? (
                  <EmptyChart message="No analytics data available" />
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={charts.categoryPerformance}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={75}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {charts.categoryPerformance.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Legend wrapperStyle={{ fontSize: '11px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Scan Source Analytics */}
            <div className="bg-white rounded-[16px] shadow-sm border border-gray-100 p-4 sm:p-5 md:p-6 flex flex-col w-full overflow-hidden">
              <h2 className="text-[22px] font-bold text-gray-900 mb-4 sm:mb-6">Scan Source Analytics</h2>
              <div className="w-full h-[220px] md:h-[300px]">
                {!charts.scanSource?.length ? (
                   <EmptyChart message="No analytics data available" />
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={charts.scanSource}
                        cx="50%"
                        cy="50%"
                        outerRadius={75}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {charts.scanSource.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Legend wrapperStyle={{ fontSize: '11px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Analytics;


