import { useState, useEffect, useMemo } from 'react';
import { useCurrentShop } from '../../hooks/useCurrentShop';
import { getMenuBySlug, createMenuItem, updateMenuItem, deleteMenuItem } from '../../services/menuService';
import { getCategoriesBySlug } from '../../services/categoryService';
import { DEMO_MODE, DEMO_MENU_DATA, DEMO_CATEGORIES_DATA } from '../../utils/demoData';
import toast from 'react-hot-toast';
import { Plus, Trash2, Edit2, Loader2, Image as ImageIcon, Search, Package, CheckCircle, XCircle } from 'lucide-react';
import { IMAGE_BASE_URL } from '../../config/constants';
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

  const displayMenu = (DEMO_MODE || menu.length === 0) ? DEMO_MENU_DATA.products : menu;
  const displayCategories = (DEMO_MODE || categories.length === 0) ? DEMO_CATEGORIES_DATA : categories;

  const displayFilteredMenu = displayMenu.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory === 'All' ? true : item.category?._id === filterCategory;
    const matchesStatus = filterStatus === 'All' ? true : item.status === filterStatus;
    const matchesMinPrice = minPrice === '' ? true : item.price >= Number(minPrice);
    const matchesMaxPrice = maxPrice === '' ? true : item.price <= Number(maxPrice);
    
    return matchesSearch && matchesCategory && matchesStatus && matchesMinPrice && matchesMaxPrice;
  });

  const displayStats = (DEMO_MODE || menu.length === 0) ? DEMO_MENU_DATA.stats : {
    total: menu.length,
    available: menu.filter(m => m.status === 'Available').length,
    outOfStock: menu.filter(m => m.status === 'Out Of Stock').length,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Menu Management</h1>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-[#E50914] hover:bg-red-700 text-white font-bold py-2.5 px-5 rounded-xl shadow-lg flex items-center gap-2 transition-all"
        >
          <Plus size={20} /> Add New Item
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-semibold mb-1">Total Products</p>
            <h3 className="text-3xl font-black text-gray-900">{displayStats.total}</h3>
          </div>
          <div className="p-4 rounded-full bg-blue-500 bg-opacity-10">
            <Package className="text-blue-500" size={24} />
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-semibold mb-1">Available Products</p>
            <h3 className="text-3xl font-black text-gray-900">{displayStats.available}</h3>
          </div>
          <div className="p-4 rounded-full bg-green-500 bg-opacity-10">
            <CheckCircle className="text-green-500" size={24} />
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-semibold mb-1">Out Of Stock Products</p>
            <h3 className="text-3xl font-black text-gray-900">{displayStats.outOfStock}</h3>
          </div>
          <div className="p-4 rounded-full bg-orange-500 bg-opacity-10">
            <XCircle className="text-orange-500" size={24} />
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col xl:flex-row gap-4 items-center">
        <div className="relative w-full xl:w-1/3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-xl outline-none focus:border-[#E50914] transition-colors bg-gray-50 focus:bg-white"
          />
        </div>
        
        <div className="w-full xl:w-2/3 flex flex-wrap gap-3">
          <select 
            value={filterCategory} 
            onChange={(e) => setFilterCategory(e.target.value)}
            className="flex-1 min-w-[120px] px-3 py-2 border rounded-xl outline-none focus:border-[#E50914] bg-gray-50 focus:bg-white text-sm"
          >
            <option value="All">All Categories</option>
            {displayCategories.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>

          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="flex-1 min-w-[120px] px-3 py-2 border rounded-xl outline-none focus:border-[#E50914] bg-gray-50 focus:bg-white text-sm"
          >
            <option value="All">All Statuses</option>
            <option value="Available">Available</option>
            <option value="Out Of Stock">Out Of Stock</option>
            <option value="Hidden">Hidden</option>
          </select>

          <div className="flex-1 min-w-[200px] flex items-center gap-2">
            <input 
              type="number" 
              placeholder="Min ₹" 
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-1/2 px-3 py-2 border rounded-xl outline-none focus:border-[#E50914] bg-gray-50 focus:bg-white text-sm"
            />
            <span className="text-gray-400">-</span>
            <input 
              type="number" 
              placeholder="Max ₹" 
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-1/2 px-3 py-2 border rounded-xl outline-none focus:border-[#E50914] bg-gray-50 focus:bg-white text-sm"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-sm">
              <tr>
                <th className="p-4 font-semibold">Item</th>
                <th className="p-4 font-semibold">Category</th>
                <th className="p-4 font-semibold">Price</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {displayFilteredMenu.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-10 text-center text-gray-500">
                    No menu items found matching your filters.
                  </td>
                </tr>
              ) : (
                displayFilteredMenu.map(item => (
                  <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 flex items-center gap-4 min-w-[250px]">
                      {item.image ? (
                        <img src={`${IMAGE_BASE_URL}${item.image}`} alt={item.name} className="w-12 h-12 rounded-lg object-cover shadow-sm" />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                          <ImageIcon size={20} />
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-500 max-w-[200px] truncate">{item.description || '-'}</p>
                      </div>
                    </td>
                    <td className="p-4 text-sm font-medium text-gray-600 whitespace-nowrap">
                      {item.category?.name || 'Uncategorized'}
                    </td>
                    <td className="p-4 font-bold text-[#E50914] whitespace-nowrap">₹{item.price}</td>
                    <td className="p-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        item.status === 'Available' ? 'bg-green-100 text-green-700' : 
                        item.status === 'Out Of Stock' ? 'bg-orange-100 text-orange-700' : 
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {item.status || 'Available'}
                      </span>
                    </td>
                    <td className="p-4 text-right whitespace-nowrap">
                      <button onClick={() => handleOpenModal(item)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors mr-2">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => setDeleteId(item._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl w-full max-w-lg p-6 overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-2xl font-bold mb-6">{editingItem ? 'Edit Menu Item' : 'Add Menu Item'}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">Product Name</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2.5 border rounded-xl outline-none focus:border-[#E50914] bg-gray-50 focus:bg-white transition-colors" placeholder="e.g. Chicken Biryani" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1 text-gray-700">Category</label>
                    <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-2.5 border rounded-xl outline-none focus:border-[#E50914] bg-gray-50 focus:bg-white transition-colors">
                      {displayCategories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1 text-gray-700">Price (₹)</label>
                    <input required type="number" min="0" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full px-4 py-2.5 border rounded-xl outline-none focus:border-[#E50914] bg-gray-50 focus:bg-white transition-colors" placeholder="0.00" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">Description</label>
                  <textarea rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2.5 border rounded-xl outline-none focus:border-[#E50914] resize-none bg-gray-50 focus:bg-white transition-colors" placeholder="Brief description of the item..."></textarea>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1 text-gray-700">Status</label>
                    <select required value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-4 py-2.5 border rounded-xl outline-none focus:border-[#E50914] bg-gray-50 focus:bg-white transition-colors">
                      <option value="Available">Available</option>
                      <option value="Out Of Stock">Out Of Stock</option>
                      <option value="Hidden">Hidden</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1 text-gray-700">Image {editingItem && <span className="text-xs font-normal text-gray-400">(Optional)</span>}</label>
                    <input type="file" accept="image/*" onChange={e => setFormData({...formData, image: e.target.files[0]})} className="w-full text-sm text-gray-500 file:mr-2 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100" />
                  </div>
                </div>

                <div className="flex gap-3 pt-6 mt-6 border-t border-gray-100">
                  <button type="button" onClick={handleCloseModal} className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-colors">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="flex-1 py-3 rounded-xl bg-[#E50914] text-white font-bold hover:bg-red-700 transition-colors flex justify-center items-center">
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
              className="bg-white rounded-2xl w-full max-w-sm p-6 text-center"
            >
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="text-red-500" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Delete Product?</h3>
              <p className="text-gray-500 mb-6">Are you sure you want to delete this product? This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)} className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-colors">Cancel</button>
                <button onClick={confirmDelete} className="flex-1 py-3 rounded-xl bg-[#E50914] text-white font-bold hover:bg-red-700 transition-colors">Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MenuPage;
