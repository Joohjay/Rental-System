import { useState } from 'react';
import { FiSettings, FiGlobe, FiShield, FiMonitor, FiBell, FiCreditCard, FiSave, FiUpload, FiKey, FiSmartphone } from 'react-icons/fi';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { useToast } from '../contexts/ToastContext';
import { useTheme } from '../contexts/ThemeContext';

const TABS = [
  { id: 'general', label: 'General', icon: FiSettings },
  { id: 'company', label: 'Company', icon: FiGlobe },
  { id: 'security', label: 'Security', icon: FiShield },
  { id: 'appearance', label: 'Appearance', icon: FiMonitor },
  { id: 'notifications', label: 'Notifications', icon: FiBell },
  { id: 'billing', label: 'Billing', icon: FiCreditCard },
];

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const { toast } = useToast();
  const { dark, setThemeMode, accent, setAccent, currentAccent, accentColors, compact, setCompact } = useTheme();
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => { setSaving(false); toast.success('Settings saved successfully'); }, 500);
  };

  const TabButton = ({ tab }) => {
    const Icon = tab.icon;
    const isActive = activeTab === tab.id;
    return (
      <button onClick={() => setActiveTab(tab.id)}
        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
          isActive
            ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
        }`}
      >
        <Icon size={16} />{tab.label}
      </button>
    );
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your account and application preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-56 shrink-0">
          <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {TABS.map((tab) => <TabButton key={tab.id} tab={tab} />)}
          </nav>
        </div>

        <div className="flex-1 min-w-0 space-y-6">
          {activeTab === 'general' && (
            <Card>
              <CardHeader><CardTitle>General Settings</CardTitle></CardHeader>
              <CardContent className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Application Name</label>
                  <input type="text" defaultValue="RentFlow" className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Default Language</label>
                  <select className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                    <option>English</option>
                    <option>Swahili</option>
                    <option>French</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Timezone</label>
                  <select className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                    <option>Africa/Dar_es_Salaam (UTC+3)</option>
                    <option>Africa/Nairobi (UTC+3)</option>
                    <option>Africa/Kampala (UTC+3)</option>
                    <option>Africa/Lagos (UTC+1)</option>
                    <option>America/New_York (UTC-5)</option>
                    <option>Europe/London (UTC+0)</option>
                  </select>
                </div>
                <div><Button onClick={handleSave} loading={saving}><FiSave size={16} className="mr-1.5" />Save Changes</Button></div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'company' && (
            <Card>
              <CardHeader><CardTitle>Company Profile</CardTitle></CardHeader>
              <CardContent className="space-y-5">
                <div className="flex items-center gap-6 pb-4 border-b border-gray-100 dark:border-gray-700">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-3xl font-bold text-indigo-700 dark:text-indigo-300">RF</div>
                    <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 transition-colors shadow-md"><FiUpload size={12} /></button>
                  </div>
                  <div><h3 className="font-semibold text-gray-900 dark:text-white">Company Logo</h3><p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">PNG or JPG. Max 2MB. Square preferred.</p></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Company Name</label><input type="text" defaultValue="RentFlow Inc." className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label><input type="email" defaultValue="info@rentflow.co.tz" className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Phone</label><input type="text" defaultValue="+255 712 345 678" className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Default Currency</label><select className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"><option>TZS - Tanzanian Shilling</option><option>USD - US Dollar</option><option>KES - Kenyan Shilling</option></select></div>
                </div>
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Address</label><textarea rows={2} defaultValue="123 Samora Avenue, Dar es Salaam, Tanzania" className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none" /></div>
                <div><Button onClick={handleSave} loading={saving}><FiSave size={16} className="mr-1.5" />Save Changes</Button></div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card>
              <CardHeader><CardTitle>Security</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div className="pb-6 border-b border-gray-100 dark:border-gray-700">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2"><FiKey size={16} />Change Password</h4>
                  <div className="space-y-4 max-w-sm">
                    <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Current Password</label><input type="password" className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">New Password</label><input type="password" className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Confirm New Password</label><input type="password" className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" /></div>
                    <Button onClick={handleSave} loading={saving}>Update Password</Button>
                  </div>
                </div>
                <div className="pb-6 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-3">
                      <FiSmartphone size={20} className="text-gray-400 mt-0.5" />
                      <div><p className="font-medium text-gray-900 dark:text-white">Two-Factor Authentication</p><p className="text-sm text-gray-500 dark:text-gray-400">Add an extra layer of security to your account</p></div>
                    </div>
                    <Button variant="secondary" size="sm">Enable</Button>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Active Sessions</h4>
                  <div className="space-y-3">
                    {[
                      { device: 'Chrome on Windows', location: 'Dar es Salaam, TZ', current: true, time: 'Active now' },
                      { device: 'Safari on iPhone', location: 'Dar es Salaam, TZ', current: false, time: '2 hours ago' },
                    ].map((s) => (
                      <div key={s.device} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/30">
                        <div className="flex items-center gap-3">
                          <div><p className="text-sm font-medium text-gray-900 dark:text-white">{s.device} {s.current && <Badge variant="green" size="sm">Current</Badge>}</p><p className="text-xs text-gray-500">{s.location} — {s.time}</p></div>
                        </div>
                        {!s.current && <Button variant="ghost" size="sm">Revoke</Button>}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'appearance' && (
            <Card>
              <CardHeader><CardTitle>Appearance</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Theme</label>
                  <div className="flex gap-3">
                    {[
                      { mode: 'light', label: 'Light', icon: '☀️' },
                      { mode: 'dark', label: 'Dark', icon: '🌙' },
                      { mode: 'system', label: 'System', icon: '💻' },
                    ].map((t) => (
                      <button key={t.mode} onClick={() => setThemeMode(t.mode)}
                        className={`flex items-center gap-2 px-5 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                          (t.mode === 'light' && !dark) || (t.mode === 'dark' && dark)
                            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 shadow-sm'
                            : t.mode === 'system'
                            ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 shadow-sm'
                            : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500'
                        }`}
                      >
                        <span>{t.icon}</span>
                        <span>{t.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Accent Color</label>
                  <div className="flex flex-wrap gap-3">
                    {Object.entries(accentColors).map(([key, color]) => (
                      <button
                        key={key}
                        onClick={() => setAccent(key)}
                        className={`w-10 h-10 rounded-xl transition-all ${
                          accent === key ? 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-900 scale-110' : 'hover:scale-105'
                        }`}
                        style={{ backgroundColor: color.hex, ...(accent === key ? { ring: `2px solid ${color.hex}` } : {}) }}
                        title={color.label}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-2">Selected: <span style={{ color: currentAccent.hex }} className="font-medium">{currentAccent.label}</span></p>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <div><label className="text-sm font-medium text-gray-700 dark:text-gray-300">Compact Mode</label><p className="text-xs text-gray-500 dark:text-gray-400">Reduce spacing for a denser layout</p></div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={compact} onChange={() => setCompact(!compact)} className="sr-only peer" />
                      <div className="w-9 h-5 bg-gray-200 dark:bg-gray-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600" />
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card>
              <CardHeader><CardTitle>Notification Preferences</CardTitle></CardHeader>
              <CardContent className="space-y-0">
                {[
                  { label: 'Email Notifications', desc: 'Receive email updates about your account and properties' },
                  { label: 'SMS Notifications', desc: 'Receive text messages for payment reminders and alerts' },
                  { label: 'Browser Notifications', desc: 'Receive push notifications in your browser' },
                  { label: 'Lease Reminders', desc: 'Get notified when leases are about to expire' },
                  { label: 'Payment Alerts', desc: 'Receive alerts for successful and failed payments' },
                  { label: 'Maintenance Updates', desc: 'Get notified about maintenance request status changes' },
                  { label: 'New Tenant Registration', desc: 'Alert when a new tenant registers or is added' },
                  { label: 'Weekly Digest', desc: 'Receive a weekly summary of all activities' },
                ].map((n, i) => (
                  <div key={n.label} className={`flex items-center justify-between py-3.5 ${i < 7 ? 'border-b border-gray-100 dark:border-gray-700' : ''}`}>
                    <div><p className="text-sm font-medium text-gray-900 dark:text-white">{n.label}</p><p className="text-xs text-gray-500 dark:text-gray-400">{n.desc}</p></div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked={i < 4} className="sr-only peer" />
                      <div className="w-9 h-5 bg-gray-200 dark:bg-gray-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600" />
                    </label>
                  </div>
                ))}
                <div className="pt-4"><Button onClick={handleSave} loading={saving}><FiSave size={16} className="mr-1.5" />Save Preferences</Button></div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'billing' && (
            <Card>
              <CardHeader><CardTitle>Billing & Subscription</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div className="p-5 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                  <p className="text-sm text-indigo-100">Current Plan</p>
                  <p className="text-2xl font-bold mt-1">Enterprise</p>
                  <p className="text-sm text-indigo-100 mt-1">TZS 0/month — Free tier during development</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { label: 'Properties', value: 'Unlimited' },
                    { label: 'Users', value: 'Up to 50' },
                    { label: 'Support', value: '24/7 Priority' },
                  ].map((f) => (
                    <div key={f.label} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/30 text-center">
                      <p className="text-xs text-gray-500 dark:text-gray-400">{f.label}</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white mt-0.5">{f.value}</p>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Payment History</h4>
                  <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-6 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                    No payment history yet
                  </div>
                </div>
                <Button variant="secondary">View Invoices</Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
