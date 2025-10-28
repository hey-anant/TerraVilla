import { useEffect, useState } from 'react';
import { MapPin, Ruler, CheckCircle, Clock, XCircle, Image as ImageIcon, FileText, ArrowLeft } from 'lucide-react';
import { Plot } from '../../types';
import { formatPriceDisplay } from '../../utils/priceFormatters';
import { supabase } from '../../lib/supabase';

interface PlotDetailPageProps {
  plotId: string;
  onBack: () => void;
}

export default function PlotDetailPage({ plotId, onBack }: PlotDetailPageProps) {
  const [plot, setPlot] = useState<Plot | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetchPlotDetails();
  }, [plotId]);

  const fetchPlotDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('plots')
        .select('*')
        .eq('id', plotId)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setPlot(data);
      }
    } catch (error) {
      console.error('Error fetching plot details:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-5 h-5 text-emerald-600" />;
      case 'pending_verification':
      case 'pending':
        return <Clock className="w-5 h-5 text-amber-600" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-slate-400" />;
    }
  };

  const getStatusText = (status: string) => {
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'pending_verification':
      case 'pending':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading plot details...</p>
        </div>
      </div>
    );
  }

  if (!plot) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Plot Not Found</h2>
          <p className="text-slate-600 mb-6">The plot you're looking for doesn't exist.</p>
          <button
            onClick={onBack}
            className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to My Listings</span>
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="grid md:grid-cols-2 gap-6 p-6">
            <div>
              {plot.images && plot.images.length > 0 ? (
                <div>
                  <div className="aspect-video rounded-xl overflow-hidden mb-4">
                    <img
                      src={plot.images[selectedImage]}
                      alt={plot.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {plot.images.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                      {plot.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImage(index)}
                          className={`aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                            selectedImage === index
                              ? 'border-emerald-600 ring-2 ring-emerald-200'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <img
                            src={image}
                            alt={`View ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="aspect-video rounded-xl bg-slate-100 flex items-center justify-center">
                  <div className="text-center">
                    <ImageIcon className="w-16 h-16 text-slate-400 mx-auto mb-2" />
                    <p className="text-slate-600">No images available</p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-start justify-between mb-2">
                  <h1 className="text-3xl font-bold text-slate-900">{plot.title}</h1>
                  <div className={`flex items-center space-x-2 px-3 py-1 rounded-lg border ${getStatusColor(plot.verification_status)}`}>
                    {getStatusIcon(plot.verification_status)}
                    <span className="text-sm font-medium">{getStatusText(plot.verification_status)}</span>
                  </div>
                </div>

                <div className="flex items-center text-slate-600 mb-4">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>{plot.location_address}, {plot.city}, {plot.state}</span>
                </div>

                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-200">
                  <div className="text-3xl font-bold text-slate-900 mb-2">
                    {formatPriceDisplay(plot.price)}
                  </div>
                  <div className="text-sm text-slate-600">
                    ₹{plot.price_per_sqft.toLocaleString('en-IN')} per sq ft
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-slate-50 rounded-xl p-4">
                    <div className="flex items-center space-x-3 mb-2">
                      <Ruler className="w-5 h-5 text-slate-600" />
                      <span className="text-sm text-slate-600">Length</span>
                    </div>
                    <div className="text-2xl font-bold text-slate-900">
                      {plot.length_ft ? Number(plot.length_ft).toFixed(2) : 'N/A'}
                    </div>
                    <div className="text-sm text-slate-600">ft</div>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4">
                    <div className="flex items-center space-x-3 mb-2">
                      <Ruler className="w-5 h-5 text-slate-600" />
                      <span className="text-sm text-slate-600">Width</span>
                    </div>
                    <div className="text-2xl font-bold text-slate-900">
                      {plot.width_ft ? Number(plot.width_ft).toFixed(2) : 'N/A'}
                    </div>
                    <div className="text-sm text-slate-600">ft</div>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4">
                    <div className="flex items-center space-x-3 mb-2">
                      <Ruler className="w-5 h-5 text-slate-600" />
                      <span className="text-sm text-slate-600">Total Area</span>
                    </div>
                    <div className="text-2xl font-bold text-slate-900">
                      {plot.area_sqft.toLocaleString('en-IN')}
                    </div>
                    <div className="text-sm text-slate-600">sq ft</div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <CheckCircle className="w-5 h-5 text-slate-600" />
                    <span className="text-sm text-slate-600">Owner Verified</span>
                  </div>
                  <div className="text-xl font-bold text-slate-900">
                    {plot.owner_verified ? 'Yes' : 'Pending'}
                  </div>
                  <div className="text-sm text-slate-600">{plot.owner_name}</div>
                </div>
              </div>

              {plot.description && (
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Description</h3>
                  <p className="text-slate-600 leading-relaxed">{plot.description}</p>
                </div>
              )}

              <div className="border-t border-slate-200 pt-4">
                <h3 className="font-semibold text-slate-900 mb-3 flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Property Details
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Property Owner:</span>
                    <span className="font-medium text-slate-900">{plot.property_owner_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Status:</span>
                    <span className="font-medium text-slate-900">{getStatusText(plot.status)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Listed:</span>
                    <span className="font-medium text-slate-900">
                      {new Date(plot.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  {plot.blockchain_hash && (
                    <div className="flex justify-between items-start">
                      <span className="text-slate-600">Blockchain:</span>
                      <span className="font-mono text-xs text-emerald-600 break-all max-w-[200px]">
                        {plot.blockchain_hash.slice(0, 16)}...
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
