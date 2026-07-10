import { FiInbox } from 'react-icons/fi';
import Button from './Button';

const EmptyState = ({ icon: Icon = FiInbox, title = 'No data found', description = 'Get started by creating your first item.', actionLabel, onAction }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4">
    <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
      <Icon className="text-gray-400 dark:text-gray-500" size={28} />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{title}</h3>
    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 text-center max-w-sm">{description}</p>
    {actionLabel && onAction && (
      <Button onClick={onAction}>{actionLabel}</Button>
    )}
  </div>
);

export default EmptyState;
