import { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, UtensilsCrossed, ClipboardList, QrCode, LogOut, Menu as MenuIcon, X, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminLayout = () => {
  const { logoutContext, shop } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isTabletExpanded, setIsTabletExpanded] = useState(false);

  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileOpen]);

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

  const SidebarContent = ({ isCollapsed = false, onClose }) => (
    <div className="flex flex-col h-full bg-[#111111] text-white overflow-hidden">
      <div className={`p-4 md:p-6 flex flex-col transition-all`}>
        <div className={`flex items-start justify-between w-full ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <img src="/logo.png" alt="Logo" className="w-11 h-11 md:w-12 md:h-12 object-cover rounded-full shadow-md border border-white/5 flex-shrink-0" />
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <h2 className="text-[20px] font-bold text-[#D90404] uppercase tracking-wider truncate leading-tight w-full max-w-[180px]">Kokkarakko</h2>
                <p className="text-[13px] font-medium text-gray-400 mt-0 truncate leading-normal">{shop ? shop.shopName : 'Admin Panel'}</p>
              </div>
            )}
          </div>
          {onClose && !isCollapsed && (
            <button 
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10 active:bg-white/20 transition-all duration-200 ml-4 flex-shrink-0 text-gray-400 hover:text-white"
              aria-label="Close sidebar"
            >
              <X size={18} />
            </button>
          )}
        </div>
        <div className="border-b border-gray-800 mt-3 w-full" />
      </div>
      
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link 
              key={item.name}
              to={item.path} 
              onClick={() => {
                setIsMobileOpen(false);
                setIsTabletExpanded(false);
              }}
              title={isCollapsed ? item.name : undefined}
              className={`flex items-center ${isCollapsed ? 'justify-center px-2.5' : 'space-x-3 px-3 md:px-4'} h-[52px] rounded-lg md:rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-[#D90404] text-white shadow-md shadow-red-500/20' 
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {!isCollapsed && <span className="font-semibold truncate text-[15px]">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-gray-800 space-y-1">
        <Link 
          to="/" 
          onClick={() => {
            setIsMobileOpen(false);
            setIsTabletExpanded(false);
          }}
          title={isCollapsed ? 'Back to Home' : undefined}
          className={`flex items-center ${isCollapsed ? 'justify-center px-2.5' : 'space-x-3 px-3 md:px-4'} h-[52px] text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg md:rounded-xl transition-colors duration-200`}
        >
          <span className="flex-shrink-0"><Home size={20} /></span>
          {!isCollapsed && <span className="font-semibold truncate text-[15px]">Back to Home</span>}
        </Link>

        <button 
          onClick={handleLogout}
          title={isCollapsed ? 'Logout' : undefined}
          className={`flex items-center ${isCollapsed ? 'justify-center px-2.5' : 'space-x-3 px-3 md:px-4'} w-full h-[52px] text-gray-400 hover:bg-gray-800 hover:text-[#D90404] rounded-lg md:rounded-xl transition-colors duration-200`}
        >
          <span className="flex-shrink-0"><LogOut size={20} /></span>
          {!isCollapsed && <span className="font-semibold truncate text-[15px]">Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-[#F8F8F8]">
      
      {/* Desktop Sidebar (Fixed 72 width) */}
      <aside className="hidden lg:flex w-72 flex-col fixed inset-y-0 z-50">
        <SidebarContent isCollapsed={false} />
      </aside>

      {/* Tablet Collapsed Sidebar (md to lg) */}
      <aside 
        onClick={() => setIsTabletExpanded(!isTabletExpanded)}
        className={`hidden md:flex lg:hidden flex-col fixed inset-y-0 z-50 cursor-pointer transition-all duration-300 shadow-xl ${
          isTabletExpanded ? 'w-72' : 'w-20'
        }`}
      >
        <SidebarContent isCollapsed={!isTabletExpanded} />
      </aside>
      {isTabletExpanded && (
        <div 
          onClick={() => setIsTabletExpanded(false)} 
          className="fixed inset-0 z-40 hidden md:block lg:hidden"
        />
      )}

      {/* Mobile Drawer (< md) */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
            />
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className="fixed inset-y-0 left-0 w-[280px] z-50 md:hidden shadow-2xl"
            >
              <SidebarContent isCollapsed={false} onClose={() => setIsMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-20 lg:ml-72 flex flex-col min-h-screen transition-all duration-300 w-full max-w-full overflow-x-hidden">
        {/* Mobile Header (< md) */}
        <header className="md:hidden bg-white shadow-sm h-16 px-4 flex items-center justify-between border-b border-gray-100 sticky top-0 z-30">
          <div className="flex items-center min-w-0">
            <button 
              onClick={() => setIsMobileOpen(true)}
              className="text-gray-600 hover:bg-gray-100 rounded-lg mr-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Open menu"
            >
              <MenuIcon size={22} />
            </button>
            <h1 className="text-lg font-bold text-gray-900 truncate">
              {navItems.find(item => location.pathname.startsWith(item.path))?.name || 'Admin'}
            </h1>
          </div>
          <img src="/logo.png" alt="Logo" className="h-8 w-8 object-cover rounded-full flex-shrink-0" />
        </header>

        <div className="flex-1 p-4 sm:p-6 md:p-8 w-full max-w-full overflow-x-hidden">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
