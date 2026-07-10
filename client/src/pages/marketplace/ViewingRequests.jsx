import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiCalendar, FiHome, FiMapPin, FiClock, FiCheckCircle, FiXCircle, FiAlertCircle, FiEye, FiChevronRight } from 'react-icons/fi';
import { getViewingRequests } from '../../api/marketplaceApi';
import { formatCurrency } from '../../utils/format';

const STATUS_MAP = {
  pending: { icon: FiClock, label: 'Pending', color: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400 border-yellow-200 dark:border-yellow-700' },
  confirmed: { icon: FiCheckCircle, label: 'Confirmed', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-700' },
  completed: { icon: FiCheckCircle, label: 'Completed', color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200 dark:border-blue-700' },
  cancelled: { icon: FiXCircle, label: 'Cancelled', color: 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-700' },
};

const ViewingRequests = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const { data } = await getViewingRequests();
        setRequests(data.data || []);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Viewing Requests</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Schedule and manage property viewings</p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-white dark:bg-gray-800 animate-pulse border border-gray-100 dark:border-gray-700 p-5">
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/5" />
            </div>
          ))}
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center py-20">
          <FiCalendar size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">No viewing requests</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Request a viewing on a property you are interested in</p>
          <Link to="/browse" className="text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:underline">Browse Properties</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map((req) => {
            const status = STATUS_MAP[req.status] || STATUS_MAP.pending;
            const StatusIcon = status.icon;
            return (
              <div key={req.id} className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{req.property?.name || 'Property'}</h3>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${status.color}`}>
                        <StatusIcon size={12} />
                        {status.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <FiMapPin size={12} />
                      {req.property?.city || req.property?.region || 'Tanzania'}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
                      {req.preferred_date && (
                        <span className="flex items-center gap-1">
                          <FiCalendar size={12} />
                          {new Date(req.preferred_date).toLocaleDateString()}
                        </span>
                      )}
                      {req.preferred_time && (
                        <span className="flex items-center gap-1">
                          <FiClock size={12} />
                          {req.preferred_time}
                        </span>
                      )}
                    </div>
                    {req.message && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 bg-gray-50 dark:bg-gray-750 p-3 rounded-xl italic">"{req.message}"</p>
                    )}
                  </div>
                  {req.property?.id && (
                    <button onClick={() => navigate(`/properties/${req.property.id}`)} className="p-2 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors">
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

export default ViewingRequests;
