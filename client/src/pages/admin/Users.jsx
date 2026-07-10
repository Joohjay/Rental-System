import { FiUsers, FiSearch, FiFilter, FiMoreVertical, FiShield, FiCheck, FiX } from 'react-icons/fi';

const MOCK_USERS = [
  { id: 1, name: 'Super Admin', email: 'super@rentflow.com', role: 'SUPER_ADMIN', status: 'active', joined: 'Jan 2025' },
  { id: 2, name: 'Jane Owner', email: 'owner@rentflow.com', role: 'COMPANY_OWNER', status: 'active', joined: 'Mar 2025' },
  { id: 3, name: 'John Manager', email: 'manager@rentflow.com', role: 'PROPERTY_MANAGER', status: 'active', joined: 'Mar 2025' },
  { id: 4, name: 'Bob Applicant', email: 'applicant@rentflow.com', role: 'APPLICANT', status: 'active', joined: 'Jun 2025' },
];

const ROLE_STYLES = {
  SUPER_ADMIN: 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400',
  COMPANY_OWNER: 'bg-indigo-100 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400',
  PROPERTY_MANAGER: 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400',
  CARETAKER: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400',
  ACCOUNTANT: 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400',
  APPLICANT: 'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400',
  TENANT: 'bg-teal-100 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400',
  FORMER_TENANT: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
};

const Users = () => (
  <div className="space-y-6">
    <div><h1 className="text-2xl font-bold text-gray-900 dark:text-white">Users</h1><p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage all platform users</p></div>
    <div className="flex items-center gap-3">
      <div className="relative flex-1 max-w-md">
        <FiSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input placeholder="Search users..." className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 outline-none" />
      </div>
      <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"><FiFilter size={14} /> Filters</button>
    </div>
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
      <table className="w-full text-sm">
        <thead><tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"><th className="text-left px-5 py-3 font-medium text-gray-500 dark:text-gray-400">Name</th><th className="text-left px-5 py-3 font-medium text-gray-500 dark:text-gray-400">Email</th><th className="text-left px-5 py-3 font-medium text-gray-500 dark:text-gray-400">Role</th><th className="text-left px-5 py-3 font-medium text-gray-500 dark:text-gray-400">Status</th><th className="text-left px-5 py-3 font-medium text-gray-500 dark:text-gray-400">Joined</th><th className="px-5 py-3"></th></tr></thead>
        <tbody>{MOCK_USERS.map((u) => (
          <tr key={u.id} className="border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30"><td className="px-5 py-3.5"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-sm font-medium text-gray-600 dark:text-gray-300">{u.name.charAt(0)}</div><span className="font-medium text-gray-900 dark:text-white">{u.name}</span></div></td><td className="px-5 py-3.5 text-gray-500 dark:text-gray-400">{u.email}</td>          <td className="px-5 py-3.5"><span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${ROLE_STYLES[u.role] || 'bg-gray-100 text-gray-700'}`}>{u.role.replace(/_/g, ' ')}</span></td><td className="px-5 py-3.5"><span className={`inline-flex items-center gap-1 text-xs ${u.status === 'active' ? 'text-emerald-600' : 'text-red-500'}`}>{u.status === 'active' ? <FiCheck size={12} /> : <FiX size={12} />}{u.status}</span></td><td className="px-5 py-3.5 text-gray-500">{u.joined}</td><td className="px-5 py-3.5"><button className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"><FiMoreVertical size={16} /></button></td></tr>
        ))}</tbody>
      </table>
    </div>
  </div>
);

export default Users;
