import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import plotRoutes from './routes/plots.js';
import marketRoutes from './routes/market.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/terravilla')
	.then(() => console.log('MongoDB connected successfully'))
	.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/plots', plotRoutes);
app.use('/api/market', marketRoutes);

// Basic route
app.get('/api/health', (req, res) => {
	res.json({ status: 'ok', message: 'Backend is running' });
});

// Start server
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
