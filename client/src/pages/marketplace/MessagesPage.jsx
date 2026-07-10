import { Link } from 'react-router-dom';
import { FiMessageSquare, FiHome } from 'react-icons/fi';

const MessagesPage = () => (
  <div className="space-y-6">
    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Messages</h1>
    <div className="text-center py-20">
      <FiMessageSquare size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">No Messages</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">Your messages will appear here when property managers respond to your inquiries.</p>
    </div>
  </div>
);

export default MessagesPage;
