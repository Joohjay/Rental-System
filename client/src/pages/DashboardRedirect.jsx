import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingPage from './LoadingPage';
import { DASHBOARD_ROUTES } from '../config/navigation';

const DashboardRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingPage />;
  if (!user) return <Navigate to="/login" replace />;

  const path = DASHBOARD_ROUTES[user.role] || '/tenant/dashboard';
  return <Navigate to={path} replace />;
};

export default DashboardRedirect;
