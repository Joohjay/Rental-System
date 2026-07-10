import { Link } from 'react-router-dom';
import { FiFileText, FiDollarSign, FiTool, FiMessageSquare, FiBell, FiClipboard } from 'react-icons/fi';
import Card from '../../components/ui/Card';
import { useAuth } from '../../contexts/AuthContext';

const TenantDashboard = () => {
  const { user } = useAuth();
  const cards = [
    { label: 'My Lease', value: 'View', icon: FiFileText, color: 'bg-blue-500', href: '/my-lease' },
    { label: 'Rent Payments', value: '—', icon: FiDollarSign, color: 'bg-emerald-500', href: '/payments' },
    { label: 'Receipts', value: '—', icon: FiClipboard, color: 'bg-purple-500', href: '/receipts' },
    { label: 'Maintenance', value: '—', icon: FiTool, color: 'bg-amber-500', href: '/maintenance' },
    { label: 'Messages', value: '0', icon: FiMessageSquare, color: 'bg-pink-500', href: '/messages' },
    { label: 'Notifications', value: '0', icon: FiBell, color: 'bg-indigo-500', href: '/notifications' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Welcome home, {user?.name}</p>
      </div>
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

export default TenantDashboard;
