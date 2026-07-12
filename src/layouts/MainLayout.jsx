import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import GlobalStickyCart from '../components/GlobalStickyCart';

const MainLayout = () => {
  const { pathname } = useLocation();
  const isLanding = pathname === '/';
  const isOrderSuccess = pathname.startsWith('/order-success/');

  useEffect(() => {
    const color = isLanding ? '#ffffff' : (isOrderSuccess ? '#f9fafb' : '#0A0A0A');
    document.body.style.backgroundColor = color;
    document.documentElement.style.backgroundColor = color;
    return () => {
      document.body.style.backgroundColor = '';
      document.documentElement.style.backgroundColor = '';
    };
  }, [pathname, isLanding, isOrderSuccess]);

  let bgClass = 'bg-[#0A0A0A]';
  if (isLanding) bgClass = 'bg-white';
  if (isOrderSuccess) bgClass = 'bg-gray-50';

  return (
    <div className={`min-h-screen flex flex-col ${bgClass} transition-colors duration-200`}>
      {/* We can add a global customer Navbar/Header here later if needed */}
      <main className="flex-grow flex flex-col">
        <Outlet />
      </main>
      <GlobalStickyCart />
      {/* Footer will go here */}
    </div>
  );
};

export default MainLayout;
