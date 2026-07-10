import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiHome, FiGrid, FiList, FiMapPin } from 'react-icons/fi';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
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
import { getProperties, deleteProperty, createProperty } from '../../api/propertyApi';
import { getCompanies } from '../../api/companyApi';
import { formatDate } from '../../utils/format';

const PropertyList = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [companies, setCompanies] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortDir, setSortDir] = useState('desc');

  const debouncedSearch = useDebounce(search, 300);
  const pagination = usePagination(1, 12);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { data: res } = await getProperties({ page: pagination.page, limit: pagination.limit, search: debouncedSearch || undefined, company_id: companyFilter || undefined, sortBy, sortDirection: sortDir });
      setData(res.data || []);
      pagination.setTotal(res.pagination?.total || 0);
    } catch { toast.error('Failed to load properties'); }
    finally { setLoading(false); }
  }, [pagination.page, pagination.limit, debouncedSearch, companyFilter, sortBy, sortDir]);

  useEffect(() => { fetchData(); }, [fetchData]);

  useEffect(() => {
    getCompanies({ limit: 100 }).then(({ data }) => setCompanies(data.data || [])).catch(() => {});
  }, []);

  useEffect(() => { pagination.setPage(1); }, [debouncedSearch, companyFilter]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const deleted = { ...deleteTarget };
      await deleteProperty(deleteTarget.id);
      setDeleteTarget(null);
      fetchData();
      toast.success('Property deleted successfully', {
        onClick: async () => {
          try {
            await createProperty({ name: deleted.name, company_id: deleted.company_id, location: deleted.location, address: deleted.address });
            fetchData();
          } catch {}
        }
      });
    } catch { toast.error('Failed to delete property'); }
    finally { setDeleting(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Properties</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your property portfolio</p>
        </div>
        <Button onClick={() => navigate('/properties/new')}><FiPlus size={16} className="mr-1.5" />Add Property</Button>
      </div>

      <Card className="animate-fade-in">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <SearchBar value={search} onChange={setSearch} placeholder="Search properties..." className="sm:w-72" />
          <select value={companyFilter} onChange={(e) => setCompanyFilter(e.target.value)} className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300">
            <option value="">All Companies</option>
            {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <div className="flex ml-auto gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button onClick={() => setViewMode('grid')} className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white dark:bg-gray-600 shadow-sm text-indigo-600' : 'text-gray-500'}`}><FiGrid size={16} /></button>
            <button onClick={() => setViewMode('list')} className={`p-2 rounded ${viewMode === 'list' ? 'bg-white dark:bg-gray-600 shadow-sm text-indigo-600' : 'text-gray-500'}`}><FiList size={16} /></button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : data.length === 0 ? (
          <EmptyState icon={FiHome} title="No properties found" description={search ? 'Try a different search term' : 'Get started by adding your first property.'} actionLabel={!search && !companyFilter ? 'Add Property' : undefined} onAction={() => navigate('/properties/new')} />
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.map((property, i) => (
              <Card key={property.id} hover onClick={() => navigate(`/properties/${property.id}/edit`)} className={`flex flex-col animate-fade-in stagger-${Math.min(i + 1, 8)}`}>
                <div className="h-40 -mx-6 -mt-6 mb-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-t-xl flex items-center justify-center">
                  <FiHome size={48} className="text-white/60" />
                </div>
                <CardHeader className="mb-2">
                  <CardTitle className="text-base">{property.name}</CardTitle>
                  <Badge variant={property.is_active ? 'green' : 'red'} size="sm">{property.is_active ? 'Active' : 'Inactive'}</Badge>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mb-1"><FiMapPin size={14} />{property.location || property.address || 'No address'}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">Created {formatDate(property.created_at)}</p>
                </CardContent>
                <div className="flex justify-end gap-1 pt-3 border-t border-gray-100 dark:border-gray-700 mt-3">
                  <button onClick={(e) => { e.stopPropagation(); navigate(`/properties/${property.id}/edit`); }} className="p-2 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"><FiEdit2 size={15} /></button>
                  <button onClick={(e) => { e.stopPropagation(); setDeleteTarget(property); }} className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"><FiTrash2 size={15} /></button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Location</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Created</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                {data.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 cursor-pointer transition-colors animate-fade-in" onClick={() => navigate(`/properties/${p.id}/edit`)}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-700 dark:text-indigo-300"><FiHome size={16} /></div>
                        <span className="font-medium text-gray-900 dark:text-white">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{p.location || p.address || '-'}</td>
                    <td className="px-4 py-3"><Badge variant={p.is_active ? 'green' : 'red'} size="sm">{p.is_active ? 'Active' : 'Inactive'}</Badge></td>
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{formatDate(p.created_at)}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={(e) => { e.stopPropagation(); navigate(`/properties/${p.id}/edit`); }} className="p-2 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"><FiEdit2 size={15} /></button>
                      <button onClick={(e) => { e.stopPropagation(); setDeleteTarget(p); }} className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"><FiTrash2 size={15} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
        <Pagination page={pagination.page} totalPages={pagination.totalPages} total={pagination.total} onPageChange={pagination.goToPage} limit={pagination.limit} onLimitChange={pagination.setLimit} />
      </Card>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete}
        title="Delete Property" message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`} loading={deleting} />
    </div>
  );
};

export default PropertyList;
