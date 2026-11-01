import express from 'express';
import multer from 'multer';
import cloudinary, { configureCloudinary } from '../config/cloudinary.js';
import ImageAsset from '../models/ImageAsset.js';
import { requireAuth } from '../middleware/auth.js';
import { findDuplicate, inspectImage } from '../services/imageValidation.js';

const router = express.Router();
const upload = multer({
	storage: multer.memoryStorage(),
	limits: { files: 10, fileSize: 10 * 1024 * 1024 }
});

function uploadToCloudinary(buffer) {
	return new Promise((resolve, reject) => {
		const stream = cloudinary.uploader.upload_stream({
			folder: 'terravilla/properties',
			resource_type: 'image',
			use_filename: false,
			unique_filename: true
		}, (error, result) => error ? reject(error) : resolve(result));
		stream.end(buffer);
	});
}

router.post('/upload', requireAuth, (req, res, next) => {
	upload.array('images', 10)(req, res, (error) => {
		if (error) return res.status(400).json({ message: error.message || 'Invalid image upload' });
		next();
	});
}, async (req, res) => {
	if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
		return res.status(503).json({ message: 'Cloudinary image storage is not configured' });
	}
	if (!req.files?.length) return res.status(400).json({ message: 'At least one image is required' });

	const uploaded = [];
	try {
		configureCloudinary();
		const inspectedFiles = [];
		for (const file of req.files) {
			const inspection = await inspectImage(file.buffer, file.mimetype);
			const duplicate = await findDuplicate(inspection);
			const batchDuplicate = inspectedFiles.find(({ inspection: previous }) =>
				previous.sha256 === inspection.sha256
			);
			if (duplicate || batchDuplicate) {
				return res.status(409).json({
					message: duplicate?.type === 'exact' || batchDuplicate
						? 'This image has already been uploaded'
						: 'This image is visually similar to an existing upload',
					duplicate: {
						type: duplicate?.type || 'exact',
						url: duplicate?.asset?.secure_url || duplicate?.asset?.url || null
					}
				});
			}
			inspectedFiles.push({ file, inspection });
		}

		for (const { file, inspection } of inspectedFiles) {
			const cloudinaryAsset = await uploadToCloudinary(file.buffer);
			const asset = await ImageAsset.create({
				owner_id: req.auth.sub,
				public_id: cloudinaryAsset.public_id,
				url: cloudinaryAsset.url,
				secure_url: cloudinaryAsset.secure_url,
				...inspection
			});
			uploaded.push(asset);
		}

		return res.status(201).json({
			images: uploaded.map((asset) => ({
				id: asset._id,
				url: asset.secure_url,
				width: asset.width,
				height: asset.height,
				format: asset.format
			}))
		});
	} catch (error) {
		console.error('Image upload validation failed:', error);
		return res.status(400).json({ message: error.message || 'Image upload failed' });
	}
});

export default router;
