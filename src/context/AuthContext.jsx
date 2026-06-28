import { createContext, useState, useEffect, useContext } from 'react';
import { getProfile, logout as authLogout } from '../services/authService';
import { getMyShop } from '../services/shopService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const getInitialUser = () => {
    try {
      const cached = localStorage.getItem('currentUser');
      return cached ? JSON.parse(cached) : null;
    } catch (e) {
      return null;
    }
  };

  const getInitialShop = () => {
    try {
      const cached = localStorage.getItem('currentShop');
      return cached ? JSON.parse(cached) : null;
    } catch (e) {
      return null;
    }
  };

  const [user, setUser] = useState(getInitialUser);
  const [shop, setShop] = useState(getInitialShop);
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('adminToken'));
  const [loading, setLoading] = useState(() => {
    const token = localStorage.getItem('adminToken');
    const cachedUser = localStorage.getItem('currentUser');
    // If there is an admin token but no cached user profile, we must load first.
    // Otherwise, we can render using cached data immediately to prevent blocking.
    return !!token && !cachedUser;
  });

  const checkAuth = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      setUser(null);
      setShop(null);
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    try {
      // Get user profile
      const profileRes = await getProfile();
      if (profileRes.success) {
        setUser(profileRes.data);
        setIsAuthenticated(true);
        localStorage.setItem('currentUser', JSON.stringify(profileRes.data));

        // Fetch their shop if any
        try {
          const shopRes = await getMyShop();
          if (shopRes.success) {
            setShop(shopRes.data);
            localStorage.setItem('currentShop', JSON.stringify(shopRes.data));
          } else {
            setShop(null);
            localStorage.removeItem('currentShop');
          }
        } catch (shopErr) {
          // It's okay if shop doesn't exist yet (404)
          console.log('No shop found for user');
          setShop(null);
          localStorage.removeItem('currentShop');
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('adminToken');
      localStorage.removeItem('currentUser');
      localStorage.removeItem('currentShop');
      setUser(null);
      setShop(null);
      setIsAuthenticated(false);
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
    localStorage.setItem('currentUser', JSON.stringify(userData));
    
    if (shopData) {
      setShop(shopData);
      localStorage.setItem('currentShop', JSON.stringify(shopData));
    } else {
      try {
        const shopRes = await getMyShop();
        if (shopRes.success) {
          setShop(shopRes.data);
          localStorage.setItem('currentShop', JSON.stringify(shopRes.data));
        }
      } catch (e) {
        setShop(null);
        localStorage.removeItem('currentShop');
      }
    }
  };

  const logoutContext = () => {
    authLogout();
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentShop');
    setUser(null);
    setShop(null);
    setIsAuthenticated(false);
  };

  const updateShopContext = (newShopData) => {
    setShop(newShopData);
    if (newShopData) {
      localStorage.setItem('currentShop', JSON.stringify(newShopData));
    } else {
      localStorage.removeItem('currentShop');
    }
  };

  return (
    <AuthContext.Provider value={{ user, shop, isAuthenticated, loading, loginContext, logoutContext, updateShopContext, checkAuth }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
