import { useState } from 'react';
import { FiBell, FiFileText, FiCalendar, FiMessageSquare, FiHeart, FiCheck, FiTrash2 } from 'react-icons/fi';

const ICONS = {
  application: FiFileText,
  viewing: FiCalendar,
  message: FiMessageSquare,
  saved: FiHeart,
};

const INITIAL = [
  { id: 1, type: 'application', title: 'Application Reviewed', desc: 'Your application for Riverside Apartments has been reviewed. The property manager will contact you soon.', time: '2 hours ago', read: false },
  { id: 2, type: 'viewing', title: 'Viewing Confirmed', desc: 'Your viewing for Ocean View Villa is confirmed for tomorrow at 10:00 AM. Please arrive on time.', time: '1 day ago', read: false },
  { id: 3, type: 'message', title: 'New Message', desc: 'Property manager responded to your inquiry about the downtown apartment.', time: '2 days ago', read: false },
  { id: 4, type: 'saved', title: 'Price Drop', desc: 'A property you saved has reduced its price by TZS 100,000.', time: '3 days ago', read: true },
  { id: 5, type: 'application', title: 'Application Accepted', desc: 'Congratulations! Your application for Green View Estate has been accepted.', time: '1 week ago', read: true },
];

const NotificationsPage = () => {
  const [items, setItems] = useState(INITIAL);
  const [expanded, setExpanded] = useState(null);

  const handleClick = (id) => {
    if (expanded === id) {
      setExpanded(null);
    } else {
      setExpanded(id);
      setItems((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
    }
  };

  const markAllRead = () => setItems((prev) => prev.map((n) => ({ ...n, read: true })));

  const clearAll = () => setItems([]);

  const unread = items.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {unread > 0 ? `${unread} unread` : 'All caught up'}
          </p>
        </div>
        <div className="flex gap-2">
          {unread > 0 && (
            <button onClick={markAllRead} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors">
              <FiCheck size={14} /> Mark All Read
            </button>
          )}
          {items.length > 0 && (
            <button onClick={clearAll} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
              <FiTrash2 size={14} /> Clear All
            </button>
          )}
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <FiBell size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">All caught up!</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">No notifications at this time</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((n) => {
            const Icon = ICONS[n.type] || FiBell;
            const open = expanded === n.id;
            const seen = n.read && !open;
            return (
              <div
                key={n.id}
                onClick={() => handleClick(n.id)}
                className={`rounded-2xl p-4 border cursor-pointer transition-all ${
                  seen
                    ? 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700'
                    : 'bg-indigo-50 dark:bg-indigo-900/10 border-indigo-100 dark:border-indigo-800'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    seen ? 'bg-gray-100 dark:bg-gray-700 text-gray-400' : 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600'
                  }`}>
                    <Icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className={`text-sm ${seen ? 'text-gray-700 dark:text-gray-300' : 'text-gray-900 dark:text-white font-semibold'}`}>
                          {n.title}
                        </p>
                        <p className={`text-xs mt-0.5 ${open ? 'text-gray-700 dark:text-gray-200' : 'text-gray-500 dark:text-gray-400 truncate'}`}>
                          {n.desc}
                        </p>
                        {open && (
                          <div className="mt-3 pt-3 border-t border-indigo-200 dark:border-indigo-700">
                            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{n.desc}</p>
                          </div>
                        )}
                      </div>
                      {!n.read && !open && (
                        <div className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0 mt-1.5" />
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-1.5">{n.time}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
