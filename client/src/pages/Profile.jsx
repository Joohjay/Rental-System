import { useState } from 'react';
import { FiUser, FiMail, FiPhone, FiShield, FiKey, FiCamera, FiClock } from 'react-icons/fi';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { ROLE_BADGES } from '../utils/constants';
import { formatDateTime } from '../utils/format';
import { useAuth } from '../contexts/AuthContext';

const MOCK_ACTIVITY = [
  { action: 'Login from web browser', time: '2 hours ago', type: 'auth' },
  { action: 'Updated company profile', time: '1 day ago', type: 'update' },
  { action: 'Created new property "Riverside Apartments"', time: '3 days ago', type: 'create' },
  { action: 'Changed password', time: '1 week ago', type: 'security' },
];

const Profile = () => {
  const { user } = useAuth();
  const roleInfo = ROLE_BADGES[user?.role] || { label: user?.role || 'User', color: 'gray' };
  const [form, setForm] = useState({
    name: user?.name || 'User', email: user?.email || '', phone: user?.phone || '',
  });

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your personal information and security</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center gap-6 pb-4 border-b border-gray-100 dark:border-gray-700">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-2xl font-bold text-indigo-700 dark:text-indigo-300">
                      {(user?.name || 'U').charAt(0).toUpperCase()}
                    </div>
                    <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 transition-colors shadow-md">
                      <FiCamera size={12} />
                    </button>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Profile Photo</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">JPG, PNG or GIF. Max 2MB.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
                    <div className="relative">
                      <FiUser size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="text" name="name" value={form.name} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
                    <div className="relative">
                      <FiMail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Phone</label>
                    <div className="relative">
                      <FiPhone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="text" name="phone" value={form.phone} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <Button type="submit">Save Changes</Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Current Password</label>
                  <div className="relative">
                    <FiKey size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="password" className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Enter current password" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">New Password</label>
                    <input type="password" className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="New password" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Confirm Password</label>
                    <input type="password" className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Confirm password" />
                  </div>
                </div>
                <div className="pt-2">
                  <Button type="submit">Update Password</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium">Role</p>
                <div className="mt-1">
                  <Badge variant={roleInfo.color}>{roleInfo.label}</Badge>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium">Member Since</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">{user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium">Two-Factor Auth</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Not enabled</p>
                  <Button variant="secondary" size="sm">Enable</Button>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium">Email Verified</p>
                <p className="text-sm font-medium text-green-600 dark:text-green-400 mt-1">Verified</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle><FiClock size={16} className="inline mr-1.5" />Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-0 -mx-6 -mb-6">
              {MOCK_ACTIVITY.map((a, i) => (
                <div key={i} className="px-6 py-3 border-t border-gray-100 dark:border-gray-700 first:border-t-0">
                  <p className="text-sm text-gray-700 dark:text-gray-300">{a.action}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{a.time}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
