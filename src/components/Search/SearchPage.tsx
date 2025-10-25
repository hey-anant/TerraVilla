import { useState } from 'react';
import { Search, MapPin, Ruler, IndianRupee, Filter, ChevronDown, Phone, Heart, Shield } from 'lucide-react';
import { mockPlots } from '../../data/mockData';
import { Plot } from '../../types';
import { formatPriceDisplay } from '../../utils/priceFormatters';

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedPlot, setSelectedPlot] = useState<Plot | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const cities = Array.from(new Set(mockPlots.map(p => p.city)));
  const states = Array.from(new Set(mockPlots.map(p => p.state)));

  const filteredPlots = mockPlots.filter(plot => {
    const matchesSearch = searchQuery === '' ||
      plot.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plot.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plot.location_address.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCity = selectedCity === '' || plot.city === selectedCity;
    const matchesState = selectedState === '' || plot.state === selectedState;
    const minPriceInRupees = minPrice === '' ? 0 : Number(minPrice) * 100000;
    const maxPriceInRupees = maxPrice === '' ? Infinity : Number(maxPrice) * 100000;
    const matchesMinPrice = plot.price >= minPriceInRupees;
    const matchesMaxPrice = plot.price <= maxPriceInRupees;

    return matchesSearch && matchesCity && matchesState && matchesMinPrice && matchesMaxPrice;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-br from-emerald-600 to-teal-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Find Your Perfect Plot</h1>
          <p className="text-emerald-50 text-lg mb-6">
            Search verified properties across India with zero broker fees
          </p>

          <div className="bg-white rounded-xl shadow-xl p-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by location, city, or property name..."
                  className="w-full pl-12 pr-4 py-3 text-slate-900 rounded-lg border-2 border-transparent focus:border-emerald-500 outline-none"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="bg-slate-100 text-slate-700 px-6 py-3 rounded-lg font-medium hover:bg-slate-200 transition-colors flex items-center justify-center space-x-2"
              >
                <Filter className="w-5 h-5" />
                <span>Filters</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {showFilters && (
              <div className="grid md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-slate-200">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">City</label>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-slate-900"
                  >
                    <option value="">All Cities</option>
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">State</label>
                  <select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-slate-900"
                  >
                    <option value="">All States</option>
                    {states.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Min Price (Lakhs)</label>
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="0"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Max Price (Lakhs)</label>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="Unlimited"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-slate-900"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-slate-600">
            <span className="font-semibold text-slate-900">{filteredPlots.length}</span> verified properties found
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlots.map((plot) => (
            <div
              key={plot.id}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl transition-all cursor-pointer group"
              onClick={() => setSelectedPlot(plot)}
            >
              <div className="relative">
                <img
                  src={plot.images[0]}
                  alt={plot.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3 bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                  <Shield className="w-3 h-3" />
                  <span>Verified</span>
                </div>
                <button className="absolute top-3 left-3 bg-white/90 backdrop-blur p-2 rounded-full hover:bg-white transition-colors">
                  <Heart className="w-4 h-4 text-slate-600" />
                </button>
              </div>

              <div className="p-5">
                <h3 className="font-bold text-lg text-slate-900 mb-2 line-clamp-1">
                  {plot.title}
                </h3>
                <div className="flex items-start space-x-2 text-slate-600 text-sm mb-4">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span className="line-clamp-1">{plot.location_address}, {plot.city}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-slate-100">
                  <div className="flex items-center space-x-2 text-sm">
                    <Ruler className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-700">{plot.area_sqft.toLocaleString('en-IN')} sq ft</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <IndianRupee className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-700">₹{plot.price_per_sqft.toLocaleString('en-IN')}/sq ft</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-slate-600 mb-1">Total Price</div>
                    <div className="text-xl font-bold text-slate-900">
                      {formatPriceDisplay(plot.price)}
                    </div>
                  </div>
                  <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors text-sm">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPlots.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No properties found</h3>
            <p className="text-slate-600">Try adjusting your search filters</p>
          </div>
        )}
      </div>

      {selectedPlot && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center z-10">
              <h2 className="text-2xl font-bold text-slate-900">Property Details</h2>
              <button
                onClick={() => setSelectedPlot(null)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4 p-6">
              {selectedPlot.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`${selectedPlot.title} ${idx + 1}`}
                  className="w-full h-64 object-cover rounded-xl"
                />
              ))}
            </div>

            <div className="px-6 pb-6">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-emerald-700 mb-1">Total Price</div>
                    <div className="text-3xl font-bold text-emerald-900">
                      {formatPriceDisplay(selectedPlot.price)}
                    </div>
                    <div className="text-sm text-emerald-700 mt-1">
                      ₹{selectedPlot.price_per_sqft.toLocaleString('en-IN')} per sq ft
                    </div>
                  </div>
                  <div className="bg-white rounded-lg px-4 py-2 border-2 border-emerald-200">
                    <div className="text-xs text-emerald-700 mb-1">Save vs Broker</div>
                    <div className="text-xl font-bold text-emerald-900">
                      ₹{(selectedPlot.price * 0.06 / 100000).toFixed(1)}L
                    </div>
                  </div>
                </div>
              </div>

              <h1 className="text-2xl font-bold text-slate-900 mb-4">{selectedPlot.title}</h1>

              <div className="flex items-center space-x-2 text-slate-600 mb-6">
                <MapPin className="w-5 h-5" />
                <span>{selectedPlot.location_address}, {selectedPlot.city}, {selectedPlot.state}</span>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-slate-50 rounded-xl p-4 text-center">
                  <Ruler className="w-6 h-6 text-slate-600 mx-auto mb-2" />
                  <div className="text-sm text-slate-600">Area</div>
                  <div className="font-bold text-slate-900">{selectedPlot.area_sqft.toLocaleString('en-IN')} sq ft</div>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 text-center">
                  <Shield className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                  <div className="text-sm text-slate-600">Status</div>
                  <div className="font-bold text-emerald-600">Verified</div>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 text-center">
                  <svg className="w-6 h-6 text-slate-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                  <div className="text-sm text-slate-600">Blockchain</div>
                  <div className="font-bold text-slate-900 text-xs truncate">{selectedPlot.blockchain_hash?.substring(0, 10)}...</div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-slate-900 mb-3">Description</h3>
                <p className="text-slate-600 leading-relaxed">{selectedPlot.description}</p>
              </div>

              <div className="bg-slate-50 rounded-xl p-6">
                <h3 className="font-semibold text-slate-900 mb-4">Contact Seller</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-slate-900">{selectedPlot.seller_name}</div>
                    <div className="text-sm text-slate-600 mt-1">Verified Seller</div>
                  </div>
                  <a
                    href={`tel:${selectedPlot.seller_phone}`}
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-lg font-medium hover:from-emerald-700 hover:to-teal-700 transition-all flex items-center space-x-2"
                  >
                    <Phone className="w-5 h-5" />
                    <span>Call Now</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
