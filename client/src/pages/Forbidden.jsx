import { Link } from 'react-router-dom';
import { FiArrowLeft, FiLock } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { DASHBOARD_ROUTES } from '../config/navigation';
import Button from '../components/ui/Button';

const Forbidden = () => {
  const { user } = useAuth();
  const dashboardPath = DASHBOARD_ROUTES[user?.role] || '/dashboard';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-6">
          <FiLock size={36} className="text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-2">
          You don't have permission to access this page.
        </p>
        {user && (
          <p className="text-sm text-gray-400 dark:text-gray-500 mb-6">
            Your role: <span className="font-medium">{user.role?.replace(/_/g, ' ')}</span>
          </p>
        )}
        <Link to={dashboardPath}>
          <Button>
            <FiArrowLeft size={16} className="mr-1.5" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Forbidden;
