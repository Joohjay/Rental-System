import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiSave } from 'react-icons/fi';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useToast } from '../../contexts/ToastContext';
import { getProperty, createProperty, updateProperty } from '../../api/propertyApi';
import { getCompanies } from '../../api/companyApi';

const PropertyForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    name: '', company_id: '', location: '', address: '', description: '', is_active: true,
  });
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    getCompanies({ limit: 200 }).then(({ data }) => setCompanies(data.data || [])).catch(() => {});
    if (!isEdit) return;
    const fetch = async () => {
      try {
        const { data: res } = await getProperty(id);
        const p = res.data;
        setForm({
          name: p.name, company_id: p.company_id || '', location: p.location || '',
          address: p.address || '', description: p.description || '', is_active: p.is_active,
        });
      } catch {
        toast.error('Property not found');
        navigate('/properties');
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
      if (isEdit) {
        await updateProperty(id, form);
        toast.success('Property updated successfully');
      } else {
        await createProperty(form);
        toast.success('Property created successfully');
      }
      navigate('/properties');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save property');
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
        <button onClick={() => navigate('/properties')} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"><FiArrowLeft size={20} /></button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{isEdit ? 'Edit Property' : 'New Property'}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{isEdit ? 'Update property details' : 'Add a new property'}</p>
        </div>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Company *</label>
            <select name="company_id" value={form.company_id} onChange={handleChange} required className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
              <option value="">Select a company</option>
              {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Property Name *</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} required className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. Riverside Apartments" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Location</label>
            <input type="text" name="location" value={form.location} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="City or area" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Address</label>
            <textarea name="address" value={form.address} onChange={handleChange} rows={2} className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none" placeholder="Full address" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none" placeholder="Property description" />
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" name="is_active" id="is_active" checked={form.is_active} onChange={handleChange} className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
            <label htmlFor="is_active" className="text-sm font-medium text-gray-700 dark:text-gray-300">Active</label>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" loading={loading}><FiSave size={16} className="mr-1.5" />{isEdit ? 'Update Property' : 'Create Property'}</Button>
            <Button variant="secondary" onClick={() => navigate('/properties')}>Cancel</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default PropertyForm;
