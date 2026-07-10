import { Link } from 'react-router-dom';
import { FiHome, FiBookmark, FiFileText, FiCalendar, FiMessageSquare, FiBell } from 'react-icons/fi';
import Card from '../../components/ui/Card';
import { useAuth } from '../../contexts/AuthContext';

const ApplicantDashboard = () => {
  const { user } = useAuth();
  const cards = [
    { label: 'Browse Properties', value: 'Explore', icon: FiHome, color: 'bg-indigo-500', href: '/browse' },
    { label: 'Saved Properties', value: '0', icon: FiBookmark, color: 'bg-purple-500', href: '/saved' },
    { label: 'Applications', value: '0', icon: FiFileText, color: 'bg-blue-500', href: '/applications' },
    { label: 'Viewing Requests', value: '0', icon: FiCalendar, color: 'bg-emerald-500', href: '/viewing-requests' },
    { label: 'Messages', value: '0', icon: FiMessageSquare, color: 'bg-amber-500', href: '/messages' },
    { label: 'Notifications', value: '0', icon: FiBell, color: 'bg-pink-500', href: '/notifications' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Find Your Next Home</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Welcome, {user?.name}</p>
      </div>

      <Card className="p-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
        <h2 className="text-lg font-semibold mb-2">Looking for a place to rent?</h2>
        <p className="text-sm text-indigo-100 mb-4">Browse thousands of properties across Tanzania</p>
        <Link to="/browse" className="inline-flex items-center gap-2 px-4 py-2 bg-white text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-50 transition-colors">
          <FiHome size={16} />
          Start Browsing
        </Link>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => (
          <Link key={card.label} to={card.href}>
            <Card hover className="p-5 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{card.label}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{card.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl ${card.color} flex items-center justify-center`}>
                  <card.icon size={22} className="text-white" />
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ApplicantDashboard;
