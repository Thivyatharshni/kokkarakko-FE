import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export const useCurrentShop = () => {
  const { shop, loading: authLoading } = useAuth();
  
  // Resolve initial state immediately to prevent initial render flash
  const getInitialState = () => {
    if (shop) {
      return {
        shopId: shop._id,
        shopSlug: shop.slug,
        shopName: shop.shopName,
        loading: false,
        error: null,
      };
    }
    
    const cachedShop = localStorage.getItem('currentShop');
    if (cachedShop) {
      try {
        const parsed = JSON.parse(cachedShop);
        return {
          shopId: parsed._id,
          shopSlug: parsed.slug,
          shopName: parsed.shopName,
          loading: false,
          error: null,
        };
      } catch (e) {
        // Ignore JSON error
      }
    }

    return {
      shopId: null,
      shopSlug: null,
      shopName: null,
      loading: authLoading,
      error: authLoading ? null : 'Shop data not found',
    };
  };

  const [shopData, setShopData] = useState(getInitialState);

  useEffect(() => {
    if (authLoading) return;

    if (shop) {
      setShopData({
        shopId: shop._id,
        shopSlug: shop.slug,
        shopName: shop.shopName,
        loading: false,
        error: null,
      });
    } else {
      const cachedShop = localStorage.getItem('currentShop');
      if (cachedShop) {
        try {
          const parsed = JSON.parse(cachedShop);
          setShopData({
            shopId: parsed._id,
            shopSlug: parsed.slug,
            shopName: parsed.shopName,
            loading: false,
            error: null,
          });
          return;
        } catch (e) {
          // Ignore
        }
      }
      setShopData({
        shopId: null,
        shopSlug: null,
        shopName: null,
        loading: false,
        error: 'Shop data not found',
      });
    }
  }, [shop, authLoading]);

  return shopData;
};

export default useCurrentShop;
