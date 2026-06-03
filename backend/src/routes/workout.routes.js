const express = require('express');
const router = express.Router();

const workoutController = require('../controllers/workout.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

router.get('/exercises', authMiddleware, workoutController.getExercises);
router.get('/exercises/:id', authMiddleware, workoutController.getExerciseById);
router.post('/exercises', authMiddleware, workoutController.createExercise);
router.put('/exercises/:id', authMiddleware, workoutController.updateExercise);
router.delete('/exercises/:id', authMiddleware, workoutController.deleteExercise);

router.get('/sessions', authMiddleware, workoutController.getWorkoutSessions);
router.get('/sessions/:id', authMiddleware, workoutController.getWorkoutSessionById);
router.post('/sessions', authMiddleware, workoutController.createWorkoutSession);
router.put('/sessions/:id', authMiddleware, workoutController.updateWorkoutSession);
router.post('/sessions/:id/exercises', authMiddleware, workoutController.addExerciseToSession);
router.delete('/sessions/:id/exercises/:workoutExerciseId', authMiddleware, workoutController.removeExerciseFromSession);
router.delete('/sessions/:id', authMiddleware, workoutController.deleteWorkoutSession);

module.exports = router;
