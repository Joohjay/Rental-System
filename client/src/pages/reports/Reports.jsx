import { useState, useEffect } from 'react';
import { FiBarChart2, FiDownload, FiFileText } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { CardSkeleton } from '../../components/ui/LoadingSkeleton';
import { getReportSummary, getMonthlyRevenue, exportReport } from '../../api/reportApi';
import { formatCurrency, formatNumber } from '../../utils/format';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#ef4444'];

const Reports = () => {
  const [summary, setSummary] = useState(null);
  const [revenue, setRevenue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [sumRes, revRes] = await Promise.all([getReportSummary(), getMonthlyRevenue()]);
        setSummary(sumRes.data.data);
        setRevenue(revRes.data.data);
      } catch {} finally { setLoading(false); }
    };
    fetch();
  }, []);

  const handleExport = async (format) => {
    setExporting(format);
    try {
      await exportReport(format);
    } catch {} finally { setExporting(null); }
  };

  if (loading) return <div className="space-y-6"><div className="animate-pulse h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded" /><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">{Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}</div></div>;

  const occupancyData = [
    { name: 'Occupied', value: summary?.occupancy?.occupied || 0 },
    { name: 'Vacant', value: summary?.occupancy?.vacant || 0 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reports</h1><p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Analytics and performance metrics</p></div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" loading={exporting === 'pdf'} onClick={() => handleExport('pdf')}><FiFileText size={14} className="mr-1.5" />Export PDF</Button>
          <Button variant="secondary" size="sm" loading={exporting === 'excel'} onClick={() => handleExport('excel')}><FiDownload size={14} className="mr-1.5" />Export Excel</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card><p className="text-sm font-medium text-gray-500 dark:text-gray-400">Occupancy Rate</p><p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{summary?.occupancy?.rate || 0}%</p><p className="text-xs text-gray-400 mt-1">{summary?.occupancy?.occupied || 0} of {summary?.occupancy?.total || 0} units</p></Card>
        <Card><p className="text-sm font-medium text-gray-500 dark:text-gray-400">Monthly Revenue</p><p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-1">{formatCurrency(summary?.revenue?.monthly || 0)}</p></Card>
        <Card><p className="text-sm font-medium text-gray-500 dark:text-gray-400">Outstanding</p><p className="text-3xl font-bold text-red-600 dark:text-red-400 mt-1">{formatCurrency(summary?.revenue?.outstanding || 0)}</p></Card>
        <Card><p className="text-sm font-medium text-gray-500 dark:text-gray-400">Open Requests</p><p className="text-3xl font-bold text-amber-600 dark:text-amber-400 mt-1">{summary?.maintenance?.open || 0}</p><p className="text-xs text-gray-400 mt-1">Avg response: {summary?.maintenance?.avgResponse || '-'}</p></Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Monthly Revenue vs Expenses</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb' }} formatter={(v) => formatCurrency(v)} />
                <Bar dataKey="revenue" fill="#6366f1" radius={[4, 4, 0, 0]} name="Revenue" />
                <Bar dataKey="expenses" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Occupancy Distribution</CardTitle></CardHeader>
          <CardContent className="h-72 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={occupancyData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
                  {occupancyData.map((_, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => formatNumber(v)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card><CardHeader><CardTitle className="text-sm">Lease Summary</CardTitle></CardHeader>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Active</span><span className="font-medium text-green-600">{summary?.leases?.active || 0}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Expiring</span><span className="font-medium text-yellow-600">{summary?.leases?.expiring || 0}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Terminated</span><span className="font-medium text-red-600">{summary?.leases?.terminated || 0}</span></div>
            <div className="flex justify-between border-t pt-2"><span className="text-gray-500">Total</span><span className="font-medium text-gray-900 dark:text-white">{summary?.leases?.total || 0}</span></div>
          </div>
        </Card>
        <Card><CardHeader><CardTitle className="text-sm">Maintenance Summary</CardTitle></CardHeader>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Open</span><span className="font-medium text-yellow-600">{summary?.maintenance?.open || 0}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">In Progress</span><span className="font-medium text-blue-600">{summary?.maintenance?.inProgress || 0}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Completed</span><span className="font-medium text-green-600">{summary?.maintenance?.completed || 0}</span></div>
            <div className="flex justify-between border-t pt-2"><span className="text-gray-500">Avg Response</span><span className="font-medium text-gray-900 dark:text-white">{summary?.maintenance?.avgResponse || '-'}</span></div>
          </div>
        </Card>
        <Card><CardHeader><CardTitle className="text-sm">Revenue Summary</CardTitle></CardHeader>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Monthly</span><span className="font-medium text-green-600">{formatCurrency(summary?.revenue?.monthly || 0)}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Annual</span><span className="font-medium text-gray-900 dark:text-white">{formatCurrency(summary?.revenue?.annual || 0)}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Outstanding</span><span className="font-medium text-red-600">{formatCurrency(summary?.revenue?.outstanding || 0)}</span></div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
