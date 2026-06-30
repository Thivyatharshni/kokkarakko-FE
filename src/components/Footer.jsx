import React from 'react';
import { Facebook, Instagram, PhoneCall } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = ({ shop }) => {
  return (
    <footer className="bg-[#D90404] text-white py-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-6">
        
        {/* Social Icons Row */}
        <div className="flex items-center gap-6">
          <motion.a
            href="https://facebook.com"
            target="_blank"
            rel="noreferrer"
            whileTap={{ scale: 0.9 }}
            className="hover:scale-125 hover:text-red-100 transition-all duration-200"
            aria-label="Facebook"
          >
            <Facebook size={22} fill="currentColor" stroke="none" />
          </motion.a>
          <motion.a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            whileTap={{ scale: 0.9 }}
            className="hover:scale-125 hover:text-red-100 transition-all duration-200"
            aria-label="Instagram"
          >
            <Instagram size={22} />
          </motion.a>
          <motion.a
            href="https://wa.me/"
            target="_blank"
            rel="noreferrer"
            whileTap={{ scale: 0.9 }}
            className="hover:scale-125 hover:text-red-100 transition-all duration-200"
            aria-label="WhatsApp"
          >
            <PhoneCall size={22} />
          </motion.a>
        </div>

        {/* Copyright Text */}
        <div className="text-center text-xs md:text-sm font-semibold tracking-wider text-red-100/80 uppercase">
          &copy; 2026 {shop?.shopName || 'Kokkarakko Crispy Chicken'}. All Rights Reserved.
        </div>

      </div>
    </footer>
  );
};

export default Footer;
