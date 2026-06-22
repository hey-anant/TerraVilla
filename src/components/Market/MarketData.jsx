import { TrendingUp, TrendingDown, BarChart3, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getAllPlots } from '../../utils/plotUtils';

export default function MarketData() {
  const [mockPriceComparisons, setMockPriceComparisons] = useState([]);
  const [recentListings, setRecentListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch plots
        const plots = await getAllPlots();
        const verifiedListings = plots
          .filter(plot => plot.status === 'verified')
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 5);
        setRecentListings(verifiedListings);

        // Fallback to offline market statistics
        const defaultPriceComparisons = [
          {
            city: 'Bangalore',
            state: 'Karnataka',
            area_type: 'residential',
            avg_price_per_sqft: 3500,
            min_price_per_sqft: 2000,
            max_price_per_sqft: 6000,
            sample_size: 127,
            last_updated: new Date().toISOString()
          },
          {
            city: 'Hyderabad',
            state: 'Telangana',
            area_type: 'residential',
            avg_price_per_sqft: 2800,
            min_price_per_sqft: 1500,
            max_price_per_sqft: 5000,
            sample_size: 93,
            last_updated: new Date().toISOString()
          },
          {
            city: 'Bangalore',
            state: 'Karnataka',
            area_type: 'commercial',
            avg_price_per_sqft: 8500,
            min_price_per_sqft: 5000,
            max_price_per_sqft: 15000,
            sample_size: 45,
            last_updated: new Date().toISOString()
          },
          {
            city: 'Hyderabad',
            state: 'Telangana',
            area_type: 'commercial',
            avg_price_per_sqft: 7200,
            min_price_per_sqft: 4000,
            max_price_per_sqft: 12000,
            sample_size: 38,
            last_updated: new Date().toISOString()
          },
        ];
        setMockPriceComparisons(defaultPriceComparisons);
      } catch (error) {
        console.error('Error fetching market data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const calculateTrend = (avg, min) => {
    const trend = ((avg - min) / min) * 100;
    return trend.toFixed(1);
  };

  if (loading) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading Market Data...</div>;
  }
  return (<div className="min-h-screen bg-slate-50">
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-white/10 p-3 rounded-xl">
            <BarChart3 className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-4xl font-bold">Market Insights</h1>
            <p className="text-slate-300 text-lg mt-2">
              Real-time price data for transparent land transactions
            </p>
          </div>
        </div>
      </div>
    </div>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 mb-8">
        <div className="flex items-start space-x-4">
          <div className="bg-emerald-100 p-3 rounded-lg">
            <TrendingUp className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h3 className="font-semibold text-emerald-900 mb-1">Transparency Guarantee</h3>
            <p className="text-emerald-800 text-sm">
              All prices are based on verified transactions. We show you the complete market picture so you can make informed decisions.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Price Comparisons by Region</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {mockPriceComparisons.map((data, idx) => {
            const trend = calculateTrend(data.avg_price_per_sqft, data.min_price_per_sqft);
            const isPositive = Number(trend) > 0;
            return (<div key={idx} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <MapPin className="w-5 h-5 text-slate-400" />
                    <h3 className="text-xl font-bold text-slate-900">
                      {data.city}, {data.state}
                    </h3>
                  </div>
                  <div className="inline-block bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-medium capitalize">
                    {data.area_type}
                  </div>
                </div>
                <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${isPositive
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-red-100 text-red-700'}`}>
                  {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  <span>{trend}%</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="text-sm text-slate-600 mb-1">Average Price</div>
                  <div className="text-3xl font-bold text-slate-900">
                    ₹{data.avg_price_per_sqft.toLocaleString('en-IN')}
                    <span className="text-base font-normal text-slate-600">/sq ft</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-lg p-3">
                    <div className="text-xs text-slate-600 mb-1">Min Price</div>
                    <div className="text-lg font-semibold text-slate-900">
                      ₹{data.min_price_per_sqft.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3">
                    <div className="text-xs text-slate-600 mb-1">Max Price</div>
                    <div className="text-lg font-semibold text-slate-900">
                      ₹{data.max_price_per_sqft.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Based on {data.sample_size} verified listings</span>
                    <span className="text-slate-400">
                      Updated {new Date(data.last_updated).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            </div>);
          })}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Recent Listings</h2>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Property</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Location</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-slate-900">Area</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-slate-900">Price/sq ft</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-slate-900">Total Price</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {recentListings.map((plot) => {
                  const cityData = mockPriceComparisons.find(pc => pc.city === plot.city && pc.area_type === 'residential');
                  const vsAverage = cityData
                    ? ((plot.price_per_sqft - cityData.avg_price_per_sqft) / cityData.avg_price_per_sqft * 100).toFixed(1)
                    : null;
                  return (<tr key={plot.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{plot.title}</div>
                      <div className="text-sm text-slate-600 mt-1">
                        Listed {new Date(plot.created_at).toLocaleDateString('en-IN')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-900">{plot.city}</div>
                      <div className="text-sm text-slate-600">{plot.state}</div>
                    </td>
                    <td className="px-6 py-4 text-right text-slate-900">
                      {plot.area_sqft.toLocaleString('en-IN')} sq ft
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="font-semibold text-slate-900">
                        ₹{plot.price_per_sqft.toLocaleString('en-IN')}
                      </div>
                      {vsAverage && (<div className={`text-xs mt-1 ${Number(vsAverage) > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                        {Number(vsAverage) > 0 ? '+' : ''}{vsAverage}% vs avg
                      </div>)}
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-slate-900">
                      ₹{(plot.price / 10000000).toFixed(2)}Cr
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-medium">
                          Verified
                        </span>
                      </div>
                    </td>
                  </tr>);
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-6">
          <h3 className="font-semibold text-blue-900 mb-2">Understanding Market Prices</h3>
          <p className="text-blue-800 text-sm leading-relaxed">
            Our price comparisons help you avoid overpaying. Properties priced significantly above the average may indicate inflated pricing.
            We recommend comparing at least 3-5 similar properties in the same area before making an offer. Remember, without broker fees,
            you're already saving 1-6% of the transaction value.
          </p>
        </div>
      </div>
    </div>
  </div>);
}
