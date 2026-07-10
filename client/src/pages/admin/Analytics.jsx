import { FiBarChart2, FiTrendingUp, FiUsers, FiHome, FiDollarSign, FiFileText } from 'react-icons/fi';

const Analytics = () => (
  <div className="space-y-6">
    <div><h1 className="text-2xl font-bold text-gray-900 dark:text-white">System Analytics</h1><p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Platform-wide metrics and insights</p></div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[
        { icon: FiUsers, label: 'Total Users', value: '48', change: '+12%', color: 'bg-indigo-500' },
        { icon: FiHome, label: 'Properties', value: '156', change: '+8%', color: 'bg-purple-500' },
        { icon: FiDollarSign, label: 'Revenue (MTD)', value: 'TZS 2.1M', change: '+15%', color: 'bg-emerald-500' },
        { icon: FiFileText, label: 'Applications', value: '89', change: '+23%', color: 'bg-blue-500' },
      ].map((card) => (
        <div key={card.label} className="p-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <div className={`w-10 h-10 rounded-xl ${card.color} flex items-center justify-center`}><card.icon size={18} className="text-white" /></div>
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5"><FiTrendingUp size={12} />{card.change}</span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{card.label}</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white mt-0.5">{card.value}</p>
        </div>
      ))}
    </div>
    <div className="p-8 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-center">
      <FiBarChart2 size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
      <p className="text-gray-500 dark:text-gray-400 text-sm">Detailed charts and graphs coming soon</p>
    </div>
  </div>
);

export default Analytics;
