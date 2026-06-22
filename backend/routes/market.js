import express from 'express';
import PriceComparison from '../models/PriceComparison.js';

const router = express.Router();

// Get all price comparisons
router.get('/', async (req, res) => {
	try {
		const prices = await PriceComparison.find();
		res.json(prices);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

export default router;
