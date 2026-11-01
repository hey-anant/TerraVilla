import express from 'express';
import bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';
import { createToken, requireAuth } from '../middleware/auth.js';

const router = express.Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

function publicUser(user) {
	return {
		id: user._id.toString(),
		full_name: user.name,
		email: user.email,
		user_type: user.role,
		kyc_status: user.verification_status === 'verified' ? 'verified' : 'pending'
	};
}

function validateCredentials(email, password) {
	return typeof email === 'string' && email.includes('@') &&
		typeof password === 'string' && password.length >= 6;
}

router.post('/signup', async (req, res) => {
	const { email, password, name, userType = 'buyer' } = req.body;
	if (!validateCredentials(email, password) || !name?.trim()) {
		return res.status(400).json({ message: 'Name, a valid email, and a password of at least 6 characters are required' });
	}

	try {
		const existingUser = await User.findOne({ email: email.toLowerCase() });
		if (existingUser) return res.status(409).json({ message: 'An account with this email already exists' });

		const user = await User.create({
			name: name.trim(),
			email: email.toLowerCase(),
			password_hash: await bcrypt.hash(password, 12),
			role: ['buyer', 'seller', 'both'].includes(userType) ? userType : 'buyer',
			auth_provider: 'password',
			verification_status: 'pending'
		});

		return res.status(201).json({ token: createToken(user), user: publicUser(user) });
	} catch (error) {
		console.error('Signup failed:', error);
		return res.status(500).json({ message: 'Unable to create account' });
	}
});

router.post('/login', async (req, res) => {
	const { email, password } = req.body;
	if (!validateCredentials(email, password)) {
		return res.status(400).json({ message: 'Enter a valid email and password' });
	}

	try {
		const user = await User.findOne({ email: email.toLowerCase() });
		if (!user?.password_hash || !(await bcrypt.compare(password, user.password_hash))) {
			return res.status(401).json({ message: 'Invalid email or password' });
		}
		return res.json({ token: createToken(user), user: publicUser(user) });
	} catch (error) {
		console.error('Login failed:', error);
		return res.status(500).json({ message: 'Unable to sign in' });
	}
});

router.post('/google', async (req, res) => {
	if (!process.env.GOOGLE_CLIENT_ID) {
		return res.status(503).json({ message: 'Google login is not configured' });
	}

	try {
		const ticket = await googleClient.verifyIdToken({
			idToken: req.body.credential,
			audience: process.env.GOOGLE_CLIENT_ID
		});
		const payload = ticket.getPayload();
		if (!payload?.email || !payload.email_verified) {
			return res.status(401).json({ message: 'Google account email is not verified' });
		}

		let user = await User.findOne({ email: payload.email.toLowerCase() });
		if (!user) {
			user = await User.create({
				name: payload.name || payload.email.split('@')[0],
				email: payload.email.toLowerCase(),
				google_id: payload.sub,
				auth_provider: 'google',
				verification_status: 'verified'
			});
		} else if (!user.google_id) {
			user.google_id = payload.sub;
			user.auth_provider = 'google';
			await user.save();
		}

		return res.json({ token: createToken(user), user: publicUser(user) });
	} catch (error) {
		console.error('Google login failed:', error);
		return res.status(401).json({ message: 'Google sign-in could not be verified' });
	}
});

router.get('/me', requireAuth, async (req, res) => {
	try {
		const user = await User.findById(req.auth.sub);
		if (!user) return res.status(404).json({ message: 'User not found' });
		return res.json({ user: publicUser(user) });
	} catch (error) {
		console.error('Loading current user failed:', error);
		return res.status(500).json({ message: 'Unable to load account' });
	}
});

router.patch('/me', requireAuth, async (req, res) => {
	const allowedUpdates = {};
	if (typeof req.body.name === 'string' && req.body.name.trim()) allowedUpdates.name = req.body.name.trim();
	if (['buyer', 'seller', 'both'].includes(req.body.role)) allowedUpdates.role = req.body.role;
	if (req.body.verification_status === 'verified') allowedUpdates.verification_status = 'verified';

	try {
		const user = await User.findByIdAndUpdate(req.auth.sub, allowedUpdates, { new: true, runValidators: true });
		if (!user) return res.status(404).json({ message: 'User not found' });
		return res.json({ user: publicUser(user) });
	} catch (error) {
		console.error('Updating profile failed:', error);
		return res.status(400).json({ message: 'Unable to update profile' });
	}
});

export default router;
