import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import AdminLayout from '../layouts/AdminLayout';
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from '../context/AuthContext';

// Pages
import Login from '../pages/admin/Login';
import SetupShop from '../pages/admin/SetupShop';
import Dashboard from '../pages/admin/Dashboard';
import MenuPage from '../pages/admin/MenuPage';
import CategoryManagement from '../pages/admin/CategoryManagement';
import Analytics from '../pages/admin/Analytics';
import OrdersPage from '../pages/admin/OrdersPage';
import OrderHistoryPage from '../pages/admin/OrderHistoryPage';
import QRPage from '../pages/admin/QRPage';
import ErrorBoundary from '../components/common/ErrorBoundary';
import TestTailwind from '../pages/TestTailwind';

// Customer Pages
import CustomerLandingPage from '../pages/customer/LandingPage';
import CustomerMenuPage from '../pages/customer/MenuPage';
import CustomerOrderSuccess from '../pages/customer/OrderSuccess';
import CartPage from '../pages/customer/CartPage';

const RequireShop = ({ children }) => {
  const { shop, loading } = useAuth();
  if (loading) return null;
  if (!shop) return <Navigate to="/owner/setup-shop" replace />;
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Customer Routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<CustomerLandingPage />} />
        <Route path="/menu/:slug" element={<CustomerMenuPage />} />
        <Route path="/shop/:slug" element={<CustomerMenuPage />} />
        <Route path="/cart/:slug" element={<CartPage />} />
        <Route path="/order-success/:orderNumber" element={<CustomerOrderSuccess />} />
      </Route>

      {/* Admin Auth Route */}
      <Route path="/owner/login" element={<Login />} />

      {/* Protected Admin Routes */}
      <Route element={<ProtectedRoute />}>
        {/* Shop Setup is protected but doesn't require a shop to already exist */}
        <Route path="/owner/setup-shop" element={<SetupShop />} />

        {/* The rest of the dashboard requires the owner to have created a shop */}
        <Route path="/owner" element={<RequireShop><AdminLayout /></RequireShop>}>
          <Route index element={<Navigate to="/owner/dashboard" replace />} />
          <Route path="dashboard" element={<ErrorBoundary><Dashboard /></ErrorBoundary>} />
          <Route path="menu" element={<ErrorBoundary><MenuPage /></ErrorBoundary>} />
          <Route path="categories" element={<ErrorBoundary><CategoryManagement /></ErrorBoundary>} />
          <Route path="analytics" element={<ErrorBoundary><Analytics /></ErrorBoundary>} />
          <Route path="orders" element={<ErrorBoundary><OrdersPage /></ErrorBoundary>} />
          <Route path="orders/history" element={<ErrorBoundary><OrderHistoryPage /></ErrorBoundary>} />
          <Route path="qr" element={<ErrorBoundary><QRPage /></ErrorBoundary>} />
        </Route>
      </Route>

      {/* Catch All */}
      <Route path="/test-tailwind" element={<TestTailwind />} />
      <Route path="*" element={<Navigate to="/owner/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
