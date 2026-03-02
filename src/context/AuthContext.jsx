import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(undefined);

const otpStore = {};

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email, password) => {
    void password;
    const emailOtp = generateOTP();
    otpStore[email] = { email, emailOtp, expiresAt: Date.now() + 10 * 60 * 1000 };

    console.log(`Email OTP for ${email}: ${emailOtp}`);
    alert(`OTP sent to ${email}: ${emailOtp}`);

    return { success: true, otpSent: true, message: 'OTP sent to your email' };
  };

  const verifyLoginOtp = async (email, otp) => {
    const stored = otpStore[email];

    if (!stored) {
      return { success: false, message: 'OTP expired or not found' };
    }

    if (Date.now() > stored.expiresAt) {
      delete otpStore[email];
      return { success: false, message: 'OTP has expired' };
    }

    if (stored.emailOtp !== otp) {
      return { success: false, message: 'Invalid OTP' };
    }

    const mockUser = {
      id: '1',
      full_name: 'John Doe',
      email,
      phone: '+91 9876543210',
      kyc_status: 'verified',
      user_type: 'both',
      created_at: new Date().toISOString(),
    };

    setUser(mockUser);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(mockUser));
    delete otpStore[email];

    return { success: true, message: 'Login successful' };
  };

  const signup = async (email, password, fullName, phone, userType) => {
    void password;
    void fullName;
    void userType;
    const emailOtp = generateOTP();
    const phoneOtp = generateOTP();

    otpStore[`${email}-${phone}`] = {
      email,
      emailOtp,
      phone,
      phoneOtp,
      expiresAt: Date.now() + 10 * 60 * 1000,
    };

    console.log(`Email OTP for ${email}: ${emailOtp}`);
    console.log(`Phone OTP for ${phone}: ${phoneOtp}`);
    alert(`Email OTP: ${emailOtp}\nPhone OTP: ${phoneOtp}`);

    return { success: true, otpRequired: true, message: 'OTPs sent to your email and phone' };
  };

  const verifySignupOtp = async (email, phone, emailOtp, phoneOtp) => {
    const key = `${email}-${phone}`;
    const stored = otpStore[key];

    if (!stored) {
      return { success: false, message: 'OTP expired or not found' };
    }

    if (Date.now() > stored.expiresAt) {
      delete otpStore[key];
      return { success: false, message: 'OTP has expired' };
    }

    if (stored.emailOtp !== emailOtp) {
      return { success: false, message: 'Invalid email OTP' };
    }

    if (stored.phoneOtp !== phoneOtp) {
      return { success: false, message: 'Invalid phone OTP' };
    }

    const mockUser = {
      id: Math.random().toString(36).substr(2, 9),
      full_name: email.split('@')[0],
      email,
      phone,
      kyc_status: 'pending',
      user_type: 'both',
      created_at: new Date().toISOString(),
    };

    setUser(mockUser);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(mockUser));
    delete otpStore[key];

    return { success: true, message: 'Account created successfully' };
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  const updateProfile = (updates) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, verifyLoginOtp, signup, verifySignupOtp, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
