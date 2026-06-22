import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Plot from './models/Plot.js';

dotenv.config();

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/terravilla')
	.then(() => console.log('MongoDB connected successfully'))
	.catch(err => console.error('MongoDB connection error:', err));

const newPlots = [
	{
		seller_id: '7',
		seller_name: 'Anjali Desai',
		seller_phone: '+91 9888777666',
		owner_name: 'Anjali Desai',
		owner_aadhaar: '7890-1234-5678',
		property_owner_name: 'Anjali Desai',
		owner_verified: true,
		documents: [],
		title: 'Sea View Plot in Andheri West',
		description: 'Premium sea-facing plot in a quiet residential neighborhood. Perfect for a luxury villa.',
		location_address: 'Lokhandwala Complex, Andheri West',
		city: 'Mumbai',
		state: 'Maharashtra',
		latitude: 19.1416,
		longitude: 72.8229,
		length_ft: 60,
		width_ft: 50,
		area_sqft: 3000,
		price: 85000000,
		price_per_sqft: 28333,
		status: 'verified',
		verification_status: 'verified',
		blockchain_hash: '0x7g8h9i0j1k2l3m4n5o6p',
		images: [
			'https://images.pexels.com/photos/1131573/pexels-photo-1131573.jpeg?auto=compress&cs=tinysrgb&w=800'
		]
	},
	{
		seller_id: '8',
		seller_name: 'Rahul Gupta',
		seller_phone: '+91 9777666555',
		owner_name: 'Rahul Gupta',
		owner_aadhaar: '8901-2345-6789',
		property_owner_name: 'Rahul Gupta',
		owner_verified: true,
		documents: [],
		title: 'Commercial Land near Connaught Place',
		description: 'Prime commercial land with great connectivity. Ideal for an office building or retail space.',
		location_address: 'Barakhamba Road',
		city: 'New Delhi',
		state: 'Delhi',
		latitude: 28.6304,
		longitude: 77.2177,
		length_ft: 100,
		width_ft: 80,
		area_sqft: 8000,
		price: 250000000,
		price_per_sqft: 31250,
		status: 'verified',
		verification_status: 'verified',
		blockchain_hash: '0x8h9i0j1k2l3m4n5o6p7q',
		images: [
			'https://images.pexels.com/photos/380768/pexels-photo-380768.jpeg?auto=compress&cs=tinysrgb&w=800'
		]
	},
	{
		seller_id: '9',
		seller_name: 'Karthik Krishnan',
		seller_phone: '+91 9666555444',
		owner_name: 'Karthik Krishnan',
		owner_aadhaar: '9012-3456-7890',
		property_owner_name: 'Karthik Krishnan',
		owner_verified: true,
		documents: [],
		title: 'Residential Plot in OMR',
		description: 'Well-located residential plot on Old Mahabalipuram Road. Close to major IT corridors.',
		location_address: 'Navalur, OMR',
		city: 'Chennai',
		state: 'Tamil Nadu',
		latitude: 12.8449,
		longitude: 80.2265,
		length_ft: 50,
		width_ft: 40,
		area_sqft: 2000,
		price: 9000000,
		price_per_sqft: 4500,
		status: 'verified',
		verification_status: 'verified',
		blockchain_hash: '0x9i0j1k2l3m4n5o6p7q8r',
		images: [
			'https://images.pexels.com/photos/1546168/pexels-photo-1546168.jpeg?auto=compress&cs=tinysrgb&w=800'
		]
	},
	{
		seller_id: '10',
		seller_name: 'Pooja Joshi',
		seller_phone: '+91 9555444333',
		owner_name: 'Pooja Joshi',
		owner_aadhaar: '0123-4567-8901',
		property_owner_name: 'Pooja Joshi',
		owner_verified: true,
		documents: [],
		title: 'Corner Plot in Koregaon Park',
		description: 'Exclusive corner plot in the highly sought-after area of Koregaon Park.',
		location_address: 'Koregaon Park',
		city: 'Pune',
		state: 'Maharashtra',
		latitude: 18.5362,
		longitude: 73.8939,
		length_ft: 80,
		width_ft: 60,
		area_sqft: 4800,
		price: 72000000,
		price_per_sqft: 15000,
		status: 'verified',
		verification_status: 'verified',
		blockchain_hash: '0x0j1k2l3m4n5o6p7q8r9s',
		images: [
			'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=800'
		]
	},
	{
		seller_id: '11',
		seller_name: 'Sourav Banerjee',
		seller_phone: '+91 9444333222',
		owner_name: 'Sourav Banerjee',
		owner_aadhaar: '1234-5678-9012',
		property_owner_name: 'Sourav Banerjee',
		owner_verified: true,
		documents: [],
		title: 'Spacious Land in Salt Lake',
		description: 'Large land parcel located in Salt Lake Sector V, ideal for mixed-use development.',
		location_address: 'Sector V, Salt Lake City',
		city: 'Kolkata',
		state: 'West Bengal',
		latitude: 22.5735,
		longitude: 88.4331,
		length_ft: 120,
		width_ft: 100,
		area_sqft: 12000,
		price: 180000000,
		price_per_sqft: 15000,
		status: 'verified',
		verification_status: 'verified',
		blockchain_hash: '0x1k2l3m4n5o6p7q8r9s0t',
		images: [
			'https://images.pexels.com/photos/2131784/pexels-photo-2131784.jpeg?auto=compress&cs=tinysrgb&w=800'
		]
	}
];

const seedDB = async () => {
	try {
		await Plot.insertMany(newPlots);
		console.log('Successfully seeded properties');
		mongoose.connection.close();
	} catch (err) {
		console.error('Error seeding properties:', err);
		mongoose.connection.close();
	}
};

seedDB();
