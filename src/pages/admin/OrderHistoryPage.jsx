import { useState, useEffect, useMemo } from 'react';
import { useCurrentShop } from '../../hooks/useCurrentShop';
import { getHistoryOrders } from '../../services/orderService';
import { DEMO_MODE, DEMO_ORDERS_DATA } from '../../utils/demoData';
import { Search, Calendar, Package, IndianRupee, CheckCircle, Hash, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';
import toast from 'react-hot-toast';

const OrderHistoryPage = () => {
  const { shopId, loading: shopLoading, error: shopError } = useCurrentShop();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchHistory = async (params = {}) => {
    if (!shopId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getHistoryOrders(shopId, params);
      if (res.success) {
        setOrders(res.data);
      } else {
        setError('Failed to fetch history orders');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!shopLoading && shopId) {
      fetchHistory();
    } else if (!shopLoading && !shopId) {
      setLoading(false);
    }
  }, [shopId, shopLoading]);

  const handleApplyFilters = () => {
    if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
      toast.error('From Date cannot be later than To Date');
      return;
    }
    const params = {};
    if (fromDate) params.fromDate = fromDate;
    if (toDate) params.toDate = toDate;
    fetchHistory(params);
  };

  const applyQuickFilter = (type) => {
    const today = new Date();
    let start = new Date();
    let end = new Date();

    switch (type) {
      case 'today':
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        break;
      case 'yesterday':
        start.setDate(today.getDate() - 1);
        start.setHours(0, 0, 0, 0);
        end.setDate(today.getDate() - 1);
        end.setHours(23, 59, 59, 999);
        break;
      case 'last7':
        start.setDate(today.getDate() - 7);
        start.setHours(0, 0, 0, 0);
        break;
      case 'last30':
        start.setDate(today.getDate() - 30);
        start.setHours(0, 0, 0, 0);
        break;
      case 'thisMonth':
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        break;
      case 'all':
        setFromDate('');
        setToDate('');
        fetchHistory();
        return;
      default:
        break;
    }

    // Format YYYY-MM-DD
    const fDate = start.toISOString().split('T')[0];
    const tDate = end.toISOString().split('T')[0];
    
    setFromDate(fDate);
    setToDate(tDate);
    fetchHistory({ fromDate: fDate, toDate: tDate });
  };

  const displayOrders = (DEMO_MODE || orders.length === 0) ? DEMO_ORDERS_DATA.filter(o => o.status === 'Completed' || o.status === 'Cancelled' || o.status === 'Ready') : orders;

  const filteredOrders = useMemo(() => {
    let result = displayOrders;
    
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(o => 
        o.orderNumber.toLowerCase().includes(lowerSearch) || 
        o.customerName.toLowerCase().includes(lowerSearch) ||
        (o.customerMobile && o.customerMobile.includes(lowerSearch)) ||
        (o.customerPhone && o.customerPhone.includes(lowerSearch))
      );
    }
    
    if (DEMO_MODE || orders.length === 0) {
      if (fromDate || toDate) {
        result = result.filter(o => {
          const orderDate = new Date(o.createdAt);
          if (fromDate && orderDate < new Date(fromDate)) return false;
          if (toDate) {
            const endTo = new Date(toDate);
            endTo.setHours(23, 59, 59, 999);
            if (orderDate > endTo) return false;
          }
          return true;
        });
      }
    }

    return result;
  }, [displayOrders, searchTerm, fromDate, toDate, orders.length]);

  const stats = useMemo(() => {
    const totalOrders = filteredOrders.length;
    const revenue = filteredOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const avgValue = totalOrders > 0 ? Math.round(revenue / totalOrders) : 0;

    return { totalOrders, revenue, avgValue };
  }, [filteredOrders]);

  const formatCompletedTime = (timestamp) => {
    const date = new Date(timestamp);
    const optionsDate = { timeZone: 'Asia/Kolkata', day: '2-digit', month: '2-digit', year: 'numeric' };
    const optionsTime = { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true };
    return {
      date: date.toLocaleDateString('en-GB', optionsDate),
      time: date.toLocaleTimeString('en-US', optionsTime)
    };
  };

  if (shopLoading || loading) return <LoadingState message="Loading history..." />;
  if (shopError) return <ErrorState message={shopError} />;
  if (error && !DEMO_MODE) return <ErrorState message={error} onRetry={fetchHistory} />;

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link 
            to="/owner/orders" 
            className="p-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl transition-colors shadow-sm"
            title="Back to Live Orders"
          >
            <ArrowLeft className="text-gray-600" size={24} />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-semibold mb-1">Total Orders</p>
            <h3 className="text-3xl font-black text-gray-900">{stats.totalOrders}</h3>
          </div>
          <div className="p-4 rounded-full bg-blue-500 bg-opacity-10">
            <Hash className="text-blue-500" size={24} />
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-semibold mb-1">Completed Orders</p>
            <h3 className="text-3xl font-black text-gray-900">{stats.totalOrders}</h3>
          </div>
          <div className="p-4 rounded-full bg-green-500 bg-opacity-10">
            <CheckCircle className="text-green-500" size={24} />
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-semibold mb-1">Revenue</p>
            <h3 className="text-3xl font-black text-gray-900">₹{stats.revenue}</h3>
          </div>
          <div className="p-4 rounded-full bg-yellow-500 bg-opacity-10">
            <IndianRupee className="text-yellow-500" size={24} />
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-semibold mb-1">Average Order Value</p>
            <h3 className="text-3xl font-black text-gray-900">₹{stats.avgValue}</h3>
          </div>
          <div className="p-4 rounded-full bg-purple-500 bg-opacity-10">
            <Package className="text-purple-500" size={24} />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-gray-500 mr-2">Quick Filters:</span>
          <button onClick={() => applyQuickFilter('today')} className="px-4 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-sm font-bold text-gray-700 transition-colors">Today</button>
          <button onClick={() => applyQuickFilter('yesterday')} className="px-4 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-sm font-bold text-gray-700 transition-colors">Yesterday</button>
          <button onClick={() => applyQuickFilter('last7')} className="px-4 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-sm font-bold text-gray-700 transition-colors">Last 7 Days</button>
          <button onClick={() => applyQuickFilter('last30')} className="px-4 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-sm font-bold text-gray-700 transition-colors">Last 30 Days</button>
          <button onClick={() => applyQuickFilter('thisMonth')} className="px-4 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-sm font-bold text-gray-700 transition-colors">This Month</button>
          <button onClick={() => applyQuickFilter('all')} className="px-4 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-sm font-bold text-gray-700 transition-colors">All Orders</button>
        </div>
        
        <div className="flex flex-col xl:flex-row gap-4 items-center pt-4 border-t border-gray-100">
          <div className="flex w-full xl:w-2/3 items-center gap-3">
            <div className="flex-1 flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
              <Calendar className="text-gray-400" size={18} />
              <input 
                type="date" 
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="bg-transparent outline-none w-full text-sm font-medium text-gray-700"
              />
            </div>
            <span className="text-gray-400 font-bold">To</span>
            <div className="flex-1 flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
              <Calendar className="text-gray-400" size={18} />
              <input 
                type="date" 
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="bg-transparent outline-none w-full text-sm font-medium text-gray-700"
              />
            </div>
            <button 
              onClick={handleApplyFilters}
              className="bg-[#111111] hover:bg-black text-white font-bold py-2 px-6 rounded-xl transition-colors"
            >
              Search
            </button>
          </div>
          <div className="relative w-full xl:w-1/3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search ID, Customer..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-xl outline-none focus:border-[#E50914] transition-colors bg-gray-50 focus:bg-white text-sm"
            />
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-10 flex justify-center"><LoadingState /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead className="bg-gray-50 text-gray-500 text-sm">
                <tr>
                  <th className="p-4 font-semibold">Order ID</th>
                  <th className="p-4 font-semibold">Customer Details</th>
                  <th className="p-4 font-semibold">Products</th>
                  <th className="p-4 font-semibold text-center">Quantity</th>
                  <th className="p-4 font-semibold">Total Amount</th>
                  <th className="p-4 font-semibold">Completed Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-10 text-center text-gray-500">No historical orders found.</td>
                  </tr>
                ) : (
                  filteredOrders.map(order => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="p-4 font-bold text-gray-900">{order.orderNumber}</td>
                      <td className="p-4">
                        <p className="font-semibold text-gray-900">{order.customerName}</p>
                        <p className="text-sm text-gray-500">{order.customerMobile || order.customerPhone || '-'}</p>
                      </td>
                      <td className="p-4 text-sm">
                        <ul className="list-disc pl-4 text-gray-600">
                          {order.items.map((item, idx) => (
                            <li key={idx}>{item.name}</li>
                          ))}
                        </ul>
                      </td>
                      <td className="p-4 text-sm font-semibold text-center text-gray-700">
                        {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                      </td>
                      <td className="p-4 font-black text-green-600">₹{order.totalAmount}</td>
                      <td className="p-4">
                        {order.createdAt ? (
                          <>
                            <p className="font-semibold text-gray-900">{formatCompletedTime(order.createdAt).date}</p>
                            <p className="text-sm text-gray-500">{formatCompletedTime(order.createdAt).time}</p>
                          </>
                        ) : (
                          <p className="text-gray-500">-</p>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;
