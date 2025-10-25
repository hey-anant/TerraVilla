import { useState } from 'react';
import { Upload, Plus, FileText, CheckCircle, Clock, XCircle, Image, Shield, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { mockPlots } from '../../data/mockData';
import { DocumentType } from '../../types';
import { formatPriceDisplay, parseLakhsToRupees } from '../../utils/priceFormatters';
import ListingFeePayment from '../Payment/ListingFeePayment';

interface DocumentUpload {
  type: DocumentType;
  file: File | null;
  preview?: string;
}

export default function SellerDashboard() {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showPayment, setShowPayment] = useState(false);
  const [pendingPlotId, setPendingPlotId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location_address: '',
    city: '',
    state: '',
    area_sqft: '',
    price: '',
    owner_name: '',
    owner_aadhaar: '',
    property_owner_name: '',
  });
  const [plotImages, setPlotImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [documents, setDocuments] = useState<DocumentUpload[]>([
    { type: 'title_deed', file: null },
    { type: 'survey_map', file: null },
    { type: 'tax_receipt', file: null },
    { type: 'encumbrance_certificate', file: null },
  ]);

  const userPlots = mockPlots.filter(plot => plot.seller_id === user?.id);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setPlotImages(prev => [...prev, ...files]);

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setPlotImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleDocumentUpload = (index: number, file: File) => {
    const newDocuments = [...documents];
    newDocuments[index].file = file;
    setDocuments(newDocuments);
  };

  const verifyOwnership = () => {
    if (formData.owner_name.toLowerCase().trim() === formData.property_owner_name.toLowerCase().trim()) {
      alert('✓ Owner verification successful! Names match.');
      return true;
    } else {
      alert('✗ Owner verification failed! The owner name does not match the property owner name. Please verify the details.');
      return false;
    }
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!formData.owner_name || !formData.owner_aadhaar || !formData.property_owner_name) {
        alert('Please fill in all owner verification details');
        return;
      }
      if (formData.owner_aadhaar.length !== 12) {
        alert('Aadhaar number must be 12 digits');
        return;
      }
      if (!verifyOwnership()) {
        return;
      }
    }
    setCurrentStep(prev => prev + 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (plotImages.length === 0) {
      alert('Please upload at least one property image');
      return;
    }

    const uploadedDocs = documents.filter(doc => doc.file !== null);
    if (uploadedDocs.length === 0) {
      alert('Please upload at least one property document');
      return;
    }

    setPendingPlotId('temp-' + Date.now());
    setShowForm(false);
    setShowPayment(true);
  };

  const handlePaymentComplete = () => {
    alert(`Property listing created successfully!\n\nDetails:\n- ${plotImages.length} images uploaded\n- ${documents.filter(doc => doc.file !== null).length} documents uploaded\n- Owner verified: ${formData.owner_name}\n- Aadhaar: ${formData.owner_aadhaar}\n- Listing fee paid: ₹500\n\nYour listing will be verified through government database and AI checks.`);

    setShowPayment(false);
    setPendingPlotId(null);
    setCurrentStep(1);
    setFormData({
      title: '',
      description: '',
      location_address: '',
      city: '',
      state: '',
      area_sqft: '',
      price: '',
      owner_name: '',
      owner_aadhaar: '',
      property_owner_name: '',
    });
    setPlotImages([]);
    setImagePreviews([]);
    setDocuments([
      { type: 'title_deed', file: null },
      { type: 'survey_map', file: null },
      { type: 'tax_receipt', file: null },
      { type: 'encumbrance_certificate', file: null },
    ]);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-5 h-5 text-emerald-600" />;
      case 'pending_verification':
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

  const getDocumentLabel = (type: DocumentType) => {
    const labels: Record<DocumentType, string> = {
      title_deed: 'Title Deed',
      survey_map: 'Survey Map',
      tax_receipt: 'Property Tax Receipt',
      noc: 'No Objection Certificate',
      encumbrance_certificate: 'Encumbrance Certificate',
      other: 'Other Document',
    };
    return labels[type];
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Seller Dashboard</h1>
            <p className="text-slate-600 mt-1">List your property with verified ownership</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-xl font-medium hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>List New Property</span>
          </button>
        </div>

        {user?.kyc_status !== 'verified' && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
            <div className="flex items-start space-x-4">
              <div className="bg-amber-100 p-3 rounded-lg">
                <FileText className="w-6 h-6 text-amber-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-amber-900 mb-1">KYC Verification Required</h3>
                <p className="text-amber-800 text-sm mb-3">
                  Complete your KYC verification to list properties and access all seller features.
                </p>
                <button className="bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors">
                  Complete KYC Now
                </button>
              </div>
            </div>
          </div>
        )}

        {showForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 z-10">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-slate-900">List New Property</h2>
                  <button
                    onClick={() => {
                      setShowForm(false);
                      setCurrentStep(1);
                    }}
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="flex items-center flex-1">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full font-semibold text-sm ${
                        currentStep >= step
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 text-slate-600'
                      }`}>
                        {step}
                      </div>
                      <div className={`flex-1 h-1 mx-2 rounded ${
                        currentStep > step ? 'bg-emerald-600' : 'bg-slate-200'
                      } ${step === 3 ? 'hidden' : ''}`}></div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-xs text-slate-600">
                  <span>Owner Verification</span>
                  <span>Property Details</span>
                  <span>Photos & Documents</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                      <div className="flex items-start space-x-3">
                        <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <h3 className="font-semibold text-blue-900 mb-1">Owner Verification Required</h3>
                          <p className="text-sm text-blue-800">
                            Your name and Aadhaar will be verified against the property ownership records to ensure authenticity.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Your Full Name (As per Aadhaar) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.owner_name}
                        onChange={(e) => setFormData({ ...formData, owner_name: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                        placeholder="Enter your full name exactly as on Aadhaar"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Aadhaar Card Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.owner_aadhaar}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '').slice(0, 12);
                          setFormData({ ...formData, owner_aadhaar: value });
                        }}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                        placeholder="Enter 12-digit Aadhaar number"
                        maxLength={12}
                        required
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        {formData.owner_aadhaar.length}/12 digits
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Property Owner Name (As per Property Documents) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.property_owner_name}
                        onChange={(e) => setFormData({ ...formData, property_owner_name: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                        placeholder="Enter name as shown on property documents"
                        required
                      />
                    </div>

                    {formData.owner_name && formData.property_owner_name && (
                      <div className={`p-4 rounded-lg border-2 ${
                        formData.owner_name.toLowerCase().trim() === formData.property_owner_name.toLowerCase().trim()
                          ? 'bg-emerald-50 border-emerald-200'
                          : 'bg-amber-50 border-amber-200'
                      }`}>
                        <div className="flex items-center space-x-2">
                          {formData.owner_name.toLowerCase().trim() === formData.property_owner_name.toLowerCase().trim() ? (
                            <>
                              <CheckCircle className="w-5 h-5 text-emerald-600" />
                              <span className="text-sm font-medium text-emerald-900">Names match - Ready for verification</span>
                            </>
                          ) : (
                            <>
                              <AlertTriangle className="w-5 h-5 text-amber-600" />
                              <span className="text-sm font-medium text-amber-900">Names don't match - Please verify</span>
                            </>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        className="px-6 py-2 border-2 border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleNext}
                        className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                      >
                        Next Step
                      </button>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Property Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                        placeholder="e.g., Premium Residential Plot in Whitefield"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Description
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={4}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none resize-none"
                        placeholder="Describe the property features, location benefits, nearby amenities..."
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.location_address}
                          onChange={(e) => setFormData({ ...formData, location_address: e.target.value })}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                          placeholder="Street address"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          City <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                          placeholder="City name"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          State <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.state}
                          onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                          placeholder="State name"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Area (sq ft) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          value={formData.area_sqft}
                          onChange={(e) => setFormData({ ...formData, area_sqft: e.target.value })}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                          placeholder="2400"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Price (Lakhs) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                        placeholder="96"
                        required
                      />
                      {formData.price && formData.area_sqft && (
                        <p className="text-sm text-slate-600 mt-2">
                          Price per sq ft: ₹{Math.round(parseLakhsToRupees(Number(formData.price)) / Number(formData.area_sqft)).toLocaleString('en-IN')}
                        </p>
                      )}
                    </div>

                    <div className="flex justify-between pt-4">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="px-6 py-2 border-2 border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={handleNext}
                        className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                      >
                        Next Step
                      </button>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-3">
                        Property Photos <span className="text-red-500">*</span>
                      </label>
                      <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 hover:border-emerald-500 transition-colors">
                        <input
                          type="file"
                          id="plot-images"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <label
                          htmlFor="plot-images"
                          className="flex flex-col items-center cursor-pointer"
                        >
                          <Image className="w-12 h-12 text-slate-400 mb-3" />
                          <span className="text-sm font-medium text-slate-700 mb-1">
                            Click to upload property photos
                          </span>
                          <span className="text-xs text-slate-500">
                            Upload multiple images (JPEG, PNG)
                          </span>
                        </label>
                      </div>

                      {imagePreviews.length > 0 && (
                        <div className="grid grid-cols-3 gap-4 mt-4">
                          {imagePreviews.map((preview, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={preview}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-32 object-cover rounded-lg"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-3">
                        Property Documents <span className="text-red-500">*</span>
                      </label>
                      <div className="space-y-3">
                        {documents.map((doc, index) => (
                          <div key={doc.type} className="border border-slate-200 rounded-lg p-4 hover:border-emerald-500 transition-colors">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="font-medium text-slate-900 mb-1">
                                  {getDocumentLabel(doc.type)}
                                </div>
                                <input
                                  type="file"
                                  id={`doc-${doc.type}`}
                                  accept=".pdf,.jpg,.jpeg,.png"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleDocumentUpload(index, file);
                                  }}
                                  className="hidden"
                                />
                                <label
                                  htmlFor={`doc-${doc.type}`}
                                  className="inline-flex items-center space-x-2 text-sm text-emerald-600 hover:text-emerald-700 cursor-pointer"
                                >
                                  <Upload className="w-4 h-4" />
                                  <span>{doc.file ? 'Change file' : 'Upload document'}</span>
                                </label>
                              </div>
                              {doc.file && (
                                <div className="flex items-center space-x-2 bg-emerald-50 px-3 py-1 rounded-lg">
                                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                                  <span className="text-sm text-emerald-700">{doc.file.name}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                      <div className="flex items-start space-x-3">
                        <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-blue-900 mb-1">Government Verification Process</p>
                          <p className="text-sm text-blue-700">
                            Your uploaded documents will be verified through government database APIs and AI fraud detection systems before the listing goes live.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between pt-4">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(2)}
                        className="px-6 py-2 border-2 border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-medium hover:from-emerald-700 hover:to-teal-700 transition-all"
                      >
                        Submit for Verification
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
            <h2 className="font-semibold text-slate-900">My Listings ({userPlots.length})</h2>
          </div>

          {userPlots.length === 0 ? (
            <div className="p-12 text-center">
              <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No listings yet</h3>
              <p className="text-slate-600 mb-6">Create your first property listing to get started</p>
              <button
                onClick={() => setShowForm(true)}
                className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
              >
                Create Listing
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {userPlots.map((plot) => (
                <div key={plot.id} className="p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start space-x-4">
                    <img
                      src={plot.images[0]}
                      alt={plot.title}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-slate-900 mb-1">{plot.title}</h3>
                          <p className="text-sm text-slate-600">{plot.location_address}, {plot.city}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(plot.verification_status)}
                          <span className="text-sm font-medium text-slate-700">
                            {getStatusText(plot.verification_status)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6 text-sm text-slate-600 mt-3">
                        <span>{plot.area_sqft.toLocaleString('en-IN')} sq ft</span>
                        <span className="font-semibold text-slate-900">
                          {formatPriceDisplay(plot.price)}
                        </span>
                        <span>₹{plot.price_per_sqft.toLocaleString('en-IN')}/sq ft</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showPayment && pendingPlotId && (
        <ListingFeePayment
          plotId={pendingPlotId}
          onPaymentComplete={handlePaymentComplete}
          onCancel={() => {
            setShowPayment(false);
            setPendingPlotId(null);
          }}
        />
      )}
    </div>
  );
}
