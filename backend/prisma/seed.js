require("dotenv/config");

const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  await prisma.food.createMany({
    data: [
      {
        name: "Nasi Putih",
        calories: 175,
        protein: 3.5,
        carbs: 40,
        fat: 0.3,
        category: "carbohydrate",
        description: "Nasi putih 1 porsi sekitar 100 gram",
      },
      {
        name: "Ayam Dada Panggang",
        calories: 165,
        protein: 31,
        carbs: 0,
        fat: 3.6,
        category: "protein",
        description: "Dada ayam tanpa kulit 100 gram",
      },
      {
        name: "Telur Rebus",
        calories: 78,
        protein: 6,
        carbs: 0.6,
        fat: 5,
        category: "protein",
        description: "Telur ayam rebus ukuran sedang",
      },
      {
        name: "Oatmeal",
        calories: 150,
        protein: 5,
        carbs: 27,
        fat: 3,
        category: "carbohydrate",
        description: "Oatmeal 40 gram",
      },
      {
        name: "Pisang",
        calories: 105,
        protein: 1.3,
        carbs: 27,
        fat: 0.3,
        category: "fruit",
        description: "Pisang ukuran sedang",
      },
    ],
  });

  await prisma.exercise.createMany({
    data: [
      {
        name: "Jogging",
        type: "cardio",
        muscleGroup: "Full Body",
        caloriesPerMin: 8,
        difficulty: "medium",
        description: "Latihan kardio ringan hingga sedang",
      },
      {
        name: "Push Up",
        type: "strength",
        muscleGroup: "Chest, Triceps, Shoulder",
        caloriesPerMin: 7,
        difficulty: "medium",
        description: "Latihan kekuatan tubuh bagian atas",
      },
      {
        name: "Squat",
        type: "strength",
        muscleGroup: "Legs, Glutes",
        caloriesPerMin: 6,
        difficulty: "medium",
        description: "Latihan kekuatan kaki dan pinggul",
      },
      {
        name: "Plank",
        type: "core",
        muscleGroup: "Abs, Core",
        caloriesPerMin: 4,
        difficulty: "easy",
        description: "Latihan stabilitas otot inti",
      },
      {
        name: "Skipping",
        type: "cardio",
        muscleGroup: "Full Body",
        caloriesPerMin: 10,
        difficulty: "hard",
        description: "Latihan kardio intensitas tinggi",
      },
    ],
  });

  console.log("Seed data berhasil dibuat");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });