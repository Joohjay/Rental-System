import { useState, useEffect, useCallback } from 'react';
import { FiTool, FiPlus } from 'react-icons/fi';
import Card, { CardHeader, CardTitle } from '../../components/ui/Card';
import DataTable from '../../components/ui/DataTable';
import Button from '../../components/ui/Button';
import SearchBar from '../../components/ui/SearchBar';
import Pagination from '../../components/ui/Pagination';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import FilterDropdown from '../../components/ui/FilterDropdown';
import Modal from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import { CardSkeleton } from '../../components/ui/LoadingSkeleton';
import { useDebounce } from '../../hooks/useDebounce';
import { usePagination } from '../../hooks/usePagination';
import { getMaintenanceRequests, updateMaintenanceStatus } from '../../api/maintenanceApi';
import { formatDate } from '../../utils/format';

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
];

const STATUS_BADGE = {
  pending: { variant: 'yellow', label: 'Pending' },
  in_progress: { variant: 'blue', label: 'In Progress' },
  completed: { variant: 'green', label: 'Completed' },
};

const PRIORITY_BADGE = {
  low: { variant: 'gray', label: 'Low' },
  medium: { variant: 'blue', label: 'Medium' },
  high: { variant: 'yellow', label: 'High' },
  critical: { variant: 'red', label: 'Critical' },
};

const MaintenanceList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const debouncedSearch = useDebounce(search, 300);
  const pagination = usePagination(1, 10);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { data: res } = await getMaintenanceRequests({ page: pagination.page, limit: pagination.limit, search: debouncedSearch, status: statusFilter || undefined, priority: priorityFilter || undefined });
      setData(res.data || []);
      pagination.setTotal(res.pagination?.total || 0);
    } catch {} finally { setLoading(false); }
  }, [pagination.page, pagination.limit, debouncedSearch, statusFilter, priorityFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);
  useEffect(() => { pagination.setPage(1); }, [debouncedSearch, statusFilter, priorityFilter]);

  const columns = [
    { key: 'title', label: 'Request', render: (r) => <div><p className="font-medium text-gray-900 dark:text-white">{r.title}</p><p className="text-xs text-gray-500 dark:text-gray-400">{r.unit} — {r.tenant}</p></div> },
    { key: 'type', label: 'Type', render: (r) => <span className="text-sm capitalize text-gray-600 dark:text-gray-400">{r.type}</span> },
    { key: 'priority', label: 'Priority', render: (r) => { const p = PRIORITY_BADGE[r.priority] || PRIORITY_BADGE.medium; return <Badge variant={p.variant} size="sm">{p.label}</Badge>; }},
    { key: 'status', label: 'Status', render: (r) => {
      const s = STATUS_BADGE[r.status] || STATUS_BADGE.pending;
      return (
        <select
          value={r.status}
          onChange={async (e) => { await updateMaintenanceStatus(r.id, e.target.value); fetchData(); }}
          className={`text-xs font-medium rounded-full px-2.5 py-1 border-0 cursor-pointer focus:ring-2 focus:ring-indigo-500 ${
            r.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
            r.status === 'in_progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
            'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
          }`}
        >
          {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      );
    }},
    { key: 'assigned', label: 'Assigned To', render: (r) => <span className="text-sm text-gray-600 dark:text-gray-400">{r.assigned || <span className="text-gray-400 italic">Unassigned</span>}</span> },
    { key: 'created', label: 'Created', render: (r) => <span className="text-sm text-gray-500 dark:text-gray-400">{formatDate(r.created)}</span> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-gray-900 dark:text-white">Maintenance</h1><p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage work orders and maintenance requests</p></div>
        <Button onClick={() => setModalOpen(true)}><FiPlus size={16} className="mr-1.5" />New Work Order</Button>
      </div>

      <Card className="animate-fade-in">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <SearchBar value={search} onChange={setSearch} placeholder="Search requests..." className="sm:w-72" />
          <FilterDropdown label="Status" options={STATUS_OPTIONS} value={statusFilter} onChange={setStatusFilter} />
          <FilterDropdown label="Priority" options={PRIORITY_OPTIONS} value={priorityFilter} onChange={setPriorityFilter} />
        </div>
        {loading ? <CardSkeleton /> : data.length === 0 ? (
          <EmptyState icon={FiTool} title="No maintenance requests" description={search ? 'Try a different search term' : 'No work orders yet.'} actionLabel="New Work Order" onAction={() => setModalOpen(true)} />
        ) : (
          <>
            <DataTable columns={columns} data={data} />
            <Pagination page={pagination.page} totalPages={pagination.totalPages} total={pagination.total} onPageChange={pagination.goToPage} limit={pagination.limit} onLimitChange={pagination.setLimit} />
          </>
        )}
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="New Work Order" size="md">
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setModalOpen(false); }}>
          <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Title *</label><input type="text" required className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Brief description of the issue" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Priority</label><select className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"><option>Low</option><option>Medium</option><option>High</option><option>Critical</option></select></div>
            <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Category</label><select className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"><option>Plumbing</option><option>Electrical</option><option>HVAC</option><option>Structural</option><option>Security</option><option>Cosmetic</option></select></div>
          </div>
          <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Unit</label><input type="text" className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. A-203" /></div>
          <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description</label><textarea rows={3} className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none" placeholder="Detailed description of the issue" /></div>
          <div className="flex gap-3 pt-2"><Button type="submit">Create Work Order</Button><Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button></div>
        </form>
      </Modal>
    </div>
  );
};

export default MaintenanceList;
