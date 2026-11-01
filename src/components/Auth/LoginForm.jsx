import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { LogIn, UserPlus, Mail, Lock, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function LoginForm() {
	const [isLogin, setIsLogin] = useState(true);
	const [form, setForm] = useState({ name: '', email: '', password: '', userType: 'buyer' });
	const [message, setMessage] = useState('');
	const [loading, setLoading] = useState(false);
	const { login, signup, signInWithGoogle } = useAuth();
	const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

	const updateField = (field) => (event) => {
		setForm((current) => ({ ...current, [field]: event.target.value }));
	};

	const submit = async (event) => {
		event.preventDefault();
		setMessage('');
		setLoading(true);
		const result = isLogin
			? await login(form.email, form.password)
			: await signup(form.email, form.password, form.name, form.userType);
		if (!result.success) setMessage(result.message);
		setLoading(false);
	};

	const handleGoogleSuccess = async ({ credential }) => {
		setMessage('');
		setLoading(true);
		try {
			await signInWithGoogle(credential);
		} catch (error) {
			setMessage(error.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50/20 to-slate-100 flex items-center justify-center px-4 py-12">
			<div className="max-w-md w-full">
				<div className="text-center mb-8">
					<img src="/logo.png" alt="TerraVilla" className="w-16 h-16 mx-auto mb-4 rounded-2xl shadow-lg" />
					<h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">TerraVilla</h1>
					<p className="text-slate-600 mt-2">Transparent land transactions.</p>
				</div>

				<div className="bg-white border border-slate-200 rounded-3xl shadow-xl p-8">
					<div className="flex gap-2 mb-7 bg-slate-100 p-1 rounded-xl">
						{[['Sign In', true], ['Create Account', false]].map(([label, loginMode]) => (
							<button
								key={label}
								type="button"
								onClick={() => { setIsLogin(loginMode); setMessage(''); }}
								className={`flex-1 py-2.5 rounded-lg font-semibold ${isLogin === loginMode ? 'bg-emerald-600 text-white' : 'text-slate-500'}`}
							>
								{label}
							</button>
						))}
					</div>

					{message && <p className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-5 text-sm">{message}</p>}

					<form onSubmit={submit} className="space-y-4">
						{!isLogin && (
							<div className="relative">
								<User className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
								<input required value={form.name} onChange={updateField('name')} placeholder="Full name" className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" />
							</div>
						)}
						<div className="relative">
							<Mail className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
							<input required type="email" value={form.email} onChange={updateField('email')} placeholder="Email address" className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" />
						</div>
						<div className="relative">
							<Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
							<input required minLength={6} type="password" value={form.password} onChange={updateField('password')} placeholder="Password (6+ characters)" className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" />
						</div>
						{!isLogin && (
							<select value={form.userType} onChange={updateField('userType')} className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500">
								<option value="buyer">I want to buy</option>
								<option value="seller">I want to sell</option>
								<option value="both">Buy and sell</option>
							</select>
						)}
						<button disabled={loading} className="w-full bg-emerald-600 text-white py-3.5 rounded-xl font-bold hover:bg-emerald-700 disabled:opacity-50 flex items-center justify-center gap-2">
							{isLogin ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
							{loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
						</button>
					</form>

					{googleClientId && (
						<>
							<div className="flex items-center gap-3 my-6 text-xs text-slate-400">
								<div className="h-px bg-slate-200 flex-1" /> OR <div className="h-px bg-slate-200 flex-1" />
							</div>
							<GoogleLogin onSuccess={handleGoogleSuccess} onError={() => setMessage('Google sign-in failed')} useOneTap={false} />
						</>
					)}
				</div>
			</div>
		</div>
	);
}
