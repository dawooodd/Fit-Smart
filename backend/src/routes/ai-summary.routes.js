const express = require('express');
const { authMiddleware } = require('../middlewares/auth.middleware');
const prisma = require('../config/prisma');
const aiInference = require('../services/aiInference.service');

const router = express.Router();

// ── helpers ───────────────────────────────────────────────────────────────────

function todayDateOnly() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function yesterdayDateOnly() {
  const d = todayDateOnly();
  d.setDate(d.getDate() - 1);
  return d;
}

/**
 * Builds a data-driven local fallback summary when OpenRouter is unavailable.
 * Generates a personalized, encouraging message based on actual user data.
 */
function buildLocalSummary({ profile, todayProgress, yesterdayProgress, recentWorkouts, recentPhoto }) {
  const goal        = profile?.goal || 'maintain_weight';
  const goalLabel   = { lose_weight: 'menurunkan berat badan', gain_weight: 'menaikkan berat badan', maintain_weight: 'menjaga berat badan ideal' }[goal] || goal;
  const targetKcal  = profile?.dailyCalorieTarget || 2000;
  const consumed    = todayProgress?.caloriesConsumed || 0;
  const burned      = todayProgress?.caloriesBurned  || 0;
  const sleepYest   = yesterdayProgress?.sleepDuration || 0;
  const sleepHours  = Math.round((sleepYest / 60) * 10) / 10;
  const name        = 'Sobat FitSmart';

  const lines = [];

  // Opening — sleep quality insight
  if (sleepYest > 0) {
    if (sleepHours >= 7) {
      lines.push(`Tidur ${sleepHours} jam semalam — luar biasa! 🌙 Tidur cukup mempercepat pemulihan otot dan menjaga metabolisme tetap optimal.`);
    } else if (sleepHours >= 5) {
      lines.push(`Tidur ${sleepHours} jam semalam. Cukup, tapi tubuh idealnya butuh 7–8 jam. Coba tidur lebih awal malam ini untuk performa lebih baik.`);
    } else {
      lines.push(`Tidur hanya ${sleepHours} jam semalam — tubuh perlu lebih banyak istirahat. Prioritaskan tidur 7–8 jam agar progres ${goalLabel} tetap optimal.`);
    }
  } else {
    lines.push(`Selamat pagi, ${name}! Semangat menjalani hari ini. Konsistensi kecil setiap hari membawa perubahan besar.`);
  }

  // Calorie insight
  if (consumed > 0) {
    const ratio = consumed / targetKcal;
    if (ratio > 1.1) {
      lines.push(`Asupan kalori hari ini ${consumed} kkal (${Math.round(ratio * 100)}% dari target). Pertimbangkan olahraga ringan untuk menyeimbangkannya.`);
    } else if (ratio >= 0.8) {
      lines.push(`Asupan kalori ${consumed} kkal — sesuai target harian ${targetKcal} kkal. Pertahankan! 🎯`);
    } else {
      lines.push(`Baru ${consumed} kkal masuk hari ini. Pastikan asupan nutrisi cukup untuk mendukung aktivitasmu.`);
    }
  }

  // Workout / activity insight
  if (recentWorkouts.length > 0) {
    const latest = recentWorkouts[0];
    lines.push(`Workout terakhir: ${latest.type || 'latihan'} selama ${latest.duration || 0} menit. ${burned > 0 ? `Terbakar ${burned} kkal — kerja keras terbayar!` : 'Terus pertahankan rutinitas ini!'}`);
  } else {
    lines.push(`Belum ada sesi latihan tercatat. Mulai dengan 20 menit jalan kaki atau peregangan ringan untuk ${goalLabel}.`);
  }

  // AI photo detection mention
  if (recentPhoto && recentPhoto.status === 'completed') {
    const food = recentPhoto.aiResponse?.predictedClass || 'makanan';
    lines.push(`AI mendeteksi "${food}" dari foto terakhirmu. Fitur deteksi nutrisi otomatis aktif — terus dokumentasikan makanmu! 📸`);
  }

  // Closing recommendation
  const tips = {
    lose_weight:    'Fokus pada defisit kalori moderat (300–500 kkal) dan latihan kardio 3–4x seminggu.',
    gain_weight:    'Pastikan surplus kalori 200–300 kkal dan latihan beban untuk memaksimalkan massa otot.',
    maintain_weight: 'Jaga keseimbangan antara asupan dan aktivitas. Konsistensi adalah kuncinya.',
  };
  lines.push(`💡 Tips hari ini: ${tips[goal] || tips.maintain_weight}`);

  return lines.join('\n\n');
}

// ── Routes ────────────────────────────────────────────────────────────────────

router.get('/model-status', authMiddleware, (req, res) => {
  return res.json(aiInference.getModelStatus());
});

/**
 * GET /api/ai/daily-summary
 *
 * Flow:
 * 1. Check DB cache for today — return immediately if found
 * 2. Gather rich user context (profile, today progress, yesterday sleep, workouts, latest photo)
 * 3. Try OpenRouter AI (with 15s timeout)
 * 4. Fallback to deterministic local summary if AI fails or key is missing
 * 5. Save to DB and return
 */
router.get('/daily-summary', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const today  = todayDateOnly();

    // ── 1. Cache check ──
    const existing = await prisma.dailyAiSummary.findUnique({
      where: { userId_date: { userId, date: today } },
    });
    if (existing) {
      return res.json({ summary: existing.summary, cached: true, mode: existing.summary.includes('💡') ? 'local' : 'ai' });
    }

    // ── 2. Gather context data ──
    const yesterday = yesterdayDateOnly();

    const [profile, todayProgress, yesterdayProgress, recentWorkouts, recentPhoto] = await Promise.all([
      prisma.userProfile.findUnique({ where: { userId } }),
      prisma.dailyProgress.findFirst({ where: { userId }, orderBy: { date: 'desc' } }),
      prisma.dailyProgress.findUnique({ where: { userId_date: { userId, date: yesterday } } }),
      prisma.workoutSession.findMany({ where: { userId }, orderBy: { date: 'desc' }, take: 3 }),
      prisma.foodPhotoAnalysis.findFirst({ where: { userId, status: 'completed' }, orderBy: { createdAt: 'desc' } }),
    ]);

    // ── 3. Build context string for AI ──
    const sleepYestHours = yesterdayProgress?.sleepDuration
      ? Math.round((yesterdayProgress.sleepDuration / 60) * 10) / 10
      : null;

    const contextBlock = `
Data kesehatan user:
- Goal: ${profile?.goal || '-'} | BMR: ${profile?.bmr || 0} kkal | Target kalori: ${profile?.dailyCalorieTarget || 0} kkal
- Berat: ${profile?.weight || '-'} kg | Tinggi: ${profile?.height || '-'} cm | Usia: ${profile?.age || '-'}
- Kalori masuk hari ini: ${todayProgress?.caloriesConsumed || 0} kkal
- Kalori terbakar hari ini: ${todayProgress?.caloriesBurned || 0} kkal
- Tidur semalam: ${sleepYestHours !== null ? `${sleepYestHours} jam` : 'tidak ada data'}
- Workout terakhir: ${recentWorkouts.length > 0 ? `${recentWorkouts[0].type || 'latihan'} ${recentWorkouts[0].duration || 0} menit` : 'belum ada'}
- Foto makanan terakhir: ${recentPhoto ? `${recentPhoto.aiResponse?.predictedClass || 'terdeteksi'} (${recentPhoto.estimatedCalories || 0} kkal)` : 'belum ada'}
`.trim();

    const prompt = `${contextBlock}

Buat ringkasan kesehatan harian personal dalam bahasa Indonesia yang:
1. Dimulai dengan insight tentang tidur semalam (jika ada data)
2. Mengomentari progress kalori hari ini
3. Memberikan 1 rekomendasi spesifik berdasarkan goal "${profile?.goal || 'maintain_weight'}"
4. Diakhiri dengan kalimat motivasi singkat

Gaya: personal, hangat, berbasis data. Maksimal 120 kata. Gunakan emoji secukupnya.`;

    // ── 4. Try OpenRouter AI ──
    let summary = null;
    let mode    = 'local';

    const apiKey = process.env.OPENROUTER_API_KEY?.trim();
    if (apiKey) {
      try {
        const aiRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method:  'POST',
          headers: {
            Authorization:  `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer':  'http://localhost:3000',
            'X-Title':       'FitSmart Daily Summary',
          },
          body: JSON.stringify({
            model:       process.env.OPENROUTER_MODEL || 'deepseek/deepseek-chat-v3.1:free',
            messages:    [
              { role: 'system', content: 'Kamu adalah AI Health Coach FitSmart. Beri ringkasan singkat, personal, dan berbasis data. Bahasa Indonesia.' },
              { role: 'user',   content: prompt },
            ],
            temperature: 0.75,
            max_tokens:  200,
          }),
          signal: AbortSignal.timeout(15000),
        });

        if (aiRes.ok) {
          const aiJson = await aiRes.json();
          const content = aiJson?.choices?.[0]?.message?.content?.trim();
          if (content && content.length > 20) {
            summary = content;
            mode    = 'ai';
          }
        } else {
          console.warn('[daily-summary] OpenRouter non-OK:', aiRes.status);
        }
      } catch (fetchErr) {
        console.warn('[daily-summary] OpenRouter failed, using local fallback:', fetchErr.message);
      }
    }

    // ── 5. Local fallback ──
    if (!summary) {
      summary = buildLocalSummary({ profile, todayProgress, yesterdayProgress, recentWorkouts, recentPhoto });
      mode    = 'local';
    }

    // ── 6. Persist to DB (once per day) ──
    const saved = await prisma.dailyAiSummary.create({
      data: { userId, date: today, summary },
    });

    return res.json({ summary: saved.summary, cached: false, mode });

  } catch (error) {
    console.error('[daily-summary] ERROR:', error.message);

    // Last-resort graceful fallback — never crash the dashboard
    const fallback = 'Selamat datang kembali! 🌿 Tetap semangat menjalani hari ini. Ingat: konsistensi kecil setiap hari adalah kunci menuju tujuan kesehatanmu. Minum air cukup, gerak aktif, dan istirahat berkualitas!';
    return res.json({ summary: fallback, cached: false, mode: 'fallback' });
  }
});

/**
 * DELETE /api/ai/daily-summary  — reset today's summary (for demo/dev)
 */
router.delete('/daily-summary', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const today  = todayDateOnly();
    await prisma.dailyAiSummary.deleteMany({ where: { userId, date: today } });
    return res.json({ message: 'Ringkasan hari ini berhasil direset.' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
