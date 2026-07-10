export const DASHBOARD_ROUTES = {
  SUPER_ADMIN:       '/admin/dashboard',
  COMPANY_OWNER:     '/owner/dashboard',
  PROPERTY_MANAGER:  '/manager/dashboard',
  CARETAKER:         '/caretaker/dashboard',
  ACCOUNTANT:        '/accountant/dashboard',
  APPLICANT:         '/applicant/dashboard',
  TENANT:            '/tenant/dashboard',
  FORMER_TENANT:     '/former-tenant/dashboard',
};

export const NAV_ITEMS_BY_ROLE = {
  SUPER_ADMIN: [
    { label: 'Dashboard', path: '/admin/dashboard', icon: 'LayoutDashboard' },
    { label: 'Companies', path: '/companies', icon: 'Building2' },
    { label: 'Users', path: '/users', icon: 'Users' },
    { label: 'Subscriptions', path: '/subscriptions', icon: 'DollarSign' },
    { label: 'System Analytics', path: '/analytics', icon: 'BarChart3' },
    { label: 'Audit Logs', path: '/audit-logs', icon: 'FileText' },
    { label: 'Settings', path: '/settings', icon: 'Settings' },
  ],

  COMPANY_OWNER: [
    { label: 'Dashboard', path: '/owner/dashboard', icon: 'LayoutDashboard' },
    { label: 'Properties', path: '/properties', icon: 'Home' },
    { label: 'Buildings', path: '/buildings', icon: 'Layers' },
    { label: 'Units', path: '/units', icon: 'DoorOpen' },
    { label: 'Staff', path: '/staff', icon: 'Users' },
    { label: 'Applicants', path: '/applicants', icon: 'Users' },
    { label: 'Tenants', path: '/tenants', icon: 'Users' },
    { label: 'Leases', path: '/leases', icon: 'FileText' },
    { label: 'Payments', path: '/payments', icon: 'DollarSign' },
    { label: 'Maintenance', path: '/maintenance', icon: 'Wrench' },
    { label: 'Reports', path: '/reports', icon: 'BarChart3' },
    { label: 'Audit Logs', path: '/audit-logs', icon: 'FileText' },
    { label: 'Settings', path: '/settings', icon: 'Settings' },
  ],

  PROPERTY_MANAGER: [
    { label: 'Dashboard', path: '/manager/dashboard', icon: 'LayoutDashboard' },
    { label: 'Properties', path: '/properties', icon: 'Home' },
    { label: 'Buildings', path: '/buildings', icon: 'Layers' },
    { label: 'Units', path: '/units', icon: 'DoorOpen' },
    { label: 'Applicants', path: '/applicants', icon: 'Users' },
    { label: 'Tenants', path: '/tenants', icon: 'Users' },
    { label: 'Leases', path: '/leases', icon: 'FileText' },
    { label: 'Payments', path: '/payments', icon: 'DollarSign' },
    { label: 'Maintenance', path: '/maintenance', icon: 'Wrench' },
    { label: 'Reports', path: '/reports', icon: 'BarChart3' },
    { label: 'Settings', path: '/settings', icon: 'Settings' },
  ],

  CARETAKER: [
    { label: 'Dashboard', path: '/caretaker/dashboard', icon: 'LayoutDashboard' },
    { label: 'Assigned Buildings', path: '/assigned-buildings', icon: 'Layers' },
    { label: 'Units', path: '/units', icon: 'DoorOpen' },
    { label: 'Maintenance Requests', path: '/maintenance', icon: 'Wrench' },
    { label: 'Tenants', path: '/tenants', icon: 'Users' },
    { label: 'Announcements', path: '/announcements', icon: 'FileText' },
    { label: 'Settings', path: '/settings', icon: 'Settings' },
  ],

  ACCOUNTANT: [
    { label: 'Dashboard', path: '/accountant/dashboard', icon: 'LayoutDashboard' },
    { label: 'Payments', path: '/payments', icon: 'DollarSign' },
    { label: 'Receipts', path: '/receipts', icon: 'FileText' },
    { label: 'Reports', path: '/reports', icon: 'BarChart3' },
    { label: 'Expenses', path: '/expenses', icon: 'DollarSign' },
    { label: 'Settings', path: '/settings', icon: 'Settings' },
  ],

  APPLICANT: [
    { label: 'Dashboard', path: '/applicant/dashboard', icon: 'LayoutDashboard' },
    { label: 'Browse Properties', path: '/browse', icon: 'Home' },
    { label: 'Saved Properties', path: '/saved', icon: 'Home' },
    { label: 'Applications', path: '/applications', icon: 'FileText' },
    { label: 'Viewing Requests', path: '/viewing-requests', icon: 'FileText' },
    { label: 'Messages', path: '/messages', icon: 'Users' },
    { label: 'Notifications', path: '/notifications', icon: 'Users' },
    { label: 'Profile', path: '/profile', icon: 'Users' },
    { label: 'Settings', path: '/settings', icon: 'Settings' },
  ],

  TENANT: [
    { label: 'Dashboard', path: '/tenant/dashboard', icon: 'LayoutDashboard' },
    { label: 'My Lease', path: '/my-lease', icon: 'FileText' },
    { label: 'Rent Payments', path: '/payments', icon: 'DollarSign' },
    { label: 'Receipts', path: '/receipts', icon: 'FileText' },
    { label: 'Maintenance', path: '/maintenance', icon: 'Wrench' },
    { label: 'Documents', path: '/documents', icon: 'FileText' },
    { label: 'Announcements', path: '/announcements', icon: 'Users' },
    { label: 'Messages', path: '/messages', icon: 'Users' },
    { label: 'Profile', path: '/profile', icon: 'Users' },
    { label: 'Settings', path: '/settings', icon: 'Settings' },
  ],

  FORMER_TENANT: [
    { label: 'Dashboard', path: '/former-tenant/dashboard', icon: 'LayoutDashboard' },
    { label: 'Rental History', path: '/rental-history', icon: 'FileText' },
    { label: 'Documents', path: '/documents', icon: 'FileText' },
    { label: 'Payments History', path: '/payment-history', icon: 'DollarSign' },
    { label: 'Profile', path: '/profile', icon: 'Users' },
    { label: 'Settings', path: '/settings', icon: 'Settings' },
  ],
};

export const MANAGEMENT_ROUTES = {
  '/companies': ['SUPER_ADMIN', 'COMPANY_OWNER'],
  '/companies/new': ['SUPER_ADMIN', 'COMPANY_OWNER'],
  '/companies/:id/edit': ['SUPER_ADMIN', 'COMPANY_OWNER'],
  '/properties': ['SUPER_ADMIN', 'COMPANY_OWNER', 'PROPERTY_MANAGER'],
  '/properties/new': ['SUPER_ADMIN', 'COMPANY_OWNER', 'PROPERTY_MANAGER'],
  '/properties/:id/edit': ['SUPER_ADMIN', 'COMPANY_OWNER', 'PROPERTY_MANAGER'],
  '/buildings': ['SUPER_ADMIN', 'COMPANY_OWNER', 'PROPERTY_MANAGER', 'CARETAKER'],
  '/buildings/new': ['SUPER_ADMIN', 'COMPANY_OWNER', 'PROPERTY_MANAGER'],
  '/buildings/:id/edit': ['SUPER_ADMIN', 'COMPANY_OWNER', 'PROPERTY_MANAGER'],
  '/units': ['SUPER_ADMIN', 'COMPANY_OWNER', 'PROPERTY_MANAGER', 'CARETAKER'],
  '/units/new': ['SUPER_ADMIN', 'COMPANY_OWNER', 'PROPERTY_MANAGER'],
  '/units/:id/edit': ['SUPER_ADMIN', 'COMPANY_OWNER', 'PROPERTY_MANAGER'],
  '/tenants': ['SUPER_ADMIN', 'COMPANY_OWNER', 'PROPERTY_MANAGER', 'CARETAKER'],
  '/leases': ['SUPER_ADMIN', 'COMPANY_OWNER', 'PROPERTY_MANAGER'],
  '/payments': ['SUPER_ADMIN', 'COMPANY_OWNER', 'PROPERTY_MANAGER', 'ACCOUNTANT', 'TENANT'],
  '/maintenance': ['SUPER_ADMIN', 'COMPANY_OWNER', 'PROPERTY_MANAGER', 'CARETAKER', 'TENANT'],
  '/reports': ['SUPER_ADMIN', 'COMPANY_OWNER', 'PROPERTY_MANAGER', 'ACCOUNTANT'],
  '/staff': ['SUPER_ADMIN', 'COMPANY_OWNER'],
  '/applicants': ['SUPER_ADMIN', 'COMPANY_OWNER', 'PROPERTY_MANAGER'],
  '/audit-logs': ['SUPER_ADMIN', 'COMPANY_OWNER'],
  '/users': ['SUPER_ADMIN'],
};

export const MANAGEMENT_GROUPS = {
  admin: ['SUPER_ADMIN'],
  owner: ['COMPANY_OWNER'],
  manager: ['PROPERTY_MANAGER'],
  caretaker: ['CARETAKER'],
  accountant: ['ACCOUNTANT'],
  applicant: ['APPLICANT'],
  tenant: ['TENANT'],
  formerTenant: ['FORMER_TENANT'],
};

export const isRoleAllowed = (pathname, role) => {
  if (!role) return false;
  if (role === 'SUPER_ADMIN') return true;

  const allowed = MANAGEMENT_ROUTES[pathname];
  if (!allowed) return true;
  return allowed.includes(role);
};
