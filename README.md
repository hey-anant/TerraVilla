
# TerraVilla Real Estate Platform

TerraVilla is a premium, secure, peer-to-peer land transaction platform designed to enable transparent and direct land deals. It removes the middleman by providing zero broker fees, maximum transparency, automated government record verification checks, and escrow transaction pathways.

---

## 🛠️ Technology Stack

- **Frontend**: React (Vite, Javascript, HTML5)
- **Styling**: Tailwind CSS (v3.4) & Vanilla CSS for premium micro-animations
- **Icons**: Lucide React
- **BaaS Backend**: **InsForge**
  - **Database**: PostgreSQL (PostgREST API)
  - **Authentication**: Email/Password + Google OAuth (Gmail)
  - **Realtime**: WebSockets

---

## ⚡ Key Features

1. **Dual OTP Signup Verification**: Requires verification codes sent to both the user's email (via InsForge server) and phone (via simulated 6-digit OTP code) to activate an account.
2. **Profile Syncing & Roles**: Automatically creates and synchronizes user profile records in the InsForge PostgreSQL `users` table on registration or first-time Google OAuth sign-in. User role (`user_type` = `buyer`, `seller`, or `both`) controls visibility of listing features.
3. **Change Password via OTP**: Change account passwords securely by triggering an email verification code and resetting via InsForge.
4. **10-Digit Phone Verification**: Update and verify a new 10-digit phone number with country code via OTP verification before saving to the database.
5. **Government KYC checks**: Seamless workflow to submit government IDs for KYC checks.
6. **Property Listing Escrow**: Listing dashboard allowing sellers to upload photos/deeds, pay a simulated ₹500 listing verification fee, and instantly list plots.
7. **Escrow Transactions**: Secure peer-to-peer escrow payments for buying and selling property listings.

---

## 🔄 Project Workflows

### 1. User Registration & Sync Workflow

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant App as React Frontend
    participant Auth as InsForge Auth
    participant DB as InsForge PostgreSQL (users)

    User->>App: Input registration details (Email, Phone, Name, etc.)
    App->>Auth: Call signUp(email, password, name)
    Auth-->>App: Returns requireEmailVerification = true
    App->>User: Sends Email code (Auth) & Phone OTP (Alert)
    User->>App: Input 6-digit Email code and Phone OTP
    App->>Auth: Call verifyEmail(email, code)
    Auth-->>App: Returns user session token
    App->>App: Validate Phone OTP matches cached code
    App->>DB: Insert profile data to 'users' table (using auth user ID)
    DB-->>App: Record created successfully
    App->>User: Authentication successful, redirects to Dashboard
```

---

### 2. Google OAuth Sign-In & Sync Workflow

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant App as React Frontend
    participant Auth as InsForge Auth
    participant DB as InsForge PostgreSQL (users)

    User->>App: Click "Sign In with Google"
    App->>Auth: Redirect to Google Consent screen
    User->>Auth: Authorizes account
    Auth-->>App: Redirects back to App with auth code
    App->>Auth: Exchange code for user session (Automatic)
    App->>DB: Query profile from 'users' table by ID
    alt Profile exists
        DB-->>App: Return user profile
        App->>User: Set authenticated session
    else First Time Sign-in
        DB-->>App: Return null
        App->>DB: Insert profile (Name, Email, default values)
        DB-->>App: Record created
        App->>User: Set authenticated session
    end
```

---

### 3. Password Reset & Change Workflow

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant App as React Frontend
    participant Auth as InsForge Auth

    User->>App: Navigate to Profile -> Click "Change Password"
    App->>Auth: Call sendPasswordResetOTP(email)
    Auth-->>App: Sends 6-digit verification code to Email
    App->>User: Prompts for code and new password
    User->>App: Submit code and new password
    App->>Auth: Call exchangeResetPasswordToken(email, code)
    Auth-->>App: Returns reset token
    App->>Auth: Call resetPassword(newPassword, token)
    Auth-->>App: Returns password reset success message
    App->>User: Show success, close change password modal
```

---

### 4. Phone Number Update & Verification Workflow

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant App as React Frontend
    participant DB as InsForge PostgreSQL (users)

    User->>App: Profile Page -> Input 10-digit number & country code
    App->>App: Validate number (must be 10 digits)
    App->>User: Alert simulated 6-digit OTP code to screen
    User->>App: Input code into confirmation box
    App->>App: Verify code matches cached session OTP
    App->>DB: Call update({ phone: 'fullNumber' }).eq('id', userId)
    DB-->>App: Returns updated profile
    App->>User: Update UI state & notify user of success
```

---

### 5. Property Listing & Payment Verification Workflow

```mermaid
sequenceDiagram
    autonumber
    actor Seller as Seller / Owner
    participant App as React Frontend
    participant DB as InsForge PostgreSQL (plots)
    participant Payment as Payment Gateway (Simulated)

    Seller->>App: Seller Dashboard -> Input plot details (Dimensions, Title, Address)
    App->>App: Auto-calculate area_sqft (length * width)
    App->>App: Compare owner name with property documents name
    Seller->>App: Upload plot photos and verification documents
    Seller->>App: Click "Submit for Verification"
    App->>DB: Insert plot record (status: pending_verification, verification_status: pending)
    DB-->>App: Plot created, returns ID
    App->>App: Show simulated ₹500 fee modal
    Seller->>Payment: Inputs details & clicks Pay
    Payment-->>App: Payment successful
    App->>DB: Update plot (status: verified, verification_status: verified)
    DB-->>App: Plot updated
    App->>Seller: Display success notification
```

---

## 🚀 Running the Project

### Prerequisites
1. Node.js installed on your machine.
2. An InsForge BaaS project credentials.

### Environment Setup
Create a `.env` file in the root directory:
```env
VITE_INSFORGE_URL=https://your-insforge-app-url.app
VITE_INSFORGE_ANON_KEY=your-anon-key-here
```

### Installation
Install the required packages:

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


### Run Locally
Launch the Vite local development server:

### Start Dev Server


```bash
npm run dev
```


### Build Production Bundle
To compile and bundle assets for production:
```bash
npm run build
```
The built assets will be exported to the `/dist` directory.

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



