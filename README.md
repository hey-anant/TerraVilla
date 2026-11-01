# TerraVilla

TerraVilla is a React marketplace prototype for transparent, broker-free land transactions.

## Stack

- React 18 + Vite
- Tailwind CSS 3
- Express + MongoDB
- JWT sessions
- Email/password and Google sign-in
- Cloudinary image storage with MongoDB SHA-256 and perceptual-hash duplicate checks

## Project layout

```text
src/
  components/   UI grouped by feature
  context/      React application state
  lib/          API client helpers
  utils/        Reusable data operations
backend/
  middleware/   Authentication middleware
  models/       MongoDB schemas
  routes/       HTTP API routes
```

## Local setup

### Frontend

```bash
npm install
npm run dev
```

### Backend

```bash
cd backend
npm install
node server.js
```

Copy [backend/.env.example](./backend/.env.example) to `backend/.env` and fill
in the values locally:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/terravilla
JWT_SECRET=replace-with-a-long-random-secret
GOOGLE_CLIENT_ID=your-google-web-client-id
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
PORT=5000
```

Copy [.env.example](./.env.example) to `.env` for the Vite app:

```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your-google-web-client-id
```

The Google client ID must be configured in both files. Add the frontend origin to the
authorized JavaScript origins in Google Cloud Console.

Never commit `.env` files, API keys, JWT secrets, MongoDB credentials, or
Cloudinary secrets. The repository ignores local environment files; rotate any
credential that was previously exposed.

## API

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/google`
- `GET /api/auth/me`
- `PATCH /api/auth/me`
- `POST /api/images/upload` (multipart field: `images`, max 10 files, 10 MB each)
- `GET /api/plots`
- `POST /api/plots`

Authenticated requests send `Authorization: Bearer <jwt>`. Tokens are stored in the
browser only to keep the prototype simple; production deployments should consider
secure, http-only cookies and stricter authorization on write routes.

## Image verification

Property images are validated on the backend before storage. Sharp confirms that
the file is a decodable image with valid dimensions, SHA-256 detects exact
re-uploads, and a perceptual dHash detects resized or lightly edited copies.
Validated files are uploaded to Cloudinary and their URL/hash metadata is stored
in MongoDB. A duplicate receives HTTP `409` and is not uploaded again.

This verifies file integrity and duplicate status; it cannot prove who originally
took an image or establish legal ownership of a property.

## Seed mock data

The canonical mock records remain in [`src/data/mockData.js`](./src/data/mockData.js).
To store those records in MongoDB and move their external images into Cloudinary:

```bash
cd backend
npm run seed:mock
```

The seeder hashes every downloaded image, reuses an existing matching
`ImageAsset`, uploads new images to Cloudinary, and stores the resulting URLs and
MongoDB image IDs on each plot. It removes only records whose `seller_id` starts
with `mock-`, so user-created listings are preserved.

## Scripts

```bash
npm run dev
npm run build
npm run lint
```
