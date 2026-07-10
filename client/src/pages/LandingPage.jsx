import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiMapPin, FiHome, FiShield, FiUsers, FiSmartphone, FiStar, FiChevronRight, FiArrowRight } from 'react-icons/fi';
import { getFeaturedListings } from '../api/marketplaceApi';
import { useAuth } from '../contexts/AuthContext';
import { formatCurrency } from '../utils/format';

const Hero = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');
  const [type, setType] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (city) params.set('city', city);
    if (type) params.set('property_type', type);
    navigate(`/browse?${params.toString()}`);
  };

  return (
    <section className="relative min-h-[600px] flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-950 overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-sm text-indigo-200 mb-6">
          <FiHome size={14} />
          <span>Tanzania's Growing Rental Marketplace</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-4">
          Find Your Next<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Home in Tanzania</span>
        </h1>
        <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
          Browse thousands of rental properties across Dar es Salaam, Arusha, Mwanza, Mbeya, and nationwide.
        </p>
        <form onSubmit={handleSearch} className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-2 flex flex-col md:flex-row gap-2 max-w-3xl mx-auto">
          <div className="flex-1 relative">
            <FiSearch size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search properties..." className="w-full pl-10 pr-4 py-3 rounded-xl border-0 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 outline-none text-sm" />
          </div>
          <div className="flex-1 relative">
            <FiMapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <select value={city} onChange={(e) => setCity(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl border-0 bg-transparent text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none text-sm appearance-none cursor-pointer">
              <option value="">All Cities</option>
              <option value="Dar es Salaam">Dar es Salaam</option>
              <option value="Arusha">Arusha</option>
              <option value="Mwanza">Mwanza</option>
              <option value="Mbeya">Mbeya</option>
              <option value="Dodoma">Dodoma</option>
              <option value="Zanzibar">Zanzibar</option>
              <option value="Tanga">Tanga</option>
              <option value="Morogoro">Morogoro</option>
            </select>
          </div>
          <div className="flex-1 relative">
            <FiHome size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <select value={type} onChange={(e) => setType(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl border-0 bg-transparent text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none text-sm appearance-none cursor-pointer">
              <option value="">All Types</option>
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="villa">Villa</option>
              <option value="studio">Studio</option>
              <option value="commercial">Commercial</option>
            </select>
          </div>
          <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-medium transition-colors flex items-center gap-2 justify-center text-sm">
            <FiSearch size={16} />
            Search
          </button>
        </form>
      </div>
    </section>
  );
};

const FeaturedSection = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFeaturedListings(6).then(({ data }) => setListings(data.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Featured Properties</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Hand-picked listings for you</p>
          </div>
          <button onClick={() => navigate('/browse')} className="hidden sm:flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 font-medium text-sm">
            View All <FiChevronRight size={16} />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-white dark:bg-gray-800 overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-200 dark:bg-gray-700" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
              </div>
            </div>
          )) : listings.map((p) => (
            <div key={p.id} onClick={() => navigate(`/properties/${p.id}`)} className="group rounded-2xl bg-white dark:bg-gray-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 dark:border-gray-700">
              <div className="relative h-48 overflow-hidden">
                {p.primary_image ? (
                  <img src={p.primary_image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/20 flex items-center justify-center">
                    <FiHome size={40} className="text-indigo-300 dark:text-indigo-600" />
                  </div>
                )}
                {p.featured ? <span className="absolute top-3 left-3 bg-indigo-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full">Featured</span> : null}
                <div className="absolute top-3 right-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full px-2.5 py-1 text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1">
                  <FiStar size={12} className="text-yellow-500 fill-yellow-500" />
                  {Number(p.avg_rating || 0).toFixed(1)}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{p.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                  <FiMapPin size={12} />
                  {p.city || p.region || 'Tanzania'}
                </p>
                <div className="flex items-center justify-between mt-3">
                  <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                    {p.rent_min ? `${formatCurrency(p.rent_min)}/mo` : 'Contact'}
                  </p>
                  <span className="text-xs text-gray-400 capitalize">{p.property_type || 'Property'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const HowItWorks = () => (
  <section id="how-it-works" className="py-16 bg-white dark:bg-gray-950">
    <div className="max-w-7xl mx-auto px-4 text-center">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">How It Works</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-12 max-w-xl mx-auto">Find your perfect rental in three simple steps</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: FiSearch, title: 'Search', desc: 'Browse thousands of listings across Tanzania. Filter by city, price, type, and more.' },
          { icon: FiHome, title: 'Visit', desc: 'Schedule viewings, ask questions, and find the perfect place for you.' },
          { icon: FiShield, title: 'Move In', desc: 'Apply online, sign your lease digitally, and move into your new home.' },
        ].map((step, i) => (
          <div key={step.title} className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mx-auto mb-4">
              <step.icon size={28} className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center mx-auto mb-3 text-sm font-bold">{i + 1}</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{step.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mx-auto">{step.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const WhyRentFlow = () => (
  <section className="py-16 bg-gray-50 dark:bg-gray-900">
    <div className="max-w-7xl mx-auto px-4">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">Why Choose RentFlow?</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: FiShield, title: 'Verified Listings', desc: 'All properties are verified to ensure quality and accuracy.' },
          { icon: FiUsers, title: 'Direct Communication', desc: 'Contact landlords and managers directly without middlemen.' },
          { icon: FiSmartphone, title: 'Digital Leases', desc: 'Sign leases, pay rent, and manage everything from your phone.' },
          { icon: FiStar, title: 'Trusted Platform', desc: 'Thousands of happy tenants and property managers across Tanzania.' },
        ].map((item) => (
          <div key={item.title} className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-4">
              <item.icon size={22} className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{item.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Testimonials = () => (
  <section className="py-16 bg-white dark:bg-gray-950">
    <div className="max-w-7xl mx-auto px-4">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white text-center mb-2">What Our Users Say</h2>
      <p className="text-gray-500 dark:text-gray-400 text-center mb-12">Trusted by tenants and property managers nationwide</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { name: 'Aisha M.', role: 'Tenant, Dar es Salaam', text: 'Found my dream apartment in just 3 days. The application process was seamless!' },
          { name: 'James K.', role: 'Property Manager, Arusha', text: 'Managing 15 properties has never been easier. RentFlow handles everything.' },
          { name: 'Grace P.', role: 'Tenant, Mwanza', text: 'Digital lease signing saved me so much time. Highly recommend for anyone renting.' },
        ].map((t) => (
          <div key={t.name} className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
            <div className="flex gap-1 mb-3">
              {Array.from({ length: 5 }).map((_, i) => <FiStar key={i} size={14} className="text-yellow-500 fill-yellow-500" />)}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">"{t.text}"</p>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white text-sm">{t.name}</p>
              <p className="text-xs text-gray-500">{t.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const DownloadSection = () => (
  <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600">
    <div className="max-w-7xl mx-auto px-4 text-center">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Get the RentFlow App</h2>
      <p className="text-indigo-100 mb-8 max-w-md mx-auto">Manage your rental journey on the go. Available on iOS and Android.</p>
      <div className="flex flex-wrap justify-center gap-4">
        <button className="flex items-center gap-3 bg-white text-gray-900 px-6 py-3 rounded-xl font-medium hover:bg-gray-100 transition-colors">
          <FiSmartphone size={20} />
          App Store
        </button>
        <button className="flex items-center gap-3 bg-white text-gray-900 px-6 py-3 rounded-xl font-medium hover:bg-gray-100 transition-colors">
          <FiSmartphone size={20} />
          Google Play
        </button>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-gray-900 dark:bg-gray-950 text-gray-400 py-12">
    <div className="max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">RF</span>
            </div>
            <span className="text-lg font-bold text-white">RentFlow</span>
          </div>
          <p className="text-sm">Tanzania's leading rental marketplace. Find, apply, and move in — all in one platform.</p>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-4">For Renters</h4>
          <ul className="space-y-2 text-sm">
            <li><button className="hover:text-white transition-colors">Browse Properties</button></li>
            <li><button className="hover:text-white transition-colors">How It Works</button></li>
            <li><button className="hover:text-white transition-colors">Rental Guide</button></li>
            <li><button className="hover:text-white transition-colors">FAQ</button></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-4">For Managers</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/register" className="hover:text-white transition-colors">List Your Property</Link></li>
            <li><button className="hover:text-white transition-colors">Property Management</button></li>
            <li><button className="hover:text-white transition-colors">Pricing</button></li>
            <li><button className="hover:text-white transition-colors">Resources</button></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-4">Contact</h4>
          <ul className="space-y-2 text-sm">
            <li>hello@rentflow.co.tz</li>
            <li>+255 712 345 678</li>
            <li>Dar es Salaam, Tanzania</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 pt-8 text-sm text-center">
        <p>&copy; {new Date().getFullYear()} RentFlow. All rights reserved. Made in Tanzania.</p>
      </div>
    </div>
  </footer>
);

const LandingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">RF</span>
            </div>
            <span className="text-lg font-bold text-gray-900 dark:text-white">RentFlow</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/browse" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Browse</Link>
            <button onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })} className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">How It Works</button>
            {user ? (
              <button onClick={() => navigate('/dashboard')} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">Dashboard</button>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Sign In</Link>
                <Link to="/register" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5">
                  Get Started <FiArrowRight size={14} />
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>

      <Hero />
      <FeaturedSection />
      <HowItWorks />
      <WhyRentFlow />
      <Testimonials />
      <DownloadSection />
      <Footer />
    </div>
  );
};

export default LandingPage;
