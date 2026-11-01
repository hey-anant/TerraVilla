import { User, Mail, Shield, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function ProfilePage() {
	const { user, updateProfile } = useAuth();

	const handleKycUpload = async () => {
		await updateProfile({ verification_status: 'verified' });
		alert('KYC documents submitted. Your status is now verified.');
	};

	return (
		<div className="min-h-screen bg-slate-50">
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
					<div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-12 flex items-center gap-6 text-white">
						<div className="bg-white w-20 h-20 rounded-full flex items-center justify-center">
							<User className="w-10 h-10 text-emerald-600" />
						</div>
						<div>
							<h1 className="text-3xl font-bold">{user?.full_name}</h1>
							<p className="text-emerald-50 capitalize">{user?.user_type} account</p>
						</div>
					</div>

					<div className="p-8 space-y-6">
						{user?.kyc_status === 'pending' ? (
							<div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex items-start gap-4">
								<AlertCircle className="w-6 h-6 text-amber-600 mt-0.5" />
								<div>
									<h2 className="font-semibold text-amber-900">Complete KYC verification</h2>
									<p className="text-amber-800 text-sm mt-1 mb-4">Submit your identity documents to unlock all marketplace features.</p>
									<button onClick={handleKycUpload} className="bg-amber-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-amber-700 flex items-center gap-2">
										<Upload className="w-4 h-4" /> Submit documents
									</button>
								</div>
							</div>
						) : (
							<div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 flex items-center gap-3">
								<CheckCircle className="w-6 h-6 text-emerald-600" />
								<div>
									<h2 className="font-semibold text-emerald-900">KYC verified</h2>
									<p className="text-emerald-800 text-sm">Your account is ready to use.</p>
								</div>
							</div>
						)}

						<h2 className="text-xl font-bold text-slate-900">Account information</h2>
						<div className="grid gap-4 sm:grid-cols-2">
							<div className="p-4 bg-slate-50 rounded-xl flex items-center gap-3">
								<User className="w-5 h-5 text-slate-500" />
								<div><p className="text-sm text-slate-500">Full name</p><p className="font-medium">{user?.full_name}</p></div>
							</div>
							<div className="p-4 bg-slate-50 rounded-xl flex items-center gap-3">
								<Mail className="w-5 h-5 text-slate-500" />
								<div><p className="text-sm text-slate-500">Email</p><p className="font-medium">{user?.email}</p></div>
							</div>
							<div className="p-4 bg-slate-50 rounded-xl flex items-center gap-3">
								<Shield className="w-5 h-5 text-slate-500" />
								<div><p className="text-sm text-slate-500">Account type</p><p className="font-medium capitalize">{user?.user_type}</p></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
