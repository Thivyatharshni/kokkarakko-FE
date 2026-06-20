import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Search, User, ShoppingCart, Heart, Star, PlusCircle, ArrowRight, 
  ChevronDown, Drumstick, Package, Layers, Loader2, ChevronRight 
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { getMenuBySlug } from '../../services/menuService';
import { IMAGE_BASE_URL } from '../../config/constants';
import toast from 'react-hot-toast';

// Import banner image statically if possible, otherwise use fallback
import defaultBannerImg from '../../assets/images/chicken wings.jpg';

const MenuPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { cart, addToCart, getCartCount, getCartTotal } = useCart();
  const cartCount = getCartCount();
  const cartTotal = getCartTotal();

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        const menuRes = await getMenuBySlug(slug || 'kokkarakko-fried-chicken');
        if (menuRes.success) {
          setMenuItems(menuRes.data);
          
          const fetchedCats = [...new Set(menuRes.data.map(item => item.category?.toUpperCase() || 'UNCATEGORIZED'))];
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

  const availableCategories = [...new Set(menuItems.map(item => item.category?.toUpperCase() || 'UNCATEGORIZED'))];
  const categories = ['ALL', ...availableCategories.filter(c => c !== 'ALL')];

  const filteredItems = menuItems.filter(item => {
    if (item.available === false) return false;
    
    const matchesCategory = activeCategory === 'ALL' || (item.category?.toUpperCase() || 'UNCATEGORIZED') === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (item) => {
    addToCart(item);
    toast.success(`${item.name} added to cart!`, {
      icon: '🍗',
      style: {
        background: '#1A1A1A',
        color: '#ffffff',
        border: '1px solid #333'
      }
    });
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

        {/* Right Actions */}
        <div className="flex items-center gap-3 md:gap-4 shrink-0">
          <div 
            onClick={() => toast('Cart drawer coming soon!', { icon: '🛒' })}
            className="relative bg-[#141414] p-3 rounded-full cursor-pointer hover:bg-[#222] transition-colors border border-[#222]"
          >
            <ShoppingCart className="w-5 h-5 text-gray-300" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#E50914] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-md border-2 border-[#0A0A0A]">
                {cartCount}
              </span>
            )}
          </div>
          <div className="bg-[#141414] p-3 rounded-full cursor-pointer hover:bg-[#222] transition-colors border border-[#222]">
            <User className="w-5 h-5 text-gray-300" />
          </div>
        </div>
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
              src={defaultBannerImg} 
              alt="Hot Fried Chicken" 
              className="w-full h-full object-cover object-center" 
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
            <div className="w-6 h-1.5 rounded-full bg-[#E50914]"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-gray-500 cursor-pointer"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-gray-500 cursor-pointer"></div>
          </div>
          
          <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20 hidden md:flex cursor-pointer bg-black/40 hover:bg-black/60 p-3 rounded-full backdrop-blur-sm border border-white/10 transition-colors shadow-lg">
            <ChevronRight className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      {/* Categories & Filter */}
      <div className="px-6 max-w-[1400px] mx-auto mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
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

        {/* Sort Dropdown */}
        <div className="bg-[#1A1A1A] border border-[#222] rounded-xl px-4 py-2.5 flex items-center gap-2 cursor-pointer hover:bg-[#222] transition-colors shrink-0 self-start md:self-auto shadow-sm">
          <span className="text-gray-400 text-xs font-medium">Sort by:</span>
          <span className="text-white text-sm font-bold">Popular</span>
          <ChevronDown className="w-4 h-4 text-gray-400 ml-2" />
        </div>
      </div>

      {/* Section Title */}
      <div className="px-6 max-w-[1400px] mx-auto mb-6 mt-2">
        <h2 className="text-2xl font-bold text-white tracking-tight">
          {activeCategory === 'ALL' ? 'All Items' : activeCategory}
        </h2>
      </div>

      {/* Menu List */}
      <div className="px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-[1400px] mx-auto pb-12">
        {filteredItems.length === 0 ? (
          <div className="col-span-full text-center py-20 text-gray-500 font-bold uppercase tracking-wider text-sm">
            No items found.
          </div>
        ) : (
          filteredItems.map((item) => {
            const imageUrl = item.image ? `${IMAGE_BASE_URL}${item.image}` : '/placeholder-food.svg';
            // Placeholder for ratings since the backend API model might not have rating/reviews fields yet
            const rating = (Math.random() * (5 - 4) + 4).toFixed(1); 
            const reviews = Math.floor(Math.random() * 200) + 50;
            
            return (
              <div key={item._id} className="bg-[#141414] border border-[#222] rounded-2xl overflow-hidden flex flex-col group hover:border-[#333] transition-colors shadow-sm hover:shadow-lg">
                
                {/* Image Section */}
                <div className="relative h-56 w-full overflow-hidden bg-[#1A1A1A]">
                  <img src={imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                       onError={(e) => { e.target.onerror = null; e.target.src = '/placeholder-food.svg'; }} />
                  
                  {/* Heart Icon */}
                  <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm p-2.5 rounded-full cursor-pointer hover:bg-black/70 transition-colors border border-white/10 z-10">
                    <Heart className="w-4 h-4 text-white hover:text-red-500 transition-colors" />
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-1.5 gap-2">
                    <h3 className="text-white font-bold text-[1.1rem] leading-tight tracking-tight">{item.name}</h3>
                    <span className="text-[#E50914] font-black text-lg shrink-0">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>
                  
                  {item.description && (
                    <p className="text-gray-400 text-sm mb-5 line-clamp-2 leading-snug font-medium">
                      {item.description}
                    </p>
                  )}
                  
                  <div className="flex justify-between items-end mt-auto pt-2">
                    <div className="flex items-center gap-1.5 text-xs">
                      <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                      <span className="text-white font-semibold">{rating}</span>
                      <span className="text-gray-500 font-medium">({reviews})</span>
                    </div>
                    
                    <button 
                      onClick={() => handleAddToCart(item)}
                      className="bg-[#E50914] text-white font-bold text-xs uppercase px-4 py-2.5 rounded-xl flex items-center hover:bg-[#CC0812] transition-colors shadow-lg shadow-red-500/10"
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
