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
      i
// Rate limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { success: false, message: 'Too many requests' },
});
}

// Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/public', publicRoutes);

// Apply form limiter to public form submissions
app.use('/api/public/contact', formLimiter);
app.use('/api/public/complaints', formLimiter);
app.usserve requests
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  // Connect to DB in background (retries on failure)
  connectDB();
};

start();

export default app;
