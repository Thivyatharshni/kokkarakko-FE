import React, { useState, useEffect } from 'react';
import { QrCode, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ shop }) => {
  const [activeTab, setActiveTab] = useState('landing');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between w-full">
        
        {/* Left: Logo and Tagline - Anchored to Left */}
        <div className="flex-1 flex justify-start items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollToSection('top', 'landing')}>
            <img src="/logo.svg" alt="Logo" className="h-10 md:h-12 w-auto object-contain" />
            <div className="leading-tight">
              <span className={`block text-lg md:text-xl font-black ${textColorClass} tracking-tight uppercase`}>{brandMain}</span>
              <span className={`block text-[8px] md:text-[9px] font-bold ${subTextColorClass} uppercase tracking-widest`}>{brandSub || 'Fried Chicken'}</span>
            </div>
          </div>
        </div>

        {/* Center: Nav Links - Centered in Navbar */}
        <div className="flex-1 flex justify-center">
          <div className="hidden md:flex items-center gap-8 font-black text-sm uppercase tracking-wider">
            <button 
              onClick={() => scrollToSection('top', 'landing')}
              className={`nav-link relative py-2 ${textColorClass} hover:text-[#D90404] transition-colors ${activeTab === 'landing' ? 'active' : ''}`}
            >
              Landing Page
            </button>
            
            <button 
              onClick={() => navigate(`/menu/${shop?.slug || 'kokkarakko-fried-chicken'}`)}
              className={`nav-link relative py-2 ${textColorClass} hover:text-[#D90404] transition-colors ${activeTab === 'menu' ? 'active' : ''}`}
            >
              Menu
            </button>

            <button 
              onClick={() => navigate('/owner/login')}
              className={`nav-link relative py-2 ${textColorClass} hover:text-[#D90404] transition-colors ${activeTab === 'admin' ? 'active' : ''}`}
            >
              Admin
            </button>
          </div>
        </div>

        {/* Right: Scan QR CTA + Mobile Menu Button - Anchored to Right */}
        <div className="flex-1 flex justify-end items-center gap-3 md:gap-4">
          <button 
            onClick={() => scrollToSection('qr-section', 'landing')}
            className="premium-btn flex items-center gap-1.5 md:gap-2 bg-[#D90404] hover:bg-[#b80303] text-white font-black px-3.5 py-2 md:px-5 md:py-3 rounded-xl md:rounded-2xl text-[10px] md:text-xs uppercase tracking-widest shadow-lg shadow-red-500/20 whitespace-nowrap"
          >
            <QrCode size={14} className="md:w-4 md:h-4" />
            <span className="hidden sm:inline">Scan QR to Order</span>
            <span className="sm:hidden">Order</span>
          </button>

          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 rounded-lg ${textColorClass} hover:bg-gray-100/10 transition-colors`}
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

      </div>

      {/* Mobile/Tablet Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white/98 backdrop-blur-md border-b border-gray-100 shadow-xl py-4 px-6 flex flex-col gap-4 font-black text-sm uppercase tracking-wider text-[#111111] transition-all duration-300">
          <button 
            onClick={() => {
              scrollToSection('top', 'landing');
              setIsMobileMenuOpen(false);
            }}
            className="text-left py-2 hover:text-[#D90404] border-b border-gray-50 transition-colors"
          >
            Landing Page
          </button>
          
          <button 
            onClick={() => {
              navigate(`/menu/${shop?.slug || 'kokkarakko-fried-chicken'}`);
              setIsMobileMenuOpen(false);
            }}
            className="text-left py-2 hover:text-[#D90404] border-b border-gray-50 transition-colors"
          >
            Menu
          </button>

          <button 
            onClick={() => {
              navigate('/owner/login');
              setIsMobileMenuOpen(false);
            }}
            className="text-left py-2 hover:text-[#D90404] transition-colors"
          >
            Admin
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
