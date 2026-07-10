import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiSave } from 'react-icons/fi';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useToast } from '../../contexts/ToastContext';
import { getBuilding, createBuilding, updateBuilding } from '../../api/buildingApi';
import { getProperties } from '../../api/propertyApi';

const BuildingForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    name: '', property_id: '', floors: '', description: '', is_active: true,
  });
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    getProperties({ limit: 200 }).then(({ data }) => setProperties(data.data || [])).catch(() => {});
    if (!isEdit) return;
    const fetch = async () => {
      try {
        const { data: res } = await getBuilding(id);
        const b = res.data;
        setForm({
          name: b.name, property_id: b.property_id || '', floors: b.floors || '',
          description: b.description || '', is_active: b.is_active,
        });
      } catch {
        toast.error('Building not found');
        navigate('/buildings');
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
      const payload = { ...form, floors: form.floors ? Number(form.floors) : undefined };
      if (isEdit) {
        await updateBuilding(id, payload);
        toast.success('Building updated successfully');
      } else {
        await createBuilding(payload);
        toast.success('Building created successfully');
      }
      navigate('/buildings');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save building');
    } finally { setLoading(false); }
  };

  if (fetching) {
    return (
      <div className="space-y-6 max-w-2xl">
        <div className="animate-pulse h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
        <Card><div className="animate-pulse space-y-4">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 rounded" />)}</div></Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/buildings')} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"><FiArrowLeft size={20} /></button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{isEdit ? 'Edit Building' : 'New Building'}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{isEdit ? 'Update building details' : 'Add a new building'}</p>
        </div>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Property *</label>
            <select name="property_id" value={form.property_id} onChange={handleChange} required className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
              <option value="">Select a property</option>
              {properties.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Building Name *</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} required className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. Block A" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Number of Floors</label>
            <input type="number" name="floors" value={form.floors} onChange={handleChange} min="0" className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. 10" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none" placeholder="Building description" />
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" name="is_active" id="is_active" checked={form.is_active} onChange={handleChange} className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
            <label htmlFor="is_active" className="text-sm font-medium text-gray-700 dark:text-gray-300">Active</label>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" loading={loading}><FiSave size={16} className="mr-1.5" />{isEdit ? 'Update Building' : 'Create Building'}</Button>
            <Button variant="secondary" onClick={() => navigate('/buildings')}>Cancel</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default BuildingForm;
