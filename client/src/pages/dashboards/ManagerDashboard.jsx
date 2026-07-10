import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiLayers, FiSquare, FiUsers, FiFileText, FiTool } from 'react-icons/fi';
import Card from '../../components/ui/Card';
import { CardSkeleton } from '../../components/ui/LoadingSkeleton';
import { getProperties } from '../../api/propertyApi';
import { getUnits } from '../../api/unitApi';
import { useAuth } from '../../contexts/AuthContext';
import { formatNumber } from '../../utils/format';

const ManagerDashboard = () => {
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
    { label: 'Units', value: stats?.totalUnits || 0, icon: FiSquare, color: 'bg-pink-500', href: '/units' },
    { label: 'Tenants', value: stats?.occupied || 0, icon: FiUsers, color: 'bg-emerald-500', href: '/tenants' },
    { label: 'Active Leases', value: '—', icon: FiFileText, color: 'bg-blue-500', href: '/leases' },
    { label: 'Maintenance', value: '—', icon: FiTool, color: 'bg-amber-500', href: '/maintenance' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manager Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Welcome back, {user?.name}</p>
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
    </div>
  );
};

export default ManagerDashboard;
