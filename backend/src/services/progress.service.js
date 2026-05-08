const prisma = require("../config/prisma");

exports.createOrUpdateProgress = async (userId, data) => {
  const date = new Date(data.date);

  const caloriesConsumed = data.caloriesConsumed || 0;
  const caloriesBurned = data.caloriesBurned || 0;
  const netCalories = caloriesConsumed - caloriesBurned;

  return prisma.dailyProgress.upsert({
    where: {
      userId_date: {
        userId,
        date,
      },
    },
    update: {
      ...data,
      date,
      netCalories,
    },
    create: {
      userId,
      ...data,
      date,
      netCalories,
    },
  });
};

exports.getProgress = async (userId) => {
  return prisma.dailyProgress.findMany({
    where: { userId },
    orderBy: { date: "desc" },
  });
};

exports.getTodayProgress = async (userId) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return prisma.dailyProgress.findUnique({
    where: {
      userId_date: {
        userId,
        date: today,
      },
    },
  });
};

exports.deleteProgress = async (id, userId) => {
  return prisma.dailyProgress.deleteMany({
    where: {
      id,
      userId,
    },
  });
};