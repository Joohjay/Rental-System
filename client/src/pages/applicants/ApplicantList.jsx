import { useState, useEffect, useCallback } from 'react';
import { FiUsers, FiCheck, FiX, FiEye, FiMail, FiPhone, FiHome, FiCalendar, FiDollarSign } from 'react-icons/fi';
import Card from '../../components/ui/Card';
import DataTable from '../../components/ui/DataTable';
import Button from '../../components/ui/Button';
import SearchBar from '../../components/ui/SearchBar';
import Pagination from '../../components/ui/Pagination';
import FilterDropdown from '../../components/ui/FilterDropdown';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import { CardSkeleton } from '../../components/ui/LoadingSkeleton';
import { useToast } from '../../contexts/ToastContext';
import { useDebounce } from '../../hooks/useDebounce';
import { usePagination } from '../../hooks/usePagination';
import { getApplicants, getApplicant, updateApplicantStatus } from '../../api/applicantApi';
import { formatCurrency, formatDate } from '../../utils/format';

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'withdrawn', label: 'Withdrawn' },
];

const STATUS_BADGE = {
  pending: { variant: 'yellow', label: 'Pending' },
  approved: { variant: 'green', label: 'Approved' },
  rejected: { variant: 'red', label: 'Rejected' },
  withdrawn: { variant: 'gray', label: 'Withdrawn' },
};

const ApplicantList = () => {
  const { toast } = useToast();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  const debouncedSearch = useDebounce(search, 300);
  const pagination = usePagination(1, 10);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { data: res } = await getApplicants({ page: pagination.page, limit: pagination.limit, search: debouncedSearch || undefined, status: statusFilter || undefined });
      setData(res.data || []);
      pagination.setTotal(res.pagination?.total || 0);
    } catch { toast.error('Failed to load applicants'); }
    finally { setLoading(false); }
  }, [pagination.page, pagination.limit, debouncedSearch, statusFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);
  useEffect(() => { pagination.setPage(1); }, [debouncedSearch, statusFilter]);

  const handleViewProfile = async (applicant) => {
    setProfileLoading(true);
    try {
      const { data: res } = await getApplicant(applicant.id);
      setProfile(res.data);
    } catch {
      toast.error('Failed to load applicant details');
    } finally { setProfileLoading(false); }
  };

  const handleStatusChange = async (applicant, newStatus) => {
    setActionLoading(applicant.id);
    try {
      await updateApplicantStatus(applicant.id, newStatus);
      toast.success(`Application ${newStatus}`);
      fetchData();
      if (profile?.id === applicant.id) {
        setProfile((prev) => prev ? { ...prev, application_status: newStatus } : null);
      }
    } catch {
      toast.error('Failed to update application status');
    } finally { setActionLoading(null); }
  };

  const columns = [
    { key: 'name', label: 'Applicant', render: (r) => (
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center text-sm font-semibold text-teal-700 dark:text-teal-300">
          {r.name?.charAt(0)?.toUpperCase()}
        </div>
        <div>
          <p className="font-medium text-gray-900 dark:text-white">{r.name}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{r.email}</p>
        </div>
      </div>
    )},
    { key: 'property_name', label: 'Property', render: (r) => <span className="text-sm text-gray-600 dark:text-gray-400">{r.property_name || '-'}</span> },
    { key: 'unit_name', label: 'Unit', render: (r) => <span className="text-sm text-gray-600 dark:text-gray-400">{r.unit_name || '-'}</span> },
    { key: 'applied_at', label: 'Applied', render: (r) => <span className="text-sm text-gray-600 dark:text-gray-400">{formatDate(r.applied_at)}</span> },
    { key: 'application_status', label: 'Status', render: (r) => {
      const badge = STATUS_BADGE[r.application_status] || STATUS_BADGE.pending;
      return <Badge variant={badge.variant} size="sm">{badge.label}</Badge>;
    }},
    { key: 'actions', label: '', render: (r) => (
      <div className="flex items-center gap-1 justify-end">
        {r.application_status === 'pending' && (
          <>
            <button onClick={() => handleStatusChange(r, 'approved')} disabled={actionLoading === r.id}
              className="p-2 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors disabled:opacity-50">
              <FiCheck size={16} />
            </button>
            <button onClick={() => handleStatusChange(r, 'rejected')} disabled={actionLoading === r.id}
              className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50">
              <FiX size={16} />
            </button>
          </>
        )}
        <button onClick={() => handleViewProfile(r)} disabled={actionLoading === r.id}
          className="p-2 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors">
          <FiEye size={16} />
        </button>
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Applicants</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Review and manage rental applications</p>
      </div>

      <Card className="animate-fade-in">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <SearchBar value={search} onChange={setSearch} placeholder="Search applicants..." className="sm:w-72" />
          <FilterDropdown label="Status" options={STATUS_OPTIONS} value={statusFilter} onChange={setStatusFilter} />
        </div>
        {loading ? <CardSkeleton /> : data.length === 0 ? (
          <EmptyState icon={FiUsers} title="No applicants found" description={search ? 'Try a different search term' : 'No applications received yet.'} />
        ) : (
          <>
            <DataTable columns={columns} data={data} />
            <Pagination page={pagination.page} totalPages={pagination.totalPages} total={pagination.total} onPageChange={pagination.goToPage} limit={pagination.limit} onLimitChange={pagination.setLimit} />
          </>
        )}
      </Card>

      {profile && (
        <div className="fixed inset-0 z-40 flex justify-end">
          <div className="fixed inset-0 bg-black/40 animate-fade-in" onClick={() => setProfile(null)} />
          <div className="relative w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl animate-slide-right overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Applicant Profile</h2>
              <button onClick={() => setProfile(null)} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"><FiX size={18} /></button>
            </div>
            {profileLoading ? (
              <div className="p-6 space-y-4"><CardSkeleton /></div>
            ) : (
              <div className="p-6 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center text-2xl font-bold text-teal-700 dark:text-teal-300">
                    {profile.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{profile.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{profile.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/30">
                    <FiMail size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{profile.email}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/30">
                    <FiPhone size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{profile.phone || '-'}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/30">
                    <FiHome size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{profile.unit_name} — {profile.building_name}, {profile.property_name}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/30">
                    <FiCalendar size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Applied {formatDate(profile.applied_at)}</span>
                  </div>
                </div>

                {profile.income && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/30">
                    <FiDollarSign size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Income: {formatCurrency(profile.income)}/month</span>
                  </div>
                )}

                <div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium">Status</span>
                  <div className="mt-2 flex gap-2">
                    {(() => {
                      const badge = STATUS_BADGE[profile.application_status] || STATUS_BADGE.pending;
                      return <Badge variant={badge.variant}>{badge.label}</Badge>;
                    })()}
                  </div>
                  {profile.application_status === 'pending' && (
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" onClick={() => { handleStatusChange(profile, 'approved'); }}><FiCheck size={14} className="mr-1" />Approve</Button>
                      <Button size="sm" variant="secondary" onClick={() => { handleStatusChange(profile, 'rejected'); }}><FiX size={14} className="mr-1" />Reject</Button>
                    </div>
                  )}
                </div>

                {profile.message && (
                  <div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium">Message</span>
                    <p className="mt-1 text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg">{profile.message}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicantList;
