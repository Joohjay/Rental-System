import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiGrid, FiUsers, FiDollarSign, FiActivity, FiShield } from 'react-icons/fi';
import Card from '../../components/ui/Card';
import { CardSkeleton } from '../../components/ui/LoadingSkeleton';
import { getCompanies } from '../../api/companyApi';
import { useAuth } from '../../contexts/AuthContext';
import { formatNumber } from '../../utils/format';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getCompanies({ limit: 1 });
        setStats({ companies: data?.pagination?.total || 0 });
      } catch {} finally { setLoading(false); }
    };
    fetch();
  }, []);

  const cards = [
    { label: 'Total Companies', value: stats?.companies || 0, icon: FiGrid, color: 'bg-blue-500', href: '/companies' },
    { label: 'System Users', value: '—', icon: FiUsers, color: 'bg-indigo-500', href: '/users' },
    { label: 'Active Subscriptions', value: '—', icon: FiDollarSign, color: 'bg-emerald-500', href: '/subscriptions' },
    { label: 'Audit Events', value: '—', icon: FiActivity, color: 'bg-amber-500', href: '/audit-logs' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Super Admin Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">System-wide overview — welcome, {user?.name}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? Array.from({ length: 4 }).map((_, i) => (
          <CardSkeleton key={i} />
        )) : cards.map((card) => (
          <Link key={card.label} to={card.href}>
            <Card hover className="p-5 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{card.label}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{formatNumber(card.value)}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl ${card.color} flex items-center justify-center`}>
                  <card.icon size={22} className="text-white" />
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link to="/companies/new" className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors border border-gray-200 dark:border-gray-700">
              <FiGrid size={20} className="text-indigo-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Create Company</span>
            </Link>
            <Link to="/users" className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors border border-gray-200 dark:border-gray-700">
              <FiUsers size={20} className="text-indigo-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Manage Users</span>
            </Link>
            <Link to="/audit-logs" className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors border border-gray-200 dark:border-gray-700">
              <FiShield size={20} className="text-indigo-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">View Audit Logs</span>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;
