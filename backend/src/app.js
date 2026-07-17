const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');

const authRoutes = require('./routes/auth.routes');
const profileRoutes = require('./routes/profile.routes');
const progressRoutes = require('./routes/progress.routes');
const foodRoutes = require('./routes/food.routes');
const mealRoutes = require('./routes/meal.routes');
const workoutRoutes = require('./routes/workout.routes');
const recommendationRoutes = require('./routes/recommendation.routes');
const aiSummaryRoutes = require('./routes/ai-summary.routes');
const photoRoutes = require('./routes/photo.routes');
const aiPlanRoutes = require('./routes/ai-plan.routes');

const app = express();
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// ── Security Headers (helmet) ─────────────────────────────────────────────────
app.use(helmet());

// ── CORS — restrict to the configured frontend origin only ───────────────────
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
];
app.use(cors({
  origin: (origin, callback) => {
    // Allow server-to-server requests (no origin) and whitelisted origins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: origin '${origin}' not allowed`));
    }
  },
  credentials: true,
}));

// ── Rate Limiters ─────────────────────────────────────────────────────────────
// Strict limiter for auth routes — prevents brute-force attacks
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again after 15 minutes.' },
});

// General limiter for all other API routes
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(uploadDir));

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/profile', generalLimiter, profileRoutes);
app.use('/api/progress', generalLimiter, progressRoutes);
app.use('/api/foods', generalLimiter, foodRoutes);
app.use('/api/meals', generalLimiter, mealRoutes);
app.use('/api/workouts', generalLimiter, workoutRoutes);
app.use('/api/recommendations', generalLimiter, recommendationRoutes);
app.use('/api/photos', generalLimiter, photoRoutes);
app.use('/api/ai', generalLimiter, aiSummaryRoutes);
app.use('/api/ai', generalLimiter, aiPlanRoutes);
app.get('/', (req, res) => {
  res.json({ message: 'Fit-Smart API running' });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

module.exports = app;
