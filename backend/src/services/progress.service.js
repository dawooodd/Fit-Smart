const prisma = require("../config/prisma");

// ── CRUD ──────────────────────────────────────────────────────────────────────

exports.createOrUpdateProgress = async (userId, data) => {
  const date = new Date(data.date);
  const caloriesConsumed = data.caloriesConsumed || 0;
  const caloriesBurned   = data.caloriesBurned   || 0;
  const netCalories      = caloriesConsumed - caloriesBurned;

  return prisma.dailyProgress.upsert({
    where:  { userId_date: { userId, date } },
    update: { ...data, date, netCalories },
    create: { userId, ...data, date, netCalories },
  });
};

exports.getProgress = async (userId) =>
  prisma.dailyProgress.findMany({ where: { userId }, orderBy: { date: "desc" } });

exports.getTodayProgress = async (userId) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return prisma.dailyProgress.findUnique({ where: { userId_date: { userId, date: today } } });
};

exports.deleteProgress = async (id, userId) =>
  prisma.dailyProgress.deleteMany({ where: { id, userId } });

// ── Sleep Weekly ──────────────────────────────────────────────────────────────

/**
 * Returns the last 7 days of sleep data (including days with no record).
 * Each entry: { date: 'YYYY-MM-DD', label: 'Sen', sleepDuration: minutes, sleepHours: float }
 */
exports.getSleepWeekly = async (userId) => {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - (6 - i));
    return d;
  });

  const records = await prisma.dailyProgress.findMany({
    where: { userId, date: { gte: days[0], lte: days[6] } },
    select: { date: true, sleepDuration: true },
  });

  const DAY_LABELS = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

  return days.map((d) => {
    const key = d.toISOString().slice(0, 10);
    const rec = records.find((r) => new Date(r.date).toISOString().slice(0, 10) === key);
    const minutes = rec?.sleepDuration ?? 0;
    return {
      date:          key,
      label:         DAY_LABELS[d.getDay()],
      sleepDuration: minutes,
      sleepHours:    Math.round((minutes / 60) * 10) / 10,
    };
  });
};

// ── Mock Wearable Sync ────────────────────────────────────────────────────────

/**
 * Generates realistic mock wearable data for today and upserts into DailyProgress.
 * Simulates an IoT/wearable API data stream for thesis demonstration.
 */
exports.syncWearable = async (userId) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const steps          = Math.floor(Math.random() * 3001) + 5000;  // 5000–8000
  const activeCalories = Math.floor(Math.random() * 151)  + 150;   // 150–300 kcal
  const avgHeartRate   = Math.floor(Math.random() * 21)   + 95;    // 95–115 bpm
  const sleepMinutes   = Math.floor(Math.random() * 121)  + 360;   // 360–480 min (6–8j)
  const waterMl        = Math.floor(Math.random() * 501)  + 1500;  // 1500–2000 ml
  const workoutDuration = Math.round(steps / 100);

  const existing = await prisma.dailyProgress.findUnique({
    where: { userId_date: { userId, date: today } },
  });
  const caloriesConsumed = existing?.caloriesConsumed || 0;
  const netCalories      = caloriesConsumed - activeCalories;

  const record = await prisma.dailyProgress.upsert({
    where:  { userId_date: { userId, date: today } },
    update: {
      caloriesBurned: activeCalories,
      netCalories,
      waterIntake:    waterMl,
      workoutDuration,
      sleepDuration:  sleepMinutes,
      notes: `[Wearable Sync] Steps: ${steps} | HR: ${avgHeartRate} bpm | Synced: ${new Date().toLocaleTimeString('id-ID')}`,
    },
    create: {
      userId,
      date:           today,
      caloriesConsumed: 0,
      caloriesBurned: activeCalories,
      netCalories:    -activeCalories,
      waterIntake:    waterMl,
      workoutDuration,
      sleepDuration:  sleepMinutes,
      notes: `[Wearable Sync] Steps: ${steps} | HR: ${avgHeartRate} bpm | Synced: ${new Date().toLocaleTimeString('id-ID')}`,
    },
  });

  return {
    ...record,
    wearable: {
      steps,
      activeCalories,
      avgHeartRate,
      sleepMinutes,
      sleepHours:     Math.round((sleepMinutes / 60) * 10) / 10,
      waterMl,
      workoutDuration,
      syncedAt:       new Date().toISOString(),
      device:         'Mock Smartwatch v2.0',
    },
  };
};

// ── Weight Forecasting ────────────────────────────────────────────────────────

/**
 * Deterministic linear weight-loss/gain forecasting.
 *
 * Science basis (same as streamlit/forecasting.py logic):
 *   1 kg body fat ≈ 7700 kcal surplus/deficit
 *   weeks_to_goal = (weightDiff_kg × 7700) / (dailyDeficit × 7)
 *
 * Also generates a 12-week trendline for chart rendering.
 */
exports.computeWeightForecast = ({ currentWeight, targetWeight, dailyCalorieDeficit }) => {
  const cw     = Number(currentWeight);
  const tw     = Number(targetWeight);
  const def    = Number(dailyCalorieDeficit);

  if (!cw || !tw || !def) throw new Error('currentWeight, targetWeight, dan dailyCalorieDeficit harus diisi.');
  if (cw <= 0 || tw <= 0) throw new Error('Berat badan harus lebih dari 0.');
  if (def === 0)           throw new Error('dailyCalorieDeficit tidak boleh 0.');

  const KCAL_PER_KG     = 7700;
  const weightDiff      = Math.abs(cw - tw);
  const direction       = tw < cw ? 'lose' : 'gain';

  // weeks = (kg × 7700 kcal/kg) / (deficit kcal/day × 7 days/week)
  const weeksToGoal     = (weightDiff * KCAL_PER_KG) / (Math.abs(def) * 7);
  const daysToGoal      = Math.round(weeksToGoal * 7);
  const weightPerWeek   = (Math.abs(def) * 7) / KCAL_PER_KG;   // kg/week

  const goalDate = new Date();
  goalDate.setDate(goalDate.getDate() + daysToGoal);

  // 12-week trendline (for chart)
  const trendline = Array.from({ length: 13 }, (_, week) => {
    const projected = direction === 'lose'
      ? Math.max(cw - weightPerWeek * week, tw)
      : Math.min(cw + weightPerWeek * week, tw);
    return {
      week,
      label:          week === 0 ? 'Sekarang' : `M${week}`,
      weight:         Math.round(projected * 10) / 10,
      isGoalReached:  Math.round(weeksToGoal) <= week,
    };
  });

  return {
    currentWeight:  cw,
    targetWeight:   tw,
    dailyCalorieDeficit: def,
    direction,
    weightDiff:     Math.round(weightDiff * 10) / 10,
    weeksToGoal:    Math.round(weeksToGoal * 10) / 10,
    daysToGoal,
    weightPerWeek:  Math.round(weightPerWeek * 100) / 100,
    estimatedGoalDate: goalDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
    trendline,
    formula: `(${weightDiff.toFixed(1)} kg × 7700 kkal/kg) ÷ (${Math.abs(def)} kkal/hari × 7 hari) = ${weeksToGoal.toFixed(1)} minggu`,
  };
};
