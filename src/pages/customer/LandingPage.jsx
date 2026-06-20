import React, { useState, useEffect, useRef } from 'react';
import { useScroll } from 'framer-motion';
import Navbar from '../../components/Navbar';
import HeroSection from '../../components/HeroSection';
import SignaturePreparationSection from '../../components/SignaturePreparationSection';
import FeaturesStrip from '../../components/FeaturesStrip';
import StreetStyleSection from '../../components/StreetStyleSection';
import BurgerAssemblySection from '../../components/BurgerAssemblySection';
import QROrderingSection from '../../components/QROrderingSection';
import Footer from '../../components/Footer';
import AnimatedChickenLeg from '../../components/AnimatedChickenLeg';
import { getShopBySlug } from '../../services/shopService';
import { Loader2 } from 'lucide-react';
import ScrollReveal from '../../components/ScrollReveal';

const LandingPage = () => {
  const [coords, setCoords] = useState(null);
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const bucketRef = useRef(null);
  const originRef = useRef(null);
  const destRef = useRef(null);
  const containerRef = useRef(null);

  const defaultSlug = 'kokkarakko-fried-chicken';

  // Track scroll inside the parent container encompassing Hero and SignaturePreparation
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const shopRes = await getShopBySlug(defaultSlug);

        if (shopRes.success) {
          setShop(shopRes.data);
        } else {
          throw new Error(shopRes.message || 'Failed to fetch shop info');
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

  // Measure coordinates for the scroll storytelling animation
  useEffect(() => {
    const measurePositions = () => {
      if (originRef.current && destRef.current && containerRef.current) {
        const originRect = originRef.current.getBoundingClientRect();
        const destRect = destRef.current.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();

        // Calculate centered positions relative to the container element
        const startW = originRect.width;
        const startH = originRect.height;
        const endW = destRect.width;
        const endH = destRect.height;

        const startCenterX = (originRect.left - containerRect.left) + startW / 2;
        const startCenterY = (originRect.top - containerRect.top) + startH / 2;
        const endCenterX = (destRect.left - containerRect.left) + endW / 2;
        const endCenterY = (destRect.top - containerRect.top) + endH / 2;

        setCoords({
          start: {
            x: startCenterX - startW / 2,
            y: startCenterY - startH / 2,
            width: startW,
            height: startH,
          },
          end: {
            x: endCenterX - startW / 2,
            y: endCenterY - startH / 2,
            width: endW,
            height: endH,
          }
        });
      }
    };

    if (!loading && !error) {
      // Re-measure after initial mount settles and on resize
      // We run it initially at 100ms, and then at 1500ms to capture the settled state after spring animation
      const timer1 = setTimeout(measurePositions, 100);
      const timer2 = setTimeout(measurePositions, 1500);
      window.addEventListener('resize', measurePositions);
      
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        window.removeEventListener('resize', measurePositions);
      };
    }
  }, [loading, error]);

  return (
    <div className="bg-white min-h-screen relative">
      {!loading && !error && <Navbar shop={shop} />}
      
      {/* Scroll animation container encompassing Hero down to StreetStyleSection */}
      <div ref={containerRef} className="relative z-30">
        {loading ? (
          <div className="min-h-screen bg-white flex flex-col justify-center items-center gap-4">
            <Loader2 className="animate-spin text-[#D90404]" size={40} />
            <p className="text-gray-500 font-bold tracking-wider uppercase text-xs">Loading Kokkarakko Experience...</p>
          </div>
        ) : error ? (
          <div className="min-h-screen bg-white flex flex-col justify-center items-center gap-4 px-6 text-center">
            <div className="text-[#D90404] text-5xl font-black mb-2">OOPS!</div>
            <h1 className="text-2xl font-black text-[#111111] uppercase tracking-wide">Shop Not Found</h1>
            <p className="text-gray-500 max-w-md font-semibold leading-relaxed">
              The default shop <strong>{defaultSlug}</strong> could not be loaded. Please check that the backend server is running and the database is seeded.
            </p>
          </div>
        ) : (
          <>
            <HeroSection slug={shop?.slug} shop={shop} />
            
            <ScrollReveal type="section">
              <SignaturePreparationSection bucketRef={bucketRef} originRef={originRef} />
            </ScrollReveal>
            
            <ScrollReveal type="section">
              <FeaturesStrip />
            </ScrollReveal>
            
            <ScrollReveal type="section">
              <StreetStyleSection slug={shop?.slug} shop={shop} plateRef={destRef} />
            </ScrollReveal>
            
            {coords && (
              <AnimatedChickenLeg 
                key={`${Math.round(coords.start.x)}-${Math.round(coords.start.y)}-${Math.round(coords.end.x)}-${Math.round(coords.end.y)}`}
                coords={coords} 
                scrollYProgress={scrollYProgress}
              />
            )}
          </>
        )}
      </div>
      
      {!loading && !error && (
        <>
          <ScrollReveal type="section">
            <BurgerAssemblySection />
          </ScrollReveal>
          
          <ScrollReveal type="section">
            <QROrderingSection slug={shop?.slug} shop={shop} />
          </ScrollReveal>
          
          <ScrollReveal type="section">
            <Footer shop={shop} />
          </ScrollReveal>
        </>
      )}
    </div>
  );
};

export default LandingPage;
