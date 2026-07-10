import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiChevronDown, FiChevronRight, FiLayers } from 'react-icons/fi';
import Card from '../../components/ui/Card';
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
import { getBuildings, deleteBuilding, createBuilding } from '../../api/buildingApi';
import { getProperties } from '../../api/propertyApi';
import { formatDate, formatNumber } from '../../utils/format';

const BuildingList = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [propertyFilter, setPropertyFilter] = useState('');
  const [properties, setProperties] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [expanded, setExpanded] = useState(null);

  const debouncedSearch = useDebounce(search, 300);
  const pagination = usePagination(1, 10);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page: pagination.page, limit: pagination.limit, search: debouncedSearch || undefined, property_id: propertyFilter || undefined };
      const { data: res } = await getBuildings(params);
      setData(res.data || []);
      pagination.setTotal(res.pagination?.total || 0);
    } catch { toast.error('Failed to load buildings'); }
    finally { setLoading(false); }
  }, [pagination.page, pagination.limit, debouncedSearch, propertyFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);
  useEffect(() => { getProperties({ limit: 200 }).then(({ data }) => setProperties(data.data || [])).catch(() => {}); }, []);
  useEffect(() => { pagination.setPage(1); }, [debouncedSearch, propertyFilter]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const deleted = { ...deleteTarget };
      await deleteBuilding(deleteTarget.id);
      setDeleteTarget(null);
      fetchData();
      toast.success('Building deleted successfully', {
        onClick: async () => {
          try {
            await createBuilding({ name: deleted.name, property_id: deleted.property_id, floors: deleted.floors, description: deleted.description });
            fetchData();
          } catch {}
        }
      });
    } catch { toast.error('Failed to delete building'); }
    finally { setDeleting(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Buildings</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage buildings within your properties</p>
        </div>
        <Button onClick={() => navigate('/buildings/new')}><FiPlus size={16} className="mr-1.5" />Add Building</Button>
      </div>

      <Card className="animate-fade-in">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <SearchBar value={search} onChange={setSearch} placeholder="Search buildings..." className="sm:w-72" />
          <select value={propertyFilter} onChange={(e) => setPropertyFilter(e.target.value)} className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300">
            <option value="">All Properties</option>
            {properties.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}</div>
        ) : data.length === 0 ? (
          <EmptyState icon={FiLayers} title="No buildings found" description={search ? 'Try a different search term' : 'Get started by adding your first building.'} actionLabel={!search && !propertyFilter ? 'Add Building' : undefined} onAction={() => navigate('/buildings/new')} />
        ) : (
          <div className="space-y-2">
            {data.map((building, i) => (
              <div key={building.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden animate-fade-in" style={{ animationDelay: `${i * 30}ms` }}>
                <button
                  onClick={() => setExpanded(expanded === building.id ? null : building.id)}
                  className="w-full flex items-center justify-between px-4 py-3.5 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    {expanded === building.id ? <FiChevronDown size={18} className="text-gray-400" /> : <FiChevronRight size={18} className="text-gray-400" />}
                    <div className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-700 dark:text-amber-300"><FiLayers size={16} /></div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{building.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{building.property_name || `Property #${building.property_id}`} &middot; {formatNumber(building.units_count || 0)} units</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {building.units_count > 0 && <Badge variant="blue" size="sm">{building.units_count} units</Badge>}
                    <Badge variant={building.is_active ? 'green' : 'red'} size="sm">{building.is_active ? 'Active' : 'Inactive'}</Badge>
                    <button onClick={(e) => { e.stopPropagation(); navigate(`/buildings/${building.id}/edit`); }} className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"><FiEdit2 size={14} /></button>
                    <button onClick={(e) => { e.stopPropagation(); setDeleteTarget(building); }} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"><FiTrash2 size={14} /></button>
                  </div>
                </button>
                {expanded === building.id && (
                  <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 animate-fade-in">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                      <div><span className="text-gray-500 dark:text-gray-400">Floors</span><p className="font-medium text-gray-900 dark:text-white">{building.floors || '-'}</p></div>
                      <div><span className="text-gray-500 dark:text-gray-400">Total Units</span><p className="font-medium text-gray-900 dark:text-white">{formatNumber(building.units_count || 0)}</p></div>
                      <div><span className="text-gray-500 dark:text-gray-400">Created</span><p className="font-medium text-gray-900 dark:text-white">{formatDate(building.created_at)}</p></div>
                      <div><span className="text-gray-500 dark:text-gray-400">Description</span><p className="font-medium text-gray-900 dark:text-white truncate">{building.description || '-'}</p></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        <Pagination page={pagination.page} totalPages={pagination.totalPages} total={pagination.total} onPageChange={pagination.goToPage} limit={pagination.limit} onLimitChange={pagination.setLimit} />
      </Card>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete}
        title="Delete Building" message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`} loading={deleting} />
    </div>
  );
};

export default BuildingList;
