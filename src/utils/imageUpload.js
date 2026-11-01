import { apiRequest } from '../lib/api';

export async function uploadPropertyImages(files) {
	const formData = new FormData();
	files.forEach((file) => formData.append('images', file));

	return apiRequest('/images/upload', {
		method: 'POST',
		body: formData
	});
}
