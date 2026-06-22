import express from 'express';
import Plot from '../models/Plot.js';

const router = express.Router();

// Get all plots
router.get('/', async (req, res) => {
	try {
		const plots = await Plot.find();
		res.json(plots);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// Get single plot
router.get('/:id', async (req, res) => {
	try {
		const plot = await Plot.findById(req.params.id);
		if (!plot) return res.status(404).json({ message: 'Plot not found' });
		res.json(plot);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// Create new plot
router.post('/', async (req, res) => {
	const plot = new Plot(req.body);
	try {
		const newPlot = await plot.save();
		res.status(201).json(newPlot);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

// Update a plot
router.patch('/:id', async (req, res) => {
	try {
		const plot = await Plot.findByIdAndUpdate(
			req.params.id,
			{ $set: req.body },
			{ new: true, runValidators: true }
		);
		if (!plot) return res.status(404).json({ message: 'Plot not found' });
		res.json(plot);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

export default router;
