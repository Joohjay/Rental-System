import {
  LayoutDashboard, Building2, Home, Layers, DoorOpen,
  Users, FileText, DollarSign, Wrench, BarChart3, Settings,
  UserCheck, UserPlus, UserX, ShieldCheck, ClipboardList,
  CreditCard, Receipt, MessageSquare, Bell, Bookmark,
  MapPin, Search, LogOut, Award, Briefcase, Key,
} from 'lucide-react';

export const LucideIcons = {
  LayoutDashboard, Building2, Home, Layers, DoorOpen,
  Users, FileText, DollarSign, Wrench, BarChart3, Settings,
  UserCheck, UserPlus, UserX, ShieldCheck, ClipboardList,
  CreditCard, Receipt, MessageSquare, Bell, Bookmark,
  MapPin, Search, LogOut, Award, Briefcase, Key,
};

export const ROLE_BADGES = {
  SUPER_ADMIN:       { label: 'Super Admin',       color: 'purple' },
  COMPANY_OWNER:     { label: 'Company Owner',     color: 'indigo' },
  PROPERTY_MANAGER:  { label: 'Property Manager',  color: 'blue' },
  CARETAKER:         { label: 'Caretaker',         color: 'yellow' },
  ACCOUNTANT:        { label: 'Accountant',        color: 'green' },
  APPLICANT:         { label: 'Applicant',         color: 'orange' },
  TENANT:            { label: 'Tenant',            color: 'teal' },
  FORMER_TENANT:     { label: 'Former Tenant',     color: 'gray' },
};

export const NAV_ITEMS = [
  { label: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
  { label: 'Companies', path: '/companies', icon: 'Building2' },
  { label: 'Properties', path: '/properties', icon: 'Home' },
  { label: 'Buildings', path: '/buildings', icon: 'Layers' },
  { label: 'Units', path: '/units', icon: 'DoorOpen' },
  { label: 'Tenants', path: '/tenants', icon: 'Users' },
  { label: 'Leases', path: '/leases', icon: 'FileText' },
  { label: 'Payments', path: '/payments', icon: 'DollarSign' },
  { label: 'Maintenance', path: '/maintenance', icon: 'Wrench' },
  { label: 'Reports', path: '/reports', icon: 'BarChart3' },
  { label: 'Settings', path: '/settings', icon: 'Settings' },
];

export const COMMANDS = [
  { id: 'go-dashboard', label: 'Go to Dashboard', keywords: 'dashboard home', path: '/dashboard' },
  { id: 'go-companies', label: 'Go to Companies', keywords: 'companies', path: '/companies' },
  { id: 'go-properties', label: 'Go to Properties', keywords: 'properties', path: '/properties' },
  { id: 'go-buildings', label: 'Go to Buildings', keywords: 'buildings', path: '/buildings' },
  { id: 'go-units', label: 'Go to Units', keywords: 'units', path: '/units' },
  { id: 'go-tenants', label: 'Go to Tenants', keywords: 'tenants', path: '/tenants' },
  { id: 'go-leases', label: 'Go to Leases', keywords: 'leases', path: '/leases' },
  { id: 'go-payments', label: 'Go to Payments', keywords: 'payments', path: '/payments' },
  { id: 'go-maintenance', label: 'Go to Maintenance', keywords: 'maintenance', path: '/maintenance' },
  { id: 'go-reports', label: 'Go to Reports', keywords: 'reports', path: '/reports' },
  { id: 'go-settings', label: 'Go to Settings', keywords: 'settings', path: '/settings' },
  { id: 'go-profile', label: 'Go to Profile', keywords: 'profile account', path: '/profile' },
  { id: 'new-company', label: 'Create Company', keywords: 'new company add', path: '/companies/new' },
  { id: 'new-property', label: 'Create Property', keywords: 'new property add', path: '/properties/new' },
  { id: 'new-building', label: 'Create Building', keywords: 'new building add', path: '/buildings/new' },
  { id: 'new-unit', label: 'Create Unit', keywords: 'new unit add', path: '/units/new' },
];

export const UNIT_STATUS = {
  available: { label: 'Available', color: 'green' },
  occupied: { label: 'Occupied', color: 'blue' },
  reserved: { label: 'Reserved', color: 'yellow' },
  maintenance: { label: 'Maintenance', color: 'red' },
};

export const ITEMS_PER_PAGE = 10;
