
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Search, ShoppingCart, Star, PlusCircle, ArrowRight, 
  ChevronDown, Drumstick, Package, Layers, Loader2, ChevronRight, ArrowLeft 
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { getMenuBySlug } from '../../services/menuService';
import { getShopBySlug } from '../../services/shopService';
import { trackQRScan } from '../../services/qrService';
import { IMAGE_BASE_URL } from '../../config/constants';
import toast from 'react-hot-toast';

// Import banner images
import bucketImg from '../../assets/images/bucket_chicken.png';
import burgerImg from '../../assets/images/burger.png';
import popcornImg from '../../assets/images/popcorn_chicken.png';

const MenuPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasTracked, setHasTracked] = useState(false);
  
  const { cart, addToCart, getCartCount, getCartTotal } = useCart();
  const cartCount = getCartCount();
  const cartTotal = getCartTotal();


  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [bucketImg, burgerImg, popcornImg];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

  // Fetch Menu

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        const menuRes = await getMenuBySlug(slug || 'kokkarakko-fried-chicken');
        if (menuRes.success) {
          setMenuItems(menuRes.data);
          
          const fetchedCats = [...new Set(menuRes.data.map(item => {
            const catName = typeof item.category === 'object' ? item.category?.name : item.category;
            return (catName || 'Uncategorized').toUpperCase();
          }))];
          if (fetchedCats.includes('BESTSELLERS')) {
            setActiveCategory('BESTSELLERS');
          } else if (fetchedCats.length > 0) {
            setActiveCategory('ALL');
          }
        }
      } catch (err) {
        console.error('Failed to fetch menu:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
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

  const getCatName = (item) => {
    const raw = typeof item.category === 'object' ? item.category?.name : item.category;
    return (raw || 'Uncategorized').toUpperCase();
  };

  const availableCategories = [...new Set(menuItems.map(getCatName))];
  const categories = ['ALL', ...availableCategories.filter(c => c !== 'ALL')];

  const filteredItems = menuItems.filter(item => {
    if (item.available === false) return false;
    
    const matchesCategory = activeCategory === 'ALL' || getCatName(item) === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (item) => {
    addToCart(item);
    navigate(`/cart/${slug || 'kokkarakko-fried-chicken'}`);
  };

  if (loading) {
    return (
      <div className="bg-[#0A0A0A] min-h-screen flex flex-col items-center justify-center font-sans">
         <Loader2 className="animate-spin text-[#E50914] mb-4" size={40} />
         <p className="text-white font-bold tracking-widest uppercase text-sm">Loading Menu...</p>
      </div>
    );
  }

  return (

    <div className="bg-[#0A0A0A] min-h-screen font-sans text-white pb-20">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-5 max-w-[1400px] mx-auto w-full gap-4">
        {/* Back to Home */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-400 hover:text-white font-bold text-sm uppercase tracking-wider transition-colors shrink-0 group"
        >
          <span className="p-2 rounded-full bg-[#1A1A1A] border border-[#2d2d2d] group-hover:bg-[#252525] group-hover:border-[#E50914]/40 transition-all">
            <ArrowLeft className="w-4 h-4" />
          </span>
          <span className="hidden md:inline">Home</span>
        </button>

        {/* Search Bar */}
        <div className="flex-1 max-w-md relative">
          <Search className="w-5 h-5 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search for chicken, snacks, combos..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#141414] text-gray-200 placeholder-gray-500 rounded-full py-3 pl-12 pr-4 border border-[#222] outline-none focus:border-gray-500 transition-colors text-sm font-medium shadow-inner"
          />
        </div>

        {/* Cart */}
        <button
          onClick={() => navigate(`/cart/${slug || 'kokkarakko-fried-chicken'}`)}
          className="relative flex items-center gap-2 bg-[#E50914] hover:bg-[#CC0812] text-white font-bold py-2.5 px-4 rounded-full transition-all text-sm shrink-0 shadow-lg shadow-red-500/20"
        >
          <ShoppingCart className="w-4 h-4" />
          <span className="hidden sm:inline">Cart</span>
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-white text-[#E50914] text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#E50914]">
              {cartCount}
            </span>
          )}
        </button>
      </header>

      {/* Hero Banner */}
      <div className="px-6 max-w-[1400px] mx-auto mb-10 mt-2">
        <div className="relative w-full rounded-[2rem] overflow-hidden bg-gradient-to-r from-[#111] to-[#222] border border-[#222] flex flex-col md:flex-row h-[350px] shadow-2xl">
          
          {/* Banner Image (Background/Right) */}
          <div className="absolute inset-0 md:left-1/3 md:w-2/3 h-full z-0 opacity-40 md:opacity-100">
            {/* Gradient mask to blend the image seamlessly on desktop */}
            <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-[#111] via-[#111]/80 to-transparent z-10 w-1/2"></div>
            {/* Mobile dark overlay */}
            <div className="block md:hidden absolute inset-0 bg-black/60 z-10"></div>
            <img 
              src={slides[currentSlide]} 
              alt="Hot Fried Chicken" 
              className="w-full h-full object-cover object-center transition-all duration-700 ease-in-out" 
              onError={(e) => { e.target.onerror = null; e.target.src = '/placeholder-food.svg'; }} 
            />
          </div>

          {/* Banner Content (Left) */}
          <div className="relative z-20 w-full md:w-3/5 p-8 md:p-14 flex flex-col justify-center h-full">
            <p className="text-[#E50914] text-xs font-black tracking-widest uppercase mb-3 drop-shadow-md">Crispy. Juicy. Irresistible.</p>
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-none mb-1 drop-shadow-md tracking-tight">
              Hot Chicken,
            </h1>
            <h1 className="text-4xl md:text-6xl font-bold text-[#E50914] leading-none mb-5 drop-shadow-md tracking-tight">
              Great Moments!
            </h1>
            <p className="text-gray-300 text-sm md:text-base font-medium mb-8 max-w-sm leading-relaxed text-shadow-sm">
              Freshly prepared with the finest ingredients. Flavors you'll love, every single time.
            </p>
            <button className="bg-[#E50914] hover:bg-[#CC0812] text-white font-bold py-3 px-7 rounded-full w-max flex items-center gap-2 transition-all shadow-lg shadow-red-500/20 text-sm">
              Order Now <ArrowRight className="w-4 h-4 ml-1" />
            </button>
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
      <div className="px-6 max-w-[1100px] mx-auto mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex gap-3 overflow-x-auto w-full md:w-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <button 
            onClick={() => setActiveCategory('ALL')}
            className={`px-6 py-2.5 rounded-xl font-bold text-[13px] tracking-wider whitespace-nowrap transition-colors border ${
              activeCategory === 'ALL' 
                ? 'bg-[#E50914] text-white border-[#E50914]' 
                : 'bg-[#1A1A1A] text-gray-300 border-[#222] hover:bg-[#222]'
            }`}
          >
            ALL
          </button>
          
          {categories.filter(c => c !== 'ALL').map((cat) => {
            let Icon = Drumstick;
            const up = cat.toUpperCase();
            if (up.includes('SNACK') || up.includes('POPCORN') || up.includes('STRIP')) Icon = Package;
            if (up.includes('COMBO') || up.includes('BUCKET') || up.includes('MEAL')) Icon = Layers;

            return (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-xl font-bold text-[13px] tracking-wider whitespace-nowrap flex items-center gap-2 transition-colors border ${
                  activeCategory === cat 
                    ? 'bg-[#E50914] text-white border-[#E50914]' 
                    : 'bg-[#1A1A1A] text-gray-300 border-[#222] hover:bg-[#222]'
                }`}
              >
                <Icon className="w-4 h-4" /> {cat}
              </button>
            )
          })}
        </div>

        {/* Sort Dropdown (Removed) */}
      </div>

      {/* Section Title */}
      <div className="px-6 max-w-[1100px] mx-auto mb-6 mt-2">
        <h2 className="text-2xl font-bold text-white tracking-tight">
          {activeCategory === 'ALL' ? 'All Items' : activeCategory}
        </h2>
      </div>

      {/* Menu List */}
      <div className="px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-[1100px] mx-auto pb-12">
        {filteredItems.length === 0 ? (
          <div className="col-span-full text-center py-20 text-gray-500 font-bold uppercase tracking-wider text-sm">
            No items found.
          </div>
        ) : (
          filteredItems.map((item) => {
            const imageUrl = item.image ? `${IMAGE_BASE_URL}${item.image}` : null;
            
            return (
              <div
                key={item._id}
                className="relative rounded-2xl overflow-hidden group cursor-pointer shadow-lg hover:shadow-2xl hover:shadow-black/50 transition-all duration-300 border border-[#222] hover:border-[#333] hover:-translate-y-1"
                style={{ aspectRatio: '1.2 / 1' }}
              >
                {/* Full-bleed image */}
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={item.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }}
                  />
                ) : (
                  <div className="absolute inset-0 bg-[#1a1a1a] flex items-center justify-center text-7xl select-none">
                    🍗
                  </div>
                )}

                {/* Bottom gradient overlay — softer and limited to bottom half for maximum image visibility */}
                <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />

                {/* Category badge — top left */}
                {item.category && (
                  <span className="absolute top-3 left-3 z-10 text-[10px] font-black tracking-widest uppercase text-white bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/10">
                    {getCatName(item)}
                  </span>
                )}

                {/* Text content — sits over gradient */}
                <div className="absolute bottom-0 left-0 right-0 z-10 p-4">
                  {/* Name + Price row */}
                  <div className="flex items-end justify-between gap-2 mb-1.5">
                    <h3 className="text-white font-black text-base leading-tight tracking-tight drop-shadow-md group-hover:text-[#E50914] transition-colors">
                      {item.name}
                    </h3>
                    <span className="text-[#E50914] font-black text-lg shrink-0 drop-shadow-md">
                      ₹{item.price}
                    </span>
                  </div>

                  {/* Description */}
                  {item.description && (
                    <p className="text-gray-300 text-xs font-medium leading-snug mb-3 line-clamp-1 drop-shadow">
                      {item.description}
                    </p>
                  )}

                  {/* Add button */}
                  <div className="flex justify-end">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(item);
                      }}
                      className="bg-[#E50914] text-white font-bold text-xs uppercase px-5 py-2.5 rounded-lg flex items-center hover:bg-[#CC0812] transition-colors shadow-md shadow-red-500/10"
                    >
                      ADD <PlusCircle className="w-4 h-4 ml-1.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};

export default MenuPage;
