import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { mongoSanitize } from './middlewares/mongoSanitize.middleware.js';
import hpp from 'hpp';
import { env } from './config/environment.js';
import { apiLimiter } from './middlewares/rateLimiter.middleware.js';
import { errorHandler } from './middlewares/error.middleware.js';
import apiRouter from './routes/index.js';
import AppError from './utils/appError.js';
import logger from './utils/logger.js';

const app = express();

// 1) Security HTTP headers
app.use(helmet());

// 2) CORS configuration (supports credentials for cookies with strict whitelist)
const allowedOrigins = [
  'https://bhondu.shop',
  'https://www.bhondu.shop',
  'http://localhost:5173',
  'https://bhondu-aih7.onrender.com'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// 3) Request Rate Limiting
app.use('/api', apiLimiter);

// 4) Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize);

// Prevent HTTP parameter pollution
app.use(hpp());

// 5) Payload Compression
app.use(compression());

// 6) Custom request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// 7) API Routes
app.use('/api/v1', apiRouter);

// 8) Root/Health check
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Welcome to BHONDU eCommerce Backend API!',
    environment: env.NODE_ENV,
  });
});

// 9) Handle undefined routes
app.all('*all', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// 10) Central error handling
app.use(errorHandler);

export default app;
