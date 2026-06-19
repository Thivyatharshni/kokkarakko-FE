import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getMenuBySlug, createMenuItem, deleteMenuItem } from '../../services/menuService';
import toast from 'react-hot-toast';
import { Plus, Trash2, Loader2, Image as ImageIcon } from 'lucide-react';
import { IMAGE_BASE_URL } from '../../config/constants';

const PREDEFINED_CATEGORIES = [
  "Chicken Leg",
  "Chicken Wings",
  "Chicken Strips",
  "Popcorn Chicken",
  "Bucket Meals",
  "Combos",
  "Beverages"
];

const MenuPage = () => {
  const { shop } = useAuth();
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterCategory, setFilterCategory] = useState('All');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: PREDEFINED_CATEGORIES[0],
    price: '',
    available: true,
    image: null,
  });

  const fetchMenu = async () => {
    if (!shop) return;
    try {
      const res = await getMenuBySlug(shop.slug);
      if (res.success) {
        setMenu(res.data);
      }
    } catch (error) {
      toast.error('Failed to fetch menu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, [shop]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
      });

      const res = await createMenuItem(data);
      if (res.success) {
        toast.success('Item added successfully');
        setIsModalOpen(false);
        fetchMenu();
        // Reset form
        setFormData({
          name: '',
          description: '',
          category: PREDEFINED_CATEGORIES[0],
          price: '',
          available: true,
          image: null,
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add item');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const res = await deleteMenuItem(id);
        if (res.success) {
          toast.success('Item deleted');
          fetchMenu();
        }
      } catch (error) {
        toast.error('Failed to delete item');
      }
    }
  };

  const filteredMenu = filterCategory === 'All' ? menu : menu.filter(m => m.category === filterCategory);

  if (loading) return <div className="flex justify-center mt-20"><Loader2 className="animate-spin text-[#E50914]" size={32} /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Menu Management</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#E50914] hover:bg-red-700 text-white font-bold py-2.5 px-5 rounded-xl shadow-lg flex items-center gap-2 transition-all"
        >
          <Plus size={20} /> Add New Item
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        <button 
          onClick={() => setFilterCategory('All')}
          className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-semibold transition-all ${filterCategory === 'All' ? 'bg-[#111111] text-white' : 'bg-white border text-gray-600 hover:bg-gray-50'}`}
        >
          All Items
        </button>
        {PREDEFINED_CATEGORIES.map(cat => (
          <button 
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-semibold transition-all ${filterCategory === cat ? 'bg-[#111111] text-white' : 'bg-white border text-gray-600 hover:bg-gray-50'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
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
            {filteredMenu.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-10 text-center text-gray-500">No menu items found.</td>
              </tr>
            ) : (
              filteredMenu.map(item => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="p-4 flex items-center gap-4">
                    {item.image ? (
                      <img src={`${IMAGE_BASE_URL}${item.image}`} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                        <ImageIcon size={20} />
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-500 max-w-[200px] truncate">{item.description}</p>
                    </div>
                  </td>
                  <td className="p-4 text-sm font-medium text-gray-600">{item.category}</td>
                  <td className="p-4 font-bold text-[#E31E24]">₹{item.price}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {item.available ? 'Available' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleDelete(item._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 overflow-hidden">
            <h2 className="text-2xl font-bold mb-4">Add Menu Item</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border rounded-xl outline-none focus:border-[#E31E24]" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Category</label>
                <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-3 py-2 border rounded-xl outline-none focus:border-[#E31E24] bg-white">
                  {PREDEFINED_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Price (₹)</label>
                <input required type="number" min="0" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full px-3 py-2 border rounded-xl outline-none focus:border-[#E31E24]" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Description</label>
                <textarea rows="2" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 border rounded-xl outline-none focus:border-[#E31E24] resize-none"></textarea>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Image</label>
                <input type="file" accept="image/*" onChange={e => setFormData({...formData, image: e.target.files[0]})} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100" />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-colors">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 py-2 rounded-xl bg-[#E31E24] text-white font-bold hover:bg-red-700 transition-colors flex justify-center items-center">
                  {isSubmitting ? <Loader2 className="animate-spin" size={20}/> : 'Save Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuPage;
