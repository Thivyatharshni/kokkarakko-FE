import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';

const HeroSection = ({ slug, shop }) => {
  const navigate = useNavigate();

  const handleExploreMenu = () => {
    if (slug) {
      navigate(`/menu/${slug}`);
    } else {
      const el = document.getElementById('bestsellers');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative h-screen min-h-[500px] lg:min-h-0 flex items-center hero-premium-bg overflow-hidden text-white">
      {/* Premium Smoky Atmosphere Layers, Vignette, Grain & Floating Seasoning */}
      <div className="hero-smoke-layer-1"></div>
      <div className="hero-smoke-layer-2"></div>
      <div className="hero-smoke-layer-3"></div>
      <div className="hero-vignette-overlay"></div>
      <div className="hero-grain-overlay"></div>
      <div className="hero-seasoning-container">
        {Array.from({ length: 16 }).map((_, idx) => (
          <div key={idx} className="hero-seasoning-particle" />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center relative z-10 w-full py-4 lg:py-6">
        
        {/* Left Column: Typography & Text Wrapper */}
        <div className="lg:col-span-7 xl:col-span-6 lg:col-start-1 text-left flex flex-col justify-center z-20 pt-20 lg:pt-24">
          
          {/* Controlled Content Wrapper to keep content in the left-center region and ensure readability over video */}
          <div className="bg-black/30 backdrop-blur-[2px] p-6 md:p-8 lg:p-10 rounded-3xl border border-white/5 space-y-6 md:space-y-7 max-w-xl w-full">
            
            {/* Red Brush Banner / Badge */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex self-start relative bg-[#D90404] text-white font-black text-[10px] md:text-xs px-5 py-2 uppercase tracking-widest rounded-r-full rounded-l-md shadow-md"
              style={{
                clipPath: 'polygon(0% 0%, 95% 0%, 100% 50%, 95% 100%, 0% 100%, 3% 50%)'
              }}
            >
              HOT. FRESH. ALWAYS FRIED TO PERFECTION.
            </motion.div>

            {/* Large Typography: CRISPY JUICY IRRESISTIBLE! */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-1 lg:space-y-2"
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter text-white leading-none uppercase">
                CRISPY
              </h1>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter text-[#D90404] leading-none uppercase">
                JUICY
              </h1>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-none uppercase italic">
                IRRESISTIBLE!
              </h1>
            </motion.div>

            {/* Description Row / Supporting text */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xs md:text-sm font-bold text-gray-300 flex flex-wrap justify-start items-center gap-x-2 gap-y-1 leading-relaxed"
            >
              <span>100% Real Chicken</span>
              <span className="text-gray-600">|</span>
              <span>Perfectly Seasoned</span>
              <span className="text-gray-600">|</span>
              <span>Fried Fresh</span>
              <span className="text-gray-600">|</span>
              <span>Made To Order</span>
            </motion.p>

            {/* Primary CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="pt-2"
            >
              <button
                onClick={handleExploreMenu}
                className="premium-btn group bg-[#D90404] hover:bg-[#b80303] text-white font-black text-xs lg:text-sm uppercase tracking-wider py-3.5 lg:py-4.5 px-6 lg:px-8 rounded-full shadow-xl shadow-[#D90404]/30 flex items-center justify-start gap-3"
              >
                <ShoppingCart size={16} className="group-hover:rotate-12 transition-transform duration-200" />
                Explore Menu
                <span className="bg-white text-[#D90404] w-5 h-5 lg:w-6 lg:h-6 rounded-full flex items-center justify-center font-bold text-xs group-hover:translate-x-1 transition-transform duration-200">
                  →
                </span>
              </button>
            </motion.div>

            {/* Customer Trust Row / Rating */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.7 }}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-start gap-3 lg:gap-4 pt-4 lg:pt-5 border-t border-white/10"
            >
              {/* Avatar Group */}
              <div className="flex -space-x-3 overflow-hidden">
                <img
                  className="inline-block h-8 w-8 lg:h-9 lg:w-9 rounded-full ring-2 ring-white"
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
                  alt="Customer 1"
                />
                <img
                  className="inline-block h-8 w-8 lg:h-9 lg:w-9 rounded-full ring-2 ring-white"
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop"
                  alt="Customer 2"
                />
                <img
                  className="inline-block h-8 w-8 lg:h-9 lg:w-9 rounded-full ring-2 ring-white"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop"
                  alt="Customer 3"
                />
                <img
                  className="inline-block h-8 w-8 lg:h-9 lg:w-9 rounded-full ring-2 ring-white"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
                  alt="Customer 4"
                />
              </div>
              
              <div className="text-left leading-none">
                <div className="flex justify-start text-yellow-500 mb-1">
                  <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                </div>
                <p className="text-[10px] lg:text-xs font-black text-gray-300 uppercase tracking-wider">
                  4.9k+ Happy Customers
                </p>
              </div>
            </motion.div>

          </div>
        </div>



      </div>
    </section>
  );
};

export default HeroSection;
