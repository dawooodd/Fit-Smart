const prisma = require('../config/prisma');
const { toDateOnly } = require('../utils/date');

function calculateNutrition(food, quantity) {
  const factor = Number(quantity) / 100;
  return {
    calories: Math.round(food.calories * factor),
    protein: Number(food.protein) * factor,
    carbs: Number(food.carbs) * factor,
    fat: Number(food.fat) * factor,
  };
}

async function buildMealFoods(foods = []) {
  const result = [];
  for (const item of foods) {
    const food = await prisma.food.findUnique({ where: { id: item.foodId } });
    if (!food) throw new Error(`Food not found: ${item.foodId}`);
    const nutrition = calculateNutrition(food, item.quantity);
    result.push({
      foodId: item.foodId,
      quantity: item.quantity,
      calories: nutrition.calories,
      protein: nutrition.protein,
      carbs: nutrition.carbs,
      fat: nutrition.fat,
    });
  }
  return result;
}

exports.createMeal = async (userId, data) => {
  const { foods, ...mealData } = data;
  const mealFoods = await buildMealFoods(foods);
  return prisma.meal.create({
    data: {
      userId,
      ...mealData,
      date: toDateOnly(mealData.date),
      mealFoods: { create: mealFoods },
    },
    include: { mealFoods: { include: { food: true } } },
  });
};

exports.getMeals = (userId, query = {}) => {
  const where = { userId };
  if (query.date) where.date = toDateOnly(query.date);
  if (query.startDate || query.endDate) {
    where.date = {};
    if (query.startDate) where.date.gte = toDateOnly(query.startDate);
    if (query.endDate) where.date.lte = toDateOnly(query.endDate);
  }

  return prisma.meal.findMany({
    where,
    include: { mealFoods: { include: { food: true } }, foodPhotoAnalyses: true },
    orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
  });
};

exports.getMealById = async (id, userId) => {
  const meal = await prisma.meal.findFirst({
    where: { id, userId },
    include: { mealFoods: { include: { food: true } }, foodPhotoAnalyses: true },
  });
  if (!meal) throw new Error('Meal not found');
  return meal;
};

exports.updateMeal = async (id, userId, data) => {
  await exports.getMealById(id, userId);
  const { foods, ...mealData } = data;
  const mealFoods = await buildMealFoods(foods);

  return prisma.$transaction(async (tx) => {
    await tx.mealFood.deleteMany({ where: { mealId: id } });
    return tx.meal.update({
      where: { id },
      data: {
        ...mealData,
        date: toDateOnly(mealData.date),
        mealFoods: { create: mealFoods },
      },
      include: { mealFoods: { include: { food: true } } },
    });
  });
};

exports.addFoodToMeal = async (mealId, userId, data) => {
  await exports.getMealById(mealId, userId);
  const [mealFood] = await buildMealFoods([data]);
  return prisma.mealFood.create({
    data: { mealId, ...mealFood },
    include: { food: true },
  });
};

exports.removeFoodFromMeal = async (mealId, mealFoodId, userId) => {
  await exports.getMealById(mealId, userId);
  const deleted = await prisma.mealFood.deleteMany({ where: { id: mealFoodId, mealId } });
  if (!deleted.count) throw new Error('Meal food not found');
  return deleted;
};

exports.deleteMeal = async (id, userId) => {
  await exports.getMealById(id, userId);
  return prisma.meal.delete({ where: { id } });
};
