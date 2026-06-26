import React from 'react';
import { motion } from 'framer-motion';

const HeroVisualCard = ({ bucketRef, originRef }) => {
  return (
    <>
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
          className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 lg:bottom-4 lg:right-4 z-20 bg-white rounded-full p-0.5 sm:p-1 shadow-2xl border border-gray-100 hover:scale-110 transition-transform duration-200 cursor-pointer"
        >
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 lg:w-28 lg:h-28 flex items-center justify-center">
            
            {/* SVG Text Rotation */}
            <svg viewBox="0 0 100 100" className="w-full h-full animate-[spin_12s_linear_infinite] select-none">
              <path
                id="circlePath"
                d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                fill="none"
              />
              <text fontSize="8.2" fontWeight="900" fill="#111111" letterSpacing="1">
                <textPath href="#circlePath">
                  100% REAL CHICKEN • 100% SATISFACTION •
                </textPath>
              </text>
            </svg>

            {/* Badge Center Red Circle + Chicken Icon */}
            <div className="absolute inset-2 sm:inset-3 lg:inset-4 bg-[#D90404] rounded-full flex items-center justify-center shadow-inner">
              {/* Chicken SVG Icon */}
              <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 fill-white text-white">
                <path d="M12 2A10 10 0 0 0 2 12c0 3 .5 6 2 8l2-2v-2c2-1 3-3 4-5 1-2 2-3 4-3 1 0 2 .5 3 1 .5.5.8 1.2.8 2 0 1.2-.8 2.2-2 2.6V15h2v-2h2v-2c0-4.4-3.6-8-8-8zm-2 10a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
              </svg>
            </div>

          </div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default HeroVisualCard;
