import { useState } from 'react';
import { User, Phone, Mail, Shield, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    phone: user?.phone || '',
    user_type: user?.user_type || 'buyer',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    setIsEditing(false);
  };

  const handleKYCUpload = () => {
    alert('KYC document upload functionality would be implemented here. In production, this would integrate with document verification services.');
    updateProfile({ kyc_status: 'verified' });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-12">
            <div className="flex items-center space-x-6">
              <div className="bg-white w-24 h-24 rounded-full flex items-center justify-center">
                <User className="w-12 h-12 text-emerald-600" />
              </div>
              <div className="text-white">
                <h1 className="text-3xl font-bold mb-2">{user?.full_name}</h1>
                <p className="text-emerald-50 capitalize">{user?.user_type} Account</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            {user?.kyc_status === 'pending' && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
                <div className="flex items-start space-x-4">
                  <div className="bg-amber-100 p-3 rounded-lg">
                    <AlertCircle className="w-6 h-6 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-amber-900 mb-1">Complete KYC Verification</h3>
                    <p className="text-amber-800 text-sm mb-4">
                      Upload a government-issued ID to verify your identity and unlock all platform features.
                    </p>
                    <button
                      onClick={handleKYCUpload}
                      className="bg-amber-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-amber-700 transition-colors flex items-center space-x-2"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Upload KYC Document</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {user?.kyc_status === 'verified' && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 mb-8">
                <div className="flex items-center space-x-3">
                  <div className="bg-emerald-100 p-3 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-emerald-900">KYC Verified</h3>
                    <p className="text-emerald-800 text-sm">Your account is fully verified and ready to use</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Account Information</h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Edit Profile
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        full_name: user?.full_name || '',
                        phone: user?.phone || '',
                        user_type: user?.user_type || 'buyer',
                      });
                    }}
                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>

            {isEditing ? (
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                    placeholder="+91 9876543210"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Account Type
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['buyer', 'seller', 'both'] as const).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setFormData({ ...formData, user_type: type })}
                        className={`py-2 px-4 rounded-lg text-sm font-medium transition-colors capitalize ${
                          formData.user_type === type
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-xl">
                  <div className="bg-white p-3 rounded-lg">
                    <User className="w-6 h-6 text-slate-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-slate-600 mb-1">Full Name</div>
                    <div className="font-medium text-slate-900">{user?.full_name}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-xl">
                  <div className="bg-white p-3 rounded-lg">
                    <Mail className="w-6 h-6 text-slate-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-slate-600 mb-1">Email</div>
                    <div className="font-medium text-slate-900">{user?.email}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-xl">
                  <div className="bg-white p-3 rounded-lg">
                    <Phone className="w-6 h-6 text-slate-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-slate-600 mb-1">Phone Number</div>
                    <div className="font-medium text-slate-900">{user?.phone || 'Not provided'}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-xl">
                  <div className="bg-white p-3 rounded-lg">
                    <Shield className="w-6 h-6 text-slate-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-slate-600 mb-1">KYC Status</div>
                    <div className="flex items-center space-x-2">
                      <span className={`font-medium capitalize ${
                        user?.kyc_status === 'verified'
                          ? 'text-emerald-600'
                          : user?.kyc_status === 'pending'
                          ? 'text-amber-600'
                          : 'text-red-600'
                      }`}>
                        {user?.kyc_status}
                      </span>
                      {user?.kyc_status === 'verified' && (
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mt-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Account Statistics</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl">
              <div className="text-3xl font-bold text-emerald-600 mb-2">0</div>
              <div className="text-sm text-slate-600">Active Listings</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
              <div className="text-3xl font-bold text-blue-600 mb-2">0</div>
              <div className="text-sm text-slate-600">Saved Properties</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
              <div className="text-3xl font-bold text-purple-600 mb-2">₹0</div>
              <div className="text-sm text-slate-600">Saved in Fees</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
