const express = require('express');
const prisma = require('../config/prisma');
const { authMiddleware } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/plan-recommendation', authMiddleware, async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const existing = await prisma.aiPlanRecommendation.findUnique({
      where: { userId },
    });

    if (existing) {
      return res.json({
        alreadyGenerated: true,
        summary: existing.summary,
        foodPlan: existing.foodPlan,
        workoutPlan: existing.workoutPlan,
      });
    }

    const profile = await prisma.userProfile.findUnique({
      where: { userId },
    });

    const progress = await prisma.dailyProgress.findFirst({
      where: { userId },
      orderBy: { date: 'desc' },
    });

    const prompt = `
Buat rekomendasi makanan dan workout personal dalam bahasa Indonesia.

Data user:
- Goal: ${profile?.goal || '-'}
- Berat: ${profile?.weight || '-'} kg
- Tinggi: ${profile?.height || '-'} cm
- Umur: ${profile?.age || '-'}
- Gender: ${profile?.gender || '-'}
- Activity level: ${profile?.activityLevel || '-'}
- BMR: ${profile?.bmr || 0}
- Target kalori: ${profile?.dailyCalorieTarget || 0}
- Kalori dikonsumsi terakhir: ${progress?.caloriesConsumed || 0}
- Kalori terbakar terakhir: ${progress?.caloriesBurned || 0}
- Menit latihan terakhir: ${progress?.workoutDuration || 0}

Format jawaban HARUS JSON valid:
{
  "summary": "ringkasan singkat",
  "foodPlan": "rekomendasi makanan detail",
  "workoutPlan": "rekomendasi workout detail"
}
`;

    if (!process.env.OPENROUTER_API_KEY) {
      return res.status(500).json({
        message: 'OPENROUTER_API_KEY belum diset.',
      });
    }

    const aiRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://43.157.206.65',
        'X-Title': 'FitSmart',
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL || 'deepseek/deepseek-chat-v3.1:free',
        messages: [
          {
            role: 'system',
            content: 'Anda adalah AI health coach untuk aplikasi FitSmart.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 250,
      }),
    });

    const aiJson = await aiRes.json();

    if (!aiRes.ok) {
      console.error('OPENROUTER ERROR:', aiJson);
      return res.status(500).json({
        message: 'Gagal memanggil OpenRouter.',
        error: aiJson,
      });
    }

    const content = aiJson?.choices?.[0]?.message?.content || '{}';

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      parsed = {
        summary: 'Rekomendasi berhasil dibuat.',
        foodPlan: content,
        workoutPlan: 'Silakan ikuti rekomendasi aktivitas sesuai kondisi tubuh.',
      };
    }

    const saved = await prisma.aiPlanRecommendation.create({
      data: {
        userId,
        summary: parsed.summary || 'Rekomendasi berhasil dibuat.',
        foodPlan: parsed.foodPlan || '-',
        workoutPlan: parsed.workoutPlan || '-',
      },
    });

    return res.json({
      alreadyGenerated: false,
      summary: saved.summary,
      foodPlan: saved.foodPlan,
      workoutPlan: saved.workoutPlan,
    });
  } catch (error) {
    console.error('AI PLAN ERROR:', error);
    return res.status(500).json({
      message: 'Gagal membuat rekomendasi AI.',
      error: error.message,
    });
  }
});

module.exports = router;