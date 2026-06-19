import { createContext, useState, useEffect, useContext } from 'react';
import { getProfile, logout as authLogout } from '../services/authService';
import { getMyShop } from '../services/shopService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [shop, setShop] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      // Get user profile
      const profileRes = await getProfile();
      if (profileRes.success) {
        setUser(profileRes.data);
        setIsAuthenticated(true);

        // Fetch their shop if any
        try {
          const shopRes = await getMyShop();
          if (shopRes.success) {
            setShop(shopRes.data);
          }
        } catch (shopErr) {
          // It's okay if shop doesn't exist yet (404)
          console.log('No shop found for user');
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      authLogout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const loginContext = async (userData, shopData = null) => {
    setUser(userData);
    setIsAuthenticated(true);
    if (shopData) {
      setShop(shopData);
    } else {
       // Attempt to fetch shop
       try {
        const shopRes = await getMyShop();
        if (shopRes.success) setShop(shopRes.data);
      } catch (e) {
        // no shop
      }
    }
  };

  const logoutContext = () => {
    authLogout();
    setUser(null);
    setShop(null);
    setIsAuthenticated(false);
  };

  const updateShopContext = (newShopData) => {
    setShop(newShopData);
  };

  return (
    <AuthContext.Provider value={{ user, shop, isAuthenticated, loading, loginContext, logoutContext, updateShopContext, checkAuth }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
