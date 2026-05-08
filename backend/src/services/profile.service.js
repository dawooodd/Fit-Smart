const prisma = require("../config/prisma");

function calculateBMR({ gender, weight, height, age }) {
  if (gender === "male") {
    return Math.round(10 * weight + 6.25 * height - 5 * age + 5);
  }

  return Math.round(10 * weight + 6.25 * height - 5 * age - 161);
}

function getActivityMultiplier(activityLevel) {
  const multipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };

  return multipliers[activityLevel] || 1.2;
}

function calculateCalorieTarget(bmr, activityLevel, goal) {
  const tdee = bmr * getActivityMultiplier(activityLevel);

  if (goal === "lose_weight") return Math.round(tdee - 500);
  if (goal === "gain_weight") return Math.round(tdee + 500);

  return Math.round(tdee);
}

exports.createOrUpdateProfile = async (userId, data) => {
  const bmr = calculateBMR(data);
  const dailyCalorieTarget = calculateCalorieTarget(
    bmr,
    data.activityLevel,
    data.goal
  );

  return prisma.userProfile.upsert({
    where: { userId },
    update: {
      ...data,
      bmr,
      dailyCalorieTarget,
    },
    create: {
      userId,
      ...data,
      bmr,
      dailyCalorieTarget,
    },
  });
};

exports.getProfile = async (userId) => {
  return prisma.userProfile.findUnique({
    where: { userId },
  });
};