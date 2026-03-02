# TerraVilla

TerraVilla is a broker-free land marketplace prototype where buyers and sellers can discover, list, and manage property transactions with a clean modern UI and mock verification/payment flows.

This app is currently frontend-focused and uses local mock data plus `localStorage` for persistence.

---

## Project Overview

TerraVilla aims to simplify land transactions by:

- Reducing dependency on brokers
- Showing transparent pricing and market insights
- Simulating identity verification and listing workflows
- Providing separate buyer and seller experiences in one app

The project is built with React + Vite and styled with Tailwind CSS.

---

## Tech Stack

### Core

- React 18
- Vite 5
- JavaScript (JSX)

### UI & Styling

- Tailwind CSS
- Lucide React (icons)

### Tooling

- ESLint
- PostCSS + Autoprefixer

### Backend/Database Status

- Supabase dependency and SQL migration are present in the repository
- Current app behavior is mock/local (no active API wiring yet)

---

## Main Features

- **Authentication UI flow**
	- Login/signup screens
	- Mock OTP generation and verification
	- Session persisted in `localStorage`

- **Buyer experience**
	- Search verified property listings
	- Filter by city, state, and price range
	- View listing details and seller contact info

- **Seller experience**
	- Multi-step property listing form
	- Owner details + document upload simulation
	- Listing fee payment simulation
	- Seller listing management (view/delete)

- **Market insights**
	- Region-wise comparison cards
	- Recent listing table with basic trend indicators

- **Profile management**
	- Edit basic profile fields
	- Simulated KYC status update

- **Ad sidebar**
	- Static ad cards for construction ecosystem context

---

## Project Structure

```text
src/
	components/
		Ads/
		Auth/
		Home/
		Market/
		Payment/
		Profile/
		Search/
		Seller/
		Navbar.jsx
	context/
		AuthContext.jsx
	data/
		mockData.js
	utils/
		plotUtils.js
		priceFormatters.js
	App.jsx
	main.jsx
	index.css
```

---

## Getting Started

### Prerequisites

- Node.js 18+ recommended
- npm 9+

### Installation

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Then open the local URL shown in terminal (usually `http://localhost:5173`).

---

## Available Scripts

- `npm run dev` → Start Vite dev server
- `npm run build` → Create optimized production build
- `npm run preview` → Serve the production build locally
- `npm run lint` → Run ESLint across the codebase

---

## Authentication Flow (Current)

Authentication is mocked in `AuthContext`:

- OTPs are generated in frontend code
- OTPs are shown via `alert()` for demo/testing
- No real SMS/email gateway is connected
- No secure backend token/session flow yet

This is suitable for UI prototyping only.

---


