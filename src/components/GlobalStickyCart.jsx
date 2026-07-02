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

  // Visibility criteria: Show ONLY on Home (/), Menu (/menu/:slug), and Shop (/shop/:slug) routes.
  // This robustly hides the sticky cart on Cart (/cart/:slug), Order Success (/order-success/:orderNumber),
  // Cancel Order (/cancel-order), Login (/owner/login), and Owner Dashboard (/owner/*).
  const isHome = pathname === '/';
  const isMenu = pathname.startsWith('/menu/');
  const isShop = pathname.startsWith('/shop/');
  const shouldShow = (isHome || isMenu || isShop) && cartCount > 0;

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          key="desktop-sticky-cart"
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          className="fixed bottom-6 right-6 z-50 bg-[#111111] border border-white/10 rounded-2xl p-4 shadow-2xl hidden sm:flex items-center justify-between gap-6 min-w-[320px] backdrop-blur-md"
        >
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Your Cart</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-sm font-bold text-gray-300">
                {cartCount} {cartCount === 1 ? 'Item' : 'Items'}
              </span>
              <span className="text-xs text-neutral-600">•</span>
              <span className="text-lg font-black text-white">₹{cartTotal}</span>
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
      )}

      {shouldShow && (
        <motion.div
          key="mobile-sticky-cart"
          initial={{ opacity: 0, y: 80, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 80, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="fixed bottom-4 left-4 right-4 z-50 bg-[#111111] border border-white/10 rounded-2xl p-3.5 flex sm:hidden items-center justify-between gap-3 shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-md"
        >
          <div className="flex flex-col min-w-0 shrink-0 pl-1">
            <span className="text-[9px] font-black uppercase tracking-wider text-neutral-400 leading-none">Your Cart</span>
            <div className="flex items-center gap-1.5 text-[14px] font-black text-white whitespace-nowrap mt-1 leading-none">
              <span>{cartCount} {cartCount === 1 ? 'Item' : 'Items'}</span>
              <span className="text-neutral-600 font-normal">•</span>
              <span className="text-white">₹{cartTotal}</span>
            </div>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(`/cart/${activeSlug}`)}
            className="bg-[#E50914] hover:bg-[#CC0812] text-white text-[10px] font-black uppercase tracking-widest py-2.5 px-4 rounded-xl flex items-center gap-1.5 transition-all shadow-lg shadow-red-500/20 shrink-0"
          >
            <span>View Cart</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GlobalStickyCart;
