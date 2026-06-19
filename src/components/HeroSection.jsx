import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';

const HeroSection = ({ slug }) => {
  const navigate = useNavigate();

  const handleExploreMenu = () => {
    if (slug) {
      navigate(`/menu/${slug}`);
    } else {
      // Fallback
      const el = document.getElementById('bestsellers');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen pt-24 md:pt-32 pb-16 flex items-center bg-white overflow-hidden">
      {/* Background Smoke Texture Overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#111_1px,transparent_1px)] [background-size:16px_16px]"></div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 w-full">
        
        {/* Left Column: Typography & Text */}
        <div className="lg:col-span-6 space-y-8 text-center lg:text-left flex flex-col justify-center">
          
          {/* Red Brush Banner */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex self-center lg:self-start relative bg-[#E50914] text-white font-black text-xs md:text-sm px-6 py-2.5 uppercase tracking-widest rounded-r-full rounded-l-md shadow-md"
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
            className="space-y-1"
          >
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-[#111111] leading-none uppercase">
              CRISPY
            </h1>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-[#E50914] leading-none uppercase">
              JUICY
            </h1>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-[#111111] leading-none uppercase italic">
              IRRESISTIBLE!
            </h1>
          </motion.div>

          {/* Description Row */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-sm md:text-base font-bold text-gray-700 flex flex-wrap justify-center lg:justify-start items-center gap-x-2 gap-y-1"
          >
            <span>100% Real Chicken</span>
            <span className="text-gray-300">|</span>
            <span>Perfectly Seasoned</span>
            <span className="text-gray-300">|</span>
            <span>Fried Fresh</span>
            <span className="text-gray-300">|</span>
            <span>Made To Order</span>
          </motion.p>

          {/* Primary CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExploreMenu}
              className="group bg-[#E50914] hover:bg-[#c40710] text-white font-black text-sm uppercase tracking-wider py-4.5 px-8 rounded-full shadow-xl shadow-red-500/30 flex items-center justify-center gap-3 mx-auto lg:mx-0 transition-all duration-200"
            >
              <ShoppingCart size={18} className="group-hover:rotate-12 transition-transform duration-200" />
              Explore Menu
              <span className="bg-white text-[#E50914] w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs group-hover:translate-x-1 transition-transform duration-200">
                →
              </span>
            </motion.button>
          </motion.div>

          {/* Customer Trust Row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4 border-t border-gray-100"
          >
            {/* Avatar Group */}
            <div className="flex -space-x-3 overflow-hidden">
              <img
                className="inline-block h-9 w-9 rounded-full ring-2 ring-white"
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
                alt="Customer 1"
              />
              <img
                className="inline-block h-9 w-9 rounded-full ring-2 ring-white"
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop"
                alt="Customer 2"
              />
              <img
                className="inline-block h-9 w-9 rounded-full ring-2 ring-white"
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop"
                alt="Customer 3"
              />
              <img
                className="inline-block h-9 w-9 rounded-full ring-2 ring-white"
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
                alt="Customer 4"
              />
            </div>
            
            <div className="text-center sm:text-left leading-none">
              <div className="flex justify-center sm:justify-start text-yellow-500 mb-1">
                <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
              </div>
              <p className="text-xs font-black text-gray-800 uppercase tracking-wider">
                4.9k+ Happy Customers
              </p>
            </div>
          </motion.div>

        </div>

        {/* Right Column: Bucket Image & Badges */}
        <div className="lg:col-span-6 relative flex justify-center items-center py-12">
          
          {/* Red Splash Background using dynamic SVG */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.85, scale: 1.1 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none"
          >
            <svg viewBox="0 0 500 500" className="w-[120%] h-[120%] text-[#E50914] fill-current">
              <path d="M390,300Q340,380,250,400Q160,420,110,330Q60,240,120,150Q180,60,280,100Q380,140,410,220Q440,300,390,300Z" />
            </svg>
          </motion.div>

          {/* Chicken Bucket Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 100, damping: 15, delay: 0.3 }}
            className="relative z-10 max-w-md w-full drop-shadow-[0_20px_35px_rgba(0,0,0,0.15)]"
          >
            <img
              src="/hero-bucket.png"
              alt="Crispy Fried Chicken Bucket"
              className="w-full h-auto object-contain select-none"
            />

            {/* Rotating Circular Badge (Bottom Right) */}
            <motion.div
              initial={{ opacity: 0, rotate: -45 }}
              animate={{ opacity: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="absolute bottom-4 right-4 z-20 bg-white rounded-full p-1.5 shadow-2xl border border-gray-100 hover:scale-110 transition-transform duration-200 cursor-pointer"
            >
              <div className="relative w-28 h-28 flex items-center justify-center">
                
                {/* SVG Text Rotation */}
                <svg viewBox="0 0 100 100" className="w-full h-full animate-[spin_12s_linear_infinite] select-none">
                  <path
                    id="circlePath"
                    d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                    fill="none"
                  />
                  <text font-size="8.2" font-weight="900" fill="#111111" letter-spacing="1">
                    <textPath href="#circlePath">
                      100% REAL CHICKEN • 100% SATISFACTION •
                    </textPath>
                  </text>
                </svg>

                {/* Badge Center Red Circle + Chicken Icon */}
                <div className="absolute inset-4 bg-[#E50914] rounded-full flex items-center justify-center shadow-inner">
                  {/* Chicken SVG Icon */}
                  <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white text-white">
                    <path d="M12 2A10 10 0 0 0 2 12c0 3 .5 6 2 8l2-2v-2c2-1 3-3 4-5 1-2 2-3 4-3 1 0 2 .5 3 1 .5.5.8 1.2.8 2 0 1.2-.8 2.2-2 2.6V15h2v-2h2v-2c0-4.4-3.6-8-8-8zm-2 10a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
                  </svg>
                </div>

              </div>
            </motion.div>
          </motion.div>

        </div>

      </div>
    </section>
  );
};

export default HeroSection;
