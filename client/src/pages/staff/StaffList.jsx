import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiUsers } from 'react-icons/fi';
import Card from '../../components/ui/Card';
import DataTable from '../../components/ui/DataTable';
import Button from '../../components/ui/Button';
import SearchBar from '../../components/ui/SearchBar';
import Pagination from '../../components/ui/Pagination';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import FilterDropdown from '../../components/ui/FilterDropdown';
import EmptyState from '../../components/ui/EmptyState';
import Badge from '../../components/ui/Badge';
import { CardSkeleton } from '../../components/ui/LoadingSkeleton';
import { useToast } from '../../contexts/ToastContext';
import { useDebounce } from '../../hooks/useDebounce';
import { usePagination } from '../../hooks/usePagination';
import { getStaff, deleteStaff } from '../../api/staffApi';
import { formatDate } from '../../utils/format';

const ROLE_OPTIONS = [
  { value: 'PROPERTY_MANAGER', label: 'Property Manager' },
  { value: 'CARETAKER', label: 'Caretaker' },
  { value: 'ACCOUNTANT', label: 'Accountant' },
];

const ROLE_BADGE = {
  PROPERTY_MANAGER: { variant: 'blue', label: 'Property Manager' },
  CARETAKER: { variant: 'yellow', label: 'Caretaker' },
  ACCOUNTANT: { variant: 'purple', label: 'Accountant' },
};

const StaffList = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const debouncedSearch = useDebounce(search, 300);
  const pagination = usePagination(1, 10);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { data: res } = await getStaff({ page: pagination.page, limit: pagination.limit, search: debouncedSearch || undefined, role: roleFilter || undefined });
      setData(res.data || []);
      pagination.setTotal(res.pagination?.total || 0);
    } catch { toast.error('Failed to load staff'); }
    finally { setLoading(false); }
  }, [pagination.page, pagination.limit, debouncedSearch, roleFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);
  useEffect(() => { pagination.setPage(1); }, [debouncedSearch, roleFilter]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteStaff(deleteTarget.id);
      setDeleteTarget(null);
      fetchData();
      toast.success('Staff member removed');
    } catch { toast.error('Failed to remove staff member'); }
    finally { setDeleting(false); }
  };

  const columns = [
    { key: 'name', label: 'Name', render: (r) => (
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-sm font-semibold text-indigo-700 dark:text-indigo-300">
          {r.name?.charAt(0)?.toUpperCase()}
        </div>
        <div>
          <p className="font-medium text-gray-900 dark:text-white">{r.name}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{r.email}</p>
        </div>
      </div>
    )},
    { key: 'role', label: 'Role', render: (r) => {
      const badge = ROLE_BADGE[r.role] || { variant: 'gray', label: r.role };
      return <Badge variant={badge.variant} size="sm">{badge.label}</Badge>;
    }},
    { key: 'phone', label: 'Phone', render: (r) => <span className="text-sm text-gray-600 dark:text-gray-400">{r.phone || '-'}</span> },
    { key: 'is_active', label: 'Status', render: (r) => (
      <Badge variant={r.is_active ? 'green' : 'red'} size="sm">{r.is_active ? 'Active' : 'Inactive'}</Badge>
    )},
    { key: 'created_at', label: 'Added', render: (r) => <span className="text-sm text-gray-600 dark:text-gray-400">{formatDate(r.created_at)}</span> },
    { key: 'actions', label: '', render: (r) => (
      <div className="flex items-center gap-1 justify-end">
        <button onClick={() => navigate(`/staff/${r.id}/edit`)} className="p-2 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"><FiEdit2 size={16} /></button>
        <button onClick={() => setDeleteTarget(r)} className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"><FiTrash2 size={16} /></button>
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Staff</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage property managers, caretakers, and accountants</p>
        </div>
        <Button onClick={() => navigate('/staff/new')}><FiPlus size={16} className="mr-1.5" />Add Staff</Button>
      </div>

      <Card className="animate-fade-in">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <SearchBar value={search} onChange={setSearch} placeholder="Search staff..." className="sm:w-72" />
          <FilterDropdown label="Role" options={ROLE_OPTIONS} value={roleFilter} onChange={setRoleFilter} />
        </div>

        {loading ? (
          <CardSkeleton />
        ) : data.length === 0 ? (
          <EmptyState icon={FiUsers} title="No staff found" description={search ? 'Try a different search term' : 'Get started by adding your first staff member.'} actionLabel={!search && !roleFilter ? 'Add Staff' : undefined} onAction={() => navigate('/staff/new')} />
        ) : (
          <>
            <DataTable columns={columns} data={data} />
            <Pagination page={pagination.page} totalPages={pagination.totalPages} total={pagination.total} onPageChange={pagination.goToPage} limit={pagination.limit} onLimitChange={pagination.setLimit} />
          </>
        )}
      </Card>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete}
        title="Remove Staff Member" message={`Are you sure you want to remove "${deleteTarget?.name}"? This action cannot be undone.`} loading={deleting} />
    </div>
  );
};

export default StaffList;
