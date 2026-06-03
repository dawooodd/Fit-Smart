const path = require('path');
const prisma = require('../config/prisma');
const aiInference = require('./aiInference.service');

exports.createFoodPhotoAnalysis = async (userId, data, file) => {
  const imageUrl = file ? `/uploads/${path.basename(file.path)}` : data.imageUrl;
  if (!imageUrl) throw new Error('imageUrl or image file is required');

  if (data.mealId) {
    const meal = await prisma.meal.findFirst({ where: { id: data.mealId, userId } });
    if (!meal) throw new Error('Meal not found');
  }

  let analysisData = { ...data };

  // Jika user upload file dan model sudah tersedia, jalankan inference otomatis.
  // Jika model belum tersedia, tetap simpan record sebagai pending agar flow UI tidak rusak.
  if (file) {
    if (aiInference.isModelReady()) {
      try {
        analysisData = {
          ...analysisData,
          ...(await aiInference.predictFood(file.path)),
        };
      } catch (error) {
        analysisData = {
          ...analysisData,
          status: 'failed',
          aiResponse: {
            provider: 'FitSmart TensorFlow model',
            error: error.message,
          },
        };
      }
    } else if (!analysisData.status) {
      analysisData.status = 'pending';
      analysisData.aiResponse = {
        provider: 'FitSmart TensorFlow model',
        message: 'Model belum tersedia. Tambahkan fitsmart_model.keras di backend/ai-model/model, atau set FITSMART_ALLOW_DEMO_AI=true untuk demo deploy.',
      };
    }
  }

  return prisma.foodPhotoAnalysis.create({
    data: {
      userId,
      mealId: analysisData.mealId,
      imageUrl,
      detectedFoods: analysisData.detectedFoods,
      estimatedCalories: analysisData.estimatedCalories,
      estimatedProtein: analysisData.estimatedProtein,
      estimatedCarbs: analysisData.estimatedCarbs,
      estimatedFat: analysisData.estimatedFat,
      confidenceScore: analysisData.confidenceScore,
      aiResponse: analysisData.aiResponse,
      status: analysisData.status || 'pending',
    },
  });
};

exports.getFoodPhotoAnalyses = (userId) => prisma.foodPhotoAnalysis.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });

exports.getFoodPhotoAnalysisById = async (id, userId) => {
  const analysis = await prisma.foodPhotoAnalysis.findFirst({ where: { id, userId } });
  if (!analysis) throw new Error('Food photo analysis not found');
  return analysis;
};

exports.updateFoodPhotoAnalysis = async (id, userId, data) => {
  await exports.getFoodPhotoAnalysisById(id, userId);
  return prisma.foodPhotoAnalysis.update({ where: { id }, data });
};

exports.deleteFoodPhotoAnalysis = async (id, userId) => {
  await exports.getFoodPhotoAnalysisById(id, userId);
  return prisma.foodPhotoAnalysis.delete({ where: { id } });
};
