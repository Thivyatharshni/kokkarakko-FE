import React, { useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

const GlobalStickyCart = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { slug: urlSlug } = useParams();
  const { getCartCount, getCartTotal } = useCart();

  const cartCount = getCartCount();
  const cartTotal = getCartTotal();

  // Keep track of the active shop slug automatically
  useEffect(() => {
    if (urlSlug) {
      localStorage.setItem('customer_shop_slug', urlSlug);
    }
  }, [urlSlug]);

  const activeSlug = urlSlug || localStorage.getItem('customer_shop_slug') || 'kokkarakko-fried-chicken';

  // Visibility criteria: Hide on Cart, Order Success, and Owner/Admin routes
  const hidePaths = ['/cart/', '/order-success/', '/owner/'];
  const shouldHide = hidePaths.some(path => pathname.includes(path));

  if (shouldHide || cartCount === 0) {
    return null;
  }

  return (
    <AnimatePresence>
      <div className="relative z-50">
        {/* Desktop / Tablet Floating Cart Card */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          className="fixed bottom-6 right-6 z-50 bg-[#141414] border border-[#2d2d2d] rounded-2xl p-4 shadow-2xl hidden sm:flex items-center justify-between gap-6 min-w-[320px] backdrop-blur-md"
        >
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#E50914]">Your Cart</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-sm font-bold text-gray-300">
                {cartCount} {cartCount === 1 ? 'Item' : 'Items'}
              </span>
              <span className="text-xs text-gray-500">•</span>
              <span className="text-base font-black text-white">₹{cartTotal}</span>
            </div>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(`/cart/${activeSlug}`)}
            className="bg-[#E50914] hover:bg-[#CC0812] text-white text-xs font-black uppercase tracking-widest py-3 px-5 rounded-xl flex items-center gap-1.5 transition-all shadow-lg shadow-red-500/20"
          >
            <span>View Cart</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </motion.button>
        </motion.div>

        {/* Mobile Sticky Bottom Bar */}
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 80 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="fixed bottom-0 left-0 w-full z-50 bg-[#141414] border-t border-[#2d2d2d] rounded-t-3xl px-6 pt-4 pb-[calc(16px+env(safe-area-inset-bottom))] flex sm:hidden items-center justify-between shadow-2xl backdrop-blur-md"
        >
          <div className="flex flex-col">
            <span className="text-[9px] font-black uppercase tracking-widest text-[#E50914]">Your Cart</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xs font-bold text-gray-300">
                {cartCount} {cartCount === 1 ? 'Item' : 'Items'}
              </span>
              <span className="text-xs text-gray-500">•</span>
              <span className="text-sm font-black text-white">₹{cartTotal}</span>
            </div>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(`/cart/${activeSlug}`)}
            className="bg-[#E50914] hover:bg-[#CC0812] text-white text-xs font-black uppercase tracking-widest py-3 px-6 rounded-xl flex items-center gap-1.5 transition-all shadow-lg shadow-red-500/20"
          >
            <span>View Cart</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </motion.button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default GlobalStickyCart;
