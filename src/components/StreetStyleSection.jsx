import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

const UrbanBackground = () => (
  <svg viewBox="0 0 1000 300" className="absolute bottom-0 left-0 w-full h-56 text-gray-100/60 fill-current pointer-events-none select-none z-0 hidden md:block">
    <path d="M 0 300 L 0 240 L 40 240 L 40 210 L 80 210 L 80 300 L 120 300 L 120 180 L 170 180 L 170 300 L 200 300 L 200 230 L 250 230 L 250 300 L 290 300 L 290 150 L 350 150 L 350 300 L 390 300 L 390 210 L 440 210 L 440 300 L 490 300 L 490 260 L 530 260 L 530 300 L 580 300 L 580 170 L 640 170 L 640 300 L 680 300 L 680 220 L 730 220 L 730 300 L 780 300 L 780 140 L 840 140 L 840 300 L 890 300 L 890 250 L 940 250 L 940 300 L 1000 300 L 1000 300 Z" />
    <line x1="0" y1="300" x2="1000" y2="300" stroke="#e5e7eb" strokeWidth="4" />
  </svg>
);

const StreetStyleSection = ({ slug, shop, plateRef }) => {
  const navigate = useNavigate();
  const sectionRef = useRef(null);

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
    <section ref={sectionRef} className="relative py-24 bg-white overflow-hidden z-10 border-b border-gray-100">
      {/* Urban skyline background */}
      <UrbanBackground />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 w-full">
        
        {/* Left Column: Info & Action */}
        <div className="lg:col-span-6 space-y-6 text-center lg:text-left flex flex-col justify-center">
          <div className="inline-flex self-center lg:self-start bg-[#E50914] text-white font-black text-xs px-5 py-2 uppercase tracking-widest rounded-lg shadow-md shadow-red-500/10">
            STREET STYLE
          </div>

          <ScrollReveal type="text">
            <div className="space-y-1">
              <h2 className="text-5xl md:text-6xl font-black text-[#111111] leading-none uppercase tracking-tight">
                BOLD FLAVOUR.
              </h2>
              <h2 className="text-5xl md:text-6xl font-black text-[#E50914] leading-none uppercase tracking-tight">
                STREET CRUNCH.
              </h2>
            </div>
          </ScrollReveal>

          <p className="text-gray-600 text-sm md:text-base font-bold leading-relaxed max-w-md mx-auto lg:mx-0">
            From the streets to your plate. Big crunch. Bigger attitude. Our street style recipe brings out authentic, mouth-watering heat in every bite.
          </p>

          <div className="pt-2">
            <button
              onClick={handleOrderNow}
              className="premium-btn bg-[#111111] hover:bg-black text-white font-black text-xs uppercase tracking-wider py-4 px-8 rounded-full shadow-lg shadow-black/10 flex items-center justify-center gap-2 mx-auto lg:mx-0"
            >
              Order Now
              <ArrowRight size={14} className="text-[#E50914] stroke-[3px]" />
            </button>
          </div>
        </div>

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
            <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full border-4 border-[#E50914] bg-black flex flex-col items-center justify-center shadow-[0_0_15px_rgba(229,9,20,0.6),inset_0_0_8px_rgba(229,9,20,0.4)] rotate-[-12deg]">
              <span className="text-[10px] font-black text-white tracking-widest block uppercase">FRIED</span>
              <span className="text-[10px] font-black text-[#E50914] tracking-widest block uppercase mt-0.5">FRESH</span>
            </div>
          </motion.div>

          {/* Large Premium Matte Black Ceramic Serving Platter */}
          <div className="absolute bottom-2 left-0 z-20 w-64 h-24 flex items-center justify-center">
            {/* Soft drop shadow under the plate */}
            <motion.div
              style={{ opacity: plateOpacity, scale: plateScale }}
              className="absolute bottom-[-8px] w-[95%] h-[80%] bg-black/40 filter blur-[8px] rounded-[50%] z-0"
            />
            {/* Plate Body */}
            <motion.div
              style={{ opacity: plateOpacity, scale: plateScale }}
              className="w-full h-full bg-gradient-to-b from-[#222] to-[#0f0f0f] rounded-[50%] border-t-2 border-l border-r border-gray-800 shadow-[0_15px_30px_rgba(0,0,0,0.55)] z-10 relative flex items-center justify-center"
            >
              {/* Inner Base */}
              <div className="w-[84%] h-[76%] bg-gradient-to-b from-[#111] to-[#060606] rounded-[50%] shadow-[inset_0_8px_16px_rgba(0,0,0,0.85)] border border-gray-950 flex items-center justify-center">
                {/* Gold Rim Detail */}
                <div className="w-[88%] h-[80%] rounded-[50%] border border-amber-500/10 flex items-center justify-center">
                  {/* Plating target for the chicken leg */}
                  <div 
                    ref={plateRef}
                    className="w-28 h-28 pointer-events-none opacity-0"
                  />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Serve Text Overlay */}
          <motion.div
            style={{ opacity: textOpacity, y: textY }}
            className="absolute -bottom-6 right-0 md:-right-8 z-30 text-right leading-none uppercase font-black text-lg md:text-2xl tracking-tighter text-[#E50914]"
          >
            <span className="block text-[#111111] text-[10px] font-bold tracking-widest mb-1.5 opacity-60">Serving Status</span>
            FRESHLY FRIED.
            <span className="block text-[#111111] mt-1 font-black">PERFECTLY SERVED.</span>
          </motion.div>

        </div>

      </div>
    </section>
  );
};

export default StreetStyleSection;
