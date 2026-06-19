import React, { useState, useEffect } from 'react';
import { QrCode } from 'lucide-react';
import tfcLogo from '../assets/logos/tfc-logo.png';

const Navbar = () => {
  const [activeTab, setActiveTab] = useState('landing');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id, tabName) => {
    setActiveTab(tabName);
    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const el = document.getElementById(id);
      if (el) {
        // Offset scroll for sticky navbar
        const navbarHeight = 80;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = el.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - navbarHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-md shadow-md py-3' : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        
        {/* Left: Logo and Tagline */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollToSection('top', 'landing')}>
          <img src={tfcLogo} alt="TFC Logo" className="h-12 w-auto object-contain" />
          <div className="leading-tight">
            <span className="block text-xl font-black text-[#111111] tracking-tight">TFC</span>
            <span className="block text-[9px] font-bold text-gray-500 uppercase tracking-widest">Fried Chicken ★★★</span>
          </div>
        </div>

        {/* Center: Nav Links */}
        <div className="hidden md:flex items-center gap-8 font-black text-sm uppercase tracking-wider">
          <button 
            onClick={() => scrollToSection('top', 'landing')}
            className={`relative py-2 text-[#111111] transition-colors hover:text-[#E50914]`}
          >
            Landing Page
            {activeTab === 'landing' && (
              <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#E50914] rounded-full" />
            )}
          </button>
          
          <button 
            onClick={() => scrollToSection('bestsellers', 'menu')}
            className={`relative py-2 text-[#111111] transition-colors hover:text-[#E50914]`}
          >
            Menu
            {activeTab === 'menu' && (
              <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#E50914] rounded-full" />
            )}
          </button>
        </div>

        {/* Right: Scan QR CTA */}
        <div>
          <button 
            onClick={() => scrollToSection('qr-section', 'landing')}
            className="flex items-center gap-2 bg-[#E50914] hover:bg-[#c40710] text-white font-black px-5 py-3 rounded-2xl text-xs uppercase tracking-widest shadow-lg shadow-red-500/20 active:scale-95 transition-all duration-150"
          >
            <QrCode size={16} />
            Scan QR to Order
          </button>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
