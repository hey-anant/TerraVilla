import { useState } from 'react';

import { User, Phone, Mail, Shield, Upload, CheckCircle, AlertCircle, XCircle, Lock, KeyRound } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function ProfilePage() {
  const { 
    user, 
    updateProfile, 
    sendPasswordResetOTP, 
    completePasswordReset, 
    sendPhoneVerificationOTP, 
    verifyPhoneOTP 
  } = useAuth();

  // Phone states
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneOtp, setPhoneOtp] = useState('');
  const [phoneStep, setPhoneStep] = useState('input'); // 'input' | 'otp'
  const [phoneError, setPhoneError] = useState('');
  const [phoneSuccess, setPhoneSuccess] = useState('');
  const [phoneLoading, setPhoneLoading] = useState(false);

  // Password states
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordOtp, setPasswordOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordStep, setPasswordStep] = useState('init'); // 'init' | 'otp'

  const countryCodes = [
    { code: '+1', country: 'USA/Canada' },
    { code: '+44', country: 'UK' },
    { code: '+61', country: 'Australia' },
    { code: '+91', country: 'India' },
    { code: '+86', country: 'China' },
    { code: '+81', country: 'Japan' },
    { code: '+33', country: 'France' },
    { code: '+49', country: 'Germany' },
    { code: '+39', country: 'Italy' },
    { code: '+34', country: 'Spain' },
    { code: '+55', country: 'Brazil' },
    { code: '+27', country: 'South Africa' },
    { code: '+65', country: 'Singapore' },
    { code: '+60', country: 'Malaysia' },
    { code: '+66', country: 'Thailand' },
    { code: '+62', country: 'Indonesia' },
    { code: '+63', country: 'Philippines' },
    { code: '+64', country: 'New Zealand' },
    { code: '+82', country: 'South Korea' },
    { code: '+852', country: 'Hong Kong' },
  ];

  // Handle phone update submission
  const handlePhoneRequest = async (e) => {
    e.preventDefault();
    setPhoneError('');
    setPhoneSuccess('');
    
    // Basic validation
    const digitsOnly = phoneNumber.replace(/\D/g, '');
    if (digitsOnly.length !== 10) {
      setPhoneError('Please enter a valid 10-digit phone number.');
      return;
    }

    setPhoneLoading(true);
    const res = await sendPhoneVerificationOTP(countryCode, digitsOnly);
    setPhoneLoading(false);
    
    if (res.success) {
      setPhoneStep('otp');
      setPhoneSuccess('Verification code sent to your phone number.');
    } else {
      setPhoneError(res.message);
    }
  };

  const handlePhoneVerify = async (e) => {
    e.preventDefault();
    setPhoneError('');
    setPhoneSuccess('');

    if (phoneOtp.length !== 6) {
      setPhoneError('Please enter a valid 6-digit verification code.');
      return;
    }

    setPhoneLoading(true);
    const res = await verifyPhoneOTP(countryCode, phoneNumber, phoneOtp);
    setPhoneLoading(false);

    if (res.success) {
      alert('Phone number verified and updated successfully!');
      setIsEditingPhone(false);
      setPhoneStep('input');
      setPhoneNumber('');
      setPhoneOtp('');
    } else {
      setPhoneError(res.message);
    }
  };

  // Handle password change request
  const handlePasswordRequest = async () => {
    setPasswordError('');
    setPasswordSuccess('');
    setPasswordLoading(true);
    const res = await sendPasswordResetOTP(user.email);
    setPasswordLoading(false);

    if (res.success) {
      setPasswordStep('otp');
      setPasswordSuccess('Password reset verification code sent to your email.');
    } else {
      setPasswordError(res.message);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (passwordOtp.length !== 6) {
      setPasswordError('Please enter a valid 6-digit verification code.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }

    setPasswordLoading(true);
    const res = await completePasswordReset(user.email, passwordOtp, newPassword);
    setPasswordLoading(false);

    if (res.success) {
      setPasswordSuccess('Password changed successfully! Closing in 2 seconds...');
      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordStep('init');
        setPasswordOtp('');
        setNewPassword('');
        setPasswordSuccess('');
      }, 2000);
    } else {
      setPasswordError(res.message);
    }
  };

  const handleKYCUpload = () => {
    updateProfile({ kyc_status: 'verified' });
    alert('KYC documents submitted. Status set to verified!');

import { User, Phone, Mail, Shield, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/useAuth';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    phone: user?.phone || '',
    user_type: user?.user_type || 'buyer',
  });

  const handleSubmit = (e) => {
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Profile Card Banner */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-12">
            <div className="flex items-center space-x-6">
              <div className="bg-white w-24 h-24 rounded-full flex items-center justify-center shadow-inner">

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

            {/* KYC status blocks */}


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

                    <button onClick={handleKYCUpload} className="bg-amber-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-amber-700 transition-colors flex items-center space-x-2">

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


            {/* Profile Info Details header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Account Information</h2>
              {!isEditingPhone ? (
                <button 
                  onClick={() => {
                    setIsEditingPhone(true);
                    setPhoneStep('input');
                    setPhoneError('');
                    setPhoneSuccess('');
                  }} 
                  className="text-emerald-600 hover:text-emerald-700 font-semibold flex items-center space-x-2 text-sm transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>Update Phone Number</span>
                </button>
              ) : (
                <button 
                  onClick={() => setIsEditingPhone(false)} 
                  className="text-slate-500 hover:text-slate-700 font-semibold text-sm transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>

            {/* Phone edit flow vs Account Detail view */}
            {isEditingPhone ? (
              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-6">
                <h3 className="font-bold text-slate-800">Verify Phone Number Change</h3>
                
                {phoneError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {phoneError}
                  </div>
                )}
                {phoneSuccess && (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg text-sm">
                    {phoneSuccess}
                  </div>
                )}

                {phoneStep === 'input' && (
                  <form onSubmit={handlePhoneRequest} className="space-y-4">
                    <div className="flex gap-2">
                      <select 
                        value={countryCode} 
                        onChange={(e) => setCountryCode(e.target.value)} 
                        className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                      >
                        {countryCodes.map((item) => (
                          <option key={item.code} value={item.code}>
                            {item.code} {item.country}
                          </option>
                        ))}
                      </select>
                      <input 
                        type="text" 
                        value={phoneNumber} 
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))} 
                        placeholder="Enter 10-digit phone number"
                        className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                        required
                      />
                    </div>
                    <button 
                      type="submit"
                      disabled={phoneLoading}
                      className="w-full bg-emerald-600 text-white py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50"
                    >
                      {phoneLoading ? 'Sending...' : 'Send Verification Code'}
                    </button>
                  </form>
                )}

                {phoneStep === 'otp' && (
                  <form onSubmit={handlePhoneVerify} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-2">
                        6-Digit Verification Code sent to {countryCode} {phoneNumber}
                      </label>
                      <input 
                        type="text" 
                        value={phoneOtp} 
                        onChange={(e) => setPhoneOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-center text-2xl tracking-widest font-bold"
                        placeholder="000000"
                        maxLength={6}
                        required
                      />
                    </div>
                    <button 
                      type="submit"
                      disabled={phoneLoading}
                      className="w-full bg-emerald-600 text-white py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50"
                    >
                      {phoneLoading ? 'Verifying...' : 'Verify and Update'}
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setPhoneStep('input')} 
                      className="w-full text-center text-sm text-emerald-600 hover:text-emerald-700 font-semibold"
                    >
                      Change Details
                    </button>
                  </form>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-xl">
                  <div className="bg-white p-3 rounded-lg border border-slate-200">

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
                    {['buyer', 'seller', 'both'].map((type) => (
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

                  <div className="bg-white p-3 rounded-lg border border-slate-200">

                  <div className="bg-white p-3 rounded-lg">

                    <Mail className="w-6 h-6 text-slate-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-slate-600 mb-1">Email</div>
                    <div className="font-medium text-slate-900">{user?.email}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-xl">

                  <div className="bg-white p-3 rounded-lg border border-slate-200">

                  <div className="bg-white p-3 rounded-lg">

                    <Phone className="w-6 h-6 text-slate-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-slate-600 mb-1">Phone Number</div>

                    <div className="font-medium text-slate-900">{user?.phone || 'Not verified/provided'}</div>

                    <div className="font-medium text-slate-900">{user?.phone || 'Not provided'}</div>

                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-xl">

                  <div className="bg-white p-3 rounded-lg border border-slate-200">

                  <div className="bg-white p-3 rounded-lg">

                    <Shield className="w-6 h-6 text-slate-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-slate-600 mb-1">KYC Status</div>
                    <div className="flex items-center space-x-2">

                      <span className={`font-semibold capitalize ${user?.kyc_status === 'verified'
                        ? 'text-emerald-600'
                        : user?.kyc_status === 'pending'
                          ? 'text-amber-600'
                          : 'text-red-600'}`}>
                        {user?.kyc_status}
                      </span>
                      {user?.kyc_status === 'verified' && (<CheckCircle className="w-4 h-4 text-emerald-600" />)}

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


        {/* Security / Password section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-1">Security & Password</h2>
              <p className="text-slate-500 text-sm">Manage your account authentication settings</p>
            </div>
            <div className="bg-emerald-50 text-emerald-700 p-3 rounded-xl border border-emerald-100">
              <Lock className="w-6 h-6" />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 gap-4">
            <div className="flex items-start space-x-3">
              <KeyRound className="w-5 h-5 text-slate-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-slate-900 text-sm">Account Password</h4>
                <p className="text-xs text-slate-500">Change your password through OTP email verification.</p>
              </div>
            </div>
            <button 
              onClick={() => {
                setShowPasswordModal(true);
                setPasswordStep('init');
                setPasswordError('');
                setPasswordSuccess('');
              }} 
              className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-800 transition-colors shadow-sm whitespace-nowrap"
            >
              Change Password
            </button>
          </div>
        </div>

        {/* Stats card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Account Statistics</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-100/50">
              <div className="text-3xl font-bold text-emerald-600 mb-2">0</div>
              <div className="text-sm text-slate-600">Active Listings</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100/50">
              <div className="text-3xl font-bold text-blue-600 mb-2">0</div>
              <div className="text-sm text-slate-600">Saved Properties</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100/50">

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


      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden transform transition-all duration-300">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <KeyRound className="w-5 h-5" />
                <h3 className="font-bold text-lg">Change Password</h3>
              </div>
              <button 
                onClick={() => setShowPasswordModal(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {passwordError && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3.5 rounded-xl text-sm">
                  {passwordError}
                </div>
              )}
              {passwordSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-600 px-4 py-3.5 rounded-xl text-sm">
                  {passwordSuccess}
                </div>
              )}

              {passwordStep === 'init' && (
                <div className="space-y-4">
                  <p className="text-slate-600 text-sm">
                    For security reasons, we will send a 6-digit confirmation code to your email address: <strong className="text-slate-800">{user.email}</strong>.
                  </p>
                  <button
                    onClick={handlePasswordRequest}
                    disabled={passwordLoading}
                    className="w-full bg-slate-900 text-white py-3 rounded-xl font-semibold hover:bg-slate-800 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    <span>{passwordLoading ? 'Sending...' : 'Send Verification OTP'}</span>
                  </button>
                </div>
              )}

              {passwordStep === 'otp' && (
                <form onSubmit={handlePasswordReset} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">
                      6-Digit Email Verification Code
                    </label>
                    <input
                      type="text"
                      value={passwordOtp}
                      onChange={(e) => setPasswordOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-center text-2xl tracking-widest font-extrabold"
                      placeholder="000000"
                      maxLength={6}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                      placeholder="Enter at least 6 characters"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={passwordLoading}
                    className="w-full bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50"
                  >
                    {passwordLoading ? 'Resetting Password...' : 'Verify OTP and Change Password'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setPasswordStep('init')}
                    className="w-full text-center text-sm font-semibold text-emerald-600 hover:text-emerald-700"
                  >
                    Resend Code
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}



    </div>
  );
}
