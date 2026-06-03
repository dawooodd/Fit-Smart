const express = require('express');
const { authMiddleware } = require('../middlewares/auth.middleware');

const router = express.Router();
const prisma = require('../config/prisma');
const aiInference = require('../services/aiInference.service');

function todayDateOnly() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

router.get('/model-status', authMiddleware, (req, res) => {
  return res.json(aiInference.getModelStatus());
});

router.get('/daily-summary', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const today = todayDateOnly();

    console.log('=== DAILY SUMMARY DEBUG START ===');
    console.log('USER ID:', userId);
    console.log('TODAY:', today);
    console.log('OPENROUTER MODEL:', process.env.OPENROUTER_MODEL);
    console.log('API KEY EXISTS:', !!process.env.OPENROUTER_API_KEY);

    const existing = await prisma.dailyAiSummary.findUnique({
      where: {
        userId_date: {
          userId,
          date: today,
        },
      },
    });

    if (existing) {
      console.log('CACHE FOUND');
      return res.json({
        summary: existing.summary,
        cached: true,
      });
    }

    const [profile, progress, workouts, meals] = await Promise.all([
      prisma.userProfile.findUnique({ where: { userId } }),
      prisma.dailyProgress.findFirst({
        where: { userId },
        orderBy: { date: 'desc' },
      }),
      prisma.workoutSession.findMany({
        where: { userId },
        orderBy: { date: 'desc' },
        take: 2,
      }),
      prisma.meal.findMany({
        where: { userId },
        orderBy: { date: 'desc' },
        take: 2,
      }),
    ]);

    console.log('PROFILE:', profile);
    console.log('PROGRESS:', progress);
    console.log('WORKOUTS COUNT:', workouts.length);
    console.log('MEALS COUNT:', meals.length);

    const prompt = `
Buat ringkasan kesehatan harian singkat bahasa Indonesia.

Goal: ${profile?.goal || '-'}
Kalori target: ${profile?.dailyCalorieTarget || 0}
Kalori masuk: ${progress?.caloriesConsumed || 0}
Kalori terbakar: ${progress?.caloriesBurned || 0}

Workout:
${workouts.map((w) => `${w.type} ${w.duration}m`).join(', ')}

Meal:
${meals.map((m) => `${m.mealType}: ${m.notes || '-'}`).join(', ')}

Berikan:
- 1 paragraf singkat
- 3 rekomendasi
Maksimal 80 kata.
`;

    console.log('PROMPT:', prompt);

    const aiRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL || 'openai/gpt-oss-120b:free',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 80,
      }),
    });

    const rawText = await aiRes.text();

    console.log('OPENROUTER STATUS:', aiRes.status);
    console.log('OPENROUTER RAW RESPONSE:', rawText);

    let aiJson;
    try {
      aiJson = rawText ? JSON.parse(rawText) : {};
    } catch (parseError) {
      console.error('OPENROUTER JSON PARSE ERROR:', parseError.message);
      return res.status(500).json({
        message: 'Response OpenRouter bukan JSON.',
        status: aiRes.status,
        raw: rawText.slice(0, 500),
      });
    }

    if (!aiRes.ok) {
      return res.status(500).json({
        message: 'Gagal memanggil OpenRouter.',
        status: aiRes.status,
        error: aiJson,
      });
    }

    const summary =
      aiJson?.choices?.[0]?.message?.content ||
      'Ringkasan belum tersedia.';

    console.log('AI SUMMARY:', summary);

    const saved = await prisma.dailyAiSummary.create({
      data: {
        userId,
        date: today,
        summary,
      },
    });

    console.log('SUMMARY SAVED:', saved.id);
    console.log('=== DAILY SUMMARY DEBUG END ===');

    return res.json({
      summary: saved.summary,
      cached: false,
    });
  } catch (error) {
    console.error('DAILY SUMMARY ERROR:', error);
    return res.status(500).json({
      message: 'Gagal membuat ringkasan AI.',
      error: error.message,
    });
  }
});

module.exports = router;