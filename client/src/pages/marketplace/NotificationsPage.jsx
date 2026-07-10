import { useState } from 'react';
import { FiBell, FiHome, FiFileText, FiCalendar, FiMessageSquare, FiHeart, FiCheck, FiTrash2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const MOCK_NOTIFICATIONS = [
  { id: 1, type: 'application', icon: FiFileText, title: 'Application Reviewed', desc: 'Your application for Riverside Apartments has been reviewed.', time: '2 hours ago', read: false },
  { id: 2, type: 'viewing', icon: FiCalendar, title: 'Viewing Confirmed', desc: 'Your viewing for Ocean View Villa is confirmed for tomorrow at 10:00 AM.', time: '1 day ago', read: false },
  { id: 3, type: 'message', icon: FiMessageSquare, title: 'New Message', desc: 'Property manager responded to your inquiry.', time: '2 days ago', read: false },
  { id: 4, type: 'saved', icon: FiHeart, title: 'Price Drop', desc: 'A property you saved has reduced its price.', time: '3 days ago', read: true },
  { id: 5, type: 'application', icon: FiFileText, title: 'Application Accepted', desc: 'Congratulations! Your application has been accepted.', time: '1 week ago', read: true },
];

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  const clearAll = () => setNotifications([]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'No unread notifications'}
          </p>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors">
              <FiCheck size={14} /> Mark All Read
            </button>
          )}
          {notifications.length > 0 && (
            <button onClick={clearAll} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
              <FiTrash2 size={14} /> Clear All
            </button>
          )}
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-20">
          <FiBell size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">All caught up!</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">No notifications at this time</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => {
            const Icon = n.icon;
            const isExpanded = expandedId === n.id;
            return (
              <div key={n.id} onClick={() => toggleExpand(n.id)} className={`rounded-2xl p-4 border transition-colors cursor-pointer ${n.read && !isExpanded ? 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700' : 'bg-indigo-50 dark:bg-indigo-900/10 border-indigo-100 dark:border-indigo-800'}`}>
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${n.read && !isExpanded ? 'bg-gray-100 dark:bg-gray-700 text-gray-400' : 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600'}`}>
                    <Icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className={`text-sm ${n.read && !isExpanded ? 'text-gray-700 dark:text-gray-300' : 'text-gray-900 dark:text-white font-semibold'}`}>{n.title}</p>
                        <p className={`text-xs mt-0.5 ${isExpanded ? 'text-gray-700 dark:text-gray-200' : 'text-gray-500 dark:text-gray-400 line-clamp-1'}`}>{n.desc}</p>
                        {isExpanded && (
                          <div className="mt-3 pt-3 border-t border-indigo-200 dark:border-indigo-700">
                            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{n.desc}</p>
                          </div>
                        )}
                      </div>
                      {!n.read && !isExpanded && <div className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0 mt-1.5" />}
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
