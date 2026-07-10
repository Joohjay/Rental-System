import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiGrid, FiHome, FiArrowLeft, FiUser, FiMail, FiLock, FiPhone, FiMapPin, FiFileText, FiBriefcase, FiCheck } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { DASHBOARD_ROUTES } from '../config/navigation';
import { registerApplicant, registerCompany } from '../api/authApi';

const OptionCard = ({ icon: Icon, title, description, selected, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`relative flex flex-col items-center text-center p-8 rounded-2xl border-2 transition-all cursor-pointer ${
      selected
        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 shadow-md'
        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-sm'
    }`}
  >
    {selected && (
      <div className="absolute top-3 right-3 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center">
        <FiCheck size={14} className="text-white" />
      </div>
    )}
    <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${
      selected ? 'bg-indigo-100 dark:bg-indigo-900/40' : 'bg-gray-100 dark:bg-gray-700'
    }`}>
      <Icon size={28} className={selected ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'} />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{title}</h3>
    <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
  </button>
);

const ApplicantForm = ({ onBack }) => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '', preferred_city: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const { data } = await registerApplicant({
        name: form.name, email: form.email, phone: form.phone || undefined,
        password: form.password, preferred_city: form.preferred_city || undefined,
      });
      login(data.token, data.user);
      const path = DASHBOARD_ROUTES[data.user.role] || '/applicant/dashboard';
      navigate(path);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-6 transition-colors">
        <FiArrowLeft size={16} /> Back
      </button>
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Find a Place to Rent</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Create your applicant account to browse and apply for properties</p>

      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name *</label>
          <div className="relative">
            <FiUser size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" name="name" value={form.name} onChange={handleChange} required placeholder="e.g. John Doe" className="w-full pl-9 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email *</label>
          <div className="relative">
            <FiMail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="john@example.com" className="w-full pl-9 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Phone</label>
            <div className="relative">
              <FiPhone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+255 712 345 678" className="w-full pl-9 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Preferred City</label>
            <div className="relative">
              <FiMapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" name="preferred_city" value={form.preferred_city} onChange={handleChange} placeholder="e.g. Dar es Salaam" className="w-full pl-9 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password *</label>
            <div className="relative">
              <FiLock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="password" name="password" value={form.password} onChange={handleChange} required minLength={6} placeholder="Min 6 chars" className="w-full pl-9 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Confirm Password *</label>
            <div className="relative">
              <FiLock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required minLength={6} placeholder="Confirm password" className="w-full pl-9 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
            </div>
          </div>
        </div>
        <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50">
          {loading ? 'Creating Account...' : 'Create Applicant Account'}
        </button>
      </form>
    </div>
  );
};

const CompanyOwnerForm = ({ onBack }) => {
  const [form, setForm] = useState({ company_name: '', business_email: '', business_phone: '', tin: '', business_address: '', owner_name: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const { data } = await registerCompany({
        company_name: form.company_name, business_email: form.business_email,
        business_phone: form.business_phone || undefined, tin: form.tin || undefined,
        business_address: form.business_address || undefined, owner_name: form.owner_name,
        password: form.password,
      });
      login(data.token, data.user);
      const path = DASHBOARD_ROUTES[data.user.role] || '/owner/dashboard';
      navigate(path);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-6 transition-colors">
        <FiArrowLeft size={16} /> Back
      </button>
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Register Your Company</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Create your company account to manage properties and operations</p>

      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Company Name *</label>
            <div className="relative">
              <FiGrid size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" name="company_name" value={form.company_name} onChange={handleChange} required placeholder="e.g. Jooh Properties Ltd" className="w-full pl-9 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">TIN (optional)</label>
            <div className="relative">
              <FiFileText size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" name="tin" value={form.tin} onChange={handleChange} placeholder="Tax ID" className="w-full pl-9 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Business Email *</label>
            <div className="relative">
              <FiMail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="email" name="business_email" value={form.business_email} onChange={handleChange} required placeholder="company@example.com" className="w-full pl-9 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Business Phone</label>
            <div className="relative">
              <FiPhone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="tel" name="business_phone" value={form.business_phone} onChange={handleChange} placeholder="+255 712 345 678" className="w-full pl-9 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Business Address</label>
          <textarea name="business_address" value={form.business_address} onChange={handleChange} rows={2} placeholder="Street, city, region" className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Owner Name *</label>
          <div className="relative">
            <FiUser size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" name="owner_name" value={form.owner_name} onChange={handleChange} required placeholder="e.g. Jooh" className="w-full pl-9 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password *</label>
            <div className="relative">
              <FiLock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="password" name="password" value={form.password} onChange={handleChange} required minLength={6} placeholder="Min 6 chars" className="w-full pl-9 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Confirm Password *</label>
            <div className="relative">
              <FiLock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required minLength={6} placeholder="Confirm password" className="w-full pl-9 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
            </div>
          </div>
        </div>
        <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50">
          {loading ? 'Creating Company...' : 'Create Company Account'}
        </button>
      </form>
    </div>
  );
};

const Register = () => {
  const [selectedOption, setSelectedOption] = useState(null);

  if (selectedOption === 'applicant') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <ApplicantForm onBack={() => setSelectedOption(null)} />
        </div>
      </div>
    );
  }

  if (selectedOption === 'company') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <CompanyOwnerForm onBack={() => setSelectedOption(null)} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FiGrid size={28} className="text-indigo-600 dark:text-indigo-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Join RentFlow</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Choose how you want to get started</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <OptionCard
            icon={FiHome}
            title="Find a Place to Rent"
            description="Browse properties, apply, and find your next home"
            selected={selectedOption === 'applicant'}
            onClick={() => setSelectedOption('applicant')}
          />
          <OptionCard
            icon={FiBriefcase}
            title="Manage My Properties"
            description="List properties, manage tenants, and grow your business"
            selected={selectedOption === 'company'}
            onClick={() => setSelectedOption('company')}
          />
        </div>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
