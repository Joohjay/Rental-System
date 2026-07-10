import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './routes/ProtectedRoute';
import RoleGuard from './routes/RoleGuard';
import DashboardLayout from './components/layout/DashboardLayout';
import DashboardRedirect from './pages/DashboardRedirect';
import Login from './pages/Login';
import Register from './pages/Register';
import Forbidden from './pages/Forbidden';
import NotFound from './pages/NotFound';
import LandingPage from './pages/LandingPage';
import BrowseProperties from './pages/marketplace/BrowseProperties';
import PropertyDetails from './pages/marketplace/PropertyDetails';
import SavedProperties from './pages/marketplace/SavedProperties';
import ApplicationsList from './pages/marketplace/ApplicationsList';
import ViewingRequests from './pages/marketplace/ViewingRequests';
import NotificationsPage from './pages/marketplace/NotificationsPage';
import MessagesPage from './pages/marketplace/MessagesPage';

// Role-specific dashboards
import AdminDashboard from './pages/dashboards/AdminDashboard';
import OwnerDashboard from './pages/dashboards/OwnerDashboard';
import ManagerDashboard from './pages/dashboards/ManagerDashboard';
import CaretakerDashboard from './pages/dashboards/CaretakerDashboard';
import AccountantDashboard from './pages/dashboards/AccountantDashboard';
import ApplicantDashboard from './pages/dashboards/ApplicantDashboard';
import TenantDashboard from './pages/dashboards/TenantDashboard';
import FormerTenantDashboard from './pages/dashboards/FormerTenantDashboard';

// Management pages
import CompanyList from './pages/companies/CompanyList';
import CompanyForm from './pages/companies/CompanyForm';
import PropertyList from './pages/properties/PropertyList';
import PropertyForm from './pages/properties/PropertyForm';
import BuildingList from './pages/buildings/BuildingList';
import BuildingForm from './pages/buildings/BuildingForm';
import UnitList from './pages/units/UnitList';
import UnitForm from './pages/units/UnitForm';
import TenantList from './pages/tenants/TenantList';
import LeaseList from './pages/leases/LeaseList';
import PaymentList from './pages/payments/PaymentList';
import MaintenanceList from './pages/maintenance/MaintenanceList';
import Reports from './pages/reports/Reports';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

const ADMIN_ROLES = ['SUPER_ADMIN', 'COMPANY_OWNER', 'PROPERTY_MANAGER'];
const MANAGEMENT_ROLES = ['SUPER_ADMIN', 'COMPANY_OWNER', 'PROPERTY_MANAGER', 'CARETAKER', 'ACCOUNTANT'];

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <ThemeProvider>
            <ToastProvider>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/403" element={<Forbidden />} />

                <Route path="/dashboard" element={<DashboardRedirect />} />

                {/* Public / Landing routes — no sidebar */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/browse" element={<BrowseProperties />} />
                <Route path="/properties/:id" element={<PropertyDetails />} />

                {/* SUPER_ADMIN dashboard */}
                <Route element={<ProtectedRoute><RoleGuard roles={['SUPER_ADMIN']}><DashboardLayout /></RoleGuard></ProtectedRoute>}>
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                </Route>

                {/* COMPANY_OWNER dashboard */}
                <Route element={<ProtectedRoute><RoleGuard roles={['COMPANY_OWNER']}><DashboardLayout /></RoleGuard></ProtectedRoute>}>
                  <Route path="/owner/dashboard" element={<OwnerDashboard />} />
                </Route>

                {/* PROPERTY_MANAGER dashboard */}
                <Route element={<ProtectedRoute><RoleGuard roles={['PROPERTY_MANAGER']}><DashboardLayout /></RoleGuard></ProtectedRoute>}>
                  <Route path="/manager/dashboard" element={<ManagerDashboard />} />
                </Route>

                {/* CARETAKER dashboard */}
                <Route element={<ProtectedRoute><RoleGuard roles={['CARETAKER']}><DashboardLayout /></RoleGuard></ProtectedRoute>}>
                  <Route path="/caretaker/dashboard" element={<CaretakerDashboard />} />
                </Route>

                {/* ACCOUNTANT dashboard */}
                <Route element={<ProtectedRoute><RoleGuard roles={['ACCOUNTANT']}><DashboardLayout /></RoleGuard></ProtectedRoute>}>
                  <Route path="/accountant/dashboard" element={<AccountantDashboard />} />
                </Route>

                {/* APPLICANT dashboard */}
                <Route element={<ProtectedRoute><RoleGuard roles={['APPLICANT']}><DashboardLayout /></RoleGuard></ProtectedRoute>}>
                  <Route path="/applicant/dashboard" element={<ApplicantDashboard />} />
                  <Route path="/saved" element={<SavedProperties />} />
                  <Route path="/applications" element={<ApplicationsList />} />
                  <Route path="/viewing-requests" element={<ViewingRequests />} />
                  <Route path="/notifications" element={<NotificationsPage />} />
                  <Route path="/messages" element={<MessagesPage />} />
                </Route>

                {/* TENANT dashboard */}
                <Route element={<ProtectedRoute><RoleGuard roles={['TENANT']}><DashboardLayout /></RoleGuard></ProtectedRoute>}>
                  <Route path="/tenant/dashboard" element={<TenantDashboard />} />
                </Route>

                {/* FORMER_TENANT dashboard */}
                <Route element={<ProtectedRoute><RoleGuard roles={['FORMER_TENANT']}><DashboardLayout /></RoleGuard></ProtectedRoute>}>
                  <Route path="/former-tenant/dashboard" element={<FormerTenantDashboard />} />
                </Route>

                {/* Management routes — shared among admin roles */}
                <Route element={<ProtectedRoute><RoleGuard roles={MANAGEMENT_ROLES}><DashboardLayout /></RoleGuard></ProtectedRoute>}>
                  <Route path="/companies" element={<CompanyList />} />
                  <Route path="/companies/new" element={<CompanyForm />} />
                  <Route path="/companies/:id/edit" element={<CompanyForm />} />
                  <Route path="/properties" element={<PropertyList />} />
                  <Route path="/properties/new" element={<PropertyForm />} />
                  <Route path="/properties/:id/edit" element={<PropertyForm />} />
                  <Route path="/buildings" element={<BuildingList />} />
                  <Route path="/buildings/new" element={<BuildingForm />} />
                  <Route path="/buildings/:id/edit" element={<BuildingForm />} />
                  <Route path="/units" element={<UnitList />} />
                  <Route path="/units/new" element={<UnitForm />} />
                  <Route path="/units/:id/edit" element={<UnitForm />} />
                  <Route path="/tenants" element={<TenantList />} />
                  <Route path="/leases" element={<LeaseList />} />
                  <Route path="/payments" element={<PaymentList />} />
                  <Route path="/maintenance" element={<MaintenanceList />} />
                  <Route path="/reports" element={<Reports />} />
                </Route>

                {/* Profile & Settings — any authenticated user */}
                <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/settings" element={<Settings />} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </ToastProvider>
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
