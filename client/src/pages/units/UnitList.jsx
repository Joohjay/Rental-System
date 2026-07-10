import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiSquare } from 'react-icons/fi';
import Card from '../../components/ui/Card';
import DataTable from '../../components/ui/DataTable';
import Button from '../../components/ui/Button';
import SearchBar from '../../components/ui/SearchBar';
import Pagination from '../../components/ui/Pagination';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import FilterDropdown from '../../components/ui/FilterDropdown';
import EmptyState from '../../components/ui/EmptyState';
import { CardSkeleton } from '../../components/ui/LoadingSkeleton';
import { useToast } from '../../contexts/ToastContext';
import { useDebounce } from '../../hooks/useDebounce';
import { usePagination } from '../../hooks/usePagination';
import { getUnits, deleteUnit, updateUnit, createUnit } from '../../api/unitApi';
import { formatCurrency } from '../../utils/format';

const STATUS_OPTIONS = [
  { value: 'available', label: 'Available' },
  { value: 'occupied', label: 'Occupied' },
  { value: 'reserved', label: 'Reserved' },
  { value: 'maintenance', label: 'Maintenance' },
];

const UnitList = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(null);

  const debouncedSearch = useDebounce(search, 300);
  const pagination = usePagination(1, 10);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page: pagination.page, limit: pagination.limit, search: debouncedSearch || undefined, status: statusFilter || undefined, sortBy: 'created_at', sortDirection: 'desc' };
      const { data: res } = await getUnits(params);
      setData(res.data || []);
      pagination.setTotal(res.pagination?.total || 0);
    } catch { toast.error('Failed to load units'); }
    finally { setLoading(false); }
  }, [pagination.page, pagination.limit, debouncedSearch, statusFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);
  useEffect(() => { pagination.setPage(1); }, [debouncedSearch, statusFilter]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const deleted = { ...deleteTarget };
      await deleteUnit(deleteTarget.id);
      setDeleteTarget(null);
      fetchData();
      toast.success('Unit deleted successfully', {
        onClick: async () => {
          try {
            await createUnit({ name: deleted.name, building_id: deleted.building_id, rent_amount: deleted.rent_amount, status: deleted.status });
            fetchData();
          } catch {}
        }
      });
    } catch { toast.error('Failed to delete unit'); }
    finally { setDeleting(false); }
  };

  const handleStatusChange = async (unit, newStatus) => {
    setUpdatingStatus(unit.id);
    try {
      await updateUnit(unit.id, { ...unit, status: newStatus });
      toast.success(`Unit status changed to ${STATUS_OPTIONS.find((o) => o.value === newStatus)?.label || newStatus}`);
      fetchData();
    } catch { toast.error('Failed to update unit status'); }
    finally { setUpdatingStatus(null); }
  };

  const columns = [
    { key: 'name', label: 'Unit', render: (r) => (
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center text-pink-700 dark:text-pink-300"><FiSquare size={16} /></div>
        <div>
          <p className="font-medium text-gray-900 dark:text-white">{r.name}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{r.building_name || `Building #${r.building_id}`}</p>
        </div>
      </div>
    )},
    { key: 'building_name', label: 'Building', render: (r) => <span className="text-sm text-gray-600 dark:text-gray-400">{r.building_name || '-'}</span> },
    { key: 'rent_amount', label: 'Rent', render: (r) => <span className="text-sm font-medium text-gray-900 dark:text-white">{r.rent_amount ? formatCurrency(r.rent_amount) : '-'}</span> },
    { key: 'status', label: 'Status', render: (r) => (
      <div className="relative">
        <select
          value={r.status}
          onChange={(e) => handleStatusChange(r, e.target.value)}
          disabled={updatingStatus === r.id}
          className={`appearance-none px-2.5 py-1 pr-6 rounded-full text-xs font-medium border-0 cursor-pointer focus:ring-2 focus:ring-indigo-500 ${
            r.status === 'available' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
            r.status === 'occupied' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
            r.status === 'reserved' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
            'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
          }`}
        >
          {STATUS_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
        {updatingStatus === r.id && <svg className="absolute right-2 top-1/2 -translate-y-1/2 animate-spin h-3 w-3 text-gray-500" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>}
      </div>
    )},
    { key: 'actions', label: '', render: (r) => (
      <div className="flex items-center gap-1 justify-end">
        <button onClick={(e) => { e.stopPropagation(); navigate(`/units/${r.id}/edit`); }} className="p-2 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"><FiEdit2 size={16} /></button>
        <button onClick={(e) => { e.stopPropagation(); setDeleteTarget(r); }} className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"><FiTrash2 size={16} /></button>
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Units</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage all rental units</p>
        </div>
        <Button onClick={() => navigate('/units/new')}><FiPlus size={16} className="mr-1.5" />Add Unit</Button>
      </div>

      <Card className="animate-fade-in">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <SearchBar value={search} onChange={setSearch} placeholder="Search units..." className="sm:w-72" />
          <FilterDropdown label="Status" options={STATUS_OPTIONS} value={statusFilter} onChange={setStatusFilter} />
        </div>

        {loading ? <CardSkeleton /> : data.length === 0 ? (
          <EmptyState icon={FiSquare} title="No units found" description={search ? 'Try a different search term' : 'Get started by adding your first unit.'} actionLabel={!search && !statusFilter ? 'Add Unit' : undefined} onAction={() => navigate('/units/new')} />
        ) : (
          <>
            <DataTable columns={columns} data={data} />
            <Pagination page={pagination.page} totalPages={pagination.totalPages} total={pagination.total} onPageChange={pagination.goToPage} limit={pagination.limit} onLimitChange={pagination.setLimit} />
          </>
        )}
      </Card>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete}
        title="Delete Unit" message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`} loading={deleting} />
    </div>
  );
};

export default UnitList;
