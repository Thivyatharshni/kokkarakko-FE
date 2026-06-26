import React from 'react';
import { motion } from 'framer-motion';
import { Flame, ShieldCheck, Clock, Award } from 'lucide-react';

const FeaturesStrip = () => {
  const features = [
    {
      icon: <Award size={36} className="text-white" />,
      title: "100% REAL CHICKEN",
      desc1: "No Preservatives",
      desc2: "No Compromise"
    },
    {
      icon: <Flame size={36} className="text-white" />,
      title: "FRESHLY FRIED",
      desc1: "Made to Order",
      desc2: "Just for You"
    },
    {
      icon: <ShieldCheck size={36} className="text-white" />,
      title: "HYGIENIC & SAFE",
      desc1: "Clean & Quality",
      desc2: "Assured"
    },
    {
      icon: <Clock size={36} className="text-white" />,
      title: "FAST SERVICE",
      desc1: "Hot & Crispy",
      desc2: "Always"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 relative z-20 -mt-8 md:-mt-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-[#D90404] rounded-3xl shadow-xl shadow-red-950/15 p-8 md:p-10 border border-white/10"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-8 md:gap-y-0 lg:divide-x lg:divide-white/20 divide-white/10">
          
          {features.map((feature, idx) => (
            <div 
              key={idx} 
              className={`flex flex-col items-center text-center p-4 md:p-6 lg:p-0 ${
                idx > 0 ? 'pt-8 md:pt-6 lg:pt-0 lg:pl-6 border-t divide-white/10 md:border-t-0' : ''
              }`}
            >
              {/* Icon Container with Circular Border */}
              <div className="w-16 h-16 rounded-full border-2 border-white/80 flex items-center justify-center mb-4 bg-white/5 shadow-inner hover:scale-110 transition-transform duration-200">
                {feature.icon}
              </div>

              {/* Title */}
              <h3 className="text-white font-black text-sm md:text-base tracking-widest uppercase mb-1">
                {feature.title}
              </h3>

              {/* Description Lines */}
              <p className="text-red-100 text-xs font-bold leading-normal">
                {feature.desc1}
              </p>
              <p className="text-red-100 text-xs font-bold leading-normal">
                {feature.desc2}
              </p>
            </div>
          ))}

        </div>
      </motion.div>
    </div>
  );
};

export default FeaturesStrip;
