import { FiAlertTriangle } from 'react-icons/fi';
import Button from '../components/ui/Button';

const ErrorBoundaryFallback = ({ error, resetError }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
    <div className="text-center max-w-md">
      <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-6">
        <FiAlertTriangle size={36} className="text-red-500" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Something went wrong</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-2">
        An unexpected error occurred. Please try again.
      </p>
      {error && (
        <p className="text-xs text-red-500 dark:text-red-400 mb-6 bg-red-50 dark:bg-red-900/20 rounded-lg p-3 font-mono">
          {error.message}
        </p>
      )}
      <Button onClick={resetError}>Try again</Button>
    </div>
  </div>
);

export default ErrorBoundaryFallback;
