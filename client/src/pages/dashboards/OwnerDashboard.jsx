import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiLayers, FiSquare, FiUsers, FiDollarSign, FiTool } from 'react-icons/fi';
import Card from '../../components/ui/Card';
import { CardSkeleton } from '../../components/ui/LoadingSkeleton';
import { getProperties } from '../../api/propertyApi';
import { getUnits } from '../../api/unitApi';
import { useAuth } from '../../contexts/AuthContext';
import { formatNumber } from '../../utils/format';

const OwnerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [propRes, unitRes] = await Promise.all([
          getProperties({ limit: 1 }),
          getUnits({ limit: 100 }),
        ]);
        const totalUnits = unitRes?.data?.data?.length || 0;
        const occupied = unitRes?.data?.data?.filter((u) => u.status === 'occupied').length || 0;
        setStats({
          properties: propRes?.data?.pagination?.total || 0,
          totalUnits,
          occupied,
          available: totalUnits - occupied,
        });
      } catch {} finally { setLoading(false); }
    };
    fetch();
  }, []);

  const cards = [
    { label: 'Properties', value: stats?.properties || 0, icon: FiHome, color: 'bg-indigo-500', href: '/properties' },
    { label: 'Buildings', value: '—', icon: FiLayers, color: 'bg-purple-500', href: '/buildings' },
    { label: 'Total Units', value: stats?.totalUnits || 0, icon: FiSquare, color: 'bg-pink-500', href: '/units' },
    { label: 'Occupied', value: stats?.occupied || 0, icon: FiUsers, color: 'bg-emerald-500', href: '/tenants' },
    { label: 'Available', value: stats?.available || 0, icon: FiHome, color: 'bg-teal-500', href: '/units?status=available' },
    { label: 'Maintenance', value: '—', icon: FiTool, color: 'bg-amber-500', href: '/maintenance' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Company Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{user?.name} · Company Owner</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />) : cards.map((card) => (
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
            <Link to="/properties/new" className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors border border-gray-200 dark:border-gray-700">
              <FiHome size={20} className="text-indigo-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Add Property</span>
            </Link>
            <Link to="/staff" className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors border border-gray-200 dark:border-gray-700">
              <FiUsers size={20} className="text-indigo-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Manage Staff</span>
            </Link>
            <Link to="/reports" className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors border border-gray-200 dark:border-gray-700">
              <FiDollarSign size={20} className="text-indigo-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">View Reports</span>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default OwnerDashboard;
