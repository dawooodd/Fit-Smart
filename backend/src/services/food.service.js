const prisma = require('../config/prisma');

exports.createFood = (data) => prisma.food.create({ data });

exports.getFoods = ({ q, category } = {}) => {
  const where = {};
  if (q) where.name = { contains: q, mode: 'insensitive' };
  if (category) where.category = category;

  return prisma.food.findMany({
    where,
    orderBy: { name: 'asc' },
  });
};

exports.getFoodById = async (id) => {
  const food = await prisma.food.findUnique({ where: { id } });
  if (!food) throw new Error('Food not found');
  return food;
};

exports.updateFood = async (id, data) => {
  await exports.getFoodById(id);
  return prisma.food.update({ where: { id }, data });
};

exports.deleteFood = async (id) => {
  await exports.getFoodById(id);
  return prisma.food.delete({ where: { id } });
};
