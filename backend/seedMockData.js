import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { mockPlots, mockPriceComparisons } from '../src/data/mockData.js';
import Plot from './models/Plot.js';
import PriceComparison from './models/PriceComparison.js';
import ImageAsset from './models/ImageAsset.js';
import { storeMockImages } from './services/mockDataStorage.js';

dotenv.config();

function requireCloudinaryConfig() {
	const names = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
	const missing = names.filter((name) => !process.env[name]);
	if (missing.length) throw new Error(`Missing environment variables: ${missing.join(', ')}`);
}

async function seedMockData() {
	requireCloudinaryConfig();
	await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/terravilla');
	await Plot.deleteMany({ seller_id: /^mock-/ });
	await ImageAsset.deleteMany({ owner_id: /^mock-/ });

	const plots = [];
	for (const sourcePlot of mockPlots) {
		const ownerId = `mock-${sourcePlot.seller_id}`;
		const assets = await storeMockImages(sourcePlot.images, ownerId);
		const plot = { ...sourcePlot };
		delete plot.id;
		delete plot.owner_aadhaar;
		delete plot.images;
		plots.push({
			...plot,
			seller_id: ownerId,
			seller_email: `${sourcePlot.seller_id}@mock.terravilla.local`,
			images: assets.map((asset) => asset.secure_url),
			image_ids: assets.map((asset) => asset._id)
		});
	}

	await Plot.insertMany(plots);
	await PriceComparison.deleteMany({});
	await PriceComparison.insertMany(mockPriceComparisons);
	console.log(`Seeded ${plots.length} mock plots and ${plots.reduce((total, plot) => total + plot.images.length, 0)} Cloudinary images`);
}

seedMockData()
	.catch((error) => {
		console.error('Mock data seeding failed:', error);
		process.exitCode = 1;
	})
	.finally(() => mongoose.disconnect());
