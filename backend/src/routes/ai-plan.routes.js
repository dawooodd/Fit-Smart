const express = require('express');
const prisma = require('../config/prisma');
const { authMiddleware } = require('../middlewares/auth.middleware');

const router = express.Router();

// ── helpers ───────────────────────────────────────────────────────────────────

/**
 * Deterministic local fallback when OpenRouter key is not set.
 * Generates a personalised recommendation using profile data only.
 */
function buildLocalRecommendation(profile, progress) {
  const goal        = profile?.goal        || 'maintain_weight';
  const bmr         = profile?.bmr         || 2000;
  const targetKcal  = profile?.dailyCalorieTarget || bmr;
  const weight      = profile?.weight      || '–';
  const height      = profile?.height      || '–';
  const age         = profile?.age         || '–';
  const actLevel    = profile?.activityLevel || 'moderate';

  const goalLabel = { lose_weight: 'menurunkan berat badan', gain_weight: 'menaikkan berat badan', maintain_weight: 'menjaga berat badan' }[goal] || goal;

  const foodPlan = `Berdasarkan target ${goalLabel} dengan kalori harian ${targetKcal} kkal:

• Sarapan (~${Math.round(targetKcal * 0.25)} kkal): Oatmeal + telur rebus + buah segar
• Makan Siang (~${Math.round(targetKcal * 0.35)} kkal): Nasi merah + ayam panggang + sayur tumis + tahu
• Makan Malam (~${Math.round(targetKcal * 0.30)} kkal): Nasi merah (lebih sedikit) + ikan kukus + sayur rebus
• Camilan (~${Math.round(targetKcal * 0.10)} kkal): Kacang almond, yogurt rendah lemak, atau buah

Tips: Penuhi kebutuhan protein 0.8–1.2 g/kg berat badan (≈${Math.round(Number(weight) * 1.0)} g/hari).`;

  const workoutPlan = goal === 'lose_weight'
    ? `Fokus pembakaran kalori dengan aktivitas level "${actLevel}":
• Kardio 30–45 menit, 4–5x seminggu (jogging, bersepeda, renang)
• Latihan beban 2–3x seminggu untuk menjaga massa otot
• Target kalori terbakar: 300–400 kkal/sesi
• Tambahkan jalan kaki 7.000–10.000 langkah/hari`
    : goal === 'gain_weight'
    ? `Fokus hipertrofi otot dengan aktivitas level "${actLevel}":
• Latihan beban 4–5x seminggu (push/pull/legs split)
• Surplus kalori 200–300 kkal di atas target (${targetKcal + 250} kkal total)
• Kardio ringan 2x seminggu untuk kesehatan jantung
• Istirahat cukup, minimal 7–8 jam/malam`
    : `Program seimbang untuk menjaga berat badan ideal:
• Kombinasi kardio 3x + latihan beban 2x seminggu
• Target kalori terbakar: 200–300 kkal/sesi
• Pertahankan langkah harian minimal 8.000 langkah
• Review progress tiap 2 minggu`;

  const summary = `Rekomendasi personal untuk ${goalLabel}. BMR: ${bmr} kkal, target harian: ${targetKcal} kkal. ` +
    `Data: ${weight} kg, ${height} cm, usia ${age} tahun. ` +
    `(Rekomendasi dibuat secara lokal — tambahkan OPENROUTER_API_KEY untuk rekomendasi AI yang lebih personal.)`;

  return { summary, foodPlan, workoutPlan };
}

/**
 * Safely parse JSON from AI response, handling markdown code fences.
 */
function safeParseAiContent(raw) {
  // strip ```json ... ``` fences if present
  const cleaned = raw.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
}

// ── GET /api/ai/plan-recommendation ──────────────────────────────────────────

router.get('/plan-recommendation', authMiddleware, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    // Return cached result if already generated
    const existing = await prisma.aiPlanRecommendation.findUnique({ where: { userId } });
    if (existing) {
      return res.json({
        alreadyGenerated: true,
        mode: existing.summary.includes('lokal') ? 'local' : 'ai',
        summary:     existing.summary,
        foodPlan:    existing.foodPlan,
        workoutPlan: existing.workoutPlan,
      });
    }

    // Fetch profile & latest progress
    const [profile, progress] = await Promise.all([
      prisma.userProfile.findUnique({ where: { userId } }),
      prisma.dailyProgress.findFirst({ where: { userId }, orderBy: { date: 'desc' } }),
    ]);

    if (!profile) {
      return res.status(400).json({ message: 'Profil belum lengkap. Silakan isi onboarding terlebih dahulu.' });
    }

    // ── Try OpenRouter AI ──
    const apiKey = process.env.OPENROUTER_API_KEY?.trim();
    let parsed = null;
    let mode   = 'local';

    if (apiKey) {
      const prompt = `Buat rekomendasi makanan dan workout personal dalam bahasa Indonesia.

Data user:
- Goal: ${profile.goal || '-'}
- Berat: ${profile.weight || '-'} kg, Tinggi: ${profile.height || '-'} cm, Umur: ${profile.age || '-'}
- Gender: ${profile.gender || '-'}, Activity: ${profile.activityLevel || '-'}
- BMR: ${profile.bmr || 0} kkal, Target kalori: ${profile.dailyCalorieTarget || 0} kkal
- Kalori dikonsumsi terakhir: ${progress?.caloriesConsumed || 0}
- Kalori terbakar terakhir: ${progress?.caloriesBurned || 0}
- Durasi latihan terakhir: ${progress?.workoutDuration || 0} menit

Balas HANYA dengan JSON valid (tanpa markdown):
{"summary":"...","foodPlan":"...","workoutPlan":"..."}`;

      try {
        const aiRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method:  'POST',
          headers: {
            Authorization:  `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer':  'http://localhost:3000',
            'X-Title':       'FitSmart',
          },
          body: JSON.stringify({
            model:       process.env.OPENROUTER_MODEL || 'deepseek/deepseek-chat-v3.1:free',
            messages:    [
              { role: 'system', content: 'Anda adalah AI health coach. Balas hanya dengan JSON valid tanpa markdown.' },
              { role: 'user',   content: prompt },
            ],
            temperature: 0.7,
            max_tokens:  400,
          }),
          signal: AbortSignal.timeout(15000), // 15s timeout
        });

        if (aiRes.ok) {
          const aiJson = await aiRes.json();
          const content = aiJson?.choices?.[0]?.message?.content || '';
          parsed = safeParseAiContent(content);
          if (parsed?.summary) mode = 'ai';
        } else {
          const errBody = await aiRes.json().catch(() => ({}));
          console.warn('OpenRouter non-OK:', aiRes.status, errBody);
        }
      } catch (fetchErr) {
        console.warn('OpenRouter fetch failed (using local fallback):', fetchErr.message);
      }
    }

    // ── Fallback to local if AI failed or no key ──
    if (!parsed?.summary) {
      parsed = buildLocalRecommendation(profile, progress);
      mode   = 'local';
    }

    // ── Persist to DB ──
    const saved = await prisma.aiPlanRecommendation.create({
      data: {
        userId,
        summary:     parsed.summary     || 'Rekomendasi berhasil dibuat.',
        foodPlan:    parsed.foodPlan     || '-',
        workoutPlan: parsed.workoutPlan  || '-',
      },
    });

    return res.json({
      alreadyGenerated: false,
      mode,
      summary:     saved.summary,
      foodPlan:    saved.foodPlan,
      workoutPlan: saved.workoutPlan,
    });

  } catch (error) {
    console.error('AI PLAN ERROR:', error);
    return res.status(500).json({
      message: `Gagal membuat rekomendasi AI: ${error.message}`,
    });
  }
});

// ── DELETE /api/ai/plan-recommendation  (reset — useful for dev/demo) ─────────

router.delete('/plan-recommendation', authMiddleware, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    await prisma.aiPlanRecommendation.deleteMany({ where: { userId } });
    return res.json({ message: 'Rekomendasi AI berhasil direset.' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
