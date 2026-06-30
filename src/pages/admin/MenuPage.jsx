import { useState, useEffect, useMemo } from 'react';
import { useCurrentShop } from '../../hooks/useCurrentShop';
import { getMenuBySlug, createMenuItem, updateMenuItem, deleteMenuItem } from '../../services/menuService';
import { getCategoriesBySlug } from '../../services/categoryService';
import { DEMO_MODE, DEMO_MENU_DATA, DEMO_CATEGORIES_DATA } from '../../utils/demoData';
import toast from 'react-hot-toast';
import { Plus, Trash2, Edit2, Loader2, Image as ImageIcon, Search, Package, CheckCircle, XCircle, Star, X } from 'lucide-react';
import { getFullImageUrl } from '../../config/constants';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';

const MenuPage = () => {
  const { shopSlug, loading: shopLoading, error: shopError } = useCurrentShop();
  const [menu, setMenu] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    status: 'Available',
    featured: false,
    quantity: 0,
    image: null,
  });

  const fetchData = async () => {
    if (!shopSlug) return;
    setLoading(true);
    setError(null);
    try {
      const [menuResult, catResult] = await Promise.allSettled([
        getMenuBySlug(shopSlug),
        getCategoriesBySlug(shopSlug)
      ]);
      
      if (catResult.status === 'fulfilled' && catResult.value.success) {
        setCategories(catResult.value.data);
      } else {
        toast.error('Failed to load categories. Some features may be limited.');
      }

      if (menuResult.status === 'fulfilled' && menuResult.value.success) {
        setMenu(menuResult.value.data);
      } else {
        setError('Failed to fetch menu items');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!shopLoading && shopSlug) {
      fetchData();
    } else if (!shopLoading && !shopSlug) {
      setLoading(false);
    }
  }, [shopSlug, shopLoading]);

  const handleOpenModal = (item = null) => {
    if (categories.length === 0) {
      toast.error('Please create a category first');
      return;
    }
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        description: item.description || '',
        category: item.category?._id || categories[0]?._id,
        price: item.price,
        status: item.status || 'Available',
        featured: item.featured || false,
        quantity: item.quantity !== undefined ? item.quantity : 0,
        image: null,
      });
    } else {
      setEditingItem(null);
      setFormData({
        name: '',
        description: '',
        category: categories[0]?._id || '',
        price: '',
        status: 'Available',
        featured: false,
        quantity: 0,
        image: null,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined) {
          data.append(key, formData[key]);
        }
      });

      let res;
      if (editingItem) {
        if (editingItem._id.startsWith('demo-')) {
          toast.error("Cannot modify demo data. Please add real products.");
          setIsSubmitting(false);
          return;
        }
        res = await updateMenuItem(editingItem._id, data);
      } else {
        res = await createMenuItem(data);
      }

      if (res.success) {
        toast.success(editingItem ? 'Item updated successfully' : 'Item added successfully');
        handleCloseModal();
        fetchData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save item');
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    if (deleteId.startsWith('demo-')) {
      toast.error("Cannot delete demo data. Please add real products.");
      setDeleteId(null);
      return;
    }
    try {
      const res = await deleteMenuItem(deleteId);
      if (res.success) {
        toast.success('Item deleted');
        setDeleteId(null);
        fetchData();
      }
    } catch (error) {
      toast.error('Failed to delete item');
    }
  };

  if (shopLoading || loading) return <LoadingState message="Loading menu items..." />;
  if (shopError) return <ErrorState message={shopError} />;
  if (error && !DEMO_MODE) return <ErrorState message={error} onRetry={fetchData} />;

  const displayMenu = DEMO_MODE ? DEMO_MENU_DATA.products : menu;
  const displayCategories = DEMO_MODE ? DEMO_CATEGORIES_DATA : categories;

  const displayFilteredMenu = displayMenu.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory === 'All' ? true : item.category?._id === filterCategory;
    const matchesStatus = filterStatus === 'All' ? true : item.status === filterStatus;
    const matchesMinPrice = minPrice === '' ? true : item.price >= Number(minPrice);
    const matchesMaxPrice = maxPrice === '' ? true : item.price <= Number(maxPrice);
    
    return matchesSearch && matchesCategory && matchesStatus && matchesMinPrice && matchesMaxPrice;
  });

  const displayStats = DEMO_MODE ? DEMO_MENU_DATA.stats : {
    total: menu.length,
    available: menu.filter(m => m.status === 'Available' && (m.quantity === undefined || m.quantity > 0)).length,
    outOfStock: menu.filter(m => m.status === 'Out Of Stock' || m.quantity === 0).length,
    featured: menu.filter(m => m.featured).length,
  };


  return (
    <div className="space-y-5 md:space-y-6 w-full max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-[28px] md:text-3xl font-bold text-gray-900 tracking-tight leading-tight truncate">Menu Management</h1>
        <button 
          onClick={() => handleOpenModal()}
          className="w-full sm:w-auto h-11 md:h-12 bg-[#E50914] hover:bg-red-700 text-white font-semibold text-[15px] px-5 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
        >
          <Plus size={20} /> Add New Item
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 w-full">
        <div className="bg-white rounded-[16px] h-[110px] md:h-auto p-4 sm:p-5 md:p-6 shadow-sm border border-gray-100 flex items-center justify-between overflow-hidden">
          <div className="overflow-hidden pr-2">
            <p className="text-gray-500 text-xs sm:text-sm font-semibold mb-0.5 truncate">Total Products</p>
            <h3 className="text-2xl sm:text-3xl font-black text-gray-900 truncate">{displayStats.total}</h3>
          </div>
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-blue-500 bg-opacity-10 flex items-center justify-center flex-shrink-0">
            <Package className="text-blue-500" size={22} />
          </div>
        </div>
        <div className="bg-white rounded-[16px] h-[110px] md:h-auto p-4 sm:p-5 md:p-6 shadow-sm border border-gray-100 flex items-center justify-between overflow-hidden">
          <div className="overflow-hidden pr-2">
            <p className="text-gray-500 text-xs sm:text-sm font-semibold mb-0.5 truncate">Available Products</p>
            <h3 className="text-2xl sm:text-3xl font-black text-gray-900 truncate">{displayStats.available}</h3>
          </div>
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-green-500 bg-opacity-10 flex items-center justify-center flex-shrink-0">
            <CheckCircle className="text-green-500" size={22} />
          </div>
        </div>
        <div className="bg-white rounded-[16px] h-[110px] md:h-auto p-4 sm:p-5 md:p-6 shadow-sm border border-gray-100 flex items-center justify-between overflow-hidden">
          <div className="overflow-hidden pr-2">
            <p className="text-gray-500 text-xs sm:text-sm font-semibold mb-0.5 truncate">Out Of Stock Products</p>
            <h3 className="text-2xl sm:text-3xl font-black text-gray-900 truncate">{displayStats.outOfStock}</h3>
          </div>
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-orange-500 bg-opacity-10 flex items-center justify-center flex-shrink-0">
            <XCircle className="text-orange-500" size={22} />
          </div>
        </div>
        <div className="bg-white rounded-[16px] h-[110px] md:h-auto p-4 sm:p-5 md:p-6 shadow-sm border border-gray-100 flex items-center justify-between overflow-hidden">
          <div className="overflow-hidden pr-2">
            <p className="text-gray-500 text-xs sm:text-sm font-semibold mb-0.5 truncate">Featured Items</p>
            <h3 className="text-2xl sm:text-3xl font-black text-gray-900 truncate">{displayStats.featured ?? 0}</h3>
          </div>
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-amber-400 bg-opacity-10 flex items-center justify-center flex-shrink-0">
            <Star className="text-amber-500" size={22} />
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-[18px] sm:p-5 rounded-[16px] shadow-sm border border-gray-100 flex flex-col xl:flex-row gap-3 xl:gap-4 items-stretch xl:items-center w-full">
        <div className="relative w-full xl:w-1/3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full min-h-[48px] pl-10 pr-4 py-2 border rounded-xl outline-none focus:border-[#E50914] transition-colors bg-gray-50 focus:bg-white text-sm"
          />
        </div>
        
        <div className="w-full xl:w-2/3 flex flex-col sm:flex-row flex-wrap gap-2.5 sm:gap-3">
          <select 
            value={filterCategory} 
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full sm:flex-1 sm:min-w-[140px] min-h-[48px] px-3 py-2 border rounded-xl outline-none focus:border-[#E50914] bg-gray-50 focus:bg-white text-sm"
          >
            <option value="All">All Categories</option>
            {displayCategories.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>

          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full sm:flex-1 sm:min-w-[140px] min-h-[48px] px-3 py-2 border rounded-xl outline-none focus:border-[#E50914] bg-gray-50 focus:bg-white text-sm"
          >
            <option value="All">All Statuses</option>
            <option value="Available">Available</option>
            <option value="Out Of Stock">Out Of Stock</option>
            <option value="Hidden">Hidden</option>
          </select>

          <div className="w-full sm:flex-1 sm:min-w-[200px] flex items-center gap-2">
            <input 
              type="number" 
              placeholder="Min ₹" 
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-1/2 min-h-[48px] px-3 py-2 border rounded-xl outline-none focus:border-[#E50914] bg-gray-50 focus:bg-white text-sm"
            />
            <span className="text-gray-400 font-bold">-</span>
            <input 
              type="number" 
              placeholder="Max ₹" 
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-1/2 min-h-[48px] px-3 py-2 border rounded-xl outline-none focus:border-[#E50914] bg-gray-50 focus:bg-white text-sm"
            />
          </div>
        </div>
      </div>

      {/* Table & Cards Container */}
      <div className="bg-white rounded-[16px] shadow-sm border border-gray-100 overflow-hidden w-full">
        {/* Desktop & Tablet Table View */}
        <div className="hidden md:block overflow-x-auto w-full">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-gray-50 text-gray-500 text-sm">
              <tr>
                <th className="p-4 font-semibold">Item</th>
                <th className="p-4 font-semibold">Category</th>
                <th className="p-4 font-semibold">Price</th>
                <th className="p-4 font-semibold">Quantity</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Featured</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {displayFilteredMenu.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-10 text-center text-gray-500">
                    No menu items found matching your filters.
                  </td>
                </tr>
              ) : (
                displayFilteredMenu.map(item => (
                  <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 flex items-center gap-4 min-w-[250px]">
                      {item.image ? (
                        <img src={getFullImageUrl(item.image)} alt={item.name} className="w-12 h-12 rounded-lg object-cover shadow-sm flex-shrink-0" />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 flex-shrink-0">
                          <ImageIcon size={20} />
                        </div>
                      )}
                      <div className="overflow-hidden">
                        <p className="font-bold text-gray-900 truncate">{item.name}</p>
                        <p className="text-xs text-gray-500 max-w-[200px] truncate">{item.description || '-'}</p>
                      </div>
                    </td>
                    <td className="p-4 text-sm font-medium text-gray-600 whitespace-nowrap">
                      {item.category?.name || 'Uncategorized'}
                    </td>
                    <td className="p-4 font-bold text-[#E50914] whitespace-nowrap">₹{item.price}</td>
                    <td className="p-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        item.quantity === 0 ? 'bg-red-100 text-red-700' :
                        item.quantity <= 5 ? 'bg-orange-100 text-orange-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {item.quantity !== undefined ? item.quantity : 0}
                      </span>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        item.status === 'Available' ? 'bg-green-100 text-green-700' : 
                        item.status === 'Out Of Stock' ? 'bg-red-100 text-red-700' : 
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {item.status || 'Available'}
                      </span>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      {item.featured ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-600 border border-amber-200">
                          <Star size={11} fill="currentColor" /> Featured
                        </span>
                      ) : (
                        <span className="text-gray-300 text-sm">—</span>
                      )}
                    </td>
                    <td className="p-4 text-right whitespace-nowrap">
                      <button onClick={() => handleOpenModal(item)} className="min-h-[40px] min-w-[40px] inline-flex items-center justify-center p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors mr-2">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => setDeleteId(item._id)} className="min-h-[40px] min-w-[40px] inline-flex items-center justify-center p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Product Cards View (< md) */}
        <div className="md:hidden divide-y divide-gray-100 p-[18px] space-y-3">
          {displayFilteredMenu.length === 0 ? (
            <p className="p-4 text-center text-gray-500 text-sm">No menu items found matching your filters.</p>
          ) : (
            displayFilteredMenu.map(item => (
              <div key={item._id} className="py-3 first:pt-0 last:pb-0 flex flex-col gap-2.5">
                <div className="flex items-start gap-3">
                  {item.image ? (
                    <img src={getFullImageUrl(item.image)} alt={item.name} className="w-[72px] h-[72px] rounded-lg object-cover shadow-sm flex-shrink-0" />
                  ) : (
                    <div className="w-[72px] h-[72px] bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 flex-shrink-0">
                      <ImageIcon size={22} />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-bold text-gray-900 text-[15px] truncate">{item.name}</h4>
                      <span className="font-black text-[#E50914] text-[15px] flex-shrink-0">₹{item.price}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{item.description || 'No description'}</p>
                    <div className="flex items-center flex-wrap gap-1.5 mt-1.5">
                      <span className="text-xs font-semibold px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md">
                        {item.category?.name || 'Uncategorized'}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${
                        item.quantity === 0 ? 'bg-red-100 text-red-700' :
                        item.quantity <= 5 ? 'bg-orange-100 text-orange-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        Qty: {item.quantity !== undefined ? item.quantity : 0}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${
                        item.status === 'Available' ? 'bg-green-100 text-green-700' : 
                        item.status === 'Out Of Stock' ? 'bg-red-100 text-red-700' : 
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {item.status || 'Available'}
                      </span>
                      {item.featured && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold bg-amber-50 text-amber-600 border border-amber-200">
                          <Star size={10} fill="currentColor" /> Featured
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-gray-50">
                  <button 
                    onClick={() => handleOpenModal(item)} 
                    className="flex-1 h-11 bg-blue-50 text-blue-600 font-semibold rounded-xl flex items-center justify-center gap-2 text-sm hover:bg-blue-100 transition-colors"
                  >
                    <Edit2 size={15} /> Edit
                  </button>
                  <button 
                    onClick={() => setDeleteId(item._id)} 
                    className="flex-1 h-11 bg-red-50 text-red-600 font-semibold rounded-xl flex items-center justify-center gap-2 text-sm hover:bg-red-100 transition-colors"
                  >
                    <Trash2 size={15} /> Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-3 sm:p-4 backdrop-blur-sm overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl w-full max-w-lg p-5 sm:p-6 my-8 max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 truncate pr-4">{editingItem ? 'Edit Menu Item' : 'Add Menu Item'}</h2>
                <button 
                  type="button"
                  onClick={handleCloseModal}
                  className="w-9 h-9 sm:w-[38px] sm:h-[38px] md:w-10 md:h-10 rounded-full bg-[#F8F8F8] hover:bg-[#F1F1F1] active:bg-[#EAEAEA] flex items-center justify-center text-gray-500 hover:text-gray-700 hover:scale-105 active:scale-95 transition-all duration-200 focus:ring-2 focus:ring-gray-200 outline-none shrink-0"
                  aria-label="Close modal"
                >
                  <X className="w-[18px] h-[18px] md:w-5 md:h-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">Product Name</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full h-11 px-4 py-2 border rounded-xl outline-none focus:border-[#E50914] bg-gray-50 focus:bg-white transition-colors text-sm" placeholder="e.g. Chicken Biryani" />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold mb-1 text-gray-700">Category</label>
                    <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full h-11 px-4 py-2 border rounded-xl outline-none focus:border-[#E50914] bg-gray-50 focus:bg-white transition-colors text-sm">
                      {displayCategories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1 text-gray-700">Price (₹)</label>
                    <input required type="number" min="0" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full h-11 px-4 py-2 border rounded-xl outline-none focus:border-[#E50914] bg-gray-50 focus:bg-white transition-colors text-sm" placeholder="0.00" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">Description</label>
                  <textarea rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 border rounded-xl outline-none focus:border-[#E50914] resize-none bg-gray-50 focus:bg-white transition-colors text-sm" placeholder="Brief description of the item..."></textarea>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-semibold mb-1 text-gray-700">Quantity (Stock)</label>
                    <input 
                      required 
                      type="number" 
                      min="0" 
                      step="1"
                      value={formData.quantity} 
                      onChange={e => {
                        const val = e.target.value;
                        setFormData({...formData, quantity: val === '' ? '' : Math.max(0, parseInt(val, 10) || 0)});
                      }} 
                      className="w-full h-11 px-4 py-2 border rounded-xl outline-none focus:border-[#E50914] bg-gray-50 focus:bg-white transition-colors text-sm" 
                      placeholder="0" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1 text-gray-700">Status</label>
                    <select required value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full h-11 px-4 py-2 border rounded-xl outline-none focus:border-[#E50914] bg-gray-50 focus:bg-white transition-colors text-sm">
                      <option value="Available">Available</option>
                      <option value="Out Of Stock">Out Of Stock</option>
                      <option value="Hidden">Hidden</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1 text-gray-700">Image {editingItem && <span className="text-xs font-normal text-gray-400">(Optional)</span>}</label>
                    <input type="file" accept="image/*" onChange={e => setFormData({...formData, image: e.target.files[0]})} className="w-full h-11 text-sm text-gray-500 file:mr-2 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 flex items-center" />
                  </div>
                </div>

                {/* Featured Item Toggle */}
                <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <div className="mt-0.5">
                    <input
                      type="checkbox"
                      id="featuredCheckbox"
                      checked={formData.featured}
                      onChange={e => setFormData({...formData, featured: e.target.checked})}
                      className="w-5 h-5 accent-amber-500 cursor-pointer rounded"
                    />
                  </div>
                  <div>
                    <label htmlFor="featuredCheckbox" className="flex items-center gap-2 text-sm font-bold text-amber-700 cursor-pointer select-none">
                      <Star size={14} fill="currentColor" className="text-amber-500" />
                      Featured Item
                    </label>
                    <p className="text-xs text-amber-600 mt-0.5 font-medium">Featured items appear in the showcase section on the landing page.</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-6 mt-6 border-t border-gray-100">
                  <button type="button" onClick={handleCloseModal} className="w-full sm:flex-1 h-[46px] rounded-xl border border-gray-300 bg-white text-gray-700 font-semibold text-[15px] hover:bg-gray-50 transition-colors">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="w-full sm:flex-1 h-[46px] rounded-xl bg-[#E50914] text-white font-semibold text-[15px] hover:bg-red-700 transition-colors flex justify-center items-center">
                    {isSubmitting ? <Loader2 className="animate-spin" size={20}/> : (editingItem ? 'Save Changes' : 'Create Product')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteId && (
          <div className="fixed inset-0 bg-black/60 z-[110] flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl w-full max-w-sm p-5 text-center shadow-2xl"
            >
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Trash2 className="text-red-500" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1.5">Delete Product?</h3>
              <p className="text-gray-500 mb-5 text-xs">Are you sure you want to delete this product? This action cannot be undone.</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={() => setDeleteId(null)} className="w-full sm:flex-1 h-[46px] rounded-xl border border-gray-300 bg-white text-gray-700 font-semibold text-[15px] hover:bg-gray-50 transition-colors">Cancel</button>
                <button onClick={confirmDelete} className="w-full sm:flex-1 h-[46px] rounded-xl bg-[#E50914] text-white font-semibold text-[15px] hover:bg-red-700 transition-colors">Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MenuPage;
