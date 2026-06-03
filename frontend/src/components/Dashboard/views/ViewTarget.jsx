/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { Dumbbell, Sparkles, Target, Utensils } from 'lucide-react';
import { api } from '../../../lib/api';

export default function ViewTarget({ profile }) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  async function generateAiPlan() {
    try {
      setLoading(true);
      setMsg('');

      const res = await api.getAiPlanRecommendation();

      setResult(res);

      setMsg(
        res.alreadyGenerated
          ? 'Rekomendasi AI sudah pernah dibuat untuk akun ini.'
          : 'Rekomendasi AI berhasil dibuat.'
      );
    } catch {
      setMsg('Gagal membuat rekomendasi AI.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-linear-to-r from-green-700 to-emerald-600 rounded-4xl p-8 text-white">
        <div className="flex items-center gap-3 mb-3">
          <Target />
          <h2 className="text-2xl font-black">
            Target & Rekomendasi AI
          </h2>
        </div>

        <p>
          Generate rekomendasi makanan dan workout personal berbasis AI.
          Fitur ini hanya bisa generate 1x untuk setiap akun.
        </p>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          <div className="bg-white/15 rounded-2xl p-4">
            <p className="opacity-80">Goal</p>
            <b>{profile?.goal || '-'}</b>
          </div>

          <div className="bg-white/15 rounded-2xl p-4">
            <p className="opacity-80">BMR</p>
            <b>{profile?.bmr || 0} kkal</b>
          </div>

          <div className="bg-white/15 rounded-2xl p-4">
            <p className="opacity-80">Target Kalori</p>
            <b>{profile?.dailyCalorieTarget || 0} kkal</b>
          </div>
        </div>
      </div>

      {msg && (
        <div className="bg-green-50 text-green-700 border border-green-100 rounded-2xl p-4 font-medium">
          {msg}
        </div>
      )}

      <button
        onClick={generateAiPlan}
        disabled={loading || result?.alreadyGenerated}
        className="bg-green-700 disabled:bg-slate-500 text-white rounded-xl px-5 py-3 font-bold flex gap-2 items-center"
      >
        <Sparkles size={18} />
        {loading
          ? 'Membuat Rekomendasi...'
          : result?.alreadyGenerated
          ? 'Sudah Pernah Generate'
          : 'Generate AI Recommendation'}
      </button>

      {result && (
        <div className="space-y-6">
          <div className="bg-(--bg-card) rounded-3xl border border-(--border-subtle) p-6">
            <h3 className="font-bold text-xl text-(--text-main) mb-3">
              Ringkasan AI
            </h3>
            <p className="text-sm text-(--text-muted) whitespace-pre-line">
              {result.summary}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card
              icon={<Utensils />}
              title="Rekomendasi Makanan"
              text={result.foodPlan}
            />

            <Card
              icon={<Dumbbell />}
              title="Rekomendasi Workout"
              text={result.workoutPlan}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function Card({ icon, title, text }) {
  return (
    <div className="bg-(--bg-card) rounded-3xl border border-(--border-subtle) p-6">
      <div className="w-12 h-12 rounded-2xl bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center mb-4">
        {icon}
      </div>

      <h3 className="font-bold text-xl text-(--text-main) mb-3">
        {title}
      </h3>

      <p className="text-sm text-(--text-muted) whitespace-pre-line leading-relaxed">
        {text}
      </p>
    </div>
  );
}