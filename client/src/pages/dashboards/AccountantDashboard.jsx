import { Link } from 'react-router-dom';
import { FiDollarSign, FiFileText, FiBarChart2, FiCreditCard } from 'react-icons/fi';
import Card from '../../components/ui/Card';
import { useAuth } from '../../contexts/AuthContext';

const AccountantDashboard = () => {
  const { user } = useAuth();
  const cards = [
    { label: 'Payments', value: '—', icon: FiDollarSign, color: 'bg-emerald-500', href: '/payments' },
    { label: 'Receipts', value: '—', icon: FiFileText, color: 'bg-blue-500', href: '/receipts' },
    { label: 'Reports', value: '—', icon: FiBarChart2, color: 'bg-purple-500', href: '/reports' },
    { label: 'Expenses', value: '—', icon: FiCreditCard, color: 'bg-amber-500', href: '/expenses' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Accountant Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Financial overview — {user?.name}</p>
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

export default AccountantDashboard;
