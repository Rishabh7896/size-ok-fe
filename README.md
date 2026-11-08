# sizeok — Universal Fit Assistant (Web Frontend)

Responsive web frontend for the **sizeok** universal clothing-size recommendation platform.

## Tech Stack

- **Framework:** React 19 + TypeScript
- **Build Tool:** Vite 6
- **Styling:** Plain CSS (responsive desktop, tablet, and mobile layouts)

## Prerequisites

- **Node.js:** v20+
- **npm:** v10+
- **Backend API:** Running on `http://localhost:8080` (proxied automatically in development)

## Getting Started

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Configure environment variables (optional):**

   Copy the example environment file if you need to override the default API base URL:

   ```bash
   cp .env.example .env.local
   ```

   By default, requests use `/api/v1`, which Vite proxies to `http://localhost:8080` during local development (see `vite.config.ts`).

3. **Start the development server:**

   ```bash
   npm run dev
   ```

   Open the local URL printed by Vite (typically `http://localhost:5173`).

## Available Scripts

- `npm run dev` — Start the Vite development server with hot module replacement
- `npm run build` — Type-check with TypeScript (`tsc -b`) and create a production build in `dist/`
- `npm run preview` — Preview the production build locally

## Features

- User authentication (email/password & OAuth provider integration)
- Household profiles: create, edit, switch, and remove profiles
- Body measurement history and unit preferences (`cm` / `in`)
- Reference brand/category size management
- Product URL ingestion, size-chart extraction confirmation, and manual chart entry
- Personalized size recommendations and fit confidence breakdowns
- Post-purchase fit feedback and user privacy/data export controls

