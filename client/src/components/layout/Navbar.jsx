import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { FiMenu, FiSun, FiMoon, FiUser, FiLogOut, FiCommand } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { ROLE_BADGES } from '../../utils/constants';
import { logoutUser } from '../../api/authApi';
import NotificationsDropdown from '../NotificationsDropdown';

const badgeColors = {
  purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  indigo: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
  blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  green: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  orange: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  teal: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400',
  gray: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
};

const Navbar = ({ onMenuClick, onCommandPaletteOpen }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { dark, toggleTheme } = useTheme();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    try { await logoutUser(); } catch {}
    logout();
    navigate('/login');
  };

  const pathParts = pathname.split('/').filter(Boolean);
  const breadcrumbs = [];
  let accumulated = '';
  for (const part of pathParts) {
    accumulated += `/${part}`;
    const label = part.replace(/^./, (c) => c.toUpperCase()).replace(/-/g, ' ');
    if (accumulated === pathname) {
      breadcrumbs.push({ label, path: accumulated, active: true });
    } else {
      breadcrumbs.push({ label, path: accumulated, active: false });
    }
  }

  const roleInfo = ROLE_BADGES[user?.role] || { label: user?.role || 'User', color: 'gray' };
  const badgeClass = badgeColors[roleInfo.color] || badgeColors.gray;

  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between px-4 lg:px-6 h-16">
        <div className="flex items-center gap-4">
          <button onClick={onMenuClick} className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800">
            <FiMenu size={20} />
          </button>

          <nav className="hidden sm:flex items-center gap-1.5 text-sm">
            <Link to="/dashboard" className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
              Dashboard
            </Link>
            {breadcrumbs.map((crumb) => (
              <span key={crumb.path} className="flex items-center gap-1.5">
                <span className="text-gray-300 dark:text-gray-600">/</span>
                {crumb.active ? (
                  <span className="text-gray-900 dark:text-white font-semibold">{crumb.label}</span>
                ) : (
                  <Link to={crumb.path} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                    {crumb.label}
                  </Link>
                )}
              </span>
            ))}
          </nav>

          <span className="sm:hidden text-gray-900 dark:text-white font-semibold text-base">
            {breadcrumbs[breadcrumbs.length - 1]?.label || 'Dashboard'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onCommandPaletteOpen}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 text-sm text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
          >
            <FiCommand size={14} />
            <span className="text-xs">Ctrl+K</span>
          </button>

          <button onClick={toggleTheme} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            {dark ? <FiSun size={18} /> : <FiMoon size={18} />}
          </button>

          <NotificationsDropdown />

          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 ml-2 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-sm font-semibold text-indigo-700 dark:text-indigo-300">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg py-1 animate-scale-in origin-top-right">
                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{user?.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                  <div className="mt-1.5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${badgeClass}`}>
                      {roleInfo.label}
                    </span>
                    {user?.company_id && (
                      <span className="ml-1.5 text-xs text-gray-400">ID: {user.company_id}</span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => { setProfileOpen(false); navigate('/profile'); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <FiUser size={16} />
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <FiLogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
