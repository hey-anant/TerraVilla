import cloudinary, { configureCloudinary } from '../config/cloudinary.js';
import ImageAsset from '../models/ImageAsset.js';
import { findDuplicate, inspectImage } from './imageValidation.js';

function uploadToCloudinary(buffer) {
	return new Promise((resolve, reject) => {
		const stream = cloudinary.uploader.upload_stream({
			folder: 'terravilla/mock-properties',
			resource_type: 'image',
			use_filename: false,
			unique_filename: true
		}, (error, result) => error ? reject(error) : resolve(result));
		stream.end(buffer);
	});
}

export async function storeMockImage(url, ownerId) {
	const response = await fetch(url);
	if (!response.ok) throw new Error(`Unable to download mock image (${response.status})`);

	const buffer = Buffer.from(await response.arrayBuffer());
	const inspection = await inspectImage(buffer, response.headers.get('content-type'));
	const duplicate = await findDuplicate(inspection);
	if (duplicate) return duplicate.asset;

	const uploaded = await uploadToCloudinary(buffer);
	return ImageAsset.create({
		owner_id: ownerId,
		public_id: uploaded.public_id,
		url: uploaded.url,
		secure_url: uploaded.secure_url,
		...inspection
	});
}

export async function storeMockImages(urls, ownerId) {
	configureCloudinary();
	const assets = [];
	for (const url of urls) {
		assets.push(await storeMockImage(url, ownerId));
	}
	return assets;
}
