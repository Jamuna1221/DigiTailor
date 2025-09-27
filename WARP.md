# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

Project overview
- Frontend: React + Vite app in Project/ with Tailwind CSS and React Router. Uses Cart and Wishlist contexts, role-based routing, and UI widgets (WhatsApp, Chatbot).
- Backend: Express 5 app in backend/ with CORS, Helmet, Morgan, JWT-protected routes, health/info endpoints, and static file serving from /uploads.
- Root: A package.json exists but development happens inside Project/ and backend/ separately.

Environment variables (backend)
- Required/used by code:
  - MONGODB_URI: MongoDB connection string (used by scripts/createAdmin.js and database connection).
  - FRONTEND_URL: e.g. http://localhost:5173 for local CORS and static file headers.
  - PORT: default 5000.
  - NODE_ENV: optional; toggles error detail.
- Place these in backend/.env (dotenv is initialized in server.js). Do not commit secrets.

Install dependencies
- Frontend:
  - npm install --prefix Project
- Backend:
  - npm install --prefix backend

Common development commands
- Run frontend (Vite dev server):
  - npm run dev --prefix Project
  - Preview built app: npm run preview --prefix Project
- Build frontend:
  - npm run build --prefix Project
- Lint frontend:
  - npm run lint --prefix Project
- Run backend (development with nodemon):
  - npm run dev --prefix backend
- Run backend (production mode):
  - npm start --prefix backend
- Seed admin user (requires MONGODB_URI):
  - npm run create-admin --prefix backend

Testing
- No test runners are configured. Project/package.json does not define a test script; backend/package.json includes a placeholder that exits with error. Running a single test is not applicable at this time.

How to run locally (two terminals)
- Terminal 1 (backend):
  - Ensure backend/.env contains MONGODB_URI and FRONTEND_URL
  - npm run dev --prefix backend
  - Backend starts on http://localhost:5000; health at /api/health and docs at /api
- Terminal 2 (frontend):
  - npm run dev --prefix Project
  - Frontend on http://localhost:5173

Key URLs and endpoints (backend)
- Health: GET http://localhost:5000/api/health
- API index/docs: GET http://localhost:5000/api
- Public routes mounted: /api/auth, /api/catalog, /api/categories, /api/homepage, /api/gallery, /api/contact, /api/admin
- Protected routes (JWT): /api/wishlist, /api/measurements, /api/profile, /api/orders, /api/products
- Static uploads: http://localhost:5000/uploads/ (CORS headers set; directories created on server start)

High-level architecture
- Frontend (Project/):
  - Vite + React with Tailwind CSS (tailwind.config.js; postcss.config.js)
  - Entry: src/main.jsx renders <App/>
  - App-level routing (src/App.jsx):
    - React Router with routes for home, login, signup, catalog, product details, AI studio, contact, gallery, forgot/reset password, checkout, orders, OAuth result pages
    - Role-based route protection via ProtectedRoute component using localStorage user (roles: customer, tailor, admin)
    - Nested admin route at /admin with AdminLayout and pages for dashboard, catalog, gallery, users, orders
    - Tailor dashboard at /tailor/dashboard
  - State/contexts:
    - CartProvider (default export) and WishlistProvider (named export) wrap the app
  - UI composition:
    - Header/Footer, domain-specific components under src/components/* (admin, dashboard, design, product, etc.) and pages under src/pages/*
- Backend (backend/):
  - Express 5 app (server.js) with:
    - Core middleware: express.json/urlencoded, CORS (origin whitelist uses FRONTEND_URL), Helmet with CSP, Morgan logging
    - Custom request logging middleware
    - Static file serving at /uploads with explicit headers and content-types
    - Health and info endpoints: /api/health, /api, /api/test, /api/uploads/info, /api/uploads/test
    - Route mounting for public and protected APIs; auth middleware protect applied to protected routes
    - Centralized error handling (validation, duplicate keys, JWT, multer) and a 404 handler
    - Graceful shutdown handlers and directory bootstrapping for uploads/profiles
  - Additional modules referenced:
    - Database connection: ./config/database.js (called via connectDB())
    - Auth middleware: ./middlewares/auth.middleware.js (exports protect)
    - Route modules: ./routes/*.routes.js (auth, catalog, category, adminAuth, order, homepage, gallery, contact, product, wishlist, measurement, profile)
  - Scripts: scripts/createAdmin.js connects to MongoDB and creates a default admin user; requires MONGODB_URI

Notes from existing READMEs
- Project/README.md indicates this app started from the React + Vite template with ESLint. No extra project-specific commands are documented there.

CI/CD and tooling
- No CLAUDE.md, Cursor rules, or Copilot instruction files found.
- No workspace/monorepo tooling detected; frontend and backend are managed independently via their own package.json files.
