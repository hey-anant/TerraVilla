import crypto from 'node:crypto';
import sharp from 'sharp';
import ImageAsset from '../models/ImageAsset.js';

const MAX_FILE_BYTES = 10 * 1024 * 1024;
const MAX_PERCEPTUAL_DISTANCE = 6;

function hammingDistance(left, right) {
	if (left.length !== right.length) return Number.MAX_SAFE_INTEGER;
	let distance = 0;
	for (let index = 0; index < left.length; index += 1) {
		distance += (parseInt(left[index], 16) ^ parseInt(right[index], 16))
			.toString(2)
			.split('1').length - 1;
	}
	return distance;
}

async function createDHash(buffer) {
	const { data } = await sharp(buffer)
		.resize(9, 8, { fit: 'fill' })
		.grayscale()
		.raw()
		.toBuffer({ resolveWithObject: true });

	let hash = '';
	for (let row = 0; row < 8; row += 1) {
		for (let column = 0; column < 8; column += 1) {
			const current = data[row * 9 + column];
			const next = data[row * 9 + column + 1];
			hash += current > next ? '1' : '0';
		}
	}

	return BigInt(`0b${hash}`).toString(16).padStart(16, '0');
}

export async function inspectImage(buffer, mimetype) {
	if (!buffer?.length || buffer.length > MAX_FILE_BYTES) {
		throw new Error('Image must be between 1 byte and 10 MB');
	}
	if (!mimetype?.startsWith('image/')) {
		throw new Error('Only image files are allowed');
	}

	const metadata = await sharp(buffer).metadata();
	if (!metadata.width || !metadata.height || !metadata.format) {
		throw new Error('Image is not valid or cannot be decoded');
	}
	if (metadata.width < 200 || metadata.height < 200) {
		throw new Error('Image must be at least 200 x 200 pixels');
	}

	return {
		sha256: crypto.createHash('sha256').update(buffer).digest('hex'),
		dhash: await createDHash(buffer),
		bytes: buffer.length,
		width: metadata.width,
		height: metadata.height,
		format: metadata.format
	};
}

export async function findDuplicate(image) {
	const exact = await ImageAsset.findOne({ sha256: image.sha256 }).lean();
	if (exact) return { asset: exact, type: 'exact' };

	const candidates = await ImageAsset.find({}, { dhash: 1, public_id: 1, url: 1, secure_url: 1 }).lean();
	const match = candidates.find((candidate) =>
		hammingDistance(image.dhash, candidate.dhash) <= MAX_PERCEPTUAL_DISTANCE
	);
	return match ? { asset: match, type: 'similar' } : null;
}
