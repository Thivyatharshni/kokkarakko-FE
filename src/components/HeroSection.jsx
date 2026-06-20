import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';

const HeroSection = ({ slug, shop, bucketRef, originRef }) => {
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
        
        {/* Left Column: Typography & Text */}
        <div className="lg:col-span-6 space-y-4 lg:space-y-5 text-center lg:text-left flex flex-col justify-center">
          
          {/* Red Brush Banner */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex self-center lg:self-start relative bg-[#D90404] text-white font-black text-[10px] md:text-xs px-5 py-2 uppercase tracking-widest rounded-r-full rounded-l-md shadow-md"
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
            className="space-y-0.5 lg:space-y-1"
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white leading-none uppercase">
              CRISPY
            </h1>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-[#D90404] leading-none uppercase">
              JUICY
            </h1>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-white leading-none uppercase italic">
              IRRESISTIBLE!
            </h1>
          </motion.div>

          {/* Description Row */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xs md:text-sm lg:text-base font-bold text-gray-300 flex flex-wrap justify-center lg:justify-start items-center gap-x-2 gap-y-1"
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
          >
            <button
              onClick={handleExploreMenu}
              className="premium-btn group bg-[#D90404] hover:bg-[#b80303] text-white font-black text-xs lg:text-sm uppercase tracking-wider py-3.5 lg:py-4.5 px-6 lg:px-8 rounded-full shadow-xl shadow-[#D90404]/30 flex items-center justify-center gap-3 mx-auto lg:mx-0"
            >
              <ShoppingCart size={16} className="group-hover:rotate-12 transition-transform duration-200" />
              Explore Menu
              <span className="bg-white text-[#D90404] w-5 h-5 lg:w-6 lg:h-6 rounded-full flex items-center justify-center font-bold text-xs group-hover:translate-x-1 transition-transform duration-200">
                →
              </span>
            </button>
          </motion.div>

          {/* Customer Trust Row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 lg:gap-4 pt-3 lg:pt-4 border-t border-white/10"
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
            
            <div className="text-center sm:text-left leading-none">
              <div className="flex justify-center sm:justify-start text-yellow-500 mb-1">
                <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
              </div>
              <p className="text-[10px] lg:text-xs font-black text-gray-300 uppercase tracking-wider">
                4.9k+ Happy Customers
              </p>
            </div>
          </motion.div>

        </div>

        {/* Right Column: Bucket Image & Badges */}
        <div className="lg:col-span-6 relative flex justify-center items-center py-4 lg:py-12">
          
          {/* Large Radial Dark-Red Spotlight (Layer 2) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2 }}
            className="absolute w-[120%] h-[120%] rounded-full pointer-events-none z-0"
            style={{
              background: 'radial-gradient(circle, rgba(225,6,0,0.20) 0%, rgba(225,6,0,0) 70%)',
            }}
          />
          {/* Warm Orange Rim Glow (Layer 3) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5 }}
            className="absolute w-[95%] h-[95%] rounded-full pointer-events-none z-0"
            style={{
              background: 'radial-gradient(circle, rgba(255,140,0,0.08) 0%, rgba(255,140,0,0) 60%)',
            }}
          />
          {/* Gigantic Invisible Watermark (Behind the bucket) */}
          <div 
            className="absolute select-none pointer-events-none font-black text-white uppercase tracking-widest z-0 blur-[3px] text-center"
            style={{
              fontSize: 'clamp(300px, 35vw, 500px)',
              opacity: 0.02,
              lineHeight: '1',
            }}
          >
            KOKKARAKKO
          </div>

          {/* Chicken Bucket Image */}
          <motion.div
            ref={bucketRef}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 100, damping: 15, delay: 0.3 }}
            className="relative z-10 max-w-xs md:max-w-sm lg:max-w-md w-full aspect-square drop-shadow-[0_20px_35px_rgba(0,0,0,0.3)] hover:shadow-[0_0_120px_rgba(217,4,4,0.15)] transition-shadow duration-500"
          >
            <img
              src="/hero-bucket.png"
              alt="Crispy Fried Chicken Bucket"
              className="w-full h-full object-contain select-none"
            />
            {/* Start coordinate target representing the selected leg piece inside the bucket */}
            <div 
              ref={originRef} 
              className="hero-origin-chicken absolute pointer-events-none opacity-0"
              style={{
                top: '13.18%',
                left: '31.25%',
                width: '24.51%',
                height: '24.02%'
              }}
            />

            {/* Rotating Circular Badge (Bottom Right) */}
            <motion.div
              initial={{ opacity: 0, rotate: -45 }}
              animate={{ opacity: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="absolute bottom-2 right-2 lg:bottom-4 lg:right-4 z-20 bg-white rounded-full p-1 shadow-2xl border border-gray-100 hover:scale-110 transition-transform duration-200 cursor-pointer"
            >
              <div className="relative w-20 h-20 lg:w-28 lg:h-28 flex items-center justify-center">
                
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
                <div className="absolute inset-3 lg:inset-4 bg-[#D90404] rounded-full flex items-center justify-center shadow-inner">
                  {/* Chicken SVG Icon */}
                  <svg viewBox="0 0 24 24" className="w-6 h-6 lg:w-8 lg:h-8 fill-white text-white">
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
