const prisma = require('../config/prisma');
const { toDateOnly, todayDateOnly } = require('../utils/date');

async function getProfileOrThrow(userId) {
  const profile = await prisma.userProfile.findUnique({ where: { userId } });
  if (!profile) throw new Error('Please complete profile first');
  return profile;
}

exports.generateFoodRecommendation = async (userId, dateValue) => {
  const date = dateValue ? toDateOnly(dateValue) : todayDateOnly();
  const profile = await getProfileOrThrow(userId);
  const foods = await prisma.food.findMany({ orderBy: { name: 'asc' } });
  const calorieTarget = profile.dailyCalorieTarget || 2000;

  const recommendation = {
    calorieTarget,
    goal: profile.goal,
    meals: [
      { mealType: 'breakfast', targetCalories: Math.round(calorieTarget * 0.25), foods: foods.filter((f) => ['carbohydrate', 'protein', 'fruit'].includes(f.category)).slice(0, 3) },
      { mealType: 'lunch', targetCalories: Math.round(calorieTarget * 0.35), foods: foods.slice(0, 4) },
      { mealType: 'dinner', targetCalories: Math.round(calorieTarget * 0.30), foods: foods.filter((f) => f.category !== 'fruit').slice(0, 4) },
      { mealType: 'snack', targetCalories: Math.round(calorieTarget * 0.10), foods: foods.filter((f) => ['fruit', 'protein'].includes(f.category)).slice(0, 2) },
    ],
    tips: [
      'Sesuaikan porsi dengan target kalori harian.',
      'Prioritaskan protein dan sayur agar kenyang lebih lama.',
      'Minum air cukup dan batasi gula tambahan.',
    ],
  };

  return prisma.foodRecommendation.create({ data: { userId, date, calorieTarget, recommendation } });
};

exports.getFoodRecommendations = (userId) => prisma.foodRecommendation.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });

exports.generateWorkoutRecommendation = async (userId, dateValue) => {
  const date = dateValue ? toDateOnly(dateValue) : todayDateOnly();
  const profile = await getProfileOrThrow(userId);
  const exercises = await prisma.exercise.findMany({ orderBy: { name: 'asc' } });
  const calorieTarget = profile.goal === 'lose_weight' ? 300 : profile.goal === 'gain_weight' ? 200 : 250;

  const recommendation = {
    calorieBurnTarget: calorieTarget,
    goal: profile.goal,
    activityLevel: profile.activityLevel,
    plan: exercises.slice(0, 5).map((exercise) => ({
      exercise,
      suggestedDuration: exercise.type === 'cardio' ? 20 : 10,
      suggestedSets: exercise.type === 'strength' ? 3 : undefined,
      suggestedReps: exercise.type === 'strength' ? 12 : undefined,
    })),
    tips: [
      'Mulai dengan pemanasan 5-10 menit.',
      'Naikkan intensitas bertahap sesuai kemampuan.',
      'Istirahat bila terasa nyeri atau pusing.',
    ],
  };

  return prisma.workoutRecommendation.create({ data: { userId, date, calorieTarget, recommendation } });
};

exports.getWorkoutRecommendations = (userId) => prisma.workoutRecommendation.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
