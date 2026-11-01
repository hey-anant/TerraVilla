import mongoose from 'mongoose';

const ImageAssetSchema = new mongoose.Schema({
	owner_id: { type: String, required: true, index: true },
	public_id: { type: String, required: true },
	url: { type: String, required: true },
	secure_url: { type: String, required: true },
	sha256: { type: String, required: true, unique: true, index: true },
	dhash: { type: String, required: true, index: true },
	bytes: { type: Number, required: true },
	width: { type: Number, required: true },
	height: { type: Number, required: true },
	format: { type: String, required: true },
	created_at: { type: Date, default: Date.now }
});

export default mongoose.model('ImageAsset', ImageAssetSchema);
