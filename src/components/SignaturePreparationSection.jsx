import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Leaf, Hand, Flame } from 'lucide-react';
import HeroVisualCard from './HeroVisualCard';

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
      delay: 1.0,
      duration: 0.5,
      ease: 'easeOut'
    }
  }
};

const pillVariants = {
  hidden: { opacity: 0, y: 15, scale: 0.9 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: 1.35 + index * 0.1,
      duration: 0.5,
      ease: 'easeOut'
    }
  })
};

const SignaturePreparationSection = ({ bucketRef, originRef }) => {
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

  return (
    <section 
      id="signature-prep"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-[50vh] lg:min-h-screen py-12 sm:py-24 overflow-hidden z-10 border-b border-gray-100 flex items-center"
      style={{ background: 'radial-gradient(ellipse at 20% 50%, #fff7f0 0%, #fef9f5 35%, #f9f9f9 70%, #f5f5f5 100%)' }}
    >
      {/* Subtle dot texture overlay */}
      <div className="absolute inset-0 opacity-[0.025] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:20px_20px]"></div>
      {/* Warm ambient glow behind left content */}
      <div className="absolute left-[-100px] top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(217,4,4,0.06) 0%, transparent 70%)' }}
      ></div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center relative z-10 w-full">
        
        {/* Text Content - left side */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          style={{ x: parallaxX, y: parallaxY }}
          className="lg:col-span-6 space-y-8 flex flex-col justify-center text-center lg:text-left"
        >
          <motion.div 
            variants={badgeVariants}
            className="inline-flex self-center lg:self-start bg-[#D90404] text-white font-black text-xs px-5 py-2 uppercase tracking-widest rounded-lg shadow-md shadow-[#D90404]/10"
          >
            Signature Preparation
          </motion.div>

          <div className="space-y-4">
            <motion.h2 
              variants={headingLineNormalVariants(0)}
              whileHover={{ x: 5, color: '#000000' }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="text-2xl md:text-5xl font-black text-[#111111] leading-none uppercase tracking-tight cursor-pointer origin-left transition-[letter-spacing] duration-300 hover:tracking-wide"
            >
              HAND SELECTED.
            </motion.h2>
            <motion.h2 
              variants={headingLineEmphasisVariants(1)}
              whileHover={{ x: 5, color: '#ff1a1a' }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="text-2xl md:text-5xl font-black text-[#D90404] leading-none uppercase tracking-tight cursor-pointer origin-left transition-[letter-spacing] duration-300 hover:tracking-wide"
            >
              SEASONED TO PERFECTION.
            </motion.h2>
            <motion.h2 
              variants={headingLineNormalVariants(2)}
              whileHover={{ x: 5, color: '#000000' }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="text-2xl md:text-5xl font-black text-[#111111] leading-none uppercase tracking-tight italic cursor-pointer origin-left transition-[letter-spacing] duration-300 hover:tracking-wide"
            >
              CRAFTED FOR CRUNCH.
            </motion.h2>
          </div>

          <motion.p 
            variants={descriptionVariants}
            className="text-gray-500 text-sm md:text-base font-bold leading-relaxed max-w-md mx-auto lg:mx-0"
          >
            Every piece is inspected, hand-breaded in our secret spices, and fried to an absolute golden-brown perfection. Plated with precision. Served with passion.
          </motion.p>

          {/* Premium Ingredient Badges */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-4">
            <motion.span 
              custom={0}
              variants={pillVariants}
              whileHover={{ y: -2, scale: 1.02 }}
              className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs font-black text-gray-700 uppercase tracking-wider cursor-default shadow-sm hover:shadow"
            >
              <Leaf size={14} className="text-emerald-500 shrink-0" />
              11 Secret Spices
            </motion.span>
            <motion.span 
              custom={1}
              variants={pillVariants}
              whileHover={{ y: -2, scale: 1.02 }}
              className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs font-black text-gray-700 uppercase tracking-wider cursor-default shadow-sm hover:shadow"
            >
              <Hand size={14} className="text-amber-500 shrink-0" />
              Hand Breaded
            </motion.span>
            <motion.span 
              custom={2}
              variants={pillVariants}
              whileHover={{ y: -2, scale: 1.02 }}
              className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs font-black text-gray-700 uppercase tracking-wider cursor-default shadow-sm hover:shadow"
            >
              <Flame size={14} className="text-[#D90404] shrink-0" />
              100% Freshly Fried
            </motion.span>
          </div>
        </motion.div>

        {/* Right Column: Bucket Image & Badges */}
        <div className="lg:col-span-6 relative flex justify-center items-center py-4 lg:py-12">
          <HeroVisualCard bucketRef={bucketRef} originRef={originRef} />
        </div>

      </div>
    </section>
  );
};

export default SignaturePreparationSection;
