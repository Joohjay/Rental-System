import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiHeart, FiHome, FiMapPin, FiStar, FiTrash2, FiChevronRight } from 'react-icons/fi';
import { getFavorites, toggleFavorite } from '../../api/marketplaceApi';
import { formatCurrency } from '../../utils/format';

const SavedProperties = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const { data } = await getFavorites();
      setFavorites(data.data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchFavorites(); }, []);

  const handleRemove = async (id) => {
    try {
      await toggleFavorite(id);
      setFavorites((prev) => prev.filter((p) => p.id !== id));
    } catch (err) { console.error(err); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Saved Properties</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Properties you have saved for later</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-white dark:bg-gray-800 animate-pulse border border-gray-100 dark:border-gray-700">
              <div className="h-40 bg-gray-200 dark:bg-gray-700" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : favorites.length === 0 ? (
        <div className="text-center py-20">
          <FiHeart size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">No saved properties</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Start browsing and save properties you like</p>
          <Link to="/browse" className="text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:underline">Browse Properties</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorites.map((p) => (
            <div key={p.id} className="group rounded-2xl bg-white dark:bg-gray-800 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-100 dark:border-gray-700">
              <div className="relative h-40 overflow-hidden" onClick={() => navigate(`/properties/${p.id}`)}>
                {p.primary_image ? (
                  <img src={p.primary_image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/20 flex items-center justify-center">
                    <FiHome size={32} className="text-indigo-300 dark:text-indigo-600" />
                  </div>
                )}
                <button onClick={(e) => { e.stopPropagation(); handleRemove(p.id); }} className="absolute top-2 right-2 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 text-red-500 hover:bg-white dark:hover:bg-gray-700 backdrop-blur-sm transition-colors">
                  <FiTrash2 size={14} />
                </button>
              </div>
              <div className="p-4" onClick={() => navigate(`/properties/${p.id}`)}>
                <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">{p.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                  <FiMapPin size={12} />
                  {p.city || p.region || 'Tanzania'}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                    {p.rent_min ? `${formatCurrency(p.rent_min)}/mo` : 'Contact'}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <FiStar size={10} className="text-yellow-500 fill-yellow-500" />
                    {Number(p.avg_rating || 0).toFixed(1)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedProperties;
