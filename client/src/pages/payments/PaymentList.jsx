import { useState, useEffect, useCallback } from 'react';
import { FiDollarSign, FiDownload, FiX } from 'react-icons/fi';
import Card from '../../components/ui/Card';
import DataTable from '../../components/ui/DataTable';
import SearchBar from '../../components/ui/SearchBar';
import Pagination from '../../components/ui/Pagination';
import FilterDropdown from '../../components/ui/FilterDropdown';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import EmptyState from '../../components/ui/EmptyState';
import { CardSkeleton } from '../../components/ui/LoadingSkeleton';
import { useDebounce } from '../../hooks/useDebounce';
import { usePagination } from '../../hooks/usePagination';
import { getPayments } from '../../api/paymentApi';
import { formatCurrency, formatDate } from '../../utils/format';

const STATUS_OPTIONS = [
  { value: 'paid', label: 'Paid' },
  { value: 'pending', label: 'Pending' },
  { value: 'overdue', label: 'Overdue' },
];

const STATUS_BADGE = {
  paid: { variant: 'green', label: 'Paid' },
  pending: { variant: 'yellow', label: 'Pending' },
  overdue: { variant: 'red', label: 'Overdue' },
};

const PaymentList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [receipt, setReceipt] = useState(null);
  const debouncedSearch = useDebounce(search, 300);
  const pagination = usePagination(1, 10);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { data: res } = await getPayments({ page: pagination.page, limit: pagination.limit, search: debouncedSearch, status: statusFilter || undefined });
      setData(res.data || []);
      pagination.setTotal(res.pagination?.total || 0);
    } catch {} finally { setLoading(false); }
  }, [pagination.page, pagination.limit, debouncedSearch, statusFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);
  useEffect(() => { pagination.setPage(1); }, [debouncedSearch, statusFilter]);

  const totalCollected = data.reduce((sum, p) => sum + (p.status === 'paid' ? p.amount : 0), 0);
  const totalOutstanding = data.reduce((sum, p) => sum + ((p.status === 'pending' || p.status === 'overdue') ? p.amount : 0), 0);

  const columns = [
    { key: 'tenant', label: 'Tenant', render: (r) => <span className="font-medium text-gray-900 dark:text-white">{r.tenant}</span> },
    { key: 'unit', label: 'Unit', render: (r) => <span className="text-sm text-gray-600 dark:text-gray-400">{r.unit}</span> },
    { key: 'period', label: 'Period', render: (r) => <span className="text-sm text-gray-500 dark:text-gray-400">{r.period}</span> },
    { key: 'amount', label: 'Amount', render: (r) => <span className="text-sm font-medium text-gray-900 dark:text-white">{formatCurrency(r.amount)}</span> },
    { key: 'method', label: 'Method', render: (r) => <span className="text-sm text-gray-500 dark:text-gray-400">{r.method || '-'}</span> },
    { key: 'date', label: 'Date', render: (r) => <span className="text-sm text-gray-500 dark:text-gray-400">{r.date ? formatDate(r.date) : '-'}</span> },
    { key: 'status', label: 'Status', render: (r) => { const s = STATUS_BADGE[r.status] || STATUS_BADGE.pending; return <Badge variant={s.variant} size="sm">{s.label}</Badge>; }},
    { key: 'actions', label: '', render: (r) => r.status === 'paid' ? (
      <button onClick={() => setReceipt(r)} className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"><FiDownload size={15} /></button>
    ) : null },
  ];

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-900 dark:text-white">Payments</h1><p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Track rent payments and receipts</p></div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card><p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Collected</p><p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">{formatCurrency(totalCollected)}</p></Card>
        <Card><p className="text-sm font-medium text-gray-500 dark:text-gray-400">Outstanding</p><p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">{formatCurrency(totalOutstanding)}</p></Card>
        <Card><p className="text-sm font-medium text-gray-500 dark:text-gray-400">Transactions</p><p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{data.length}</p></Card>
      </div>

      <Card className="animate-fade-in">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <SearchBar value={search} onChange={setSearch} placeholder="Search payments..." className="sm:w-72" />
          <FilterDropdown label="Status" options={STATUS_OPTIONS} value={statusFilter} onChange={setStatusFilter} />
        </div>
        {loading ? <CardSkeleton /> : data.length === 0 ? (
          <EmptyState icon={FiDollarSign} title="No payments found" description={search ? 'Try a different search term' : 'No payment records yet.'} />
        ) : (
          <>
            <DataTable columns={columns} data={data} />
            <Pagination page={pagination.page} totalPages={pagination.totalPages} total={pagination.total} onPageChange={pagination.goToPage} limit={pagination.limit} onLimitChange={pagination.setLimit} />
          </>
        )}
      </Card>

      <Modal open={!!receipt} onClose={() => setReceipt(null)} title="Payment Receipt" size="sm">
        {receipt && (
          <div className="space-y-4">
            <div className="text-center pb-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-bold text-gray-900 dark:text-white text-lg">RentFlow</h3>
              <p className="text-xs text-gray-500">Payment Receipt</p>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Receipt #</span><span className="font-medium text-gray-900 dark:text-white">{receipt.ref || 'N/A'}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Tenant</span><span className="font-medium text-gray-900 dark:text-white">{receipt.tenant}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Unit</span><span className="font-medium text-gray-900 dark:text-white">{receipt.unit}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Period</span><span className="font-medium text-gray-900 dark:text-white">{receipt.period}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Amount</span><span className="font-medium text-gray-900 dark:text-white">{formatCurrency(receipt.amount)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Method</span><span className="font-medium text-gray-900 dark:text-white">{receipt.method}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Date</span><span className="font-medium text-gray-900 dark:text-white">{formatDate(receipt.date)}</span></div>
            </div>
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700 text-center">
              <p className="text-xs text-gray-500">Thank you for your payment!</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PaymentList;
