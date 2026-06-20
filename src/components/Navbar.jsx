import React, { useState, useEffect } from 'react';
import { QrCode, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import bgImage from '../assets/images/bg.png';

const Navbar = ({ shop }) => {
  const [activeTab, setActiveTab] = useState('landing');
  const [activeTheme, setActiveTheme] = useState('transparent');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const sectionIds = ['hero', 'signature-prep', 'street-style', 'burger-assembly', 'qr-section'];
    
    const observerOptions = {
      root: null,
      rootMargin: '-80px 0px -50% 0px', // Detects the active section covering the upper viewport area
      threshold: 0
    };

    const handleIntersect = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          if (id === 'hero') {
            setActiveTheme('transparent');
          } else if (id === 'signature-prep' || id === 'street-style') {
            setActiveTheme('light');
          } else if (id === 'burger-assembly') {
            setActiveTheme('dark-slate');
          } else if (id === 'qr-section') {
            setActiveTheme('smoky');
          }
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);

    sectionIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    const handleScroll = () => {
      if (window.scrollY < 20) {
        setActiveTheme('transparent');
      }
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
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

  // Dynamic text color classes based on active theme with transition support
  const textColorClass = activeTheme === 'light' ? 'text-[#111111]' : 'text-white';
  const subTextColorClass = activeTheme === 'light' ? 'text-gray-500' : 'text-gray-300';
  
  // Mobile drawer container classes based on active theme
  let drawerBgClass = 'bg-[#070707]/95 backdrop-blur-md border-white/5 text-white';
  if (activeTheme === 'light') {
    drawerBgClass = 'bg-white/98 border-gray-100 text-[#111111]';
  } else if (activeTheme === 'dark-slate') {
    drawerBgClass = 'bg-[#0d0d0d]/98 border-white/5 text-white';
  } else if (activeTheme === 'smoky') {
    drawerBgClass = 'bg-[#141414]/98 border-red-950/20 text-white';
  }

  // Padding adjustment based on transparent vs. sticky state
  const paddingClass = activeTheme === 'transparent' ? 'py-5' : 'py-3';

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out ${paddingClass}`}>
      
      {/* BACKGROUND LAYERS WITH SMOOTH OPACITY TRANSITIONS */}
      
      {/* 1. Light Theme Layer */}
      <div 
        className="absolute inset-0 bg-white/95 backdrop-blur-md shadow-md border-b border-gray-100 transition-opacity duration-500 ease-in-out -z-10"
        style={{ opacity: activeTheme === 'light' ? 1 : 0 }}
      />

      {/* 2. Dark Slate Layer (Textured) */}
      <div 
        className="absolute inset-0 bg-cover bg-center border-b border-white/5 shadow-lg shadow-black/30 transition-opacity duration-500 ease-in-out -z-10"
        style={{ 
          opacity: activeTheme === 'dark-slate' ? 1 : 0,
          backgroundImage: `url(${bgImage})`
        }}
      />

      {/* 3. Smoky Theme Layer (With Red Glow) */}
      <div 
        className="absolute inset-0 bg-[#141414]/90 backdrop-blur-lg border-b border-red-950/20 shadow-[0_10px_30px_rgba(217,4,4,0.18)] transition-opacity duration-500 ease-in-out -z-10"
        style={{ opacity: activeTheme === 'smoky' ? 1 : 0 }}
      />

      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between w-full relative z-10">
        
        {/* Left: Logo and Tagline - Anchored to Left */}
        <div className="flex-1 flex justify-start items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollToSection('top', 'landing')}>
            <img src="/logo.svg" alt="Logo" className="h-10 md:h-12 w-auto object-contain" />
            <div className="leading-tight">
              <span className={`block text-lg md:text-xl font-black ${textColorClass} tracking-tight uppercase transition-colors duration-500`}>{brandMain}</span>
              <span className={`block text-[8px] md:text-[9px] font-bold ${subTextColorClass} uppercase tracking-widest transition-colors duration-500`}>{brandSub || 'Fried Chicken'}</span>
            </div>
          </div>
        </div>

        {/* Center: Nav Links - Centered in Navbar */}
        <div className="flex-1 flex justify-center">
          <div className="hidden md:flex items-center gap-8 font-black text-sm uppercase tracking-wider">
            <button 
              onClick={() => scrollToSection('top', 'landing')}
              className={`nav-link relative py-2 ${textColorClass} hover:text-[#D90404] transition-colors duration-500 ${activeTab === 'landing' ? 'active' : ''}`}
            >
              Landing Page
            </button>
            
            <button 
              onClick={() => navigate(`/menu/${shop?.slug || 'kokkarakko-fried-chicken'}`)}
              className={`nav-link relative py-2 ${textColorClass} hover:text-[#D90404] transition-colors duration-500 ${activeTab === 'menu' ? 'active' : ''}`}
            >
              Menu
            </button>

            <button 
              onClick={() => navigate('/owner/login')}
              className={`nav-link relative py-2 ${textColorClass} hover:text-[#D90404] transition-colors duration-500 ${activeTab === 'admin' ? 'active' : ''}`}
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
            className={`md:hidden p-2 rounded-lg ${textColorClass} hover:bg-gray-100/10 transition-colors duration-500`}
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

      </div>

      {/* Mobile/Tablet Drawer Menu */}
      {isMobileMenuOpen && (
        <div className={`md:hidden absolute top-full left-0 w-full ${drawerBgClass} border-b shadow-xl py-4 px-6 flex flex-col gap-4 font-black text-sm uppercase tracking-wider transition-all duration-300`}>
          <button 
            onClick={() => {
              scrollToSection('top', 'landing');
              setIsMobileMenuOpen(false);
            }}
            className="text-left py-2 hover:text-[#D90404] border-b border-gray-100/10 transition-colors"
          >
            Landing Page
          </button>
          
          <button 
            onClick={() => {
              navigate(`/menu/${shop?.slug || 'kokkarakko-fried-chicken'}`);
              setIsMobileMenuOpen(false);
            }}
            className="text-left py-2 hover:text-[#D90404] border-b border-gray-100/10 transition-colors"
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
