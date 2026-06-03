const workoutService = require('../services/workout.service');
const { exerciseSchema, workoutSessionSchema, addWorkoutExerciseSchema, workoutQuerySchema } = require('../validations/workout.validation');
const { uuidParamSchema } = require('../validations/common.validation');

exports.createExercise = async (req, res) => {
  try {
    const data = exerciseSchema.parse(req.body);
    const exercise = await workoutService.createExercise(data);
    return res.status(201).json({ message: 'Exercise created successfully', exercise });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.getExercises = async (req, res) => {
  try {
    const exercises = await workoutService.getExercises(req.query);
    return res.status(200).json({ message: 'Exercises fetched successfully', exercises });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.getExerciseById = async (req, res) => {
  try {
    const { id } = uuidParamSchema.parse(req.params);
    const exercise = await workoutService.getExerciseById(id);
    return res.status(200).json({ message: 'Exercise fetched successfully', exercise });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

exports.updateExercise = async (req, res) => {
  try {
    const { id } = uuidParamSchema.parse(req.params);
    const data = exerciseSchema.partial().parse(req.body);
    const exercise = await workoutService.updateExercise(id, data);
    return res.status(200).json({ message: 'Exercise updated successfully', exercise });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.deleteExercise = async (req, res) => {
  try {
    const { id } = uuidParamSchema.parse(req.params);
    await workoutService.deleteExercise(id);
    return res.status(200).json({ message: 'Exercise deleted successfully' });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.createWorkoutSession = async (req, res) => {
  try {
    const data = workoutSessionSchema.parse(req.body);
    const workoutSession = await workoutService.createWorkoutSession(req.user.id, data);
    return res.status(201).json({ message: 'Workout session created successfully', workoutSession });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.getWorkoutSessions = async (req, res) => {
  try {
    const query = workoutQuerySchema.parse(req.query);
    const workoutSessions = await workoutService.getWorkoutSessions(req.user.id, query);
    return res.status(200).json({ message: 'Workout sessions fetched successfully', workoutSessions });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.getWorkoutSessionById = async (req, res) => {
  try {
    const { id } = uuidParamSchema.parse(req.params);
    const workoutSession = await workoutService.getWorkoutSessionById(id, req.user.id);
    return res.status(200).json({ message: 'Workout session fetched successfully', workoutSession });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

exports.updateWorkoutSession = async (req, res) => {
  try {
    const { id } = uuidParamSchema.parse(req.params);
    const data = workoutSessionSchema.parse(req.body);
    const workoutSession = await workoutService.updateWorkoutSession(id, req.user.id, data);
    return res.status(200).json({ message: 'Workout session updated successfully', workoutSession });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.addExerciseToSession = async (req, res) => {
  try {
    const { id } = uuidParamSchema.parse(req.params);
    const data = addWorkoutExerciseSchema.parse(req.body);
    const workoutExercise = await workoutService.addExerciseToSession(id, req.user.id, data);
    return res.status(201).json({ message: 'Exercise added to workout successfully', workoutExercise });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.removeExerciseFromSession = async (req, res) => {
  try {
    const { id } = uuidParamSchema.parse(req.params);
    const { workoutExerciseId } = req.params;
    await workoutService.removeExerciseFromSession(id, workoutExerciseId, req.user.id);
    return res.status(200).json({ message: 'Exercise removed from workout successfully' });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.deleteWorkoutSession = async (req, res) => {
  try {
    const { id } = uuidParamSchema.parse(req.params);
    await workoutService.deleteWorkoutSession(id, req.user.id);
    return res.status(200).json({ message: 'Workout session deleted successfully' });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
