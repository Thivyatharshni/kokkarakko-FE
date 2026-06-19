import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { IMAGE_BASE_URL } from '../config/constants';
import toast from 'react-hot-toast';

const BestSellerSection = ({ menuItems, slug }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // Filter first 5 available items
  const bestSellers = menuItems
    ? menuItems.filter((item) => item.available).slice(0, 5)
    : [];

  const handleAddToCart = (e, item) => {
    e.stopPropagation();
    addToCart(item);
    toast.success(`${item.name} added to order!`, {
      icon: '🍗',
      style: {
        background: '#111111',
        color: '#ffffff',
      }
    });
  };

  const getCategoryTag = (category) => {
    if (!category) return 'BEST SELLER';
    // Map certain categories to match reference tags
    const catUpper = category.toUpperCase();
    if (catUpper.includes('LEG')) return 'BEST SELLER';
    if (catUpper.includes('WING')) return 'HOT & SPICY';
    if (catUpper.includes('STRIP') || catUpper.includes('SPICY')) return 'HOT & SPICY';
    if (catUpper.includes('POPCORN')) return 'BEST SELLER';
    return category;
  };

  return (
    <section id="bestsellers" className="relative py-20 bg-white overflow-hidden">
      
      {/* Delicious Background Watermark Text */}
      <div className="absolute right-0 top-1/4 translate-x-1/4 select-none pointer-events-none opacity-5 font-black text-[120px] md:text-[200px] text-gray-900 uppercase tracking-widest italic">
        Delicious
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Headings */}
        <div className="text-center mb-16 space-y-2">
          <div className="flex items-center justify-center gap-2 text-[#E50914] font-black text-lg md:text-xl">
            <span>→</span>
            <span className="italic uppercase tracking-widest font-black">Our Bestsellers</span>
            <span>←</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-[#111111] tracking-tight uppercase">
            PURE <span className="text-[#E50914]">FRIED.</span> PURE LOVE.
          </h2>
        </div>

        {/* Bestseller Grid */}
        {bestSellers.length === 0 ? (
          <div className="text-center py-12 text-gray-500 font-bold">
            No items available in the menu right now.
          </div>
        ) : (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1 }
              }
            }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-16"
          >
            {bestSellers.map((item) => {
              const imageUrl = item.image
                ? `${IMAGE_BASE_URL}${item.image}`
                : '/placeholder-food.png';

              return (
                <motion.div
                  key={item._id}
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
                  }}
                  className="bg-white rounded-3xl border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 p-4 flex flex-col justify-between relative group hover:-translate-y-1"
                >
                  
                  {/* Category Tag (Top Left) */}
                  <span className="absolute top-4 left-4 bg-[#E50914] text-white text-[9px] font-black tracking-widest px-2.5 py-1 rounded-lg uppercase shadow-sm z-10">
                    {getCategoryTag(item.category)}
                  </span>

                  {/* Product Image */}
                  <div className="w-full h-40 flex items-center justify-center mb-6 overflow-hidden rounded-2xl bg-gray-50/50 p-2">
                    <img
                      src={imageUrl}
                      alt={item.name}
                      className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-300 select-none"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/placeholder-food.png';
                      }}
                    />
                  </div>

                  {/* Product Info */}
                  <div className="text-center space-y-3 flex-grow flex flex-col justify-between">
                    <div>
                      <h4 className="font-black text-sm text-[#111111] uppercase tracking-wide leading-snug line-clamp-2">
                        {item.name}
                      </h4>
                      {item.description && (
                        <p className="text-gray-400 text-[10px] font-semibold mt-1 line-clamp-1">
                          {item.description}
                        </p>
                      )}
                    </div>

                    <div className="space-y-3">
                      <p className="text-lg font-black text-[#E50914]">
                        ₹{item.price}
                      </p>

                      {/* Add to Order Button */}
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={(e) => handleAddToCart(e, item)}
                        className="w-full flex items-center justify-between border-2 border-gray-100 hover:border-[#E50914] rounded-xl overflow-hidden bg-white text-gray-700 hover:text-[#E50914] font-bold text-xs transition-colors py-1 pl-3 pr-1"
                      >
                        <span className="uppercase tracking-wider">Add to Order</span>
                        <span className="bg-[#E50914] text-white p-1.5 rounded-lg flex items-center justify-center">
                          <Plus size={12} strokeWidth={3} />
                        </span>
                      </motion.button>
                    </div>

                  </div>

                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* View Full Menu CTA */}
        <div className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => slug && navigate(`/menu/${slug}`)}
            className="group bg-[#E50914] hover:bg-[#c40710] text-white font-black text-xs md:text-sm uppercase tracking-wider py-4 px-8 rounded-full shadow-lg shadow-red-500/20 flex items-center justify-center gap-2 transition-all duration-200"
            style={{
              clipPath: 'polygon(3% 0%, 97% 0%, 100% 50%, 97% 100%, 3% 100%, 0% 50%)'
            }}
          >
            View Full Menu
            <span className="font-bold group-hover:translate-x-1 transition-transform duration-200">→</span>
          </motion.button>
        </div>

      </div>
    </section>
  );
};

export default BestSellerSection;
