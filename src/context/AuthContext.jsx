import { createContext, useContext, useEffect, useState } from 'react';
import { apiRequest } from '../lib/api';

const AuthContext = createContext(undefined);
const TOKEN_KEY = 'terravilla_token';

function saveSession({ token, user }) {
	localStorage.setItem(TOKEN_KEY, token);
	return user;
}

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!localStorage.getItem(TOKEN_KEY)) {
			setLoading(false);
			return;
		}

		apiRequest('/auth/me')
			.then(({ user: currentUser }) => setUser(currentUser))
			.catch(() => localStorage.removeItem(TOKEN_KEY))
			.finally(() => setLoading(false));
	}, []);

	const authenticate = async (path, credentials) => {
		try {
			const session = await apiRequest(path, {
				method: 'POST',
				body: JSON.stringify(credentials)
			});
			setUser(saveSession(session));
			return { success: true };
		} catch (error) {
			return { success: false, message: error.message };
		}
	};

	const login = (email, password) => authenticate('/auth/login', { email, password });
	const signup = (email, password, fullName, userType) =>
		authenticate('/auth/signup', { email, password, name: fullName, userType });

	const signInWithGoogle = async (credential) => {
		const result = await authenticate('/auth/google', { credential });
		if (!result.success) throw new Error(result.message);
		return result;
	};

	const logout = () => {
		localStorage.removeItem(TOKEN_KEY);
		setUser(null);
	};

	const updateProfile = async (updates) => {
		const { user: updatedUser } = await apiRequest('/auth/me', {
			method: 'PATCH',
			body: JSON.stringify(updates)
		});
		setUser(updatedUser);
		return updatedUser;
	};

	return (
		<AuthContext.Provider value={{
			user,
			isAuthenticated: Boolean(user),
			loading,
			login,
			signup,
			signInWithGoogle,
			logout,
			updateProfile
		}}>
			{loading ? (
				<div className="min-h-screen bg-slate-50 flex items-center justify-center">
					<div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600" />
				</div>
			) : children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (!context) throw new Error('useAuth must be used within an AuthProvider');
	return context;
}
