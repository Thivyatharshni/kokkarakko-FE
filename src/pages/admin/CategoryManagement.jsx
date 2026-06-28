import { useState, useEffect } from 'react';
import { useCurrentShop } from '../../hooks/useCurrentShop';
import { getCategoriesBySlug, createCategory, updateCategory, deleteCategory } from '../../services/categoryService';
import { DEMO_MODE, DEMO_CATEGORIES_DATA } from '../../utils/demoData';
import toast from 'react-hot-toast';
import { Plus, Trash2, Edit2, Loader2, Image as ImageIcon, X } from 'lucide-react';
import { getFullImageUrl } from '../../config/constants';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';

const CategoryManagement = () => {
  const { shopSlug, loading: shopLoading, error: shopError } = useCurrentShop();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: null,
  });

  const fetchCategories = async () => {
    if (!shopSlug) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getCategoriesBySlug(shopSlug);
      if (res.success) {
        setCategories(res.data);
      } else {
        setError('Failed to fetch categories');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!shopLoading && shopSlug) {
      fetchCategories();
    } else if (!shopLoading && !shopSlug) {
      setLoading(false);
    }
  }, [shopSlug, shopLoading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null) {
          data.append(key, formData[key]);
        }
      });

      let res;
      if (editingId) {
        if (editingId.startsWith('demo-')) {
          toast.error("Cannot modify demo data. Please add real categories.");
          setIsSubmitting(false);
          return;
        }
        res = await updateCategory(editingId, data);
      } else {
        res = await createCategory(data);
      }

      if (res.success) {
        toast.success(editingId ? 'Category updated successfully' : 'Category added successfully');
        closeModal();
        fetchCategories();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save category');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id, productCount) => {
    if (productCount > 0) {
      toast.error(`Cannot delete category. There are ${productCount} products under this category.`);
      return;
    }

    if (id.startsWith('demo-')) {
      toast.error("Cannot delete demo data. Please add real categories.");
      return;
    }

    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        const res = await deleteCategory(id);
        if (res.success) {
          toast.success('Category deleted');
          fetchCategories();
        }
      } catch (error) {
        toast.error(error.message || 'Failed to delete category');
      }
    }
  };

  const openEditModal = (cat) => {
    setEditingId(cat._id);
    setFormData({
      name: cat.name,
      description: cat.description || '',
      image: null,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ name: '', description: '', image: null });
  };

  if (shopLoading || loading) return <LoadingState message="Loading categories..." />;
  if (shopError) return <ErrorState message={shopError} />;
  if (error && !DEMO_MODE) return <ErrorState message={error} onRetry={fetchCategories} />;

  const displayCategories = DEMO_MODE ? DEMO_CATEGORIES_DATA : categories;

  return (
    <div className="space-y-5 w-full max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-[28px] md:text-3xl font-bold text-gray-900 tracking-tight leading-tight truncate">Categories</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto h-11 md:h-12 bg-[#E50914] hover:bg-red-700 text-white font-semibold text-[15px] px-5 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
        >
          <Plus size={20} /> Add Category
        </button>
      </div>

      {/* Table & Cards Container */}
      <div className="bg-white rounded-[16px] shadow-sm border border-gray-100 overflow-hidden w-full">
        {/* Desktop & Tablet Table View */}
        <div className="hidden md:block overflow-x-auto w-full">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-gray-50 text-gray-500 text-sm">
              <tr>
                <th className="p-4 font-semibold">Image</th>
                <th className="p-4 font-semibold">Name</th>
                <th className="p-4 font-semibold">Description</th>
                <th className="p-4 font-semibold">Product Count</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {displayCategories.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-10 text-center text-gray-500">No categories found.</td>
                </tr>
              ) : (
                displayCategories.map(cat => (
                  <tr key={cat._id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      {cat.image ? (
                        <img src={getFullImageUrl(cat.image)} alt={cat.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 flex-shrink-0">
                          <ImageIcon size={20} />
                        </div>
                      )}
                    </td>
                    <td className="p-4 font-bold text-gray-900">{cat.name}</td>
                    <td className="p-4 text-sm text-gray-500 max-w-[200px] truncate">{cat.description || '-'}</td>
                    <td className="p-4 font-semibold text-blue-600">
                      {cat.productCount || 0} {(cat.productCount || 0) === 1 ? 'Product' : 'Products'}
                    </td>
                    <td className="p-4 text-right">
                      <button onClick={() => openEditModal(cat)} className="min-h-[40px] min-w-[40px] inline-flex items-center justify-center p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors mr-2">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => handleDelete(cat._id, cat.productCount || 0)} className="min-h-[40px] min-w-[40px] inline-flex items-center justify-center p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards View (< md) */}
        <div className="md:hidden divide-y divide-gray-100 p-[18px] space-y-3">
          {displayCategories.length === 0 ? (
            <p className="p-4 text-center text-gray-500 text-sm">No categories found.</p>
          ) : (
            displayCategories.map(cat => (
               <div key={cat._id} className="py-3 first:pt-0 last:pb-0 flex flex-col gap-2.5">
                <div className="flex items-center gap-2.5">
                  {cat.image ? (
                    <img src={getFullImageUrl(cat.image)} alt={cat.name} className="w-12 h-12 rounded-lg object-cover shadow-sm flex-shrink-0" />
                  ) : (
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 flex-shrink-0">
                      <ImageIcon size={20} />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 text-[15px] truncate">{cat.name}</h4>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">{cat.description || 'No description'}</p>
                    <span className="inline-block mt-0.5 text-xs font-semibold px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md">
                      {cat.productCount || 0} {(cat.productCount || 0) === 1 ? 'Product' : 'Products'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-gray-50">
                  <button 
                    onClick={() => openEditModal(cat)} 
                    className="flex-1 h-11 bg-blue-50 text-blue-600 font-semibold rounded-xl flex items-center justify-center gap-2 text-sm hover:bg-blue-100 transition-colors"
                  >
                    <Edit2 size={15} /> Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(cat._id, cat.productCount || 0)} 
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
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-3 sm:p-4 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-md p-5 sm:p-6 my-8 overflow-hidden max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 truncate pr-4">{editingId ? 'Edit Category' : 'Add Category'}</h2>
              <button 
                type="button"
                onClick={closeModal}
                className="w-9 h-9 sm:w-[38px] sm:h-[38px] md:w-10 md:h-10 rounded-full bg-[#F8F8F8] hover:bg-[#F1F1F1] active:bg-[#EAEAEA] flex items-center justify-center text-gray-500 hover:text-gray-700 hover:scale-105 active:scale-95 transition-all duration-200 focus:ring-2 focus:ring-gray-200 outline-none shrink-0"
                aria-label="Close modal"
              >
                <X className="w-[18px] h-[18px] md:w-5 md:h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700">Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full h-11 px-4 py-2 border rounded-xl outline-none focus:border-[#E50914] bg-gray-50 focus:bg-white transition-colors text-sm" placeholder="Category Name" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700">Description</label>
                <textarea rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 border rounded-xl outline-none focus:border-[#E50914] resize-none bg-gray-50 focus:bg-white transition-colors text-sm" placeholder="Description..."></textarea>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700">Image {editingId && <span className="text-xs font-normal text-gray-400">(Optional)</span>}</label>
                <input type="file" accept="image/*" onChange={e => setFormData({...formData, image: e.target.files[0]})} className="w-full h-11 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 flex items-center" />
              </div>
              <div className="flex flex-col sm:flex-row gap-3 pt-4 mt-4 border-t border-gray-100">
                <button type="button" onClick={closeModal} className="w-full sm:flex-1 h-[46px] rounded-xl border border-gray-300 bg-white text-gray-700 font-semibold text-[15px] hover:bg-gray-50 transition-colors">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="w-full sm:flex-1 h-[46px] rounded-xl bg-[#E50914] text-white font-semibold text-[15px] hover:bg-red-700 transition-colors flex justify-center items-center">
                  {isSubmitting ? <Loader2 className="animate-spin" size={20}/> : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;
