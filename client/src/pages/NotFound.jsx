import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import Button from '../components/ui/Button';

const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
    <div className="text-center max-w-md">
      <div className="text-8xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">404</div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Page not found</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/dashboard">
        <Button>
          <FiArrowLeft size={16} className="mr-1.5" />
          Back to Dashboard
        </Button>
      </Link>
    </div>
  </div>
);

export default NotFound;
