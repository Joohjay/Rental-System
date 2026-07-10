import { useState, useEffect, useCallback } from 'react';
import { FiFileText } from 'react-icons/fi';
import Card from '../../components/ui/Card';
import DataTable from '../../components/ui/DataTable';
import SearchBar from '../../components/ui/SearchBar';
import Pagination from '../../components/ui/Pagination';
import FilterDropdown from '../../components/ui/FilterDropdown';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import { CardSkeleton } from '../../components/ui/LoadingSkeleton';
import { useDebounce } from '../../hooks/useDebounce';
import { usePagination } from '../../hooks/usePagination';
import { getLeases } from '../../api/leaseApi';
import { formatCurrency, formatDate } from '../../utils/format';

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'expiring', label: 'Expiring' },
  { value: 'terminated', label: 'Terminated' },
];

const STATUS_BADGE = {
  active: { variant: 'green', label: 'Active' },
  expiring: { variant: 'yellow', label: 'Expiring Soon' },
  terminated: { variant: 'red', label: 'Terminated' },
};

const LeaseList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const pagination = usePagination(1, 10);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { data: res } = await getLeases({ page: pagination.page, limit: pagination.limit, search: debouncedSearch, status: statusFilter || undefined });
      setData(res.data || []);
      pagination.setTotal(res.pagination?.total || 0);
    } catch {} finally { setLoading(false); }
  }, [pagination.page, pagination.limit, debouncedSearch, statusFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);
  useEffect(() => { pagination.setPage(1); }, [debouncedSearch, statusFilter]);

  const columns = [
    { key: 'tenant', label: 'Tenant', render: (r) => <span className="font-medium text-gray-900 dark:text-white">{r.tenant}</span> },
    { key: 'unit', label: 'Unit', render: (r) => <span className="text-sm text-gray-600 dark:text-gray-400">{r.unit}</span> },
    { key: 'property', label: 'Property', render: (r) => <span className="text-sm text-gray-600 dark:text-gray-400">{r.property}</span> },
    { key: 'rent', label: 'Rent', render: (r) => <span className="text-sm font-medium text-gray-900 dark:text-white">{formatCurrency(r.rent)}</span> },
    { key: 'start', label: 'Start', render: (r) => <span className="text-sm text-gray-500 dark:text-gray-400">{formatDate(r.start)}</span> },
    { key: 'end', label: 'End', render: (r) => <span className="text-sm text-gray-500 dark:text-gray-400">{formatDate(r.end)}</span> },
    { key: 'status', label: 'Status', render: (r) => { const s = STATUS_BADGE[r.status] || STATUS_BADGE.active; return <Badge variant={s.variant} size="sm">{s.label}</Badge>; }},
  ];

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-900 dark:text-white">Leases</h1><p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage lease agreements</p></div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[{ label: 'Active Leases', count: data.filter((l) => l.status === 'active').length || 0, variant: 'green' },
          { label: 'Expiring Soon', count: data.filter((l) => l.status === 'expiring').length || 0, variant: 'yellow' },
          { label: 'Terminated', count: data.filter((l) => l.status === 'terminated').length || 0, variant: 'red' },
        ].map((s) => (
          <Card key={s.label} className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{s.label}</p>
            <Badge variant={s.variant}>{s.count}</Badge>
          </Card>
        ))}
      </div>

      <Card className="animate-fade-in">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <SearchBar value={search} onChange={setSearch} placeholder="Search leases..." className="sm:w-72" />
          <FilterDropdown label="Status" options={STATUS_OPTIONS} value={statusFilter} onChange={setStatusFilter} />
        </div>
        {loading ? <CardSkeleton /> : data.length === 0 ? (
          <EmptyState icon={FiFileText} title="No leases found" description={search ? 'Try a different search term' : 'No lease agreements yet.'} />
        ) : (
          <>
            <DataTable columns={columns} data={data} />
            <Pagination page={pagination.page} totalPages={pagination.totalPages} total={pagination.total} onPageChange={pagination.goToPage} limit={pagination.limit} onLimitChange={pagination.setLimit} />
          </>
        )}
      </Card>
    </div>
  );
};

export default LeaseList;
