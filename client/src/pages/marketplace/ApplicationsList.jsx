import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiFileText, FiHome, FiMapPin, FiClock, FiCheckCircle, FiXCircle, FiAlertCircle, FiEye, FiChevronRight } from 'react-icons/fi';
import { getApplications } from '../../api/marketplaceApi';
import { formatCurrency } from '../../utils/format';

const STATUS_MAP = {
  pending: { icon: FiClock, label: 'Pending', color: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400 border-yellow-200 dark:border-yellow-700' },
  reviewed: { icon: FiEye, label: 'Reviewed', color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200 dark:border-blue-700' },
  accepted: { icon: FiCheckCircle, label: 'Accepted', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-700' },
  rejected: { icon: FiXCircle, label: 'Rejected', color: 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-700' },
};

const ApplicationsList = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const { data } = await getApplications();
        setApplications(data.data || []);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Applications</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Track your rental applications</p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-white dark:bg-gray-800 animate-pulse border border-gray-100 dark:border-gray-700 p-5">
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : applications.length === 0 ? (
        <div className="text-center py-20">
          <FiFileText size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">No applications yet</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Apply to properties you are interested in</p>
          <Link to="/browse" className="text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:underline">Browse Properties</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => {
            const status = STATUS_MAP[app.status] || STATUS_MAP.pending;
            const StatusIcon = status.icon;
            return (
              <div key={app.id} className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{app.property?.name || 'Property'}</h3>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${status.color}`}>
                        <StatusIcon size={12} />
                        {status.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <FiMapPin size={12} />
                      {app.property?.city || app.property?.region || 'Tanzania'}
                    </p>
                    {app.message && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 bg-gray-50 dark:bg-gray-750 p-3 rounded-xl italic">"{app.message}"</p>
                    )}
                    <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                      <FiClock size={12} />
                      Applied {app.created_at ? new Date(app.created_at).toLocaleDateString() : 'Recently'}
                    </p>
                  </div>
                  {app.property?.id && (
                    <button onClick={() => navigate(`/properties/${app.property.id}`)} className="p-2 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors">
                      <FiEye size={16} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ApplicationsList;
