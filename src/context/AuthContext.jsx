import { createContext, useContext, useEffect, useState } from 'react';
import { insforge } from '../lib/insforge';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            try {
                const { data, error } = await insforge.auth.getCurrentUser();
                if (data?.user) {
                    // Sync profile with the database users table
                    const { data: dbData } = await insforge.database
                        .from('users')
                        .select('*')
                        .eq('id', data.user.id)
                        .maybeSingle();

                    if (dbData) {
                        setUser({
                            ...data.user,
                            full_name: dbData.full_name,
                            phone: dbData.phone,
                            user_type: dbData.user_type,
                            kyc_status: dbData.kyc_status
                        });
                        setIsAuthenticated(true);
                    } else {
                        // User is signed in, but their record doesn't exist in the database yet
                        // (e.g. logged in via Google OAuth for the first time)
                        const name = data.user.profile?.name || data.user.email.split('@')[0];
                        const { data: insertedData } = await insforge.database
                            .from('users')
                            .insert({
                                id: data.user.id,
                                full_name: name,
                                email: data.user.email,
                                phone: null,
                                user_type: 'buyer',
                                kyc_status: 'pending'
                            })
                            .select()
                            .maybeSingle();

                        setUser({
                            ...data.user,
                            full_name: insertedData?.full_name || name,
                            phone: insertedData?.phone || null,
                            user_type: insertedData?.user_type || 'buyer',
                            kyc_status: insertedData?.kyc_status || 'pending'
                        });
                        setIsAuthenticated(true);
                    }
                } else {
                    setUser(null);
                    setIsAuthenticated(false);
                }
            } catch (err) {
                console.error('Error initializing auth:', err);
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    const login = async (email, password) => {
        const { data, error } = await insforge.auth.signInWithPassword({ email, password });
        if (error) {
            return { success: false, message: error.message };
        }

        // Fetch their profile from the database
        const { data: dbData } = await insforge.database
            .from('users')
            .select('*')
            .eq('id', data.user.id)
            .maybeSingle();

        if (dbData) {
            setUser({
                ...data.user,
                full_name: dbData.full_name,
                phone: dbData.phone,
                user_type: dbData.user_type,
                kyc_status: dbData.kyc_status
            });
        } else {
            // Missing DB record fallback creation
            const name = data.user.profile?.name || data.user.email.split('@')[0];
            const { data: insertedData } = await insforge.database
                .from('users')
                .insert({
                    id: data.user.id,
                    full_name: name,
                    email: data.user.email,
                    phone: null,
                    user_type: 'buyer',
                    kyc_status: 'pending'
                })
                .select()
                .maybeSingle();

            setUser({
                ...data.user,
                full_name: insertedData?.full_name || name,
                phone: insertedData?.phone || null,
                user_type: insertedData?.user_type || 'buyer',
                kyc_status: insertedData?.kyc_status || 'pending'
            });
        }

        setIsAuthenticated(true);
        return { success: true };
    };

    const signup = async (email, password, fullName, phone, userType) => {
        const { data, error } = await insforge.auth.signUp({
            email,
            password,
            name: fullName,
        });

        if (error) {
            return { success: false, message: error.message };
        }

        // Generate simulated phone OTP
        const phoneOtp = Math.floor(100000 + Math.random() * 900000).toString();
        console.log(`Phone signup OTP for ${phone}: ${phoneOtp}`);
        alert(`OTP sent to phone ${phone}: ${phoneOtp}`);

        // Store details temporarily to sync to DB once OTPs are verified
        sessionStorage.setItem('pending_signup', JSON.stringify({
            fullName,
            phone,
            userType,
            email,
            phoneOtp
        }));

        if (data?.requireEmailVerification) {
            return { success: true, otpRequired: true, message: 'Verification codes sent to your email and phone.' };
        }

        // If email verification is disabled, insert profile directly
        const { data: insertedData } = await insforge.database
            .from('users')
            .insert({
                id: data.user.id,
                full_name: fullName,
                email: email,
                phone: phone,
                user_type: userType,
                kyc_status: 'pending'
            })
            .select()
            .maybeSingle();

        setUser({
            ...data.user,
            full_name: insertedData?.full_name || fullName,
            phone: insertedData?.phone || phone,
            user_type: insertedData?.user_type || userType,
            kyc_status: insertedData?.kyc_status || 'pending'
        });
        setIsAuthenticated(true);
        sessionStorage.removeItem('pending_signup');
        return { success: true };
    };

    const verifySignupOtp = async (email, phone, emailOtp, phoneOtp) => {
        // Recover pending signup details
        const pendingStr = sessionStorage.getItem('pending_signup');
        if (!pendingStr) {
            return { success: false, message: 'No signup request found' };
        }

        let pending;
        try {
            pending = JSON.parse(pendingStr);
        } catch (e) {
            return { success: false, message: 'Invalid session data' };
        }

        // Verify simulated phone OTP first
        if (pending.phoneOtp !== phoneOtp) {
            return { success: false, message: 'Invalid phone verification code' };
        }

        // Verify real email OTP with InsForge
        const { data, error } = await insforge.auth.verifyEmail({
            email,
            otp: emailOtp
        });

        if (error) {
            return { success: false, message: error.message };
        }

        // Create the user record in database
        const { data: dbData, error: dbError } = await insforge.database
            .from('users')
            .insert({
                id: data.user.id,
                full_name: pending.fullName,
                email: email,
                phone: pending.phone || phone,
                user_type: pending.userType,
                kyc_status: 'pending'
            })
            .select()
            .maybeSingle();

        if (dbError) {
            console.error('Failed to insert user profile to database:', dbError);
        }

        setUser({
            ...data.user,
            full_name: dbData?.full_name || pending.fullName,
            phone: dbData?.phone || pending.phone || phone,
            user_type: dbData?.user_type || pending.userType,
            kyc_status: dbData?.kyc_status || 'pending'
        });
        setIsAuthenticated(true);
        sessionStorage.removeItem('pending_signup');
        return { success: true, message: 'Account verified and created successfully' };
    };

    const verifyLoginOtp = async (email, otp) => {
        return { success: true };
    };

    const signInWithGoogle = async () => {
        const { error } = await insforge.auth.signInWithOAuth('google', {
            redirectTo: window.location.origin,
        });
        if (error) {
            throw error;
        }
    };

    const logout = async () => {
        await insforge.auth.signOut();
        setUser(null);
        setIsAuthenticated(false);
    };

    const updateProfile = async (updates) => {
        if (!user) return;
        const { data, error } = await insforge.database
            .from('users')
            .update(updates)
            .eq('id', user.id)
            .select()
            .maybeSingle();

        if (!error && data) {
            setUser(prev => ({
                ...prev,
                full_name: data.full_name,
                phone: data.phone,
                user_type: data.user_type,
                kyc_status: data.kyc_status
            }));
        }
    };

    // Password Reset Methods
    const sendPasswordResetOTP = async (emailAddress) => {
        const { data, error } = await insforge.auth.sendResetPasswordEmail({
            email: emailAddress
        });
        if (error) {
            return { success: false, message: error.message };
        }
        return { success: true, message: 'Password reset code sent to your email.' };
    };

    const completePasswordReset = async (emailAddress, code, newPassword) => {
        // Step 1: Exchange code for reset token
        const { data: exchangeData, error: exchangeError } = await insforge.auth.exchangeResetPasswordToken({
            email: emailAddress,
            code: code
        });
        if (exchangeError) {
            return { success: false, message: exchangeError.message };
        }

        // Step 2: Reset the password
        const { data: resetData, error: resetError } = await insforge.auth.resetPassword({
            newPassword,
            otp: exchangeData.token
        });
        if (resetError) {
            return { success: false, message: resetError.message };
        }

        return { success: true, message: resetData?.message || 'Password reset successfully.' };
    };

    // Phone Verification Methods (Simulated OTP with 10-digit validation)
    const sendPhoneVerificationOTP = async (countryCode, phoneNumber) => {
        if (!user) return { success: false, message: 'Must be logged in' };
        
        // Ensure phone number is exactly 10 digits
        const cleanPhone = phoneNumber.replace(/\D/g, '');
        if (cleanPhone.length !== 10) {
            return { success: false, message: 'Phone number must be exactly 10 digits' };
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const key = `phone-verify-${user.id}`;

        sessionStorage.setItem(key, JSON.stringify({
            countryCode,
            phoneNumber: cleanPhone,
            otp,
            expiresAt: Date.now() + 10 * 60 * 1000
        }));

        console.log(`Phone verification OTP for ${countryCode} ${cleanPhone}: ${otp}`);
        alert(`OTP sent to phone ${countryCode} ${cleanPhone}: ${otp}`);

        return { success: true, message: 'OTP code generated successfully.' };
    };

    const verifyPhoneOTP = async (countryCode, phoneNumber, otp) => {
        if (!user) return { success: false, message: 'Must be logged in' };

        const cleanPhone = phoneNumber.replace(/\D/g, '');
        const key = `phone-verify-${user.id}`;
        const storedStr = sessionStorage.getItem(key);
        if (!storedStr) {
            return { success: false, message: 'No verification request found' };
        }

        const stored = JSON.parse(storedStr);

        if (Date.now() > stored.expiresAt) {
            sessionStorage.removeItem(key);
            return { success: false, message: 'OTP has expired' };
        }
        if (stored.countryCode !== countryCode || stored.phoneNumber !== cleanPhone) {
            return { success: false, message: 'Phone details do not match original request' };
        }
        if (stored.otp !== otp) {
            return { success: false, message: 'Invalid verification code' };
        }

        // OTP verified successfully. Save user phone number to DB
        const fullPhone = `${countryCode} ${cleanPhone}`;
        const { data, error } = await insforge.database
            .from('users')
            .update({ phone: fullPhone })
            .eq('id', user.id)
            .select()
            .maybeSingle();

        if (error) {
            return { success: false, message: 'Failed to save phone to database: ' + error.message };
        }

        setUser(prev => ({
            ...prev,
            phone: fullPhone
        }));

        sessionStorage.removeItem(key);
        return { success: true, message: 'Phone number updated and verified successfully.' };
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated,
            loading,
            login,
            verifyLoginOtp,
            signup,
            verifySignupOtp,
            signInWithGoogle,
            logout,
            updateProfile,
            sendPasswordResetOTP,
            completePasswordReset,
            sendPhoneVerificationOTP,
            verifyPhoneOTP
        }}>
            {!loading ? children : (
                <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                </div>
            )}
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
