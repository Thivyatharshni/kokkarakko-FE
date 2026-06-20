import { useState, useEffect } from 'react';
import { useCurrentShop } from '../../hooks/useCurrentShop';
import { getCategoriesBySlug, createCategory, updateCategory, deleteCategory } from '../../services/categoryService';
import { DEMO_MODE, DEMO_CATEGORIES_DATA } from '../../utils/demoData';
import toast from 'react-hot-toast';
import { Plus, Trash2, Edit2, Loader2, Image as ImageIcon } from 'lucide-react';
import { IMAGE_BASE_URL } from '../../config/constants';
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

  const displayCategories = (DEMO_MODE || categories.length === 0) ? DEMO_CATEGORIES_DATA : categories;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#E50914] hover:bg-red-700 text-white font-bold py-2.5 px-5 rounded-xl shadow-lg flex items-center gap-2 transition-all"
        >
          <Plus size={20} /> Add Category
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
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
                <tr key={cat._id} className="hover:bg-gray-50">
                  <td className="p-4">
                    {cat.image ? (
                      <img src={`${IMAGE_BASE_URL}${cat.image}`} alt={cat.name} className="w-12 h-12 rounded-lg object-cover" />
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
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
                    <button onClick={() => openEditModal(cat)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors mr-2">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => handleDelete(cat._id, cat.productCount || 0)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 overflow-hidden">
            <h2 className="text-2xl font-bold mb-4">{editingId ? 'Edit Category' : 'Add Category'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border rounded-xl outline-none focus:border-[#E31E24]" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Description</label>
                <textarea rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 border rounded-xl outline-none focus:border-[#E31E24] resize-none"></textarea>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Image {editingId && '(Leave blank to keep existing)'}</label>
                <input type="file" accept="image/*" onChange={e => setFormData({...formData, image: e.target.files[0]})} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100" />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={closeModal} className="flex-1 py-2 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-colors">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 py-2 rounded-xl bg-[#E31E24] text-white font-bold hover:bg-red-700 transition-colors flex justify-center items-center">
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
