import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createShop } from '../../services/shopService';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Store, Loader2, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const SetupShop = () => {
  const [shopName, setShopName] = useState('');
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { shop, updateShopContext } = useAuth();
  const navigate = useNavigate();

  // If they already have a shop, bounce them back to dashboard
  useEffect(() => {
    if (shop) {
      navigate('/owner/dashboard');
    }
  }, [shop, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!shopName || !address) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const res = await createShop({ shopName, address });
      if (res.success) {
        toast.success('Shop Created Successfully!');
        updateShopContext(res.data);
        navigate('/owner/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create shop');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
      >
        <div className="bg-[#111111] p-10 text-center relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-[#D90404]"></div>
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800 mb-4 border-2 border-gray-700">
             <Store size={32} className="text-[#D90404]" />
          </div>
          <h2 className="text-3xl font-black text-white">Setup Your Shop</h2>
          <p className="text-gray-400 mt-2 font-medium">Let's get your digital menu up and running.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-6 bg-white">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Shop Name</label>
            <div className="relative">
              <Store className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#D90404] focus:ring-2 focus:ring-red-100 outline-none transition-all"
                placeholder="e.g. Kokkarakko Anna Nagar"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">This name will be used to generate your unique QR Code link.</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Complete Address</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-4 text-gray-400" size={20} />
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#D90404] focus:ring-2 focus:ring-red-100 outline-none transition-all resize-none"
                placeholder="Shop number, street, city..."
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#D90404] hover:bg-red-700 text-white font-bold py-4 px-4 rounded-xl transition-all shadow-lg shadow-red-500/30 flex items-center justify-center mt-4"
          >
            {isLoading ? <Loader2 className="animate-spin" size={24} /> : 'Create My Shop'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default SetupShop;
