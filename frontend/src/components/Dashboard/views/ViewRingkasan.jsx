/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Flame, Footprints, Heart, Plus, Sparkles } from 'lucide-react';
import { formatNumber } from '../../../lib/mappers';
import { api } from '../../../lib/api';

export default function ViewRingkasan({ data }) {
  const { user, profile, todayProgress, isLoading, error } = data || {};

  const [sessions, setSessions] = useState([]);

  const [aiSummary, setAiSummary] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    async function loadSessions() {
      try {
        const res = await api.getWorkoutSessions();
        setSessions(res.workoutSessions || []);
      } catch {
        setSessions([]);
      }
    }

    loadSessions();
  }, []);

  const totalWorkoutMinutes = sessions.reduce(
    (total, item) => total + Number(item.duration || 0),
    0
  );

  const totalCaloriesBurned = sessions.reduce(
    (total, item) => total + Number(item.caloriesBurned || 0),
    0
  );

  const dailyTarget = profile?.dailyCalorieTarget || 0;

  const consumed = todayProgress?.caloriesConsumed || 0;

  const burned = totalCaloriesBurned;

  const netCalories = consumed - burned;

  const remaining = dailyTarget
    ? Math.max(dailyTarget - netCalories, 0)
    : 0;

  const waterLiter = todayProgress?.waterIntake
    ? todayProgress.waterIntake / 1000
    : 0;

  const today = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  async function loadAiSummary() {
    try {
      setAiLoading(true);

      const res = await api.getDailyAiSummary();

      setAiSummary(
        res.summary ||
          'Ringkasan AI belum tersedia.'
      );
    } catch {
      setAiSummary(
        'Gagal mengambil ringkasan AI dari backend.'
      );
    } finally {
      setAiLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="bg-(--bg-card) p-6 rounded-2xl border border-(--border-subtle)">
        Memuat data dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {error && (
        <div className="bg-amber-50 text-amber-700 border border-amber-100 rounded-2xl p-4 font-medium">
          {error}
        </div>
      )}

      <div>
        <p className="text-sm text-(--text-muted) font-medium mb-1">
          {today}
        </p>

        <h1 className="text-3xl font-extrabold text-(--text-main) flex items-center gap-2">
          Selamat Datang, {user?.name || 'FitSmart'}!
          <span className="text-green-600">🌿</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Kalori */}
        <div className="bg-(--bg-card) p-5 rounded-2xl border border-(--border-subtle) shadow-sm flex flex-col justify-between h-36">
          <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center">
            <Flame size={20} />
          </div>

          <div>
            <h3 className="text-2xl font-bold text-(--text-main)">
              {formatNumber(netCalories, '0')}
            </h3>

            <p className="text-xs font-semibold text-(--text-muted) uppercase tracking-wide mt-1">
              Kalori Bersih Hari Ini
            </p>

            <p className="text-xs text-green-600 mt-1 font-medium">
              Target {formatNumber(dailyTarget)} • Sisa{' '}
              {formatNumber(remaining, '0')}
            </p>
          </div>
        </div>

        {/* Workout */}
        <div className="bg-(--bg-card) p-5 rounded-2xl border border-(--border-subtle) shadow-sm flex flex-col justify-between h-36">
          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center">
            <Footprints size={20} />
          </div>

          <div>
            <h3 className="text-2xl font-bold text-(--text-main)">
              {formatNumber(totalWorkoutMinutes, '0')}
            </h3>

            <p className="text-xs font-semibold text-(--text-muted) uppercase tracking-wide mt-1">
              Menit Latihan
            </p>

            <p className="text-xs text-blue-600 mt-1 font-medium">
              Kalori terbakar{' '}
              {formatNumber(totalCaloriesBurned, '0')}
            </p>
          </div>
        </div>

        {/* BMR */}
        <div className="bg-(--bg-card) p-5 rounded-2xl border border-(--border-subtle) shadow-sm flex flex-col justify-between h-36">
          <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 flex items-center justify-center">
            <Heart size={20} />
          </div>

          <div>
            <h3 className="text-2xl font-bold text-(--text-main)">
              {formatNumber(profile?.bmr)}
            </h3>

            <p className="text-xs font-semibold text-(--text-muted) uppercase tracking-wide mt-1">
              BMR
            </p>

            <p className="text-xs text-red-600 mt-1 font-medium">
              Dihitung otomatis dari profil
            </p>
          </div>
        </div>

        {/* Water */}
        <div className="bg-(--bg-card) p-5 rounded-2xl border border-(--border-subtle) shadow-sm flex flex-col justify-between h-36">
          <div className="w-10 h-10 rounded-full bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 flex items-center justify-center">
            <Plus size={20} />
          </div>

          <div>
            <h3 className="text-2xl font-bold text-(--text-main)">
              {waterLiter.toLocaleString('id-ID')}
            </h3>

            <p className="text-xs font-semibold text-(--text-muted) uppercase tracking-wide mt-1">
              Liter Air
            </p>

            <p className="text-xs text-cyan-600 mt-1 font-medium">
              Input backend: waterIntake ml
            </p>
          </div>
        </div>
      </div>

      {/* AI SUMMARY */}
      <div className="bg-(--bg-card) rounded-3xl border border-(--border-subtle) p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center">
              <Sparkles size={24} />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-(--text-main)">
                Ringkasan AI Hari Ini
              </h2>

              <p className="text-sm text-(--text-muted)">
                AI Health Coach menggunakan OpenRouter
              </p>
            </div>
          </div>

          <button
            onClick={loadAiSummary}
            disabled={aiLoading || !!aiSummary}
            className="bg-green-700 hover:bg-green-800 disabled:bg-slate-600 text-white rounded-2xl px-5 py-3 font-bold transition"
          >
            {aiLoading
              ? 'Membuat Ringkasan...'
              : aiSummary
              ? 'Sudah Dibuat Hari Ini'
              : 'Generate AI Summary'}
          </button>
        </div>

        <div className="rounded-2xl bg-(--bg-subtle) border border-(--border-subtle) p-5">
          <p className="text-sm leading-relaxed whitespace-pre-line text-(--text-main)">
            {aiSummary ||
              'Klik tombol "Generate AI Summary" untuk membuat ringkasan kesehatan harian otomatis dari aktivitas, nutrisi, workout, dan progress Anda hari ini.\n\nRequest AI dibatasi hanya 1x per hari untuk menghemat penggunaan OpenRouter API.'}
          </p>
        </div>
      </div>
    </div>
  );
}