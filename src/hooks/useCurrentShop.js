import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export const useCurrentShop = () => {
  const { shop, loading: authLoading } = useAuth();
  const [shopData, setShopData] = useState({
    shopId: null,
    shopSlug: null,
    shopName: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (authLoading) return;

    try {
      // 1. Auth Context (Primary)
      if (shop) {
        setShopData({
          shopId: shop._id,
          shopSlug: shop.slug,
          shopName: shop.shopName,
          loading: false,
          error: null,
        });
        return;
      }

      // 2. Local Storage (Fallback)
      const cachedShop = localStorage.getItem('currentShop');
      if (cachedShop) {
        const parsed = JSON.parse(cachedShop);
        setShopData({
          shopId: parsed._id,
          shopSlug: parsed.slug,
          shopName: parsed.shopName,
          loading: false,
          error: null,
        });
        return;
      }

      // 3. Not Found safely
      setShopData({
        shopId: null,
        shopSlug: null,
        shopName: null,
        loading: false,
        error: 'Shop data not found',
      });

    } catch (err) {
      setShopData(prev => ({ ...prev, loading: false, error: 'Failed to resolve shop context' }));
    }
  }, [shop, authLoading]);

  return shopData;
};

export default useCurrentShop;
