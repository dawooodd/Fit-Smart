const express = require('express');
const cors = require('cors');
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

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(uploadDir));

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/photos', photoRoutes);
app.use('/api/ai', aiSummaryRoutes);
app.use('/api/ai', aiPlanRoutes);
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
