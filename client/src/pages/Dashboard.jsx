import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiGrid, FiHome, FiLayers, FiSquare, FiUsers, FiDollarSign, FiTool, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import Card from '../components/ui/Card';
import { CardSkeleton } from '../components/ui/LoadingSkeleton';
import { getCompanies } from '../api/companyApi';
import { getProperties } from '../api/propertyApi';
import { getBuildings } from '../api/buildingApi';
import { getUnits } from '../api/unitApi';
import { formatNumber } from '../utils/format';

const statCards = [
  { label: 'Total Companies', key: 'companies', icon: FiGrid, color: 'bg-blue-500', href: '/companies' },
  { label: 'Total Properties', key: 'properties', icon: FiHome, color: 'bg-indigo-500', href: '/properties' },
  { label: 'Total Buildings', key: 'buildings', icon: FiLayers, color: 'bg-purple-500', href: '/buildings' },
  { label: 'Total Units', key: 'totalUnits', icon: FiSquare, color: 'bg-pink-500', href: '/units' },
  { label: 'Occupied Units', key: 'occupied', icon: FiUsers, color: 'bg-emerald-500', href: '/units?status=occupied' },
  { label: 'Vacant Units', key: 'available', icon: FiCheckCircle, color: 'bg-teal-500', href: '/units?status=available' },
  { label: 'Maintenance', key: 'maintenance', icon: FiTool, color: 'bg-amber-500', href: '/units?status=maintenance' },
  { label: 'Revenue', key: 'revenue', icon: FiDollarSign, color: 'bg-green-600', href: '/payments' },
];

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [compRes, propRes, buildRes, unitRes] = await Promise.all([
          getCompanies({ limit: 1 }),
          getProperties({ limit: 1 }),
          getBuildings({ limit: 1 }),
          getUnits({ limit: 1 }),
        ]);

        setStats({
          companies: compRes.data.pagination?.total || 0,
          properties: propRes.data.pagination?.total || 0,
          buildings: buildRes.data.pagination?.total || 0,
          totalUnits: unitRes.data.pagination?.total || 0,
          occupied: unitRes.data.summary?.occupied || 0,
          available: unitRes.data.summary?.available || 0,
          maintenance: unitRes.data.summary?.maintenance || 0,
          revenue: 0,
        });
      } catch {
        setStats({
          companies: 0, properties: 0, buildings: 0,
          totalUnits: 0, occupied: 0, available: 0, maintenance: 0, revenue: 0,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Overview of your property portfolio</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)
          : statCards.map(({ label, key, icon: Icon, color, href }, idx) => (
              <Link key={key} to={href} className={`animate-fade-in stagger-${Math.min(idx + 1, 8)}`}>
                <Card hover className="relative overflow-hidden">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                        {key === 'revenue' && '$'}
                        {key === 'revenue' ? '0' : formatNumber(stats[key])}
                      </p>
                    </div>
                    <div className={`w-12 h-12 rounded-xl ${color} bg-opacity-10 dark:bg-opacity-20 flex items-center justify-center`}>
                      <Icon className={`${color.replace('bg-', 'text-')} opacity-80`} size={22} />
                    </div>
                  </div>
                  <div className={`absolute bottom-0 left-0 right-0 h-1 ${color} opacity-30`} />
                </Card>
              </Link>
            ))}
      </div>
    </div>
  );
};

export default Dashboard;
