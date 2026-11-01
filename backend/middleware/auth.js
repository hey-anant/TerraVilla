import jwt from 'jsonwebtoken';

export function createToken(user) {
	const secret = process.env.JWT_SECRET;
	if (!secret) {
		throw new Error('JWT_SECRET is not configured');
	}

	return jwt.sign(
		{ sub: user._id.toString(), email: user.email, role: user.role },
		secret,
		{ expiresIn: '7d' }
	);
}

export function requireAuth(req, res, next) {
	const token = req.headers.authorization?.replace('Bearer ', '');
	if (!token) {
		return res.status(401).json({ message: 'Authentication required' });
	}

	try {
		req.auth = jwt.verify(token, process.env.JWT_SECRET);
		next();
	} catch {
		return res.status(401).json({ message: 'Invalid or expired token' });
	}
}
