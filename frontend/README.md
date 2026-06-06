# Bhondu

A full-stack ecommerce project with separate backend and frontend applications.

## Project Structure

- `backend/` - Node.js + Express API server
- `frontend/` - React application built with Vite

## Backend

### Overview

The backend is a REST API built with:
- Node.js + Express
- MongoDB via Mongoose
- JWT authentication
- Cloudinary file uploads
- Redis support for caching/session use
- Email delivery via Nodemailer
- Security middleware: helmet, rate limiting, sanitization

### Key folders

- `backend/src/app.js` - Express app configuration and middleware
- `backend/src/config/` - environment, database, Redis, and cloudinary setup
- `backend/src/controllers/` - request handlers for auth, users, products, orders
- `backend/src/routes/` - API routes registration
- `backend/src/models/` - Mongoose schemas
- `backend/src/services/` - business logic and integrations
- `backend/src/utils/` - error handling, async wrapper, logger
- `backend/src/middlewares/` - authentication, validation, upload, error handling

### Run Backend

```bash
cd backend
npm install
npm run dev
```

The server starts from `backend/server.js` and uses the `.env` variables defined in `backend/src/config/environment.js`.

### Environment variables

Create a `.env` file in `backend/` with the following values:

```env
NODE_ENV=development
PORT=4000
MONGO_URI=<your_mongo_connection_string>

JWT_ACCESS_SECRET=<your_jwt_access_secret>
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_SECRET=<your_jwt_refresh_secret>
JWT_REFRESH_EXPIRY=7d

CLOUDINARY_NAME=<cloudinary_cloud_name>
CLOUDINARY_API_KEY=<cloudinary_api_key>
CLOUDINARY_API_SECRET=<cloudinary_api_secret>

REDIS_URL=<your_redis_url>

GOOGLE_CLIENT_ID=<google_oauth_client_id>
GOOGLE_CLIENT_SECRET=<google_oauth_client_secret>

SMTP_HOST=<smtp_host>
SMTP_PORT=<smtp_port>
SMTP_USER=<smtp_user>
SMTP_PASS=<smtp_password>
SMTP_FROM_EMAIL=<from_email>
```

Defaults are configured in code for many values, but `MONGO_URI` is required.

## Frontend

### Overview

The frontend is a Vite-powered React application using:
- React 19
- Tailwind CSS
- Redux Toolkit
- React Router DOM
- Axios for API requests
- Framer Motion, GSAP, Swiper, Recharts
- Zod validation and React Hook Form

### Key folders

- `frontend/src/App.jsx` - application root and routing
- `frontend/src/pages/` - page components
- `frontend/src/components/` - reusable UI components
- `frontend/src/services/` - API service modules
- `frontend/src/context/` - app and admin context providers
- `frontend/src/utils/` - axios instance and constants

### Run Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on Vite and is served locally during development.

## Development Workflow

1. Start the backend:
   ```bash
   cd backend
   npm run dev
   ```
2. Start the frontend:
   ```bash
   cd frontend
   npm run dev
   ```
3. Open the Vite URL shown in the terminal to use the app.

## Notes

- Backend entry point: `backend/server.js`
- Frontend entry point: `frontend/src/main.jsx`
- Ensure the backend API URL is configured correctly in `frontend/src/utils/axiosInstance.js`

## Helpful Scripts

### Backend
- `npm run dev` - start backend with `nodemon`
- `npm start` - run backend once with Node

### Frontend
- `npm run dev` - start Vite development server
- `npm run build` - build production static assets
- `npm run preview` - preview the production build
- `npm run lint` - run ESLint
