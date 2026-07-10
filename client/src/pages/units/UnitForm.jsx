import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiSave } from 'react-icons/fi';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useToast } from '../../contexts/ToastContext';
import { getUnit, createUnit, updateUnit } from '../../api/unitApi';
import { getBuildings } from '../../api/buildingApi';

const STATUS_OPTIONS = [
  { value: 'available', label: 'Available' },
  { value: 'occupied', label: 'Occupied' },
  { value: 'reserved', label: 'Reserved' },
  { value: 'maintenance', label: 'Maintenance' },
];

const UnitForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    name: '', building_id: '', rent_amount: '', deposit_amount: '',
    status: 'available', description: '', is_active: true,
  });
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    getBuildings({ limit: 200 }).then(({ data }) => setBuildings(data.data || [])).catch(() => {});
    if (!isEdit) return;
    const fetch = async () => {
      try {
        const { data: res } = await getUnit(id);
        const u = res.data;
        setForm({
          name: u.name, building_id: u.building_id || '', rent_amount: u.rent_amount || '',
          deposit_amount: u.deposit_amount || '', status: u.status || 'available',
          description: u.description || '', is_active: u.is_active,
        });
      } catch {
        toast.error('Unit not found');
        navigate('/units');
      } finally { setFetching(false); }
    };
    fetch();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        rent_amount: form.rent_amount ? Number(form.rent_amount) : undefined,
        deposit_amount: form.deposit_amount ? Number(form.deposit_amount) : undefined,
      };
      if (isEdit) {
        await updateUnit(id, payload);
        toast.success('Unit updated successfully');
      } else {
        await createUnit(payload);
        toast.success('Unit created successfully');
      }
      navigate('/units');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save unit');
    } finally { setLoading(false); }
  };

  if (fetching) {
    return (
      <div className="space-y-6 max-w-2xl">
        <div className="animate-pulse h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
        <Card><div className="animate-pulse space-y-4">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 rounded" />)}</div></Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/units')} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"><FiArrowLeft size={20} /></button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{isEdit ? 'Edit Unit' : 'New Unit'}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{isEdit ? 'Update unit details' : 'Add a new rental unit'}</p>
        </div>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Building *</label>
            <select name="building_id" value={form.building_id} onChange={handleChange} required className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
              <option value="">Select a building</option>
              {buildings.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Unit Name *</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} required className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. Unit 101" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Rent Amount (TZS)</label>
              <input type="number" name="rent_amount" value={form.rent_amount} onChange={handleChange} min="0" className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="500000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Deposit Amount (TZS)</label>
              <input type="number" name="deposit_amount" value={form.deposit_amount} onChange={handleChange} min="0" className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="500000" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Status</label>
            <select name="status" value={form.status} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
              {STATUS_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none" placeholder="Unit description" />
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" name="is_active" id="is_active" checked={form.is_active} onChange={handleChange} className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
            <label htmlFor="is_active" className="text-sm font-medium text-gray-700 dark:text-gray-300">Active</label>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" loading={loading}><FiSave size={16} className="mr-1.5" />{isEdit ? 'Update Unit' : 'Create Unit'}</Button>
            <Button variant="secondary" onClick={() => navigate('/units')}>Cancel</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default UnitForm;
