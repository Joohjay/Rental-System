import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiGrid } from 'react-icons/fi';
import Card from '../../components/ui/Card';
import DataTable from '../../components/ui/DataTable';
import Button from '../../components/ui/Button';
import SearchBar from '../../components/ui/SearchBar';
import Pagination from '../../components/ui/Pagination';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import { CardSkeleton } from '../../components/ui/LoadingSkeleton';
import { useToast } from '../../contexts/ToastContext';
import { useDebounce } from '../../hooks/useDebounce';
import { usePagination } from '../../hooks/usePagination';
import { getCompanies, deleteCompany, createCompany } from '../../api/companyApi';
import { formatDate } from '../../utils/format';

const CompanyList = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortDir, setSortDir] = useState('desc');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const debouncedSearch = useDebounce(search, 300);
  const pagination = usePagination(1, 10);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { data: res } = await getCompanies({
        page: pagination.page, limit: pagination.limit,
        search: debouncedSearch || undefined, sortBy, sortDirection: sortDir,
      });
      setData(res.data || []);
      pagination.setTotal(res.pagination?.total || 0);
    } catch {
      toast.error('Failed to load companies');
    } finally { setLoading(false); }
  }, [pagination.page, pagination.limit, debouncedSearch, sortBy, sortDir]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSort = (key) => {
    if (sortBy === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortBy(key); setSortDir('asc'); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const deletedItem = { ...deleteTarget };
      await deleteCompany(deleteTarget.id);
      setDeleteTarget(null);
      fetchData();
      toast.success('Company deleted successfully', {
        onClick: async () => {
          try {
            await createCompany({ name: deletedItem.name, email: deletedItem.email, phone: deletedItem.phone, address: deletedItem.address });
            fetchData();
          } catch {}
        }
      });
    } catch {
      toast.error('Failed to delete company');
    } finally { setDeleting(false); }
  };

  useEffect(() => { pagination.setPage(1); }, [debouncedSearch]);

  const columns = [
    { key: 'name', label: 'Name', sortable: true, render: (r) => (
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-semibold text-sm">
          {r.name?.charAt(0)?.toUpperCase() || 'C'}
        </div>
        <div>
          <p className="font-medium text-gray-900 dark:text-white">{r.name}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{r.email || '-'}</p>
        </div>
      </div>
    )},
    { key: 'phone', label: 'Phone', render: (r) => r.phone || '-' },
    { key: 'is_active', label: 'Status', sortable: true, render: (r) => (
      <Badge variant={r.is_active ? 'green' : 'red'}>{r.is_active ? 'Active' : 'Inactive'}</Badge>
    )},
    { key: 'created_at', label: 'Created', sortable: true, render: (r) => (
      <span className="text-gray-500 dark:text-gray-400">{formatDate(r.created_at)}</span>
    )},
    { key: 'actions', label: '', render: (r) => (
      <div className="flex items-center gap-1 justify-end">
        <button onClick={(e) => { e.stopPropagation(); navigate(`/companies/${r.id}/edit`); }} className="p-2 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"><FiEdit2 size={16} /></button>
        <button onClick={(e) => { e.stopPropagation(); setDeleteTarget(r); }} className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"><FiTrash2 size={16} /></button>
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Companies</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage all registered companies</p>
        </div>
        <Button onClick={() => navigate('/companies/new')}>
          <FiPlus size={16} className="mr-1.5" />
          Add Company
        </Button>
      </div>

      <Card className="animate-fade-in">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <SearchBar value={search} onChange={setSearch} placeholder="Search companies..." className="sm:w-72" />
        </div>

        {loading ? <CardSkeleton /> : data.length === 0 ? (
          <EmptyState icon={FiGrid} title="No companies found" description={search ? 'Try a different search term' : 'Get started by creating your first company.'} actionLabel={!search ? 'Add Company' : undefined} onAction={() => navigate('/companies/new')} />
        ) : (
          <>
            <DataTable columns={columns} data={data} sortBy={sortBy} sortDirection={sortDir} onSort={handleSort} loading={loading} />
            <Pagination page={pagination.page} totalPages={pagination.totalPages} total={pagination.total} onPageChange={pagination.goToPage} limit={pagination.limit} onLimitChange={pagination.setLimit} />
          </>
        )}
      </Card>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete}
        title="Delete Company" message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`} loading={deleting} />
    </div>
  );
};

export default CompanyList;
