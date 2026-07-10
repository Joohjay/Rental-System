import { useState, useEffect, useCallback } from 'react';
import { FiUsers, FiSearch, FiX, FiMail, FiPhone, FiHome, FiCalendar, FiDollarSign, FiChevronRight } from 'react-icons/fi';
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
import { getTenants } from '../../api/tenantApi';
import { formatCurrency, formatDate } from '../../utils/format';

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'expiring', label: 'Expiring' },
  { value: 'terminated', label: 'Terminated' },
];

const STATUS_BADGE = {
  active: { variant: 'green', label: 'Active' },
  expiring: { variant: 'yellow', label: 'Expiring' },
  terminated: { variant: 'red', label: 'Terminated' },
};

const TenantList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [profile, setProfile] = useState(null);
  const debouncedSearch = useDebounce(search, 300);
  const pagination = usePagination(1, 10);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { data: res } = await getTenants({ page: pagination.page, limit: pagination.limit, search: debouncedSearch, status: statusFilter || undefined });
      setData(res.data || []);
      pagination.setTotal(res.pagination?.total || 0);
    } catch {} finally { setLoading(false); }
  }, [pagination.page, pagination.limit, debouncedSearch, statusFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);
  useEffect(() => { pagination.setPage(1); }, [debouncedSearch, statusFilter]);

  const columns = [
    { key: 'name', label: 'Tenant', render: (r) => (
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => setProfile(r)}>
        <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-sm font-semibold text-indigo-700 dark:text-indigo-300">
          {r.name?.charAt(0)?.toUpperCase()}
        </div>
        <div><p className="font-medium text-gray-900 dark:text-white">{r.name}</p><p className="text-xs text-gray-500 dark:text-gray-400">{r.email}</p></div>
      </div>
    )},
    { key: 'unit', label: 'Unit', render: (r) => <span className="text-sm text-gray-600 dark:text-gray-400">{r.unit}</span> },
    { key: 'property', label: 'Property', render: (r) => <span className="text-sm text-gray-600 dark:text-gray-400">{r.property}</span> },
    { key: 'rent', label: 'Rent', render: (r) => <span className="text-sm font-medium text-gray-900 dark:text-white">{formatCurrency(r.rent)}</span> },
    { key: 'status', label: 'Status', render: (r) => { const s = STATUS_BADGE[r.status] || STATUS_BADGE.active; return <Badge variant={s.variant} size="sm">{s.label}</Badge>; }},
    { key: 'actions', label: '', render: (r) => (
      <button onClick={() => setProfile(r)} className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors">
        <FiChevronRight size={16} />
      </button>
    )},
  ];

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tenants</h1><p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage all tenants across your properties</p></div>

      <Card className="animate-fade-in">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <SearchBar value={search} onChange={setSearch} placeholder="Search tenants..." className="sm:w-72" />
          <FilterDropdown label="Status" options={STATUS_OPTIONS} value={statusFilter} onChange={setStatusFilter} />
        </div>
        {loading ? <CardSkeleton /> : data.length === 0 ? (
          <EmptyState icon={FiUsers} title="No tenants found" description={search ? 'Try a different search term' : 'No tenants registered yet.'} />
        ) : (
          <>
            <DataTable columns={columns} data={data} />
            <Pagination page={pagination.page} totalPages={pagination.totalPages} total={pagination.total} onPageChange={pagination.goToPage} limit={pagination.limit} onLimitChange={pagination.setLimit} />
          </>
        )}
      </Card>

      {/* Profile Drawer */}
      {profile && (
        <div className="fixed inset-0 z-40 flex justify-end">
          <div className="fixed inset-0 bg-black/40 animate-fade-in" onClick={() => setProfile(null)} />
          <div className="relative w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl animate-slide-right overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Tenant Profile</h2>
              <button onClick={() => setProfile(null)} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"><FiX size={18} /></button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-2xl font-bold text-indigo-700 dark:text-indigo-300">{profile.name?.charAt(0)?.toUpperCase()}</div>
                <div><h3 className="text-xl font-bold text-gray-900 dark:text-white">{profile.name}</h3><p className="text-sm text-gray-500 dark:text-gray-400">{profile.email}</p></div>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/30"><FiPhone size={16} className="text-gray-400" /><span className="text-sm text-gray-700 dark:text-gray-300">{profile.phone}</span></div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/30"><FiHome size={16} className="text-gray-400" /><span className="text-sm text-gray-700 dark:text-gray-300">{profile.unit} — {profile.building}</span></div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/30"><FiCalendar size={16} className="text-gray-400" /><span className="text-sm text-gray-700 dark:text-gray-300">{formatDate(profile.lease_start)} — {formatDate(profile.lease_end)}</span></div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/30"><FiDollarSign size={16} className="text-gray-400" /><span className="text-sm text-gray-700 dark:text-gray-300">{formatCurrency(profile.rent)}/month</span></div>
              </div>
              <div><span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium">Status</span><div className="mt-1">{(() => { const s = STATUS_BADGE[profile.status] || STATUS_BADGE.active; return <Badge variant={s.variant}>{s.label}</Badge>; })()}</div></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TenantList;
