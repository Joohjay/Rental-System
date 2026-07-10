import { NavLink, useNavigate } from 'react-router-dom';
import { FiX } from 'react-icons/fi';
import { LucideIcons } from '../../utils/constants';
import { NAV_ITEMS_BY_ROLE, DASHBOARD_ROUTES } from '../../config/navigation';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = ({ mobileOpen, onClose }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const role = user?.role || 'TENANT';
  const navItems = NAV_ITEMS_BY_ROLE[role] || NAV_ITEMS_BY_ROLE.TENANT;
  const dashboardPath = DASHBOARD_ROUTES[role] || '/tenant/dashboard';

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-700/50">
        <button onClick={() => navigate(dashboardPath)} className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm">RF</span>
          </div>
          <span className="text-lg font-bold text-white">RentFlow</span>
        </button>
        <button onClick={onClose} className="lg:hidden p-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700">
          <FiX size={20} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = LucideIcons[item.icon];
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-indigo-600/20 text-indigo-300 shadow-sm'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`
              }
            >
              {Icon && <Icon size={18} strokeWidth={1.5} />}
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-gray-700/50">
        <button onClick={() => { navigate('/profile'); onClose(); }} className="flex items-center gap-3 px-3 py-2 w-full rounded-lg hover:bg-gray-700/30 transition-colors">
          <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-sm font-medium text-white">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-medium text-white truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-gray-400 truncate">{user?.role?.replace(/_/g, ' ') || 'View profile'}</p>
          </div>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-gray-900 dark:bg-gray-950 border-r border-gray-800">
        {sidebarContent}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black/60 animate-fade-in" onClick={onClose} />
          <aside className="fixed inset-y-0 left-0 w-64 bg-gray-900 dark:bg-gray-950 z-50 shadow-2xl animate-slide-right">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
};

export default Sidebar;
