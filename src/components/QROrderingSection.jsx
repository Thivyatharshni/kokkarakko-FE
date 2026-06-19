import React from 'react';
import { motion } from 'framer-motion';
import QRCode from 'react-qr-code';
import { QrCode, ClipboardList, Send, ArrowRight } from 'lucide-react';

const QROrderingSection = ({ slug }) => {
  const fullShopUrl = `${window.location.origin}/menu/${slug || 'kokkarakko-fried-chicken'}`;

  const steps = [
    {
      icon: <QrCode size={20} className="text-white" />,
      label: "SCAN QR CODE"
    },
    {
      icon: <ClipboardList size={20} className="text-white" />,
      label: "CHOOSE ITEMS"
    },
    {
      icon: <Send size={20} className="text-white" />,
      label: "PLACE ORDER"
    }
  ];

  return (
    <section id="qr-section" className="relative py-20 bg-gradient-to-b from-[#181818] via-[#111111] to-[#0b0b0b] overflow-hidden text-white">
      
      {/* Street Light Background Glow */}
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-yellow-500/5 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-[#E50914]/10 rounded-full blur-[100px] pointer-events-none z-0"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
        >
          
          {/* Left Column: QR Code & Ordering Flow */}
          <div className="lg:col-span-7 space-y-8 flex flex-col justify-center text-center lg:text-left">
            
            {/* Header */}
            <div className="space-y-3">
              <h2 className="text-5xl md:text-6xl font-black tracking-tight uppercase leading-none">
                SCAN. <span className="text-[#E50914]">ORDER.</span> ENJOY.
              </h2>
              <p className="text-gray-400 text-sm md:text-base font-semibold max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Scan the QR code to view our digital menu and place your order instantly. No app download required!
              </p>
            </div>

            {/* QR Code Display & direct link wrapper */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-8">
              
              {/* QR Code Container */}
              <div className="bg-white p-5 rounded-3xl shadow-[0_15px_30px_rgba(0,0,0,0.5)] border-4 border-white flex flex-col items-center">
                <div className="bg-white p-1 rounded-2xl">
                  <QRCode
                    value={fullShopUrl}
                    size={150}
                    level="H"
                    fgColor="#111111"
                    bgColor="#ffffff"
                  />
                </div>
                {/* Micro branding under QR */}
                <div className="mt-3 leading-none text-center">
                  <span className="text-[10px] font-black text-[#111111] uppercase tracking-widest block">TFC ORDER</span>
                  <span className="text-[7px] font-bold text-gray-400 uppercase tracking-widest block mt-0.5">Scan to Order</span>
                </div>
              </div>

              {/* URL Direct Access Info */}
              <div className="space-y-3 max-w-xs text-center sm:text-left">
                <div className="inline-block bg-[#E50914]/15 border border-[#E50914]/30 rounded-xl px-3 py-1 text-[#E50914] text-xs font-black uppercase tracking-wider">
                  Direct Order Link
                </div>
                <p className="text-xs text-gray-400 font-semibold leading-relaxed">
                  Or click this direct link if you're browsing on your phone:
                </p>
                <a 
                  href={fullShopUrl} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="block text-[#E50914] hover:underline font-bold text-sm truncate"
                >
                  {fullShopUrl}
                </a>
              </div>

            </div>

            {/* Step-by-Step Flow */}
            <div className="pt-6 border-t border-white/5">
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-6">
                {steps.map((step, idx) => (
                  <React.Fragment key={idx}>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#E50914] flex items-center justify-center shadow-lg shadow-red-500/25">
                        {step.icon}
                      </div>
                      <span className="text-[11px] font-black tracking-widest text-gray-200">
                        {step.label}
                      </span>
                    </div>

                    {idx < steps.length - 1 && (
                      <ArrowRight size={16} className="text-gray-600 hidden sm:block" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Cart Illustration & Neon Sign */}
          <div className="lg:col-span-5 relative flex justify-center items-center py-8">
            
            {/* Street Cart Illustration */}
            <div className="relative max-w-sm w-full select-none">
              <img
                src="/street-cart.png"
                alt="TFC Fried Chicken Cart"
                className="w-full h-auto object-contain rounded-3xl drop-shadow-[0_10px_30px_rgba(229,9,20,0.15)]"
              />

              {/* Glowing Red Neon Sign */}
              <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full border-4 border-[#E50914] bg-black/80 flex flex-col items-center justify-center shadow-[0_0_20px_rgba(229,9,20,0.8),inset_0_0_10px_rgba(229,9,20,0.5)] rotate-12 animate-pulse select-none">
                <span className="text-[10px] font-black text-white tracking-widest block uppercase">HOT</span>
                <span className="text-[8px] font-bold text-[#E50914] tracking-widest block uppercase my-0.5">&</span>
                <span className="text-[9px] font-black text-white tracking-widest block uppercase">CRISPY</span>
              </div>
            </div>

          </div>

        </motion.div>
      </div>
    </section>
  );
};

export default QROrderingSection;
