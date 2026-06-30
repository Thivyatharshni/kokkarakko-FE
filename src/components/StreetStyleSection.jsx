import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const badgeVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { duration: 0.5, ease: 'easeOut' }
  }
};

const headingLineNormalVariants = (index) => ({
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.15 + index * 0.15,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1]
    }
  }
});

const headingLineEmphasisVariants = (index) => ({
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.15 + index * 0.15,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1]
    }
  }
});

const descriptionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.85,
      duration: 0.5,
      ease: 'easeOut'
    }
  }
};

const ctaVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      delay: 1.15,
      duration: 0.5,
      ease: 'easeOut'
    }
  }
};

const UrbanBackground = () => (
  <svg viewBox="0 0 1000 300" className="absolute bottom-0 left-0 w-full h-56 text-gray-100/60 fill-current pointer-events-none select-none z-0 hidden md:block">
    <path d="M 0 300 L 0 240 L 40 240 L 40 210 L 80 210 L 80 300 L 120 300 L 120 180 L 170 180 L 170 300 L 200 300 L 200 230 L 250 230 L 250 300 L 290 300 L 290 150 L 350 150 L 350 300 L 390 300 L 390 210 L 440 210 L 440 300 L 490 300 L 490 260 L 530 260 L 530 300 L 580 300 L 580 170 L 640 170 L 640 300 L 680 300 L 680 220 L 730 220 L 730 300 L 780 300 L 780 140 L 840 140 L 840 300 L 890 300 L 890 250 L 940 250 L 940 300 L 1000 300 L 1000 300 Z" />
    <line x1="0" y1="300" x2="1000" y2="300" stroke="#e5e7eb" strokeWidth="4" />
  </svg>
);

const StreetStyleSection = ({ slug, shop, plateRef }) => {
  const navigate = useNavigate();
  const sectionRef = useRef(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 30, stiffness: 100 };
  const parallaxX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), springConfig);
  const parallaxY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-8, 8]), springConfig);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xVal = (e.clientX - rect.left) / rect.width - 0.5;
    const yVal = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(xVal);
    mouseY.set(yVal);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Smooth plate fade and scale based on scroll position
  const plateOpacity = useTransform(scrollYProgress, [0.15, 0.35], [0, 1]);
  const plateScale = useTransform(scrollYProgress, [0.15, 0.35], [0.8, 1]);

  // Serve text fade and slide up after landing
  const textOpacity = useTransform(scrollYProgress, [0.38, 0.48], [0, 1]);
  const textY = useTransform(scrollYProgress, [0.38, 0.48], [15, 0]);

  const handleOrderNow = () => {
    if (slug) {
      navigate(`/menu/${slug}`);
    } else {
      const el = document.getElementById('bestsellers');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="street-style"
      ref={sectionRef} 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative py-12 sm:py-24 bg-white overflow-hidden z-10 border-b border-gray-100"
    >
      {/* Urban skyline background */}
      <UrbanBackground />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 w-full py-4 lg:py-12">
        
        {/* Left Column: Info & Action */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          style={{ x: parallaxX, y: parallaxY }}
          className="lg:col-span-6 space-y-6 text-center lg:text-left flex flex-col justify-center"
        >
          <motion.div 
            variants={badgeVariants}
            className="inline-flex self-center lg:self-start bg-[#D90404] text-white font-black text-xs px-5 py-2 uppercase tracking-widest rounded-lg shadow-md shadow-[#D90404]/10"
          >
            STREET STYLE
          </motion.div>

          <div className="space-y-1">
            <motion.h2 
              variants={headingLineNormalVariants(0)}
              whileHover={{ x: 5, color: '#000000' }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="text-3xl md:text-6xl font-black text-[#111111] leading-none uppercase tracking-tight cursor-pointer origin-left transition-[letter-spacing] duration-300 hover:tracking-wide"
            >
              BOLD FLAVOUR.
            </motion.h2>
            <motion.h2 
              variants={headingLineEmphasisVariants(1)}
              whileHover={{ x: 5, color: '#ff1a1a' }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="text-3xl md:text-6xl font-black text-[#D90404] leading-none uppercase tracking-tight cursor-pointer origin-left transition-[letter-spacing] duration-300 hover:tracking-wide"
            >
              STREET CRUNCH.
            </motion.h2>
          </div>

          <motion.p 
            variants={descriptionVariants}
            className="text-gray-600 text-sm md:text-base font-bold leading-relaxed max-w-md mx-auto lg:mx-0"
          >
            From the streets to your plate. Big crunch. Bigger attitude. Our street style recipe brings out authentic, mouth-watering heat in every bite.
          </motion.p>

          <div className="pt-2">
            <motion.button
              variants={ctaVariants}
              whileHover={{ y: -3, boxShadow: '0 15px 30px rgba(0,0,0,0.15)' }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              onClick={handleOrderNow}
              className="premium-btn bg-[#111111] hover:bg-black text-white font-black text-xs uppercase tracking-wider py-4 px-8 rounded-full flex items-center justify-center gap-2 mx-auto lg:mx-0 shadow-lg shadow-black/10"
            >
              Order Now
              <ArrowRight size={14} className="text-[#D90404] stroke-[3px]" />
            </motion.button>
          </div>
        </motion.div>

        {/* Right Column: Cart, Plate & Serve Text */}
        <div className="lg:col-span-6 relative flex justify-center items-center py-10">
          {/* Faded background text */}
          <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 select-none pointer-events-none opacity-5 font-black text-[90px] md:text-[140px] text-gray-900 leading-none uppercase tracking-tighter italic z-0 whitespace-nowrap">
            EAT. DRINK. ENJOY.
          </div>

          {/* Cart Image Container */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, type: 'spring', stiffness: 60 }}
            className="relative z-10 max-w-sm w-full drop-shadow-[0_15px_30px_rgba(0,0,0,0.08)] select-none"
          >
            <img
              src="/street-cart.png"
              alt="Street Food Cart"
              className="w-full h-auto object-contain"
            />
            {/* Glowing neon red sign */}
            <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full border-4 border-[#D90404] bg-black flex flex-col items-center justify-center shadow-[0_0_15px_rgba(217,4,4,0.6),inset_0_0_8px_rgba(217,4,4,0.4)] rotate-[-12deg]">
              <span className="text-[10px] font-black text-white tracking-widest block uppercase">FRIED</span>
              <span className="text-[10px] font-black text-[#D90404] tracking-widest block uppercase mt-0.5">FRESH</span>
            </div>
          </motion.div>

          {/* Large Premium Matte Black Ceramic Serving Platter */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 lg:left-0 lg:translate-x-0 z-20 w-52 sm:w-64 h-20 sm:h-24 flex items-center justify-center">
            {/* Soft drop shadow under the plate */}
            <motion.div
              style={{ opacity: plateOpacity, scale: plateScale }}
              className="absolute bottom-[-8px] w-[95%] h-[80%] bg-black/40 filter blur-[8px] rounded-[50%] z-0"
            />
            {/* Plate Body (Matte Red Theme Ceramic Platter) */}
            <motion.div
              style={{ opacity: plateOpacity, scale: plateScale }}
              className="w-full h-full bg-gradient-to-b from-[#E31E24] to-[#5c0306] rounded-[50%] border-t-2 border-l border-r border-red-500/40 shadow-[0_15px_30px_rgba(0,0,0,0.55)] z-10 relative flex items-center justify-center"
            >
              {/* Inner Base */}
              <div className="w-[84%] h-[76%] bg-gradient-to-b from-[#a8050b] to-[#3a0103] rounded-[50%] shadow-[inset_0_8px_16px_rgba(0,0,0,0.85)] border border-red-950 flex items-center justify-center">
                {/* Silver/Red Rim Detail */}
                <div className="w-[88%] h-[80%] rounded-[50%] border border-red-400/20 flex items-center justify-center relative">
                  {/* Plating target for the chicken leg */}
                  <div 
                    ref={plateRef}
                    className="w-24 h-24 sm:w-28 sm:h-28 pointer-events-none opacity-0 -translate-y-3.5"
                  />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Serve Text Overlay */}
          <motion.div
            style={{ opacity: textOpacity, y: textY }}
            className="absolute -bottom-8 right-4 sm:right-6 lg:-right-8 z-30 text-right leading-none uppercase font-black text-sm sm:text-base md:text-2xl tracking-tighter text-[#D90404]"
          >
            <span className="block text-[#111111] text-[9px] sm:text-[10px] font-bold tracking-widest mb-1 opacity-60">Serving Status</span>
            FRESHLY FRIED.
            <span className="block text-[#111111] mt-0.5 font-black">PERFECTLY SERVED.</span>
          </motion.div>

        </div>

      </div>
    </section>
  );
};

export default StreetStyleSection;
