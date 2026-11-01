import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	password_hash: { type: String },
	google_id: { type: String, sparse: true },
	auth_provider: { type: String, enum: ['password', 'google'], required: true },
	role: { type: String, enum: ['buyer', 'seller', 'both', 'admin'], default: 'buyer' },
	verification_status: { type: String, enum: ['unverified', 'pending', 'verified', 'rejected'], default: 'unverified' },
	aadhaar_number: { type: String },
	created_at: { type: Date, default: Date.now }
});

export default mongoose.model('User', UserSchema);
