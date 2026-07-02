
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search, ShoppingCart, PlusCircle, ArrowRight, 
  Drumstick, Package, Layers, ChevronRight, ArrowLeft 
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { getMenuBySlug } from '../../services/menuService';
import { getCategoriesBySlug } from '../../services/categoryService';
import { getShopBySlug } from '../../services/shopService';
import { trackQRScan } from '../../services/qrService';
import { trackProductViewBatch } from '../../services/analyticsService';
import { getFullImageUrl, API_BASE_URL } from '../../config/constants';
import { clientCache } from '../../utils/cache';
import Footer from '../../components/Footer';
import ScrollReveal from '../../components/ScrollReveal';
import toast from 'react-hot-toast';

// Import banner images
import bucketImg from '../../assets/images/bucket_chicken.png';
import burgerImg from '../../assets/images/burger.png';
import popcornImg from '../../assets/images/popcorn_chicken.png';

const SkeletonCategoryButton = () => (
  <div className="h-10 bg-[#1A1A1A] border border-[#222] animate-pulse rounded-xl w-24"></div>
);

const SkeletonMenuCard = () => (
  <div className="relative rounded-2xl overflow-hidden bg-[#121212] border border-[#222] animate-pulse" style={{ aspectRatio: '1.2 / 1' }}>
    <div className="absolute inset-0 bg-[#1A1A1A]"></div>
    <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
      <div className="h-5 bg-[#252525] rounded w-2/3"></div>
      <div className="h-3 bg-[#252525] rounded w-1/2"></div>
      <div className="flex justify-end pt-2">
        <div className="h-8 bg-[#252525] rounded w-16"></div>
      </div>
    </div>
  </div>
);

const MenuCardDescription = ({ description }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!description) return null;

  const previewText = description.replace(/\r?\n/g, ', ');

  return (
    <div 
      onClick={(e) => {
        e.stopPropagation();
        setIsExpanded(!isExpanded);
      }}
      className="mt-1 mb-1 text-left cursor-pointer"
    >
      {!isExpanded && (
        <p className="text-gray-400 text-[11px] font-medium line-clamp-1 mb-1">
          {previewText}
        </p>
      )}
      
      <motion.div
        initial={false}
        animate={{ 
          opacity: isExpanded ? 1 : 0, 
          height: isExpanded ? 'auto' : 0,
          marginTop: isExpanded ? 4 : 0,
          marginBottom: isExpanded ? 4 : 0
        }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="text-gray-400 text-[11px] font-medium leading-relaxed whitespace-pre-line border-l-2 border-[#E50914]/40 pl-2 overflow-hidden"
      >
        {description}
      </motion.div>
      
      <button className="text-[#E50914] text-[9px] font-black tracking-wider uppercase flex items-center gap-0.5 hover:text-white transition-colors mt-1">
        <span>{isExpanded ? 'Hide Details' : 'Show Details'}</span>
        <span className={`inline-block transition-transform duration-200 text-[8px] ${isExpanded ? 'rotate-180' : 'rotate-0'}`}>
          ▼
        </span>
      </button>
    </div>
  );
};

const MenuPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [menuItems, setMenuItems] = useState([]);
  const [dbCategories, setDbCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasTracked, setHasTracked] = useState(false);
  const [hasTrackedViews, setHasTrackedViews] = useState(false);
  const [shop, setShop] = useState(null);
  
  const { addToCart, getCartCount } = useCart();
  const cartCount = getCartCount();

  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [bucketImg, burgerImg, popcornImg];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

  // Fetch Shop Details for Footer
  useEffect(() => {
    const fetchShopDetails = async () => {
      const shopSlug = slug || 'kokkarakko-fried-chicken';
      const cacheKey = `shop_${shopSlug}`;
      const cached = clientCache.get(cacheKey);

      if (cached) {
        setShop(cached);
      }

      try {
        const res = await getShopBySlug(shopSlug);
        if (res.success && res.data) {
          setShop(res.data);
          clientCache.set(cacheKey, res.data);
        }
      } catch (err) {
        console.error('Menu page shop fetch error:', err);
      }
    };

    fetchShopDetails();
  }, [slug]);

  // Fetch Menu & Categories with SWR Caching
  useEffect(() => {
    const fetchMenuAndCategories = async () => {
      const shopSlug = slug || 'kokkarakko-fried-chicken';
      const cacheKeyMenu = `menu_${shopSlug}`;
      const cacheKeyCategories = `categories_${shopSlug}`;

      const cachedMenu = clientCache.get(cacheKeyMenu);
      const cachedCats = clientCache.get(cacheKeyCategories);

      if (cachedMenu) {
        setMenuItems(cachedMenu);
      }
      if (cachedCats) {
        setDbCategories(cachedCats);
        const catNames = cachedCats.map(c => c.name.toUpperCase());
        if (catNames.includes('BESTSELLERS')) {
          setActiveCategory('BESTSELLERS');
        } else {
          setActiveCategory('ALL');
        }
      }

      if (cachedMenu && cachedCats) {
        setLoading(false);
      } else {
        setLoading(true);
      }

      try {
        const [menuRes, catRes] = await Promise.allSettled([
          getMenuBySlug(shopSlug),
          getCategoriesBySlug(shopSlug)
        ]);

        let freshMenu = null;
        let freshCats = null;

        if (menuRes.status === 'fulfilled' && menuRes.value.success) {
          freshMenu = menuRes.value.data;
          setMenuItems(freshMenu);
          clientCache.set(cacheKeyMenu, freshMenu);
        }

        if (catRes.status === 'fulfilled' && catRes.value.success) {
          freshCats = catRes.value.data;
          setDbCategories(freshCats);
          clientCache.set(cacheKeyCategories, freshCats);
          
          const catNames = freshCats.map(c => c.name.toUpperCase());
          if (catNames.includes('BESTSELLERS')) {
            setActiveCategory('BESTSELLERS');
          } else {
            setActiveCategory('ALL');
          }
        } else if (menuRes.status === 'fulfilled' && menuRes.value.success) {
          // Fallback: derive categories from menu items
          const derivedCats = [...new Set(menuRes.value.data.map(item => {
            const catName = typeof item.category === 'object' ? item.category?.name : item.category;
            return (catName || 'Uncategorized').toUpperCase();
          }))].map(name => ({ name }));
          
          setDbCategories(derivedCats);
          clientCache.set(cacheKeyCategories, derivedCats);
        }
      } catch (err) {
        console.error('Failed to fetch menu/categories:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMenuAndCategories();
  }, [slug]);

  // Track QR Visit
  useEffect(() => {
    const trackVisit = async () => {
      try {
        const res = await getShopBySlug(slug);
        if (res.success && res.data && !hasTracked) {
          const shopId = res.data._id;
          await trackQRScan(shopId);
          setHasTracked(true);
        }
      } catch (error) {
        console.error('Failed to track QR scan:', error);
      }
    };

    if (slug && !hasTracked) {
      trackVisit();
    }
  }, [slug, hasTracked]);

  // Track Product Views
  useEffect(() => {
    const trackAllViews = async () => {
      if (menuItems.length > 0 && hasTracked && !hasTrackedViews) {
        try {
          const res = await getShopBySlug(slug);
          if (res.success && res.data) {
            const shopId = res.data._id;
            let sessionId = localStorage.getItem('visitor_session_id');
            if (!sessionId) {
              sessionId = `session_${Math.random().toString(36).substring(2, 11)}_${Date.now()}`;
              localStorage.setItem('visitor_session_id', sessionId);
            }
            const productIds = menuItems.map(item => item._id);
            await trackProductViewBatch(shopId, productIds, sessionId);
            setHasTrackedViews(true);
          }
        } catch (err) {
          console.error("Error tracking views:", err);
        }
      }
    };
    trackAllViews();
  }, [menuItems, hasTracked, hasTrackedViews, slug]);

  const getCatName = (item) => {
    const raw = typeof item.category === 'object' ? item.category?.name : item.category;
    return (raw || 'Uncategorized').toUpperCase();
  };

  const categories = dbCategories.length > 0
    ? ['ALL', ...dbCategories.map(c => c.name.toUpperCase())]
    : ['ALL', ...[...new Set(menuItems.map(getCatName))].filter(c => c !== 'ALL')];

  const filteredItems = menuItems.filter(item => {
    if (item.available === false) return false;
    
    const matchesCategory = activeCategory === 'ALL' || getCatName(item) === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (item) => {
    addToCart({ ...item, category: item.category?.name || item.category });
    toast.success(`${item.name} added to cart!`, { icon: '🍗' });
  };

  const isInitialLoading = loading && menuItems.length === 0;

  return (
    <div className="bg-[#0A0A0A] min-h-screen font-sans text-white">
      {/* Header */}
      <header className="flex flex-col sm:flex-row gap-4 justify-between items-center px-6 py-5 max-w-[1400px] mx-auto w-full">
        <div className="flex justify-between items-center w-full sm:w-auto gap-4">
          {/* Back to Home */}
          <motion.button
            onClick={() => navigate('/')}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 text-gray-400 hover:text-white font-bold text-sm uppercase tracking-wider transition-colors group"
          >
            <span className="p-2 rounded-full bg-[#1A1A1A] border border-[#2d2d2d] group-hover:bg-[#252525] group-hover:border-[#E50914]/40 transition-all">
              <ArrowLeft className="w-4 h-4" />
            </span>
            <span>Home</span>
          </motion.button>

          {/* Cart */}
          <motion.button
            onClick={() => navigate(`/cart/${slug || 'kokkarakko-fried-chicken'}`)}
            whileTap={{ scale: 0.95 }}
            className="relative flex items-center gap-2 bg-[#E50914] hover:bg-[#CC0812] text-white font-bold py-2.5 px-4 rounded-full transition-all text-sm shadow-lg shadow-red-500/20"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-white text-[#E50914] text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#E50914]">
                {cartCount}
              </span>
            )}
          </motion.button>
        </div>

        {/* Search Bar */}
        <div className="w-full sm:flex-1 sm:max-w-md relative">
          <Search className="w-5 h-5 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search for chicken, snacks, combos..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#141414] text-gray-200 placeholder-gray-500 rounded-full py-3 pl-12 pr-4 border border-[#222] outline-none focus:border-gray-500 transition-colors text-sm font-medium shadow-inner"
          />
        </div>
      </header>

      {/* Hero Banner */}
      <div className="px-6 max-w-[1400px] mx-auto mb-10 mt-2">
        <div className="relative w-full rounded-[2rem] overflow-hidden bg-gradient-to-r from-[#111] to-[#222] border border-[#222] flex flex-col md:flex-row h-[240px] sm:h-[290px] md:h-[350px] shadow-2xl">
          
          {/* Banner Image */}
          <div className="absolute inset-0 md:left-1/3 md:w-2/3 h-full z-0 opacity-40 md:opacity-100">
            <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-[#111] via-[#111]/80 to-transparent z-10 w-1/2"></div>
            <div className="block md:hidden absolute inset-0 bg-black/60 z-10"></div>
            <img 
              src={slides[currentSlide]} 
              alt="Hot Fried Chicken" 
              loading="eager"
              className="w-full h-full object-cover object-center transition-all duration-700 ease-in-out" 
              onError={(e) => { e.target.onerror = null; e.target.src = '/placeholder-food.svg'; }} 
            />
          </div>

          {/* Banner Content */}
          <div className="relative z-20 w-full md:w-3/5 p-6 sm:p-8 md:p-14 flex flex-col justify-center h-full">
            <p className="text-[#E50914] text-[10px] sm:text-xs font-black tracking-widest uppercase mb-1 sm:mb-3 drop-shadow-md">Crispy. Juicy. Irresistible.</p>
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-none mb-0.5 sm:mb-1 drop-shadow-md tracking-tight">
              Hot Chicken,
            </h1>
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#E50914] leading-none mb-3 sm:mb-5 drop-shadow-md tracking-tight">
              Great Moments!
            </h1>
            <p className="text-gray-300 text-xs sm:text-sm md:text-base font-medium mb-4 sm:mb-8 max-w-xs sm:max-w-sm leading-relaxed text-shadow-sm line-clamp-2 sm:line-clamp-none">
              Freshly prepared with the finest ingredients. Flavors you'll love, every single time.
            </p>

          </div>

          {/* Carousel Controls */}
          <div className="absolute bottom-6 left-8 md:left-14 flex items-center gap-2 z-20">
            {slides.map((_, idx) => (
              <div 
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-1.5 rounded-full cursor-pointer transition-all ${
                  currentSlide === idx ? 'w-6 bg-[#E50914]' : 'w-1.5 bg-gray-500'
                }`}
              ></div>
            ))}
          </div>
          
          <div 
            onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-20 hidden md:flex cursor-pointer bg-black/40 hover:bg-black/60 p-3 rounded-full backdrop-blur-sm border border-white/10 transition-colors shadow-lg"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      {/* Categories & Filter */}
      <div className="px-6 max-w-[1200px] mx-auto mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex gap-3 overflow-x-auto w-full md:w-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {isInitialLoading ? (
            <>
              <SkeletonCategoryButton />
              <SkeletonCategoryButton />
              <SkeletonCategoryButton />
              <SkeletonCategoryButton />
            </>
          ) : (
            <>
              <motion.button 
                onClick={() => {
                  setActiveCategory('ALL');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-2.5 rounded-xl font-bold text-[13px] tracking-wider whitespace-nowrap transition-colors border ${
                  activeCategory === 'ALL' 
                    ? 'bg-[#E50914] text-white border-[#E50914]' 
                    : 'bg-[#1A1A1A] text-gray-300 border-[#222] hover:bg-[#222]'
                }`}
              >
                ALL
              </motion.button>
              
              {categories.filter(c => c !== 'ALL').map((cat) => {
                let Icon = Drumstick;
                const up = cat.toUpperCase();
                if (up.includes('SNACK') || up.includes('POPCORN') || up.includes('STRIP')) Icon = Package;
                if (up.includes('COMBO') || up.includes('BUCKET') || up.includes('MEAL')) Icon = Layers;

                return (
                  <motion.button 
                    key={cat}
                    onClick={() => {
                      setActiveCategory(cat);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-5 py-2.5 rounded-xl font-bold text-[13px] tracking-wider whitespace-nowrap flex items-center gap-2 transition-colors border ${
                      activeCategory === cat 
                        ? 'bg-[#E50914] text-white border-[#E50914]' 
                        : 'bg-[#1A1A1A] text-gray-300 border-[#222] hover:bg-[#222]'
                    }`}
                  >
                    <Icon className="w-4 h-4" /> {cat}
                  </motion.button>
                )
              })}
            </>
          )}
        </div>
      </div>

      {/* Section Title */}
      <div className="px-6 max-w-[1200px] mx-auto mb-6 mt-2">
        <h2 className="text-2xl font-bold text-white tracking-tight">
          {activeCategory === 'ALL' ? 'All Items' : activeCategory}
        </h2>
      </div>

      {/* Menu List */}
      <div className="px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 max-w-[1200px] mx-auto pb-12">
        {isInitialLoading ? (
          <>
            <SkeletonMenuCard />
            <SkeletonMenuCard />
            <SkeletonMenuCard />
            <SkeletonMenuCard />
            <SkeletonMenuCard />
            <SkeletonMenuCard />
            <SkeletonMenuCard />
            <SkeletonMenuCard />
          </>
        ) : filteredItems.length === 0 ? (
          <div className="col-span-full text-center py-20 text-gray-500 font-bold uppercase tracking-wider text-sm">
            No products available.
          </div>
        ) : (
          filteredItems.map((item) => {
            const imageUrl = item.image ? getFullImageUrl(item.image) : null;
            
            return (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                whileTap={{ scale: 0.97 }}
                className="flex flex-col rounded-2xl overflow-hidden bg-[#141414] border border-[#222] hover:border-[#333] hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-black/50 group cursor-pointer h-full w-full max-w-[340px] sm:max-w-none mx-auto"
              >
                {/* Product Image at Top */}
                <div className="relative aspect-[16/10] sm:aspect-[4/3] overflow-hidden bg-[#1A1A1A] shrink-0">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={item.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl bg-[#1a1a1a] select-none">
                      🍗
                    </div>
                  )}

                  {/* Category badge */}
                  {item.category && (
                    <span className="absolute top-3 left-3 z-10 text-[9px] font-black tracking-widest uppercase text-white bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/10">
                      {getCatName(item)}
                    </span>
                  )}
                </div>

                {/* Product Details below the image */}
                <div className="flex flex-col flex-grow p-2.5 sm:p-3 gap-1.5 sm:gap-2 justify-between bg-[#141414]">
                  {/* Name */}
                  <div>
                    <h3 className="text-white font-black text-sm md:text-base leading-tight tracking-tight group-hover:text-[#E50914] transition-colors line-clamp-1">
                      {item.name}
                    </h3>
                  </div>

                  {/* Description (if exists) */}
                  {item.description && (
                    <MenuCardDescription description={item.description} />
                  )}

                  {/* Price & Add Button Row */}
                  <div className="flex items-center justify-between mt-auto">
                    {/* Price & Stock info */}
                    <div className="flex flex-col">
                      <span className="text-[#E50914] font-black text-base md:text-lg leading-none">
                        ₹{item.price}
                      </span>
                      
                      {/* Stock Status text */}
                      <span className={`text-[8px] md:text-[9px] font-bold tracking-wider uppercase mt-0.5 sm:mt-1 ${
                        item.quantity === undefined || item.quantity > 0 
                          ? 'text-green-500' 
                          : 'text-red-500'
                      }`}>
                        {item.quantity === undefined || item.quantity > 0 ? 'AVAILABLE' : 'Out of Stock'}
                      </span>
                    </div>

                    {/* Add button */}
                    <motion.button
                      disabled={item.quantity === 0}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (item.quantity === undefined || item.quantity > 0) {
                          handleAddToCart(item);
                        }
                      }}
                      whileTap={item.quantity === 0 ? {} : { scale: 0.93 }}
                      className={`font-black text-[9px] sm:text-xs uppercase px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-lg flex items-center transition-all ${
                        item.quantity === undefined || item.quantity > 0
                          ? 'bg-[#E50914] text-white hover:bg-[#CC0812] shadow-md shadow-red-500/10'
                          : 'bg-[#222] text-gray-500 cursor-not-allowed border border-white/5'
                      }`}
                    >
                      {item.quantity === undefined || item.quantity > 0 ? (
                        <>ADD <PlusCircle className="w-3.5 h-3.5 ml-1" /></>
                      ) : (
                        'Unavailable'
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Cancel Order Helper Section */}
      <div className="max-w-[1200px] mx-auto px-6 pb-12 pt-6 text-center border-t border-white/5 mt-4">
        <p className="text-gray-500 text-xs sm:text-sm font-semibold mb-3">
          Need to cancel an order?
        </p>
        <motion.button
          onClick={() => navigate('/cancel-order')}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-2.5 rounded-full border border-gray-600 hover:border-gray-400 text-gray-400 hover:text-white font-bold text-xs uppercase tracking-wider transition-all duration-200"
        >
          Cancel Existing Order
        </motion.button>
      </div>

      {/* Footer */}
      <ScrollReveal type="section">
        <Footer shop={shop} />
      </ScrollReveal>
    </div>
  );
};

export default MenuPage;
