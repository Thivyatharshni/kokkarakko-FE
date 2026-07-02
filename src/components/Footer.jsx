import React from 'react';
import { Facebook, Instagram } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';

const Footer = ({ shop }) => {
  const { getCartCount } = useCart();
  const cartCount = getCartCount();
  const hasItems = cartCount > 0;

  return (
    <footer className={`bg-[#D90404] text-white pt-12 border-t border-white/10 transition-all duration-300 ${
      hasItems 
        ? 'pb-[calc(7.5rem+env(safe-area-inset-bottom))] sm:pb-28' 
        : 'pb-12'
    }`}>
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
            href="https://www.instagram.com/__kokkarakoo_crispy_chicken__?utm_source=qr"
            target="_blank"
            rel="noopener noreferrer"
            whileTap={{ scale: 0.9 }}
            className="hover:scale-125 hover:text-red-100 transition-all duration-200"
            aria-label="Instagram"
          >
            <Instagram size={22} />
          </motion.a>
          <motion.a
            href="https://wa.me/919750507772"
            target="_blank"
            rel="noreferrer"
            whileTap={{ scale: 0.9 }}
            className="hover:scale-125 hover:text-red-100 transition-all duration-200"
            aria-label="WhatsApp"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={22}
              height={22}
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.458L0 24zm6.59-4.846c1.62.962 3.238 1.414 4.882 1.415 5.55 0 10.068-4.512 10.071-10.062.002-2.69-1.047-5.216-2.953-7.124C16.536 1.475 14.02 .425 11.332.425 5.782.425 1.266 4.94 1.263 10.493c-.001 1.705.447 3.37 1.299 4.884l-.999 3.649 3.733-.979l.354.211zM17.48 14.51c-.32-.16-1.89-.93-2.18-1.04-.29-.11-.51-.16-.72.16-.21.32-.82 1.04-1.01 1.25-.19.21-.39.24-.71.08-.32-.16-1.37-.5-2.61-1.61-.96-.86-1.61-1.92-1.8-2.24-.19-.32-.02-.49.14-.65.14-.14.32-.37.48-.56.16-.18.21-.31.32-.51.11-.21.05-.39-.03-.56-.08-.17-.72-1.74-.99-2.39-.26-.64-.52-.55-.72-.56l-.61-.01c-.21 0-.55.08-.84.4-.29.32-1.12 1.1-1.12 2.68 0 1.58 1.15 3.11 1.31 3.32.16.21 2.26 3.45 5.48 4.84.77.33 1.37.53 1.84.68.77.24 1.48.21 2.04.13.62-.09 1.89-.77 2.15-1.47.26-.71.26-1.31.19-1.43-.07-.12-.27-.22-.6-.38z" />
            </svg>
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
