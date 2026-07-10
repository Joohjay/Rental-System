import { Link } from 'react-router-dom';
import { FiFileText, FiDollarSign, FiUser, FiSettings } from 'react-icons/fi';
import Card from '../../components/ui/Card';
import { useAuth } from '../../contexts/AuthContext';

const FormerTenantDashboard = () => {
  const { user } = useAuth();
  const cards = [
    { label: 'Rental History', value: 'View', icon: FiFileText, color: 'bg-blue-500', href: '/rental-history' },
    { label: 'Documents', value: '—', icon: FiFileText, color: 'bg-purple-500', href: '/documents' },
    { label: 'Payments History', value: '—', icon: FiDollarSign, color: 'bg-emerald-500', href: '/payment-history' },
    { label: 'Profile', value: 'Edit', icon: FiUser, color: 'bg-amber-500', href: '/profile' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My History</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Welcome back, {user?.name}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

export default FormerTenantDashboard;
