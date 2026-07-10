export const tenants = [
  { id: 1, name: 'John Doe', email: 'john@example.com', phone: '+255 712 345 678', unit: 'A-203', building: 'Riverside Tower', property: 'Riverside Apartments', lease_start: '2025-01-01', lease_end: '2026-01-01', rent: 850000, status: 'active', avatar: null },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '+255 713 456 789', unit: 'B-105', building: 'Harbour Heights', property: 'Harbour Estate', lease_start: '2025-03-15', lease_end: '2026-03-15', rent: 1200000, status: 'active', avatar: null },
  { id: 3, name: 'Alice Johnson', email: 'alice@example.com', phone: '+255 714 567 890', unit: 'C-301', building: 'Hilltop Towers', property: 'Hilltop Residency', lease_start: '2025-06-01', lease_end: '2025-12-31', rent: 650000, status: 'active', avatar: null },
  { id: 4, name: 'Bob Williams', email: 'bob@example.com', phone: '+255 715 678 901', unit: 'D-202', building: 'Sunrise Block D', property: 'Sunrise Complex', lease_start: '2024-08-01', lease_end: '2025-08-01', rent: 950000, status: 'expiring', avatar: null },
  { id: 5, name: 'Carol Brown', email: 'carol@example.com', phone: '+255 716 789 012', unit: 'E-101', building: 'Ocean View', property: 'Ocean View Estate', lease_start: '2024-11-01', lease_end: '2025-05-01', rent: 1500000, status: 'terminated', avatar: null },
  { id: 6, name: 'David Lee', email: 'david@example.com', phone: '+255 717 890 123', unit: 'A-101', building: 'Riverside Tower', property: 'Riverside Apartments', lease_start: '2025-02-01', lease_end: '2026-02-01', rent: 750000, status: 'active', avatar: null },
  { id: 7, name: 'Eve Martin', email: 'eve@example.com', phone: '+255 718 901 234', unit: 'B-203', building: 'Harbour Heights', property: 'Harbour Estate', lease_start: '2025-04-01', lease_end: '2026-04-01', rent: 1100000, status: 'active', avatar: null },
  { id: 8, name: 'Frank Wilson', email: 'frank@example.com', phone: '+255 719 012 345', unit: 'C-102', building: 'Hilltop Towers', property: 'Hilltop Residency', lease_start: '2024-09-01', lease_end: '2025-09-01', rent: 700000, status: 'expiring', avatar: null },
  { id: 9, name: 'Grace Chen', email: 'grace@example.com', phone: '+255 720 123 456', unit: 'D-301', building: 'Sunrise Block D', property: 'Sunrise Complex', lease_start: '2025-05-01', lease_end: '2025-11-01', rent: 880000, status: 'active', avatar: null },
  { id: 10, name: 'Henry Taylor', email: 'henry@example.com', phone: '+255 721 234 567', unit: 'A-302', building: 'Riverside Tower', property: 'Riverside Apartments', lease_start: '2024-06-01', lease_end: '2025-06-01', rent: 920000, status: 'terminated', avatar: null },
];

export const leases = [
  { id: 1, tenant: 'John Doe', unit: 'A-203', property: 'Riverside Apartments', start: '2025-01-01', end: '2026-01-01', rent: 850000, deposit: 850000, status: 'active', type: 'annual' },
  { id: 2, tenant: 'Jane Smith', unit: 'B-105', property: 'Harbour Estate', start: '2025-03-15', end: '2026-03-15', rent: 1200000, deposit: 1200000, status: 'active', type: 'annual' },
  { id: 3, tenant: 'Alice Johnson', unit: 'C-301', property: 'Hilltop Residency', start: '2025-06-01', end: '2025-12-31', rent: 650000, deposit: 650000, status: 'active', type: 'monthly' },
  { id: 4, tenant: 'Bob Williams', unit: 'D-202', property: 'Sunrise Complex', start: '2024-08-01', end: '2025-08-01', rent: 950000, deposit: 950000, status: 'expiring', type: 'annual' },
  { id: 5, tenant: 'Carol Brown', unit: 'E-101', property: 'Ocean View Estate', start: '2024-11-01', end: '2025-05-01', rent: 1500000, deposit: 1500000, status: 'terminated', type: 'annual' },
  { id: 6, tenant: 'David Lee', unit: 'A-101', property: 'Riverside Apartments', start: '2025-02-01', end: '2026-02-01', rent: 750000, deposit: 750000, status: 'active', type: 'annual' },
  { id: 7, tenant: 'Eve Martin', unit: 'B-203', property: 'Harbour Estate', start: '2025-04-01', end: '2026-04-01', rent: 1100000, deposit: 1100000, status: 'active', type: 'annual' },
  { id: 8, tenant: 'Frank Wilson', unit: 'C-102', property: 'Hilltop Residency', start: '2024-09-01', end: '2025-09-01', rent: 700000, deposit: 700000, status: 'expiring', type: 'monthly' },
];

export const payments = [
  { id: 1, tenant: 'John Doe', unit: 'A-203', amount: 850000, method: 'M-Pesa', ref: 'MPE-2025-001', date: '2025-07-01', status: 'paid', period: 'July 2025' },
  { id: 2, tenant: 'Jane Smith', unit: 'B-105', amount: 1200000, method: 'Bank Transfer', ref: 'BT-2025-042', date: '2025-07-05', status: 'paid', period: 'July 2025' },
  { id: 3, tenant: 'Alice Johnson', unit: 'C-301', amount: 650000, method: 'Cash', ref: 'CSH-2025-018', date: '2025-07-10', status: 'paid', period: 'July 2025' },
  { id: 4, tenant: 'Bob Williams', unit: 'D-202', amount: 950000, method: 'M-Pesa', ref: 'MPE-2025-015', date: '2025-07-03', status: 'paid', period: 'July 2025' },
  { id: 5, tenant: 'David Lee', unit: 'A-101', amount: 750000, method: 'M-Pesa', ref: 'MPE-2025-089', date: '2025-07-12', status: 'paid', period: 'July 2025' },
  { id: 6, tenant: 'Eve Martin', unit: 'B-203', amount: 1100000, method: 'Bank Transfer', ref: 'BT-2025-067', date: '2025-07-08', status: 'paid', period: 'July 2025' },
  { id: 7, tenant: 'Grace Chen', unit: 'D-301', amount: 880000, method: 'M-Pesa', ref: null, date: null, status: 'pending', period: 'July 2025' },
  { id: 8, tenant: 'Frank Wilson', unit: 'C-102', amount: 700000, method: null, ref: null, date: null, status: 'overdue', period: 'July 2025' },
  { id: 9, tenant: 'John Doe', unit: 'A-203', amount: 850000, method: 'M-Pesa', ref: 'MPE-2025-001', date: '2025-06-01', status: 'paid', period: 'June 2025' },
  { id: 10, tenant: 'Jane Smith', unit: 'B-105', amount: 1200000, method: 'Bank Transfer', ref: 'BT-2025-030', date: '2025-06-05', status: 'paid', period: 'June 2025' },
  { id: 11, tenant: 'Alice Johnson', unit: 'C-301', amount: 650000, method: 'M-Pesa', ref: 'MPE-2025-078', date: '2025-06-10', status: 'paid', period: 'June 2025' },
  { id: 12, tenant: 'Bob Williams', unit: 'D-202', amount: 950000, method: 'Cash', ref: 'CSH-2025-012', date: '2025-06-03', status: 'paid', period: 'June 2025' },
  { id: 13, tenant: 'Carol Brown', unit: 'E-101', amount: 1500000, method: 'M-Pesa', ref: 'MPE-2025-055', date: '2025-05-01', status: 'paid', period: 'May 2025' },
];

export const maintenance = [
  { id: 1, title: 'Leaking faucet', unit: 'A-203', tenant: 'John Doe', type: 'plumbing', priority: 'medium', status: 'in_progress', assigned: 'Mike Technician', created: '2025-07-08', description: 'Kitchen faucet has been leaking for 2 days' },
  { id: 2, title: 'Broken AC unit', unit: 'B-105', tenant: 'Jane Smith', type: 'hvac', priority: 'high', status: 'pending', assigned: null, created: '2025-07-10', description: 'AC not cooling at all. Temperature reaching 30°C' },
  { id: 3, title: 'Electrical outlet not working', unit: 'C-301', tenant: 'Alice Johnson', type: 'electrical', priority: 'medium', status: 'pending', assigned: null, created: '2025-07-11', description: 'Two outlets in the living room stopped working' },
  { id: 4, title: 'Window glass cracked', unit: 'D-202', tenant: 'Bob Williams', type: 'structural', priority: 'low', status: 'completed', assigned: 'Mike Technician', created: '2025-07-05', description: 'Bedroom window cracked after storm' },
  { id: 5, title: 'Water heater not working', unit: 'A-101', tenant: 'David Lee', type: 'plumbing', priority: 'high', status: 'in_progress', assigned: 'Sarah Fixer', created: '2025-07-09', description: 'No hot water in the bathroom' },
  { id: 6, title: 'Door lock broken', unit: 'B-203', tenant: 'Eve Martin', type: 'security', priority: 'critical', status: 'pending', assigned: null, created: '2025-07-12', description: 'Front door lock is jammed, cannot enter unit' },
  { id: 7, title: 'Paint peeling', unit: 'D-301', tenant: 'Grace Chen', type: 'cosmetic', priority: 'low', status: 'completed', assigned: 'John Painter', created: '2025-07-02', description: 'Paint peeling in the hallway' },
  { id: 8, title: 'Toilet running constantly', unit: 'C-102', tenant: 'Frank Wilson', type: 'plumbing', priority: 'medium', status: 'pending', assigned: null, created: '2025-07-13', description: 'Toilet tank not refilling properly' },
];

export const reports = {
  occupancy: { total: 120, occupied: 98, vacant: 22, rate: 81.7 },
  revenue: { monthly: 8950000, annual: 107400000, outstanding: 1580000 },
  maintenance: { open: 5, inProgress: 2, completed: 8, avgResponse: '2.4 days' },
  leases: { active: 6, expiring: 2, terminated: 2, total: 10 },
};

export const monthlyRevenue = [
  { month: 'Jan', revenue: 8200000, expenses: 3100000 },
  { month: 'Feb', revenue: 8350000, expenses: 2900000 },
  { month: 'Mar', revenue: 8500000, expenses: 3200000 },
  { month: 'Apr', revenue: 8650000, expenses: 2800000 },
  { month: 'May', revenue: 8800000, expenses: 3400000 },
  { month: 'Jun', revenue: 8900000, expenses: 3000000 },
  { month: 'Jul', revenue: 8950000, expenses: 3500000 },
];
