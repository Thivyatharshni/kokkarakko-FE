import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, UtensilsCrossed, ClipboardList, QrCode, LogOut, Menu as MenuIcon, X, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminLayout = () => {
  const { logoutContext, shop } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = () => {
    logoutContext();
    navigate('/owner/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/owner/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Menu Management', path: '/owner/menu', icon: <UtensilsCrossed size={20} /> },
    { name: 'Categories', path: '/owner/categories', icon: <MenuIcon size={20} /> },
    { name: 'Analytics', path: '/owner/analytics', icon: <LayoutDashboard size={20} /> },
    { name: 'Orders', path: '/owner/orders', icon: <ClipboardList size={20} /> },
    { name: 'QR Code', path: '/owner/qr', icon: <QrCode size={20} /> },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#111111] text-white">
      <div className="p-6 flex items-center gap-4 border-b border-gray-800">
        <img src="/logo.png" alt="Logo" className="h-14 w-auto object-contain rounded-full shadow-md border border-white/5" />
        <div>
          <h2 className="text-xl font-black text-[#D90404] uppercase tracking-wider">Kokkarakko</h2>
          <p className="text-xs text-gray-400 mt-0.5">{shop ? shop.shopName : 'Admin Panel'}</p>
        </div>
      </div>
      
      <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link 
              key={item.name}
              to={item.path} 
              onClick={() => setIsMobileOpen(false)}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-[#D90404] text-white shadow-lg shadow-red-500/30' 
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              {item.icon}
              <span className="font-semibold">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-800 space-y-1">
        <Link 
          to="/" 
          onClick={() => setIsMobileOpen(false)}
          className="flex items-center space-x-3 w-full px-4 py-3 text-gray-400 hover:bg-gray-800 hover:text-white rounded-xl transition-colors duration-200"
        >
          <Home size={20} />
          <span className="font-semibold">Back to Home</span>
        </Link>

        <button 
          onClick={handleLogout}
          className="flex items-center space-x-3 w-full px-4 py-3 text-gray-400 hover:bg-gray-800 hover:text-[#D90404] rounded-xl transition-colors duration-200"
        >
          <LogOut size={20} />
          <span className="font-semibold">Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-[#F8F8F8]">
      
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 flex-col fixed inset-y-0 z-50">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
            />
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className="fixed inset-y-0 left-0 w-72 z-50 lg:hidden shadow-2xl"
            >
              <button 
                onClick={() => setIsMobileOpen(false)}
                className="absolute top-6 right-4 text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-72 flex flex-col min-h-screen">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white shadow-sm p-4 flex items-center border-b border-gray-100 sticky top-0 z-30">
          <button 
            onClick={() => setIsMobileOpen(true)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg mr-4"
          >
            <MenuIcon size={24} />
          </button>
          <h1 className="text-xl font-bold text-gray-900 truncate">
            {navItems.find(item => location.pathname.startsWith(item.path))?.name || 'Admin'}
          </h1>
        </header>

        <div className="flex-1 p-4 md:p-8 overflow-x-hidden">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
