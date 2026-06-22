import mongoose from 'mongoose';

const PriceComparisonSchema = new mongoose.Schema({
	city: { type: String, required: true },
	state: { type: String, required: true },
	area_type: { type: String, enum: ['residential', 'commercial', 'agricultural'], required: true },
	avg_price_per_sqft: { type: Number, required: true },
	min_price_per_sqft: { type: Number, required: true },
	max_price_per_sqft: { type: Number, required: true },
	sample_size: { type: Number, default: 0 },
	last_updated: { type: Date, default: Date.now }
});

export default mongoose.model('PriceComparison', PriceComparisonSchema);
