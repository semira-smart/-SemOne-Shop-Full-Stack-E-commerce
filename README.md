# SemOne Shop — Full‑Stack E‑commerce

SemOne Shop is a full‑stack e‑commerce website built with React (Vite) on the frontend and Node.js/Express/MongoDB on the backend. It supports user registration/login, protected routes, product catalog, cart, orders, and an Admin area (dashboard, products, orders).

## Tech Stack

- Frontend: React 19, Vite, React Router 7, axios, jwt-decode
- Styling: CSS (custom design system)
- Backend: Node.js, Express, Mongoose, JWT, express-validator
- Dev tools: Nodemon, ESLint, @vitejs/plugin-react

## Monorepo Structure

```
fullstack ecommerce/
├─ backend/
│  ├─ src/
│  │  ├─ controllers/       # auth, products, orders, admin
│  │  ├─ middleware/        # auth, error handler
│  │  ├─ models/            # User, Product, Order
│  │  ├─ routes/            # /auth, /products, /orders, /admin
│  │  └─ server.js          # express app
│  ├─ seedAdmin.js          # seed/update admin user
│  ├─ .env                  
│  └─ package.json
└─ frontend/
   ├─ src/                  # pages, components, context, services, styles
   ├─ vite.config.js        # dev proxy to backend
   ├─ .env (optional)       
   └─ package.json
```

## Prerequisites

- Node.js LTS (>= 18)
- A MongoDB instance (Atlas or local)

## Environment Variables

Create `backend/.env`:

```
PORT=5001
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/<db>?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_here
```

Notes:
- Do not commit `.env` files. Keep secrets private.
- Cloudinary is not required in this project (no direct usage). If you later add image uploads, you can introduce `CLOUDINARY_*` variables then.

## Quick Start

1) Install dependencies

```
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

2) Start backend

```
cd ../backend
npm run dev
# Server logs: "Server running on port 5001" and "MongoDB connected successfully"
```

3) Seed Admin (optional)

```
node seedAdmin.js
# Admin created/updated:
# email: semiratsegaye71@gmail.com / password: Semira@123 (role Admin)
```

4) Start frontend

```
cd ../frontend
npm run dev
# Open http://localhost:5173
```

The Vite dev server proxies API calls to `http://localhost:5001` per `vite.config.js`.

## Frontend Notes

- Admin pages are under `/admin/*` and protected; login as Admin to access.
- Search bar on Products page queries `/products/search?q=...` when a search term is provided.
- Hero section uses rotating slides with full-cover background images.

Common scripts:

```
# frontend
npm run dev       # start Vite dev server
npm run build     # production build
npm run preview   # preview build locally
npm run lint      # run ESLint
```

## Backend Notes

Main routes:

- `POST /auth/register`
- `POST /auth/login` (returns JWT with role)
- `GET  /products` (list)
- `GET  /products/search?q=keyword` (search)
- `GET  /products/:id`
- `POST /products` (Protected, creator)
- `PUT  /products/:id` (Protected)
- `DELETE /products/:id` (Protected)
- `POST /orders` (Protected, requires `products[]`, `address`, `phone`)
- `GET  /orders/myorders` (Protected: user’s orders)
- `GET  /orders` (Protected Admin: all orders)
- `PUT  /orders/:id/status` (Protected Admin)
- `GET  /admin/dashboard` (Protected Admin: stats)

Common scripts:

```
# backend
npm run dev       # nodemon dev server
npm start         # run server (no nodemon)
```

## Testing Admin

1) Start both servers
2) Seed admin (`node seedAdmin.js`)
3) Login with admin credentials
4) Visit:
- `/admin/dashboard` for charts and stats
- `/admin/products` to manage products
- `/admin/orders` to review and update order status

## Technology Choices (Brief)

- React + Vite for a fast dev experience and modern JSX/ESM pipeline
- React Router 7 for declarative routing and protected/admin routes
- Express + Mongoose for straightforward REST APIs and schema models
- JWT for stateless authentication, simple role handling in middleware
- ESLint for code quality and consistency
