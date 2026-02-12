import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string; otpSent?: boolean }>;
  verifyLoginOtp: (email: string, otp: string) => Promise<{ success: boolean; message?: string }>;
  signup: (email: string, password: string, fullName: string, phone: string, userType: 'buyer' | 'seller' | 'both') => Promise<{ success: boolean; message?: string; otpRequired?: boolean }>;
  verifySignupOtp: (email: string, phone: string, emailOtp: string, phoneOtp: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock OTP storage (in production, this would be backend)
const otpStore: { [key: string]: { email?: string; emailOtp?: string; phone?: string; phoneOtp?: string; expiresAt: number } } = {};

// Generate random 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string; otpSent?: boolean }> => {
    // Simulate sending email OTP
    const emailOtp = generateOTP();
    otpStore[email] = { email, emailOtp, expiresAt: Date.now() + 10 * 60 * 1000 }; // 10 minutes expiry
    
    console.log(`Email OTP for ${email}: ${emailOtp}`);
    alert(`OTP sent to ${email}: ${emailOtp}`);
    
    return { success: true, otpSent: true, message: 'OTP sent to your email' };
  };

  const verifyLoginOtp = async (email: string, otp: string): Promise<{ success: boolean; message?: string }> => {
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

    const mockUser: User = {
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

  const signup = async (email: string, password: string, fullName: string, phone: string, userType: 'buyer' | 'seller' | 'both'): Promise<{ success: boolean; message?: string; otpRequired?: boolean }> => {
    // Generate and store OTPs
    const emailOtp = generateOTP();
    const phoneOtp = generateOTP();
    
    otpStore[`${email}-${phone}`] = { 
      email, 
      emailOtp, 
      phone, 
      phoneOtp, 
      expiresAt: Date.now() + 10 * 60 * 1000 
    };
    
    console.log(`Email OTP for ${email}: ${emailOtp}`);
    console.log(`Phone OTP for ${phone}: ${phoneOtp}`);
    alert(`Email OTP: ${emailOtp}\nPhone OTP: ${phoneOtp}`);
    
    return { success: true, otpRequired: true, message: 'OTPs sent to your email and phone' };
  };

  const verifySignupOtp = async (email: string, phone: string, emailOtp: string, phoneOtp: string): Promise<{ success: boolean; message?: string }> => {
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

    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      full_name: email.split('@')[0], // placeholder
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

  const updateProfile = (updates: Partial<User>) => {
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
