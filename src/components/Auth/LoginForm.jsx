import { useState } from 'react';
import { LogIn, UserPlus, Mail, Lock, User, Phone, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function LoginForm() {
    const [isLogin, setIsLogin] = useState(true);
    const [step, setStep] = useState('credentials'); // 'credentials' | 'otp'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [countryCode, setCountryCode] = useState('+91');
    const [phone, setPhone] = useState('');
    const [userType, setUserType] = useState('buyer');
    const [loading, setLoading] = useState(false);
    const [otpEmail, setOtpEmail] = useState('');
    const [otpPhone, setOtpPhone] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const { login, signup, verifySignupOtp, signInWithGoogle } = useAuth();

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setLoading(true);
        try {
            if (isLogin) {
                const result = await login(email, password);
                if (!result.success) {
                    setError(result.message || 'Login failed');
                }
            } else {
                const fullPhoneNumber = `${countryCode} ${phone}`;
                const result = await signup(email, password, fullName, fullPhoneNumber, userType);
                if (result.success) {
                    if (result.otpRequired) {
                        setStep('otp');
                        setSuccessMessage(result.message || 'Verification codes sent to your email and phone.');
                    } else {
                        setSuccessMessage('Account created successfully!');
                    }
                } else {
                    setError(result.message || 'Signup failed');
                }
            }
        } catch (err) {
            console.error('Auth error:', err);
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleOtpVerification = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setLoading(true);
        try {
            const fullPhoneNumber = `${countryCode} ${phone}`;
            const result = await verifySignupOtp(email, fullPhoneNumber, otpEmail, otpPhone);
            if (result.success) {
                setSuccessMessage('Email & phone verified successfully! Logging you in...');
            } else {
                setError(result.message || 'Verification failed');
            }
        } catch (err) {
            console.error('OTP verification error:', err);
            setError('An error occurred during verification.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setError('');
        setLoading(true);
        try {
            await signInWithGoogle();
        } catch (err) {
            console.error('Google Sign In error:', err);
            setError(err.message || 'Failed to start Google sign-in.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50/20 to-slate-100 flex items-center justify-center px-4 py-12 relative overflow-hidden">
            {/* Background elements for rich aesthetics */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="max-w-md w-full z-10">
                <div className="text-center mb-8">
                    <img src="/logo.svg" alt="TerraVilla Logo" className="w-20 h-20 mx-auto mb-4 rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-300 object-cover border border-slate-200" />
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">TerraVilla</h1>
                    <p className="text-slate-600 text-lg">Zero broker fees. Maximum transparency.</p>
                </div>

                <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl shadow-2xl p-8 transform hover:translate-y-[-4px] transition-all duration-300">
                    <div className="flex space-x-2 mb-8 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
                        <button 
                            type="button"
                            onClick={() => {
                                setIsLogin(true);
                                setStep('credentials');
                                setError('');
                                setSuccessMessage('');
                            }} 
                            className={`flex-1 py-2.5 rounded-lg font-semibold transition-all duration-200 ${isLogin
                                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/10'
                                : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Sign In
                        </button>
                        <button 
                            type="button"
                            onClick={() => {
                                setIsLogin(false);
                                setStep('credentials');
                                setError('');
                                setSuccessMessage('');
                            }} 
                            className={`flex-1 py-2.5 rounded-lg font-semibold transition-all duration-200 ${!isLogin
                                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/10'
                                : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Sign Up
                        </button>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3.5 rounded-xl mb-6 text-sm flex items-center space-x-2">
                            <span className="font-semibold">⚠️</span>
                            <span>{error}</span>
                        </div>
                    )}

                    {successMessage && (
                        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3.5 rounded-xl mb-6 text-sm flex items-center space-x-2">
                            <CheckCircle className="w-5 h-5 flex-shrink-0" />
                            <span>{successMessage}</span>
                        </div>
                    )}

                    {step === 'credentials' && (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {!isLogin && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-600 mb-2">
                                            Full Name
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <User className="h-5 w-5 text-slate-500" />
                                            </div>
                                            <input 
                                                type="text" 
                                                value={fullName} 
                                                onChange={(e) => setFullName(e.target.value)} 
                                                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400" 
                                                placeholder="Enter your full name" 
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-600 mb-2">
                                            Phone Number
                                        </label>
                                        <div className="flex gap-2">
                                            <select 
                                                value={countryCode} 
                                                onChange={(e) => setCountryCode(e.target.value)} 
                                                className="px-3 py-3 bg-white border border-slate-200 rounded-xl text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                                            >
                                                {countryCodes.map((item) => (
                                                    <option key={item.code} value={item.code}>
                                                        {item.code} {item.country}
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="relative flex-1">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Phone className="h-5 w-5 text-slate-500" />
                                                </div>
                                                <input 
                                                    type="text" 
                                                    value={phone} 
                                                    onChange={(e) => {
                                                        const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                                                        setPhone(value);
                                                    }} 
                                                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400" 
                                                    placeholder="Enter 10 digits" 
                                                    maxLength={10} 
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1">{phone.length}/10 digits</p>
                                    </div>
                                </>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-slate-500" />
                                    </div>
                                    <input 
                                        type="email" 
                                        value={email} 
                                        onChange={(e) => setEmail(e.target.value)} 
                                        className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400" 
                                        placeholder="your@email.com" 
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-slate-500" />
                                    </div>
                                    <input 
                                        type="password" 
                                        value={password} 
                                        onChange={(e) => setPassword(e.target.value)} 
                                        className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400" 
                                        placeholder="••••••••" 
                                        required
                                    />
                                </div>
                            </div>

                            {!isLogin && (
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-2">
                                        I want to
                                    </label>
                                    <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
                                        <button 
                                            type="button" 
                                            onClick={() => setUserType('buyer')} 
                                            className={`py-2 px-3 rounded-lg text-sm font-semibold transition-all ${userType === 'buyer'
                                                ? 'bg-emerald-600 text-white shadow'
                                                : 'text-slate-500 hover:text-slate-700'}`}
                                        >
                                            Buy
                                        </button>
                                        <button 
                                            type="button" 
                                            onClick={() => setUserType('seller')} 
                                            className={`py-2 px-3 rounded-lg text-sm font-semibold transition-all ${userType === 'seller'
                                                ? 'bg-emerald-600 text-white shadow'
                                                : 'text-slate-500 hover:text-slate-700'}`}
                                        >
                                            Sell
                                        </button>
                                        <button 
                                            type="button" 
                                            onClick={() => setUserType('both')} 
                                            className={`py-2 px-3 rounded-lg text-sm font-semibold transition-all ${userType === 'both'
                                                ? 'bg-emerald-600 text-white shadow'
                                                : 'text-slate-500 hover:text-slate-700'}`}
                                        >
                                            Both
                                        </button>
                                    </div>
                                </div>
                            )}

                            <button 
                                type="submit" 
                                disabled={loading} 
                                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3.5 rounded-xl font-bold hover:from-emerald-500 hover:to-teal-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg shadow-emerald-600/10 hover:shadow-emerald-600/20 transform active:scale-95"
                            >
                                {loading ? (
                                    <span>Processing...</span>
                                ) : (
                                    <>
                                        {isLogin ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                                        <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                                    </>
                                )}
                            </button>
                        </form>
                    )}

                    {step === 'otp' && (
                        <form onSubmit={handleOtpVerification} className="space-y-6">
                            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-4">
                                <p className="text-sm text-emerald-700">
                                    Please enter the 6-digit verification codes sent to your email <strong className="text-slate-900">{email}</strong> and phone <strong className="text-slate-900">{countryCode} {phone}</strong>.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-2">
                                        Email Verification Code
                                    </label>
                                    <input 
                                        type="text" 
                                        value={otpEmail} 
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                                            setOtpEmail(value);
                                        }} 
                                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-center text-2xl font-extrabold tracking-widest" 
                                        placeholder="000000" 
                                        maxLength={6} 
                                        required
                                    />
                                    <p className="text-xs text-slate-500 mt-1 text-center">{otpEmail.length}/6 digits</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-2">
                                        Phone Verification Code
                                    </label>
                                    <input 
                                        type="text" 
                                        value={otpPhone} 
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                                            setOtpPhone(value);
                                        }} 
                                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-center text-2xl font-extrabold tracking-widest" 
                                        placeholder="000000" 
                                        maxLength={6} 
                                        required
                                    />
                                    <p className="text-xs text-slate-500 mt-1 text-center">{otpPhone.length}/6 digits</p>
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                disabled={loading} 
                                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3.5 rounded-xl font-bold hover:from-emerald-500 hover:to-teal-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
                            >
                                {loading ? 'Verifying...' : 'Verify & Sign In'}
                            </button>

                            <button 
                                type="button" 
                                onClick={() => {
                                    setStep('credentials');
                                    setError('');
                                    setSuccessMessage('');
                                }} 
                                className="w-full text-emerald-600 hover:text-emerald-700 font-semibold text-sm transition-colors text-center"
                            >
                                Change Details
                            </button>
                        </form>
                    )}

                    {step === 'credentials' && (
                        <>
                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-slate-200"></div>
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-white px-3 text-slate-400 font-medium">Or continue with</span>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={handleGoogleLogin}
                                disabled={loading}
                                className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 hover:text-slate-900 py-3.5 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center shadow-sm hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
                            >
                                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                                </svg>
                                <span>Sign In with Google</span>
                            </button>
                        </>
                    )}
                </div>

                <div className="mt-8 text-center text-xs text-slate-500">
                    <p>By continuing, you agree to TerraVilla's Terms of Service and Privacy Policy</p>
                </div>
            </div>
        </div>
    );
}
