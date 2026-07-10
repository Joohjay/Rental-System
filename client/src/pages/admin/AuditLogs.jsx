import { FiFileText, FiSearch, FiFilter, FiMoreVertical } from 'react-icons/fi';

const MOCK_LOGS = [
  { id: 1, user: 'Super Admin', action: 'CREATE', resource: 'Company', detail: 'Created company "PropCo Ltd"', time: '2 hours ago' },
  { id: 2, user: 'Jane Owner', action: 'UPDATE', resource: 'Property', detail: 'Updated "Riverside Apartments"', time: '5 hours ago' },
  { id: 3, user: 'John Manager', action: 'DELETE', resource: 'Unit', detail: 'Deleted unit B-12', time: '1 day ago' },
  { id: 4, user: 'Super Admin', action: 'LOGIN', resource: 'Auth', detail: 'Login from web browser', time: '2 days ago' },
  { id: 5, user: 'Alice Accountant', action: 'CREATE', resource: 'Payment', detail: 'Recorded payment of TZS 500,000', time: '3 days ago' },
];

const ACTION_COLORS = {
  CREATE: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-200',
  UPDATE: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200',
  DELETE: 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 border-red-200',
  LOGIN: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-400 border-purple-200',
};

const AuditLogs = () => (
  <div className="space-y-6">
    <div><h1 className="text-2xl font-bold text-gray-900 dark:text-white">Audit Logs</h1><p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Track all actions across the platform</p></div>
    <div className="flex items-center gap-3">
      <div className="relative flex-1 max-w-md">
        <FiSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input placeholder="Search logs..." className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 outline-none" />
      </div>
      <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"><FiFilter size={14} /> Filter</button>
    </div>
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
      <table className="w-full text-sm">
        <thead><tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"><th className="text-left px-5 py-3 font-medium text-gray-500 dark:text-gray-400">User</th><th className="text-left px-5 py-3 font-medium text-gray-500 dark:text-gray-400">Action</th><th className="text-left px-5 py-3 font-medium text-gray-500 dark:text-gray-400">Resource</th><th className="text-left px-5 py-3 font-medium text-gray-500 dark:text-gray-400">Detail</th><th className="text-right px-5 py-3 font-medium text-gray-500 dark:text-gray-400">Time</th></tr></thead>
        <tbody>{MOCK_LOGS.map((log) => (
          <tr key={log.id} className="border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30"><td className="px-5 py-3.5 font-medium text-gray-900 dark:text-white">{log.user}</td><td className="px-5 py-3.5"><span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border ${ACTION_COLORS[log.action] || 'text-gray-600 bg-gray-50'}`}>{log.action}</span></td><td className="px-5 py-3.5 text-gray-700 dark:text-gray-300">{log.resource}</td><td className="px-5 py-3.5 text-gray-500">{log.detail}</td><td className="px-5 py-3.5 text-right text-gray-500">{log.time}</td></tr>
        ))}</tbody>
      </table>
    </div>
  </div>
);

export default AuditLogs;
