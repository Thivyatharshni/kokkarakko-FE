import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import AdminLayout from '../layouts/AdminLayout';
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from '../context/AuthContext';
import ErrorBoundary from '../components/common/ErrorBoundary';

// Lazy load admin pages
const Login = lazy(() => import('../pages/admin/Login'));
const SetupShop = lazy(() => import('../pages/admin/SetupShop'));
const Dashboard = lazy(() => import('../pages/admin/Dashboard'));
const MenuPage = lazy(() => import('../pages/admin/MenuPage'));
const CategoryManagement = lazy(() => import('../pages/admin/CategoryManagement'));
const Analytics = lazy(() => import('../pages/admin/Analytics'));
const OrdersPage = lazy(() => import('../pages/admin/OrdersPage'));
const OrderHistoryPage = lazy(() => import('../pages/admin/OrderHistoryPage'));
const QRPage = lazy(() => import('../pages/admin/QRPage'));
const TestTailwind = lazy(() => import('../pages/TestTailwind'));

// Lazy load customer pages
const CustomerLandingPage = lazy(() => import('../pages/customer/LandingPage'));
const CustomerMenuPage = lazy(() => import('../pages/customer/MenuPage'));
const CustomerOrderSuccess = lazy(() => import('../pages/customer/OrderSuccess'));
const CartPage = lazy(() => import('../pages/customer/CartPage'));
const CustomerOrdersPage = lazy(() => import('../pages/customer/OrdersPage'));

const LoadingFallback = () => (
  <div className="bg-[#0A0A0A] min-h-screen flex items-center justify-center text-white">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#E50914]"></div>
  </div>
);

const RequireShop = ({ children }) => {
  const { shop, loading } = useAuth();
  if (loading) return null;
  if (!shop) return <Navigate to="/owner/setup-shop" replace />;
  return children;
};

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Public Customer Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<CustomerLandingPage />} />
          <Route path="/menu/:slug" element={<CustomerMenuPage />} />
          <Route path="/shop/:slug" element={<CustomerMenuPage />} />
          <Route path="/cart/:slug" element={<CartPage />} />
          <Route path="/order-success/:orderNumber" element={<CustomerOrderSuccess />} />
          <Route path="/orders" element={<CustomerOrdersPage />} />
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
    </Suspense>
  );
};

export default AppRoutes;
