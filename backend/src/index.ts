import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { connectDB } from './config/db';

// Load env
import * as dotenv from 'dotenv';
dotenv.config();

import authRoutes from './routes/auth';
import adminRoutes from './routes/admin';
import publicRoutes from './routes/public';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Security
app.use(helmet());

const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:3000')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      // Allow any Netlify preview/branch deploys (*.netlify.app)
      if (/\.netlify\.app$/.test(new URL(origin).hostname)) return callback(null, true);
      callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
  })
);

// Trust Render/Netlify proxy for rate limiting + real IPs
app.set('trust proxy', 1);

// Rate limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { success: false, message: 'Too many requests' },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many login attempts' },
});

const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many submissions' },
});

app.use(generalLimiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/public', publicRoutes);

// Apply form limiter to public form submissions
app.use('/api/public/contact', formLimiter);
app.use('/api/public/complaints', formLimiter);
app.use('/api/public/applications', formLimiter);
app.use('/api/public/admissions', formLimiter);
app.use('/api/public/newsletter', formLimiter);
// Limit only POST for testimonials so visitors can still GET the list freely
app.post('/api/public/testimonials', formLimiter);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'MEYLOR API is running', timestamp: new Date().toISOString() });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

const start = async () => {
  // Start server immediately so it can serve requests
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  // Connect to DB in background (retries on failure)
  connectDB();
};

start();

export default app;
