import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import HeroSection from '../../components/HeroSection';
import FeaturesStrip from '../../components/FeaturesStrip';
import BestSellerSection from '../../components/BestSellerSection';
import QROrderingSection from '../../components/QROrderingSection';
import Footer from '../../components/Footer';
import { getShopBySlug } from '../../services/shopService';
import { getMenuBySlug } from '../../services/menuService';
import { Loader2 } from 'lucide-react';

const LandingPage = () => {
  const [shop, setShop] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const defaultSlug = 'kokkarakko-fried-chicken';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [shopRes, menuRes] = await Promise.all([
          getShopBySlug(defaultSlug),
          getMenuBySlug(defaultSlug),
        ]);

        if (shopRes.success) {
          setShop(shopRes.data);
        } else {
          throw new Error(shopRes.message || 'Failed to fetch shop info');
        }

        if (menuRes.success) {
          setMenuItems(menuRes.data);
        } else {
          throw new Error(menuRes.message || 'Failed to fetch menu items');
        }
      } catch (err) {
        console.error('Landing page fetch error:', err);
        setError(err.message || 'Something went wrong while loading the page.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col justify-center items-center gap-4">
        <Loader2 className="animate-spin text-[#E50914]" size={40} />
        <p className="text-gray-500 font-bold tracking-wider uppercase text-xs">Loading TFC Experience...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex flex-col justify-center items-center gap-4 px-6 text-center">
        <div className="text-[#E50914] text-5xl font-black mb-2">OOPS!</div>
        <h1 className="text-2xl font-black text-[#111111] uppercase tracking-wide">Shop Not Found</h1>
        <p className="text-gray-500 max-w-md font-semibold leading-relaxed">
          The default shop <strong>{defaultSlug}</strong> could not be loaded. Please check that the backend server is running and the database is seeded.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <HeroSection slug={shop?.slug} />
      <FeaturesStrip />
      <BestSellerSection menuItems={menuItems} slug={shop?.slug} />
      <QROrderingSection slug={shop?.slug} />
      <Footer />
    </div>
  );
};

export default LandingPage;
