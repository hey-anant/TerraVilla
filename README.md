# TerraVilla

TerraVilla is a broker-free land marketplace prototype where buyers and sellers can discover, list, and manage property transactions with a modern React UI.

The app is currently frontend-focused and uses mock data + `localStorage` persistence.

## Overview

TerraVilla is designed to make land transactions more transparent by:

- Reducing broker dependency
- Showing market pricing insights
- Simulating verification and listing workflows
- Supporting buyer and seller flows in one product

## Tech Stack

### Core
- React 18
- Vite 5
- JavaScript (JSX)

### Styling/UI
- Tailwind CSS
- Lucide React

### Tooling
- ESLint (flat config)
- PostCSS + Autoprefixer

### Language Status
- JavaScript + JSX only
- No TypeScript files or TypeScript dev dependencies


## Features

- OTP-based mock auth flow (login/signup)
- Property search with city/state/price filters
- Property detail modal and seller contact CTA
- Seller listing workflow with multi-step form
- Mock document/image upload + mock listing fee payment
- Seller listing management (view/delete)
- Market insights section with recent listings
- Profile page with mock KYC flow

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
supabase/
  migrations/
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Install

```bash
npm install
```

### Start Dev Server

```bash
npm run dev
```

Open the URL shown in terminal (typically `http://localhost:5173`).

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## Data and Persistence

Current storage model:

- Initial listings come from `src/data/mockData.js`
- Runtime listing operations are in `src/utils/plotUtils.js`
- Listings persist in `localStorage` key: `terraVillaPlots`
- Session user persists in `localStorage` key: `user`

To reset app state during testing, clear browser local storage.

## Notes

- This project intentionally runs on React + JavaScript only.
- If you clone fresh, run `npm install` to sync lockfile and dependencies.


