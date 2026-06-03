const prisma = require('../config/prisma');
const { toDateOnly } = require('../utils/date');

exports.createExercise = (data) => prisma.exercise.create({ data });

exports.getExercises = ({ q, type, difficulty } = {}) => {
  const where = {};
  if (q) where.name = { contains: q, mode: 'insensitive' };
  if (type) where.type = type;
  if (difficulty) where.difficulty = difficulty;
  return prisma.exercise.findMany({ where, orderBy: { name: 'asc' } });
};

exports.getExerciseById = async (id) => {
  const exercise = await prisma.exercise.findUnique({ where: { id } });
  if (!exercise) throw new Error('Exercise not found');
  return exercise;
};

exports.updateExercise = async (id, data) => {
  await exports.getExerciseById(id);
  return prisma.exercise.update({ where: { id }, data });
};

exports.deleteExercise = async (id) => {
  await exports.getExerciseById(id);
  return prisma.exercise.delete({ where: { id } });
};

async function buildWorkoutExercises(exercises = []) {
  const result = [];
  for (const item of exercises) {
    const exercise = await prisma.exercise.findUnique({ where: { id: item.exerciseId } });
    if (!exercise) throw new Error(`Exercise not found: ${item.exerciseId}`);
    const caloriesBurned = item.duration && exercise.caloriesPerMin
      ? Math.round(item.duration * Number(exercise.caloriesPerMin))
      : undefined;
    result.push({ ...item, caloriesBurned });
  }
  return result;
}

exports.createWorkoutSession = async (userId, data) => {
  const { exercises, ...sessionData } = data;
  const workoutExercises = await buildWorkoutExercises(exercises);
  const totalBurned = sessionData.caloriesBurned ?? workoutExercises.reduce((sum, item) => sum + (item.caloriesBurned || 0), 0);
  const totalDuration = sessionData.duration ?? workoutExercises.reduce((sum, item) => sum + (item.duration || 0), 0);

  return prisma.workoutSession.create({
    data: {
      userId,
      ...sessionData,
      date: toDateOnly(sessionData.date),
      duration: totalDuration || sessionData.duration,
      caloriesBurned: totalBurned || sessionData.caloriesBurned,
      workoutExercises: { create: workoutExercises },
    },
    include: { workoutExercises: { include: { exercise: true } } },
  });
};

exports.getWorkoutSessions = (userId, query = {}) => {
  const where = { userId };
  if (query.date) where.date = toDateOnly(query.date);
  if (query.startDate || query.endDate) {
    where.date = {};
    if (query.startDate) where.date.gte = toDateOnly(query.startDate);
    if (query.endDate) where.date.lte = toDateOnly(query.endDate);
  }
  return prisma.workoutSession.findMany({
    where,
    include: { workoutExercises: { include: { exercise: true } } },
    orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
  });
};

exports.getWorkoutSessionById = async (id, userId) => {
  const session = await prisma.workoutSession.findFirst({
    where: { id, userId },
    include: { workoutExercises: { include: { exercise: true } } },
  });
  if (!session) throw new Error('Workout session not found');
  return session;
};

exports.updateWorkoutSession = async (id, userId, data) => {
  await exports.getWorkoutSessionById(id, userId);
  const { exercises, ...sessionData } = data;
  const workoutExercises = await buildWorkoutExercises(exercises);
  const totalBurned = sessionData.caloriesBurned ?? workoutExercises.reduce((sum, item) => sum + (item.caloriesBurned || 0), 0);
  const totalDuration = sessionData.duration ?? workoutExercises.reduce((sum, item) => sum + (item.duration || 0), 0);

  return prisma.$transaction(async (tx) => {
    await tx.workoutExercise.deleteMany({ where: { workoutSessionId: id } });
    return tx.workoutSession.update({
      where: { id },
      data: {
        ...sessionData,
        date: toDateOnly(sessionData.date),
        duration: totalDuration || sessionData.duration,
        caloriesBurned: totalBurned || sessionData.caloriesBurned,
        workoutExercises: { create: workoutExercises },
      },
      include: { workoutExercises: { include: { exercise: true } } },
    });
  });
};

exports.addExerciseToSession = async (sessionId, userId, data) => {
  await exports.getWorkoutSessionById(sessionId, userId);
  const [workoutExercise] = await buildWorkoutExercises([data]);
  return prisma.workoutExercise.create({
    data: { workoutSessionId: sessionId, ...workoutExercise },
    include: { exercise: true },
  });
};

exports.removeExerciseFromSession = async (sessionId, workoutExerciseId, userId) => {
  await exports.getWorkoutSessionById(sessionId, userId);
  const deleted = await prisma.workoutExercise.deleteMany({ where: { id: workoutExerciseId, workoutSessionId: sessionId } });
  if (!deleted.count) throw new Error('Workout exercise not found');
  return deleted;
};

exports.deleteWorkoutSession = async (id, userId) => {
  await exports.getWorkoutSessionById(id, userId);
  return prisma.workoutSession.delete({ where: { id } });
};
