import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { ShoppingCart, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getFeaturedMenuBySlug } from '../services/menuService';
import { getFullImageUrl } from '../config/constants';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

// ─── Description Component ───────────────────────────────────────────────────
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
      className="mt-1 mb-1 text-left cursor-pointer flex-grow"
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

// ─── Card 3D Tilt ─────────────────────────────────────────────────────────────
const FeaturedCard = ({ item, index, slug }) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const cardRef = useRef(null);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const checkTouch = () => {
      setIsTouchDevice(window.innerWidth < 1024 || window.matchMedia('(pointer: coarse)').matches);
    };
    checkTouch();
    window.addEventListener('resize', checkTouch);
    return () => window.removeEventListener('resize', checkTouch);
  }, []);

  const handleMouseMove = (e) => {
    if (!cardRef.current || isTouchDevice) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientY - rect.top) / rect.height - 0.5) * 10;
    const y = ((e.clientX - rect.left) / rect.width - 0.5) * -10;
    setTilt({ x, y });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart({ ...item, category: item.category?.name || item.category });
    toast.success(`${item.name} added to cart!`, { icon: '🍗' });
  };

  const imageUrl = item.image ? getFullImageUrl(item.image) : null;
  const categoryName = typeof item.category === 'object' ? item.category?.name : item.category;

  // Suppress hex ObjectID showing up
  const isHexId = /^[0-9a-fA-F]{24}$/.test(categoryName || '');
  const displayCategory = categoryName && !isHexId ? categoryName : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      whileTap={{ scale: 0.98 }}
      className="h-full"
    >
      <motion.div
        ref={cardRef}
        onMouseMove={(e) => { handleMouseMove(e); setIsHovered(true); }}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: (!isTouchDevice && isHovered)
            ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(-10px)`
            : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)',
          transition: 'transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.3s ease',
          boxShadow: (isHovered && !isTouchDevice)
            ? '0 30px 60px rgba(0,0,0,0.6), 0 0 30px rgba(229,9,20,0.15)'
            : '0 10px 30px rgba(0,0,0,0.4)',
        }}
        className="relative bg-[#141414] border border-[#252525] rounded-2xl overflow-hidden flex flex-col h-full group cursor-pointer"
      >
        {/* ⭐ Featured Badge */}
        <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 bg-[#E50914] text-white text-[10px] font-black tracking-widest uppercase px-2.5 py-1 rounded-full shadow-lg shadow-red-500/30">
          <Star size={9} fill="white" />
          <span>Featured</span>
          {/* Pulsing glow ring */}
          <span className="absolute inset-0 rounded-full animate-ping bg-[#E50914] opacity-20 pointer-events-none" />
        </div>

        {/* Image */}
        <div className="relative aspect-[16/10] sm:aspect-[4/3] overflow-hidden bg-[#1A1A1A] shrink-0">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={item.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              onError={(e) => { e.target.onerror = null; e.target.src = '/placeholder-food.svg'; }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-6xl select-none">🍗</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col flex-grow p-4 gap-2">
          {displayCategory && (
            <span className="text-[10px] font-black text-[#E50914] tracking-widest uppercase">
              {displayCategory}
            </span>
          )}

          <h3 className="text-white font-black text-lg leading-tight tracking-tight">
            {item.name}
          </h3>

          {item.description && (
            <MenuCardDescription description={item.description} />
          )}

          <div className="flex items-center justify-between pt-2.5 mt-auto border-t border-[#252525]">
            <span className="text-[#E50914] font-black text-xl">
              ₹{item.price}
            </span>
            <motion.button
              onClick={handleAddToCart}
              whileTap={{ scale: 0.95 }}
              className="premium-btn flex items-center gap-2 bg-[#E50914] hover:bg-[#CC0812] text-white font-black text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl shadow-lg shadow-red-500/20 transition-all"
            >
              <ShoppingCart size={13} />
              Add
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── Main Section ─────────────────────────────────────────────────────────────
const FeaturedMenuSection = ({ shop }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scrollIndex, setScrollIndex] = useState(0);

  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const slug = shop?.slug || 'kokkarakko-fried-chicken';

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        const res = await getFeaturedMenuBySlug(slug);
        if (res.success) {
          setItems(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch featured items:', err);
        setError('Failed to load featured items');
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, [slug]);

  // Don't render section at all if no featured items and not loading
  if (!loading && items.length === 0) return null;

  const CARDS_PER_VIEW = 3;
  const canScrollLeft = scrollIndex > 0;
  const canScrollRight = scrollIndex < items.length - CARDS_PER_VIEW;

  return (
    <section
      id="featured-menu"
      ref={sectionRef}
      className="relative py-12 sm:py-24 bg-[#0d0d0d] overflow-hidden border-b border-neutral-900"
    >
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#E50914]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[100px]" />
      </div>

      {/* Fine grain texture overlay */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.015] pointer-events-none z-0">
        <filter id="featuredGrain">
          <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#featuredGrain)" />
      </svg>

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* ── Section Header ── */}
        <div className="text-center mb-14">

          {/* Badge — scale pop-in */}
          <motion.span
            initial={{ opacity: 0, scale: 0.7, y: 8 }}
            animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
            transition={{ duration: 0.45, ease: [0.34, 1.56, 0.64, 1] }}
            className="inline-flex items-center gap-2 bg-[#E50914]/10 border border-[#E50914]/25 text-[#E50914] text-xs font-black tracking-widest uppercase px-5 py-2 rounded-full mb-8"
          >
            <Star size={12} fill="currentColor" />
            Chef's Selection
          </motion.span>

          {/* Heading — each word clips up individually */}
          <h2 className="text-3xl md:text-6xl font-black uppercase tracking-tight leading-none mb-5 flex flex-wrap justify-center gap-x-4 gap-y-1">
            {/* FEATURED */}
            <span className="overflow-hidden inline-block">
              <motion.span
                className="inline-block text-white"
                initial={{ y: '110%', opacity: 0, filter: 'blur(8px)' }}
                animate={isInView ? { y: '0%', opacity: 1, filter: 'blur(0px)' } : {}}
                transition={{ duration: 0.65, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
              >
                FEATURED
              </motion.span>
            </span>

            {/* SIGNATURE — red, slight extra delay */}
            <span className="overflow-hidden inline-block">
              <motion.span
                className="inline-block text-[#E50914]"
                initial={{ y: '110%', opacity: 0, filter: 'blur(10px)' }}
                animate={isInView ? { y: '0%', opacity: 1, filter: 'blur(0px)' } : {}}
                transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              >
                SIGNATURE
              </motion.span>
            </span>

            {/* ITEMS */}
            <span className="overflow-hidden inline-block">
              <motion.span
                className="inline-block text-white"
                initial={{ y: '110%', opacity: 0, filter: 'blur(8px)' }}
                animate={isInView ? { y: '0%', opacity: 1, filter: 'blur(0px)' } : {}}
                transition={{ duration: 0.65, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                ITEMS
              </motion.span>
            </span>
          </h2>

          {/* Subheading — fade up with slight letter spacing open */}
          <motion.p
            initial={{ opacity: 0, y: 12, letterSpacing: '0.15em' }}
            animate={isInView ? { opacity: 1, y: 0, letterSpacing: '0em' } : {}}
            transition={{ duration: 0.6, delay: 0.55, ease: 'easeOut' }}
            className="text-gray-400 text-sm md:text-base font-semibold max-w-xl mx-auto"
          >
            Hand-picked customer favourites freshly prepared every day.
          </motion.p>

          {/* Decorative line — draws in after words settle */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={isInView ? { scaleX: 1, opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 h-px w-32 bg-gradient-to-r from-transparent via-[#E50914] to-transparent mx-auto origin-center"
          />
        </div>

        {/* ── Loading Skeleton ── */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-[#141414] border border-[#252525] rounded-2xl overflow-hidden animate-pulse">
                <div className="aspect-[16/10] sm:aspect-[4/3] bg-[#1e1e1e] shrink-0" />
                <div className="p-5 space-y-3">
                  <div className="h-3 bg-[#1e1e1e] rounded w-1/3" />
                  <div className="h-5 bg-[#1e1e1e] rounded w-2/3" />
                  <div className="h-3 bg-[#1e1e1e] rounded w-full" />
                  <div className="h-3 bg-[#1e1e1e] rounded w-4/5" />
                  <div className="flex justify-between items-center pt-3 mt-2 border-t border-[#252525]">
                    <div className="h-6 bg-[#1e1e1e] rounded w-16" />
                    <div className="h-9 bg-[#1e1e1e] rounded w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Cards Grid ── */}
        {!loading && items.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((item, index) => (
                <FeaturedCard key={item._id} item={item} index={index} slug={slug} />
              ))}
            </div>

            {/* Item count */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.8 }}
              className="mt-10 text-center hidden sm:block"
            >
              <span className="text-gray-600 text-xs font-semibold uppercase tracking-widest">
                {items.length} Featured Item{items.length !== 1 ? 's' : ''} Available
              </span>
            </motion.div>
          </>
        )}

        {/* ── Error state ── */}
        {!loading && error && (
          <div className="text-center py-16 text-gray-500">
            <p className="text-sm font-semibold">Could not load featured items.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedMenuSection;
