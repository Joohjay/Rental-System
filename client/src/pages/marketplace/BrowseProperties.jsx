import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { FiSearch, FiMapPin, FiGrid, FiList, FiHome, FiStar, FiChevronLeft, FiChevronRight, FiFilter, FiX } from 'react-icons/fi';
import { getListings } from '../../api/marketplaceApi';
import { formatCurrency } from '../../utils/format';

const CITIES = [
  'Dar es Salaam', 'Arusha', 'Mwanza', 'Mbeya', 'Dodoma', 'Zanzibar', 'Tanga', 'Morogoro',
];
const PROPERTY_TYPES = ['apartment', 'house', 'villa', 'studio', 'commercial', 'land'];
const BEDROOM_OPTIONS = [1, 2, 3, 4, 5];
const BATHROOM_OPTIONS = [1, 2, 3, 4];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'name_asc', label: 'Name: A-Z' },
  { value: 'name_desc', label: 'Name: Z-A' },
];

const BrowseProperties = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    city: searchParams.get('city') || '',
    property_type: searchParams.get('property_type') || '',
    min_price: searchParams.get('min_price') || '',
    max_price: searchParams.get('max_price') || '',
    bedrooms: searchParams.get('bedrooms') || '',
    bathrooms: searchParams.get('bathrooms') || '',
    furnished: searchParams.get('furnished') || '',
    sort: searchParams.get('sort') || 'newest',
    page: parseInt(searchParams.get('page')) || 1,
  });
  const limit = 12;

  const fetchListings = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page: filters.page, limit, sort: filters.sort };
      if (filters.search) params.search = filters.search;
      if (filters.city) params.city = filters.city;
      if (filters.property_type) params.property_type = filters.property_type;
      if (filters.min_price) params.min_price = filters.min_price;
      if (filters.max_price) params.max_price = filters.max_price;
      if (filters.bedrooms) params.bedrooms = filters.bedrooms;
      if (filters.bathrooms) params.bathrooms = filters.bathrooms;
      if (filters.furnished) params.furnished = filters.furnished;
      const { data } = await getListings(params);
      setListings(data.data || []);
      setTotal(data.pagination?.total || 0);
    } catch { setListings([]); } finally { setLoading(false); }
  }, [filters]);

  useEffect(() => { fetchListings(); }, [fetchListings]);

  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => { if (v && k !== 'page') params.set(k, v); });
    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  const totalPages = Math.ceil(total / limit);

  const updateFilter = (key, value) => setFilters({ ...filters, [key]: value, page: 1 });

  const clearFilters = () => setFilters({ search: '', city: '', property_type: '', min_price: '', max_price: '', bedrooms: '', bathrooms: '', furnished: '', sort: 'newest', page: 1 });

  const hasActiveFilters = filters.city || filters.property_type || filters.min_price || filters.max_price || filters.bedrooms || filters.bathrooms || filters.furnished || filters.search;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <FiSearch size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={filters.search} onChange={(e) => updateFilter('search', e.target.value)} placeholder="Search properties..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 outline-none text-sm" />
            </div>
            <button onClick={() => setShowFilters(!showFilters)} className={`p-2.5 rounded-xl border ${showFilters ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-700 text-indigo-600' : 'border-gray-200 dark:border-gray-700 text-gray-500'} hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}>
              <FiFilter size={18} />
            </button>
            <div className="hidden sm:flex items-center border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
              <button onClick={() => setViewMode('grid')} className={`p-2.5 ${viewMode === 'grid' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600' : 'text-gray-400'}`}><FiGrid size={16} /></button>
              <button onClick={() => setViewMode('list')} className={`p-2.5 ${viewMode === 'list' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600' : 'text-gray-400'}`}><FiList size={16} /></button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
        {/* Sidebar Filters */}
        <aside className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-64 flex-shrink-0`}>
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 space-y-5 sticky top-28">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Filters</h3>
              {hasActiveFilters && <button onClick={clearFilters} className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-1"><FiX size={12} /> Clear</button>}
            </div>

            {/* City */}
            <div>
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">City</label>
              <select value={filters.city} onChange={(e) => updateFilter('city', e.target.value)} className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none">
                <option value="">All Cities</option>
                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Property Type */}
            <div>
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">Property Type</label>
              <div className="grid grid-cols-2 gap-1.5">
                {PROPERTY_TYPES.map(t => (
                  <button key={t} onClick={() => updateFilter('property_type', filters.property_type === t ? '' : t)} className={`text-xs capitalize px-3 py-1.5 rounded-lg border transition-colors ${filters.property_type === t ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-700 text-indigo-600' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>{t}</button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">Price Range (TZS/mo)</label>
              <div className="flex items-center gap-2">
                <input type="number" placeholder="Min" value={filters.min_price} onChange={(e) => updateFilter('min_price', e.target.value)} className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm px-3 py-2 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 outline-none" />
                <span className="text-gray-400">-</span>
                <input type="number" placeholder="Max" value={filters.max_price} onChange={(e) => updateFilter('max_price', e.target.value)} className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm px-3 py-2 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
            </div>

            {/* Bedrooms */}
            <div>
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">Bedrooms</label>
              <div className="flex flex-wrap gap-1.5">
                {BEDROOM_OPTIONS.map(n => (
                  <button key={n} onClick={() => updateFilter('bedrooms', filters.bedrooms == n ? '' : n)} className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${filters.bedrooms == n ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-700 text-indigo-600' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>{n}+</button>
                ))}
              </div>
            </div>

            {/* Bathrooms */}
            <div>
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">Bathrooms</label>
              <div className="flex flex-wrap gap-1.5">
                {BATHROOM_OPTIONS.map(n => (
                  <button key={n} onClick={() => updateFilter('bathrooms', filters.bathrooms == n ? '' : n)} className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${filters.bathrooms == n ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-700 text-indigo-600' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>{n}+</button>
                ))}
              </div>
            </div>

            {/* Furnished */}
            <div>
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">Furnished</label>
              <select value={filters.furnished} onChange={(e) => updateFilter('furnished', e.target.value)} className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none">
                <option value="">Any</option>
                <option value="1">Furnished</option>
                <option value="0">Unfurnished</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">Sort By</label>
              <select value={filters.sort} onChange={(e) => updateFilter('sort', e.target.value)} className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none">
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            <button onClick={fetchListings} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg text-sm font-medium transition-colors">
              Apply Filters
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {loading ? 'Searching...' : `${total} property${total !== 1 ? 'ies' : 'y'} found`}
            </p>
            <div className="flex items-center gap-2 lg:hidden">
              <button onClick={() => setShowFilters(!showFilters)} className="text-sm text-indigo-600 dark:text-indigo-400 flex items-center gap-1"><FiFilter size={14} /> Filters</button>
              <div className="flex border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <button onClick={() => setViewMode('grid')} className={`p-1.5 ${viewMode === 'grid' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600' : 'text-gray-400'}`}><FiGrid size={14} /></button>
                <button onClick={() => setViewMode('list')} className={`p-1.5 ${viewMode === 'list' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600' : 'text-gray-400'}`}><FiList size={14} /></button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-4`}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-2xl bg-white dark:bg-gray-800 overflow-hidden animate-pulse border border-gray-100 dark:border-gray-700">
                  <div className={`${viewMode === 'grid' ? 'h-48' : 'h-32'} bg-gray-200 dark:bg-gray-700`} />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : listings.length === 0 ? (
            <div className="text-center py-20">
              <FiHome size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">No properties found</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Try adjusting your filters or search terms</p>
              <button onClick={clearFilters} className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">Clear all filters</button>
            </div>
          ) : (
            <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-4`}>
              {listings.map((p) => (
                <div key={p.id} onClick={() => navigate(`/properties/${p.id}`)} className={`group bg-white dark:bg-gray-800 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-100 dark:border-gray-700 ${viewMode === 'grid' ? 'rounded-2xl' : 'rounded-2xl flex'}`}>
                  <div className={`relative overflow-hidden flex-shrink-0 ${viewMode === 'grid' ? 'h-48' : 'w-48 h-36'}`}>
                    {p.primary_image ? (
                      <img src={p.primary_image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/20 flex items-center justify-center">
                        <FiHome size={32} className="text-indigo-300 dark:text-indigo-600" />
                      </div>
                    )}
                    {p.featured ? <span className="absolute top-2 left-2 bg-indigo-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full">Featured</span> : null}
                    <div className="absolute top-2 right-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full px-2 py-0.5 text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1">
                      <FiStar size={10} className="text-yellow-500 fill-yellow-500" />
                      {Number(p.avg_rating || 0).toFixed(1)}
                    </div>
                  </div>
                  <div className="p-4 flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">{p.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1 truncate">
                      <FiMapPin size={12} />
                      {p.city || p.region || 'Tanzania'}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                        {p.rent_min ? `${formatCurrency(p.rent_min)}/mo` : 'Contact'}
                      </p>
                      <span className="text-xs text-gray-400 capitalize">{p.property_type || 'Property'}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
                      {p.bedrooms ? <span>{p.bedrooms} bed</span> : null}
                      {p.bathrooms ? <span>{p.bathrooms} bath</span> : null}
                      {p.furnished ? <span>Furnished</span> : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button disabled={filters.page <= 1} onClick={() => setFilters({ ...filters, page: filters.page - 1 })} className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <FiChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button key={i + 1} onClick={() => setFilters({ ...filters, page: i + 1 })} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filters.page === i + 1 ? 'bg-indigo-600 text-white' : 'border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>{i + 1}</button>
              ))}
              <button disabled={filters.page >= totalPages} onClick={() => setFilters({ ...filters, page: filters.page + 1 })} className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <FiChevronRight size={16} />
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default BrowseProperties;
