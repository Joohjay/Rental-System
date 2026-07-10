import { Link } from 'react-router-dom';
import { FiLayers, FiSquare, FiTool, FiUsers, FiFileText } from 'react-icons/fi';
import Card from '../../components/ui/Card';
import { useAuth } from '../../contexts/AuthContext';

const CaretakerDashboard = () => {
  const { user } = useAuth();
  const cards = [
    { label: 'Assigned Buildings', value: '—', icon: FiLayers, color: 'bg-purple-500', href: '/assigned-buildings' },
    { label: 'Units', value: '—', icon: FiSquare, color: 'bg-pink-500', href: '/units' },
    { label: 'Maintenance Requests', value: '—', icon: FiTool, color: 'bg-amber-500', href: '/maintenance' },
    { label: 'Tenants', value: '—', icon: FiUsers, color: 'bg-emerald-500', href: '/tenants' },
    { label: 'Announcements', value: '—', icon: FiFileText, color: 'bg-blue-500', href: '/announcements' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Caretaker Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Welcome, {user?.name}</p>
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

export default CaretakerDashboard;
