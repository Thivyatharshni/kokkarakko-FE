import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getShopBySlug } from '../../services/shopService';
import { trackQRScan } from '../../services/qrService';

const MenuPage = () => {
  const { slug } = useParams();
  const [hasTracked, setHasTracked] = useState(false);

  useEffect(() => {
    const trackVisit = async () => {
      try {
        const res = await getShopBySlug(slug);
        if (res.success && res.data && !hasTracked) {
          const shopId = res.data._id;
          await trackQRScan(shopId);
          setHasTracked(true);
        }
      } catch (error) {
        console.error('Failed to track QR scan:', error);
      }
    };

    if (slug && !hasTracked) {
      trackVisit();
    }
  }, [slug, hasTracked]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-6 text-center">
      <h1 className="text-3xl font-black text-[#111111] mb-2 uppercase">Menu Page</h1>
      <p className="text-gray-500 mb-6 font-semibold">Shop Slug: {slug}</p>
      <div className="bg-white p-6 rounded-2xl shadow-sm max-w-sm w-full border border-gray-100 space-y-4">
        <p className="text-gray-600 text-sm">This is the Customer Menu & Order page for <strong>{slug}</strong>.</p>
        <Link 
          to="/" 
          className="inline-block bg-[#E50914] text-white font-bold py-2 px-6 rounded-xl text-sm hover:bg-[#c40710] transition-colors"
        >
          Back to Marketing Page
        </Link>
      </div>
    </div>
  );
};

export default MenuPage;
