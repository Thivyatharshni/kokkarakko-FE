import React, { useState, useEffect } from 'react';
import { QrCode } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ shop }) => {
  const [activeTab, setActiveTab] = useState('landing');
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    handleScroll();
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

  const getBrandText = () => {
    if (!shop?.shopName) return { main: 'Kokkarakko', sub: 'Fried Chicken ★★★' };
    const words = shop.shopName.split(' ');
    const main = words[0];
    const sub = words.slice(1).join(' ');
    return { main, sub };
  };

  const { main: brandMain, sub: brandSub } = getBrandText();

  const textColorClass = isScrolled ? 'text-[#111111]' : 'text-white';
  const subTextColorClass = isScrolled ? 'text-gray-500' : 'text-gray-300';

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-md shadow-md py-3 border-b border-gray-100' : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        
        {/* Left: Logo and Tagline */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollToSection('top', 'landing')}>
          <img src="/logo.svg" alt="Logo" className="h-12 w-auto object-contain" />
          <div className="leading-tight">
            <span className={`block text-xl font-black ${textColorClass} tracking-tight uppercase`}>{brandMain}</span>
            <span className={`block text-[9px] font-bold ${subTextColorClass} uppercase tracking-widest`}>{brandSub || 'Fried Chicken'}</span>
          </div>
        </div>

        {/* Center: Nav Links */}
        <div className="hidden md:flex items-center gap-8 font-black text-sm uppercase tracking-wider">
          <button 
            onClick={() => scrollToSection('top', 'landing')}
            className={`nav-link relative py-2 ${textColorClass} hover:text-[#D90404] transition-colors ${activeTab === 'landing' ? 'active' : ''}`}
          >
            Landing Page
          </button>
          
          <button 
            onClick={() => navigate(`/menu/${shop?.slug || 'kokkarakko-fried-chicken'}`)}
            className={`nav-link relative py-2 text-[#111111] hover:text-[#E50914] transition-colors ${activeTab === 'menu' ? 'active' : ''}`}
          >
            Menu
          </button>
        </div>

        {/* Right: Scan QR CTA */}
        <div>
          <button 
            onClick={() => scrollToSection('qr-section', 'landing')}
            className="premium-btn flex items-center gap-2 bg-[#D90404] hover:bg-[#b80303] text-white font-black px-5 py-3 rounded-2xl text-xs uppercase tracking-widest shadow-lg shadow-red-500/20"
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
