import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import heroVideo from '../assets/animations/herosection video.mp4';

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
    <section id="hero" className="relative h-screen min-h-[500px] lg:min-h-0 flex items-center hero-premium-bg overflow-hidden text-white">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-70"
      >
        <source src={heroVideo} type="video/mp4" />
      </video>
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
        
        {/* Left Column: Typography & Text Wrapper - Premium Center-Left Composition */}
        <div className="lg:col-span-6 xl:col-span-6 lg:col-start-3 text-center lg:text-left flex flex-col justify-center items-center lg:items-start z-20 pt-28 sm:pt-32 md:pt-36 lg:pt-28 space-y-6 md:space-y-8 max-w-[580px] w-full">
          
          {/* Red Brush Banner / Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex relative bg-[#D90404] text-white font-black text-[10px] md:text-xs px-5 py-2 uppercase tracking-widest rounded-r-full rounded-l-md shadow-md"
            style={{
              clipPath: 'polygon(0% 0%, 95% 0%, 100% 50%, 95% 100%, 0% 100%, 3% 50%)'
            }}
          >
            HOT. FRESH. ALWAYS FRIED TO PERFECTION.
          </motion.div>
 
           {/* Large Typography: CRISPY JUICY IRRESISTIBLE! */}
           <div className="space-y-1 lg:space-y-2 select-none w-full">
             <motion.h1 
               initial={{ opacity: 0, y: 25, filter: 'blur(8px)' }}
               animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
               transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
               className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter text-white leading-none uppercase [text-shadow:_0_4px_16px_rgba(0,0,0,0.6)]"
             >
               CRISPY
             </motion.h1>
             <motion.h1 
               initial={{ opacity: 0, y: 25, filter: 'blur(8px)' }}
               animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
               transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
               className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter text-[#D90404] leading-none uppercase [text-shadow:_0_4px_16px_rgba(0,0,0,0.6)]"
             >
               JUICY
             </motion.h1>
             <motion.h1 
               initial={{ opacity: 0, y: 25, filter: 'blur(8px)' }}
               animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
               transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
               className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-none uppercase italic [text-shadow:_0_4px_16px_rgba(0,0,0,0.6)]"
             >
               IRRESISTIBLE!
             </motion.h1>
           </div>
 
           {/* Description Row / Supporting text */}
           <motion.p
             initial={{ opacity: 0, y: 15, filter: 'blur(4px)' }}
             animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
             transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
             className="text-xs md:text-sm font-bold text-gray-200 flex flex-wrap justify-center lg:justify-start items-center gap-x-2 gap-y-1 leading-relaxed [text-shadow:_0_2px_8px_rgba(0,0,0,0.6)]"
           >
             <span>100% Real Chicken</span>
             <span className="text-gray-500">|</span>
             <span>Perfectly Seasoned</span>
             <span className="text-gray-500">|</span>
             <span>Fried Fresh</span>
             <span className="text-gray-500">|</span>
             <span>Made To Order</span>
           </motion.p>
 
           {/* Primary CTA */}
           <motion.div
             initial={{ opacity: 0, y: 15, filter: 'blur(4px)' }}
             animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
             transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
             className="pt-2"
           >
            <button
              onClick={handleExploreMenu}
              className="premium-btn group bg-[#D90404] hover:bg-[#b80303] text-white font-black text-xs lg:text-sm uppercase tracking-wider py-3.5 lg:py-4.5 px-6 lg:px-8 rounded-full shadow-xl shadow-[#D90404]/30 flex items-center justify-center gap-3"
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
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-3 lg:gap-4 pt-4 lg:pt-5 border-t border-white/10 w-full"
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
            
            <div className="text-center lg:text-left leading-none [text-shadow:_0_2px_8px_rgba(0,0,0,0.6)]">
              <div className="flex justify-center lg:justify-start text-yellow-500 mb-1">
                <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
              </div>
              <p className="text-[10px] lg:text-xs font-black text-gray-300 uppercase tracking-wider">
                4.9k+ Happy Customers
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
