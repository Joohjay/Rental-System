import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiHome, FiMapPin, FiStar, FiHeart, FiShare2, FiCheck, FiX, FiArrowLeft, FiCalendar, FiMessageSquare, FiUser, FiClock, FiDollarSign, FiMaximize2, FiCamera, FiShield, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { getListing, toggleFavorite, submitApplication, createViewingRequest } from '../../api/marketplaceApi';
import { useAuth } from '../../contexts/AuthContext';
import { formatCurrency } from '../../utils/format';

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showApplication, setShowApplication] = useState(false);
  const [showViewing, setShowViewing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [appMessage, setAppMessage] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const { data } = await getListing(id);
        setProperty(data.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetch();
  }, [id]);

  const images = property?.images?.length ? property.images : [];

  const handleToggleFavorite = async () => {
    if (!user) return navigate('/login');
    try {
      await toggleFavorite(id);
      setIsFavorite(!isFavorite);
    } catch (err) { console.error(err); }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    setSubmitting(true);
    try {
      await submitApplication({ property_id: id, message: appMessage });
      setSuccessMsg('Application submitted successfully!');
      setShowApplication(false);
      setAppMessage('');
    } catch (err) { setMessage(err.response?.data?.message || 'Failed to submit application'); }
    finally { setSubmitting(false); }
  };

  const handleViewingRequest = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    setSubmitting(true);
    try {
      const formData = new FormData(e.target);
      await createViewingRequest({ property_id: id, preferred_date: formData.get('preferred_date'), preferred_time: formData.get('preferred_time'), message: formData.get('message') });
      setSuccessMsg('Viewing request submitted! We will contact you soon.');
      setShowViewing(false);
    } catch (err) { setMessage(err.response?.data?.message || 'Failed to submit request'); }
    finally { setSubmitting(false); }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="max-w-6xl mx-auto px-4 py-8 animate-pulse">
          <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded-2xl mb-6" />
          <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-1/2 mb-4" />
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/3 mb-2" />
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4" />
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <FiHome size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">Property Not Found</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-4">The property you are looking for does not exist or has been removed.</p>
          <button onClick={() => navigate('/browse')} className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">Browse Properties</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Back Button */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mb-4 transition-colors">
          <FiArrowLeft size={14} /> Back
        </button>

        {successMsg && (
          <div className="mb-4 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 flex items-center gap-2 text-emerald-700 dark:text-emerald-300 text-sm">
            <FiCheck size={16} /> {successMsg}
          </div>
        )}

        {/* Image Gallery */}
        <div className="relative rounded-2xl overflow-hidden bg-gray-200 dark:bg-gray-800 mb-6">
          {images.length > 0 ? (
            <>
              <img src={images[currentImage]} alt={property.name} className="w-full h-96 md:h-[500px] object-cover" />
              {images.length > 1 && (
                <>
                  <button onClick={() => setCurrentImage(Math.max(0, currentImage - 1))} disabled={currentImage === 0} className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 disabled:opacity-30 transition-all">
                    <FiChevronLeft size={20} />
                  </button>
                  <button onClick={() => setCurrentImage(Math.min(images.length - 1, currentImage + 1))} disabled={currentImage === images.length - 1} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 disabled:opacity-30 transition-all">
                    <FiChevronRight size={20} />
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {images.map((_, i) => (
                      <button key={i} onClick={() => setCurrentImage(i)} className={`w-2 h-2 rounded-full transition-all ${i === currentImage ? 'bg-white w-6' : 'bg-white/50'}`} />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-96 md:h-[500px] bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/20 flex items-center justify-center">
              <FiCamera size={48} className="text-indigo-300 dark:text-indigo-600" />
            </div>
          )}
          <div className="absolute top-4 right-4 flex gap-2">
            <button onClick={handleToggleFavorite} className={`p-3 rounded-full backdrop-blur-sm transition-colors ${isFavorite ? 'bg-red-500 text-white' : 'bg-white/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700'}`}>
              <FiHeart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
            </button>
            <button className="p-3 rounded-full bg-white/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 backdrop-blur-sm transition-colors">
              <FiShare2 size={18} />
            </button>
          </div>
          {property.featured && <div className="absolute top-4 left-4 bg-indigo-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full">Featured</div>}
        </div>

        {/* Thumbnail Strip */}
        {images.length > 1 && (
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {images.map((img, i) => (
              <button key={i} onClick={() => setCurrentImage(i)} className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${i === currentImage ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{property.name}</h1>
                  <p className="text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                    <FiMapPin size={14} />
                    {property.address ? `${property.address}, ` : ''}{property.city || property.region || 'Tanzania'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{property.rent_min ? `${formatCurrency(property.rent_min)}/mo` : 'Contact for Price'}</p>
                  {property.rent_max && property.rent_max !== property.rent_min && (
                    <p className="text-sm text-gray-500">- {formatCurrency(property.rent_max)}/mo</p>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-4 mt-4">
                {property.bedrooms && (
                  <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300">
                    <FiHome size={16} className="text-gray-400" />
                    <span>{property.bedrooms} Bedrooms</span>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300">
                    <FiMaximize2 size={16} className="text-gray-400" />
                    <span>{property.bathrooms} Bathrooms</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300">
                  <FiStar size={16} className="text-yellow-500" />
                  <span>{Number(property.avg_rating || 0).toFixed(1)} Rating</span>
                </div>
                {property.property_type && (
                  <span className="text-sm capitalize px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">{property.property_type}</span>
                )}
              </div>
            </div>

            {/* Description */}
            {property.description && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">About This Property</h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">{property.description}</p>
              </div>
            )}

            {/* Amenities */}
            {property.amenities?.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Amenities</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {property.amenities.map((a) => (
                    <div key={a.id} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <FiCheck size={14} className="text-emerald-500 flex-shrink-0" />
                      <span>{a.category ? `${a.category}: ` : ''}{a.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Nearby Places */}
            {property.nearby_places?.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Nearby Places</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {property.nearby_places.map((np) => (
                    <div key={np.id} className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                      <p className="font-medium text-sm text-gray-900 dark:text-white">{np.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{np.category}{np.distance ? ` • ${np.distance}` : ''}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Info */}
            {(property.furnished !== null || property.parking !== null || property.year_built || property.size_sqft) && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Additional Info</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {property.furnished !== null && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      {property.furnished ? <FiCheck size={14} className="text-emerald-500" /> : <FiX size={14} className="text-red-400" />}
                      Furnished
                    </div>
                  )}
                  {property.parking !== null && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      {property.parking ? <FiCheck size={14} className="text-emerald-500" /> : <FiX size={14} className="text-red-400" />}
                      Parking
                    </div>
                  )}
                  {property.pets_allowed !== null && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      {property.pets_allowed ? <FiCheck size={14} className="text-emerald-500" /> : <FiX size={14} className="text-red-400" />}
                      Pets Allowed
                    </div>
                  )}
                  {property.year_built && <span className="text-sm text-gray-600 dark:text-gray-300">Built: {property.year_built}</span>}
                  {property.size_sqft && <span className="text-sm text-gray-600 dark:text-gray-300">{property.size_sqft} sqft</span>}
                </div>
              </div>
            )}

            {/* Reviews */}
            {property.reviews?.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Reviews ({property.reviews.length})</h2>
                <div className="space-y-3">
                  {property.reviews.map((r) => (
                    <div key={r.id} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {r.user?.profile_photo_url ? (
                            <img src={r.user.profile_photo_url} alt="" className="w-8 h-8 rounded-full object-cover" />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                              <FiUser size={14} className="text-indigo-600" />
                            </div>
                          )}
                          <span className="font-medium text-sm text-gray-900 dark:text-white">{r.user?.name || 'Anonymous'}</span>
                        </div>
                        <div className="flex gap-0.5">
                          {Array.from({ length: r.rating }).map((_, i) => <FiStar key={i} size={12} className="text-yellow-500 fill-yellow-500" />)}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{r.comment}</p>
                      {r.created_at && <p className="text-xs text-gray-400 mt-2">{new Date(r.created_at).toLocaleDateString()}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Available Units */}
            {property.units?.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Available Units</h2>
                <div className="space-y-2">
                  {property.units.map((u) => (
                    <div key={u.id} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm text-gray-900 dark:text-white">{u.unit_label || `Unit ${u.unit_number || u.id}`}</p>
                        <p className="text-xs text-gray-500">{u.bedrooms} bed • {u.bathrooms} bath{u.size_sqft ? ` • ${u.size_sqft} sqft` : ''}</p>
                      </div>
                      <p className="font-bold text-indigo-600 dark:text-indigo-400">{u.rent ? `${formatCurrency(u.rent)}/mo` : 'Contact'}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar — Actions */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 space-y-3 sticky top-28">
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Actions</h3>

              <button onClick={handleToggleFavorite} className={`w-full py-3 rounded-xl border text-sm font-medium transition-colors flex items-center justify-center gap-2 ${isFavorite ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700 text-red-600 hover:bg-red-100' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                <FiHeart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
                {isFavorite ? 'Saved' : 'Save Property'}
              </button>

              <button onClick={() => { if (!user) return navigate('/login'); setShowApplication(true); }} className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors flex items-center justify-center gap-2">
                <FiCheck size={16} />
                Apply Now
              </button>

              <button onClick={() => { if (!user) return navigate('/login'); setShowViewing(true); }} className="w-full py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                <FiCalendar size={16} />
                Schedule Viewing
              </button>

              {property.company && (
                <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 mb-1">Managed by</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{property.company.name}</p>
                  {property.company.phone && <p className="text-xs text-gray-500">{property.company.phone}</p>}
                </div>
              )}
            </div>

            {/* Application Modal */}
            {showApplication && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowApplication(false)}>
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Apply for Rental</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{property.name}</p>
                  <form onSubmit={handleApply}>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message (optional)</label>
                      <textarea value={appMessage} onChange={(e) => setAppMessage(e.target.value)} rows={3} className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm px-4 py-2.5 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 outline-none resize-none" placeholder="Tell the landlord about yourself..." />
                    </div>
                    {message && <p className="text-sm text-red-500 mb-3">{message}</p>}
                    <div className="flex gap-3">
                      <button type="button" onClick={() => setShowApplication(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Cancel</button>
                      <button type="submit" disabled={submitting} className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium disabled:opacity-50 transition-colors">{submitting ? 'Submitting...' : 'Submit Application'}</button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Viewing Request Modal */}
            {showViewing && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowViewing(false)}>
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Schedule a Viewing</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{property.name}</p>
                  <form onSubmit={handleViewingRequest}>
                    <div className="space-y-3 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Preferred Date</label>
                        <input type="date" name="preferred_date" required className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm px-4 py-2.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Preferred Time</label>
                        <input type="time" name="preferred_time" required className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm px-4 py-2.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message (optional)</label>
                        <textarea name="message" rows={2} className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm px-4 py-2.5 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 outline-none resize-none" placeholder="Any specific time preference?" />
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button type="button" onClick={() => setShowViewing(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Cancel</button>
                      <button type="submit" disabled={submitting} className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium disabled:opacity-50 transition-colors">{submitting ? 'Submitting...' : 'Request Viewing'}</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
