import mongoose from 'mongoose';

const PlotSchema = new mongoose.Schema({
	seller_id: { type: String, required: true },
	seller_name: { type: String, required: true },
	seller_phone: { type: String, required: true },
	owner_name: { type: String, required: true },
	owner_aadhaar: { type: String },
	property_owner_name: { type: String },
	owner_verified: { type: Boolean, default: false },
	documents: [{ type: String }], // Array of document URLs
	title: { type: String, required: true },
	description: { type: String, required: true },
	location_address: { type: String, required: true },
	city: { type: String, required: true },
	state: { type: String, required: true },
	latitude: { type: Number },
	longitude: { type: Number },
	length_ft: { type: Number, required: true },
	width_ft: { type: Number, required: true },
	area_sqft: { type: Number, required: true },
	price: { type: Number, required: true },
	price_per_sqft: { type: Number, required: true },
	status: { type: String, enum: ['available', 'sold', 'pending_verification', 'verified'], default: 'available' },
	verification_status: { type: String, enum: ['unverified', 'pending', 'verified', 'rejected'], default: 'unverified' },
	blockchain_hash: { type: String },
	images: [{ type: String }], // Array of image URLs
}, {
	timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

export default mongoose.model('Plot', PlotSchema);
