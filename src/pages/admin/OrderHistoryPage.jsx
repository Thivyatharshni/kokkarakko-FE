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

  const displayOrders = DEMO_MODE ? DEMO_ORDERS_DATA.filter(o => o.status === 'Completed') : orders;

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
    <div className="space-y-5 pb-10 w-full max-w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <Link 
            to="/owner/orders" 
            className="h-11 w-11 md:h-12 md:w-12 flex items-center justify-center bg-white hover:bg-gray-50 border border-gray-200 rounded-xl transition-colors shadow-sm"
            title="Back to Live Orders"
          >
            <ArrowLeft className="text-gray-600" size={22} />
          </Link>
          <h1 className="text-[28px] md:text-3xl font-bold text-gray-900 tracking-tight leading-tight truncate">Order History</h1>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full">
        <div className="bg-white rounded-[16px] h-[110px] md:h-auto p-4 sm:p-5 md:p-6 shadow-sm border border-gray-100 flex items-center justify-between overflow-hidden">
          <div className="overflow-hidden pr-2">
            <p className="text-gray-500 text-xs sm:text-sm font-semibold mb-0.5 truncate">Total Orders</p>
            <h3 className="text-2xl sm:text-3xl font-black text-gray-900 truncate">{stats.totalOrders}</h3>
          </div>
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-blue-500 bg-opacity-10 flex items-center justify-center flex-shrink-0">
            <Hash className="text-blue-500" size={22} />
          </div>
        </div>
        <div className="bg-white rounded-[16px] h-[110px] md:h-auto p-4 sm:p-5 md:p-6 shadow-sm border border-gray-100 flex items-center justify-between overflow-hidden">
          <div className="overflow-hidden pr-2">
            <p className="text-gray-500 text-xs sm:text-sm font-semibold mb-0.5 truncate">Completed Orders</p>
            <h3 className="text-2xl sm:text-3xl font-black text-gray-900 truncate">{stats.totalOrders}</h3>
          </div>
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-green-500 bg-opacity-10 flex items-center justify-center flex-shrink-0">
            <CheckCircle className="text-green-500" size={22} />
          </div>
        </div>
        <div className="bg-white rounded-[16px] h-[110px] md:h-auto p-4 sm:p-5 md:p-6 shadow-sm border border-gray-100 flex items-center justify-between overflow-hidden">
          <div className="overflow-hidden pr-2">
            <p className="text-gray-500 text-xs sm:text-sm font-semibold mb-0.5 truncate">Revenue</p>
            <h3 className="text-2xl sm:text-3xl font-black text-gray-900 truncate">₹{stats.revenue}</h3>
          </div>
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-yellow-500 bg-opacity-10 flex items-center justify-center flex-shrink-0">
            <IndianRupee className="text-yellow-500" size={22} />
          </div>
        </div>
        <div className="bg-white rounded-[16px] h-[110px] md:h-auto p-4 sm:p-5 md:p-6 shadow-sm border border-gray-100 flex items-center justify-between overflow-hidden">
          <div className="overflow-hidden pr-2">
            <p className="text-gray-500 text-xs sm:text-sm font-semibold mb-0.5 truncate">Average Value</p>
            <h3 className="text-2xl sm:text-3xl font-black text-gray-900 truncate">₹{stats.avgValue}</h3>
          </div>
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-purple-500 bg-opacity-10 flex items-center justify-center flex-shrink-0">
            <Package className="text-purple-500" size={22} />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-[18px] sm:p-5 rounded-[16px] shadow-sm border border-gray-100 flex flex-col space-y-3 w-full">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs sm:text-sm font-semibold text-gray-500 mr-2 w-full sm:w-auto mb-1 sm:mb-0">Quick Filters:</span>
          <button onClick={() => applyQuickFilter('today')} className="h-8 px-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 transition-colors flex items-center justify-center">Today</button>
          <button onClick={() => applyQuickFilter('yesterday')} className="h-8 px-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 transition-colors flex items-center justify-center">Yesterday</button>
          <button onClick={() => applyQuickFilter('last7')} className="h-8 px-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 transition-colors flex items-center justify-center">Last 7 Days</button>
          <button onClick={() => applyQuickFilter('last30')} className="h-8 px-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 transition-colors flex items-center justify-center">Last 30 Days</button>
          <button onClick={() => applyQuickFilter('thisMonth')} className="h-8 px-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 transition-colors flex items-center justify-center">This Month</button>
          <button onClick={() => applyQuickFilter('all')} className="h-8 px-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 transition-colors flex items-center justify-center">All Orders</button>
        </div>
        
        <div className="flex flex-col xl:flex-row gap-3 items-stretch xl:items-center pt-3 border-t border-gray-100">
          <div className="flex flex-col sm:flex-row w-full xl:w-2/3 items-stretch sm:items-center gap-2">
            <div className="flex-1 h-11 flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
              <Calendar className="text-gray-400 flex-shrink-0" size={18} />
              <input 
                type="date" 
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="bg-transparent outline-none w-full text-sm font-medium text-gray-700"
              />
            </div>
            <span className="text-gray-400 font-bold text-center text-xs">To</span>
            <div className="flex-1 h-11 flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
              <Calendar className="text-gray-400 flex-shrink-0" size={18} />
              <input 
                type="date" 
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="bg-transparent outline-none w-full text-sm font-medium text-gray-700"
              />
            </div>
            <button 
              onClick={handleApplyFilters}
              className="h-11 bg-[#111111] hover:bg-black text-white font-semibold text-[15px] px-6 rounded-xl transition-colors flex justify-center items-center shrink-0"
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
              className="w-full h-11 pl-10 pr-4 py-2 border rounded-xl outline-none focus:border-[#E50914] transition-colors bg-gray-50 focus:bg-white text-sm"
            />
          </div>
        </div>
      </div>

      {/* History Table & Cards Container */}
      <div className="bg-white rounded-[16px] shadow-sm border border-gray-100 overflow-hidden w-full">
        {loading ? (
          <div className="p-10 flex justify-center"><LoadingState /></div>
        ) : (
          <>
            {/* Desktop & Tablet Table View */}
            <div className="hidden md:block overflow-x-auto w-full">
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
                      <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4 font-bold text-gray-900">{order.orderNumber}</td>
                        <td className="p-4">
                          <p className="font-semibold text-gray-900">{order.customerName}</p>
                          <p className="text-sm text-gray-500">{order.customerMobile || order.customerPhone || '-'}</p>
                        </td>
                        <td className="p-4 text-sm whitespace-normal max-w-xs">
                          <ul className="list-disc pl-4 text-gray-600">
                            {order.items.map((item, idx) => (
                              <li key={idx} className="truncate">{item.name}</li>
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

            {/* Mobile Cards View (< md) */}
            <div className="md:hidden divide-y divide-gray-100 p-[18px] space-y-3">
              {filteredOrders.length === 0 ? (
                <p className="p-4 text-center text-gray-500 text-sm">No historical orders found.</p>
              ) : (
                filteredOrders.map(order => (
                  <div key={order._id} className="py-3.5 first:pt-0 last:pb-0 flex flex-col gap-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-gray-900 text-sm">{order.orderNumber}</span>
                      <span className="font-black text-green-600 text-base">₹{order.totalAmount}</span>
                    </div>

                    <div className="bg-gray-50 p-2.5 rounded-lg flex justify-between items-center text-sm">
                      <div>
                        <p className="font-bold text-gray-900">{order.customerName}</p>
                        <p className="text-xs text-gray-500">{order.customerMobile || order.customerPhone || '-'}</p>
                      </div>
                      {order.createdAt && (
                        <div className="text-right text-xs text-gray-500">
                          <p className="font-semibold text-gray-700">{formatCompletedTime(order.createdAt).date}</p>
                          <p>{formatCompletedTime(order.createdAt).time}</p>
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Products:</span>
                        <span className="text-xs font-semibold text-gray-600">Total Qty: {order.items.reduce((sum, item) => sum + item.quantity, 0)}</span>
                      </div>
                      <ul className="space-y-1 text-sm bg-white border border-gray-100 p-2.5 rounded-lg">
                        {order.items.map((item, idx) => (
                          <li key={idx} className="flex justify-between font-medium text-gray-700">
                            <span>{item.quantity}x {item.name}</span>
                          </li>
                        ))}
                      </ul>
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

export default OrderHistoryPage;
