import React from 'react';
import { Facebook, Instagram, PhoneCall } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#E50914] text-white py-12 border-t border-red-500/20">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-6">
        
        {/* Social Icons Row */}
        <div className="flex items-center gap-6">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noreferrer"
            className="hover:scale-125 hover:text-red-100 transition-all duration-200"
            aria-label="Facebook"
          >
            <Facebook size={22} fill="currentColor" stroke="none" />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="hover:scale-125 hover:text-red-100 transition-all duration-200"
            aria-label="Instagram"
          >
            <Instagram size={22} />
          </a>
          <a
            href="https://wa.me/"
            target="_blank"
            rel="noreferrer"
            className="hover:scale-125 hover:text-red-100 transition-all duration-200"
            aria-label="WhatsApp"
          >
            {/* PhoneCall / WhatsApp replacement */}
            <PhoneCall size={22} />
          </a>
        </div>

        {/* Copyright Text */}
        <div className="text-center text-xs md:text-sm font-semibold tracking-wider text-red-100/80 uppercase">
          &copy; 2030 TFC Fried Chicken. All Rights Reserved.
        </div>

      </div>
    </footer>
  );
};

export default Footer;
