const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export async function apiRequest(path, options = {}) {
	const token = localStorage.getItem('terravilla_token');
	const isFormData = options.body instanceof FormData;
	const response = await fetch(`${API_URL}${path}`, {
		...options,
		headers: {
			...(isFormData ? {} : { 'Content-Type': 'application/json' }),
			...(token ? { Authorization: `Bearer ${token}` } : {}),
			...options.headers
		}
	});

	const body = await response.json().catch(() => ({}));
	if (!response.ok) throw new Error(body.message || 'Request failed');
	return body;
}

export { API_URL };
