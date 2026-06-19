import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-[#E31E24]" size={40} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/owner/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
