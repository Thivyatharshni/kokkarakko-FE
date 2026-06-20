import React from 'react';
import ScrollReveal from './ScrollReveal';

const SignaturePreparationSection = () => {
  return (
    <section className="relative min-h-screen py-24 overflow-hidden z-10 border-b border-gray-100 flex items-center"
      style={{ background: 'radial-gradient(ellipse at 20% 50%, #fff7f0 0%, #fef9f5 35%, #f9f9f9 70%, #f5f5f5 100%)' }}
    >
      {/* Subtle dot texture overlay */}
      <div className="absolute inset-0 opacity-[0.025] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:20px_20px]"></div>
      {/* Warm ambient glow behind left content */}
      <div className="absolute left-[-100px] top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(229,9,20,0.06) 0%, transparent 70%)' }}
      ></div>

      <div className="max-w-7xl mx-auto px-6 flex items-center w-full">
        
        {/* Text Content - full width now */}
        <div className="w-full max-w-2xl space-y-8 flex flex-col justify-center text-center lg:text-left">
          <div className="inline-flex self-center lg:self-start bg-[#E50914] text-white font-black text-xs px-5 py-2 uppercase tracking-widest rounded-lg shadow-md shadow-red-500/10">
            Signature Preparation
          </div>

          <ScrollReveal type="text">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-black text-[#111111] leading-none uppercase tracking-tight">
                HAND SELECTED.
              </h2>
              <h2 className="text-4xl md:text-5xl font-black text-[#E50914] leading-none uppercase tracking-tight">
                SEASONED TO PERFECTION.
              </h2>
              <h2 className="text-4xl md:text-5xl font-black text-[#111111] leading-none uppercase tracking-tight italic">
                CRAFTED FOR CRUNCH.
              </h2>
            </div>
          </ScrollReveal>

          <p className="text-gray-500 text-sm md:text-base font-bold leading-relaxed max-w-md mx-auto lg:mx-0">
            Every piece is inspected, hand-breaded in our secret spices, and fried to an absolute golden-brown perfection. Plated with precision. Served with passion.
          </p>

          {/* Premium Ingredient Badges */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-4">
            <span className="stagger-item stagger-delay-1 px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs font-black text-gray-700 uppercase tracking-wider">
              🌿 11 Secret Spices
            </span>
            <span className="stagger-item stagger-delay-2 px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs font-black text-gray-700 uppercase tracking-wider">
              🍗 Hand Breaded
            </span>
            <span className="stagger-item stagger-delay-3 px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs font-black text-gray-700 uppercase tracking-wider">
              🔥 100% Freshly Fried
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};

export default SignaturePreparationSection;
