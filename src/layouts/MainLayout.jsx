import { Outlet } from 'react-router-dom';
import GlobalStickyCart from '../components/GlobalStickyCart';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* We can add a global customer Navbar/Header here later if needed */}
      <main className="flex-grow">
        <Outlet />
      </main>
      <GlobalStickyCart />
      {/* Footer will go here */}
    </div>
  );
};

export default MainLayout;
