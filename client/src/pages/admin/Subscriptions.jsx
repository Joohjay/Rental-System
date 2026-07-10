import { FiDollarSign, FiCheck, FiX, FiMoreVertical } from 'react-icons/fi';

const MOCK_SUBSCRIPTIONS = [
  { id: 1, company: 'RentFlow HQ', plan: 'Enterprise', status: 'active', users: 25, nextBilling: 'Aug 1, 2026', amount: 'TZS 500,000' },
  { id: 2, company: 'PropCo Ltd', plan: 'Professional', status: 'active', users: 10, nextBilling: 'Jul 15, 2026', amount: 'TZS 200,000' },
  { id: 3, company: 'HomeFinders', plan: 'Starter', status: 'trialing', users: 3, nextBilling: 'Jul 28, 2026', amount: 'TZS 0' },
];

const Subscriptions = () => (
  <div className="space-y-6">
    <div><h1 className="text-2xl font-bold text-gray-900 dark:text-white">Subscriptions</h1><p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage company subscriptions and billing</p></div>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="p-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700"><p className="text-sm text-gray-500 dark:text-gray-400">Active Subscriptions</p><p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">3</p></div>
      <div className="p-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700"><p className="text-sm text-gray-500 dark:text-gray-400">Monthly Revenue</p><p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">TZS 700K</p></div>
      <div className="p-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700"><p className="text-sm text-gray-500 dark:text-gray-400">Trialing</p><p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">1</p></div>
    </div>
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
      <table className="w-full text-sm">
        <thead><tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"><th className="text-left px-5 py-3 font-medium text-gray-500 dark:text-gray-400">Company</th><th className="text-left px-5 py-3 font-medium text-gray-500 dark:text-gray-400">Plan</th><th className="text-left px-5 py-3 font-medium text-gray-500 dark:text-gray-400">Status</th><th className="text-left px-5 py-3 font-medium text-gray-500 dark:text-gray-400">Users</th><th className="text-left px-5 py-3 font-medium text-gray-500 dark:text-gray-400">Next Billing</th><th className="text-right px-5 py-3 font-medium text-gray-500 dark:text-gray-400">Amount</th></tr></thead>
        <tbody>{MOCK_SUBSCRIPTIONS.map((s) => (
          <tr key={s.id} className="border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30"><td className="px-5 py-3.5 font-medium text-gray-900 dark:text-white">{s.company}</td><td className="px-5 py-3.5 text-gray-700 dark:text-gray-300">{s.plan}</td><td className="px-5 py-3.5"><span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${s.status === 'active' ? 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400' : 'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400'}`}>{s.status === 'active' ? <FiCheck size={10} /> : null}{s.status}</span></td><td className="px-5 py-3.5 text-gray-500">{s.users}</td><td className="px-5 py-3.5 text-gray-500">{s.nextBilling}</td><td className="px-5 py-3.5 text-right font-medium text-gray-900 dark:text-white">{s.amount}</td></tr>
        ))}</tbody>
      </table>
    </div>
  </div>
);

export default Subscriptions;
