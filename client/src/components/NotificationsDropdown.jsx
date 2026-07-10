import { useState, useRef, useEffect } from 'react';
import { FiBell } from 'react-icons/fi';

const MOCK_NOTIFICATIONS = [
  { id: 1, title: 'Lease expires tomorrow', description: 'Unit A-203, John Doe', time: '2 hours ago', type: 'warning', unread: true },
  { id: 2, title: 'Rent overdue', description: 'Unit B-105, Jane Smith - 3 days overdue', time: '5 hours ago', type: 'error', unread: true },
  { id: 3, title: 'Maintenance completed', description: 'Plumbing repair at Unit C-301', time: '1 day ago', type: 'success', unread: true },
  { id: 4, title: 'New tenant registered', description: 'Alice Johnson signed lease for Unit D-202', time: '2 days ago', type: 'info', unread: false },
  { id: 5, title: 'Payment received', description: 'TZS 850,000 from Unit A-203', time: '3 days ago', type: 'success', unread: false },
];

const typeStyles = {
  warning: 'border-l-amber-400 bg-amber-50 dark:bg-amber-900/10',
  error: 'border-l-red-400 bg-red-50 dark:bg-red-900/10',
  success: 'border-l-emerald-400 bg-emerald-50 dark:bg-emerald-900/10',
  info: 'border-l-blue-400 bg-blue-50 dark:bg-blue-900/10',
};

const NotificationsDropdown = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const unread = MOCK_NOTIFICATIONS.filter((n) => n.unread).length;

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <FiBell size={18} />
        {unread > 0 && (
          <span className="absolute top-1.5 right-1.5 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-red-500 rounded-full">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden animate-scale-in origin-top-right">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Notifications</h3>
            {unread > 0 && (
              <button className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">Mark all read</button>
            )}
          </div>

          <div className="max-h-72 overflow-y-auto">
            {MOCK_NOTIFICATIONS.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                No notifications yet
              </div>
            ) : (
              MOCK_NOTIFICATIONS.map((n) => (
                <div
                  key={n.id}
                  className={`px-4 py-3 border-l-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${typeStyles[n.type] || ''}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-1.5">
                        {n.title}
                        {n.unread && <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">{n.description}</p>
                    </div>
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 shrink-0">{n.time}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsDropdown;
