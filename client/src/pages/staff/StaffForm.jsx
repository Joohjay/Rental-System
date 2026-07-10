import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiSave } from 'react-icons/fi';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useToast } from '../../contexts/ToastContext';
import { getStaffMember, createStaff, updateStaff } from '../../api/staffApi';

const ROLE_OPTIONS = [
  { value: 'PROPERTY_MANAGER', label: 'Property Manager' },
  { value: 'CARETAKER', label: 'Caretaker' },
  { value: 'ACCOUNTANT', label: 'Accountant' },
];

const StaffForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    name: '', email: '', phone: '', role: 'PROPERTY_MANAGER', password: '', is_active: true,
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;
    const fetch = async () => {
      try {
        const { data: res } = await getStaffMember(id);
        const s = res.data;
        setForm({
          name: s.name, email: s.email, phone: s.phone || '', role: s.role,
          password: '', is_active: s.is_active,
        });
      } catch {
        toast.error('Staff member not found');
        navigate('/staff');
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
      const payload = { ...form };
      if (!payload.password) delete payload.password;
      if (isEdit) {
        await updateStaff(id, payload);
        toast.success('Staff member updated');
      } else {
        await createStaff(payload);
        toast.success('Staff member created');
      }
      navigate('/staff');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save staff member');
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
        <button onClick={() => navigate('/staff')} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"><FiArrowLeft size={20} /></button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{isEdit ? 'Edit Staff Member' : 'New Staff Member'}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{isEdit ? 'Update staff details' : 'Add a new staff member'}</p>
        </div>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name *</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} required className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. John Doe" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email *</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. john@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Phone</label>
            <input type="text" name="phone" value={form.phone} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. +255 712 345 678" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Role *</label>
            <select name="role" value={form.role} onChange={handleChange} required className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
              {ROLE_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{isEdit ? 'New Password (leave blank to keep current)' : 'Password *'}</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} required={!isEdit} minLength={6} className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Min. 6 characters" />
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" name="is_active" id="is_active" checked={form.is_active} onChange={handleChange} className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
            <label htmlFor="is_active" className="text-sm font-medium text-gray-700 dark:text-gray-300">Active</label>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" loading={loading}><FiSave size={16} className="mr-1.5" />{isEdit ? 'Update Staff' : 'Create Staff'}</Button>
            <Button variant="secondary" onClick={() => navigate('/staff')}>Cancel</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default StaffForm;
