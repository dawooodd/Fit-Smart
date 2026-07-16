import { useState } from 'react';
import { Dumbbell, Sparkles, Target, Utensils, RotateCcw, Cpu, Server } from 'lucide-react';
import { api } from '../../../lib/api';

// ── helpers ───────────────────────────────────────────────────────────────────

function ModeBadge({ mode }) {
  if (!mode) return null;
  const isAi = mode === 'ai';
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full
      ${isAi ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300'
              : 'bg-blue-100   text-blue-700   dark:bg-blue-900/40   dark:text-blue-300'}`}>
      {isAi ? <Cpu size={12} /> : <Server size={12} />}
      {isAi ? 'OpenRouter AI' : 'Rekomendasi Lokal'}
    </span>
  );
}

function Card({ icon, title, text }) {
  return (
    <div className="bg-(--bg-card) rounded-3xl border border-(--border-subtle) p-6">
      <div className="w-12 h-12 rounded-2xl bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="font-bold text-xl text-(--text-main) mb-3">{title}</h3>
      <p className="text-sm text-(--text-muted) whitespace-pre-line leading-relaxed">{text}</p>
    </div>
  );
}

// ── main component ────────────────────────────────────────────────────────────

export default function ViewTarget({ profile }) {
  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [msg,     setMsg]     = useState('');
  const [msgType, setMsgType] = useState('success'); // 'success' | 'error' | 'info'

  async function generateAiPlan() {
    try {
      setLoading(true);
      setMsg('');
      const res = await api.getAiPlanRecommendation();
      setResult(res);
      setMsg(
        res.alreadyGenerated
          ? 'Rekomendasi sudah tersimpan untuk akun ini.'
          : res.mode === 'ai'
            ? 'Rekomendasi berhasil dibuat oleh OpenRouter AI.'
            : 'Rekomendasi berhasil dibuat (mode lokal — tambahkan OPENROUTER_API_KEY untuk AI penuh).',
      );
      setMsgType(res.alreadyGenerated ? 'info' : 'success');
    } catch (err) {
      setMsg(err.message || 'Gagal membuat rekomendasi AI. Coba lagi.');
      setMsgType('error');
    } finally {
      setLoading(false);
    }
  }

  async function resetPlan() {
    if (!window.confirm('Reset rekomendasi AI? Anda bisa generate ulang setelah ini.')) return;
    try {
      setResetting(true);
      await api.resetAiPlan();
      setResult(null);
      setMsg('Rekomendasi berhasil direset. Silakan generate ulang.');
      setMsgType('info');
    } catch (err) {
      setMsg(err.message || 'Gagal reset rekomendasi.');
      setMsgType('error');
    } finally {
      setResetting(false);
    }
  }

  const msgClass = {
    success: 'bg-green-50 text-green-700 border-green-100 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800',
    error:   'bg-red-50   text-red-700   border-red-100   dark:bg-red-900/20   dark:text-red-300   dark:border-red-800',
    info:    'bg-blue-50  text-blue-700  border-blue-100  dark:bg-blue-900/20  dark:text-blue-300  dark:border-blue-800',
  }[msgType];

  const canGenerate = !loading && !result?.alreadyGenerated && !result?.summary;

  return (
    <div className="space-y-6 animate-fadeIn">

      {/* header card */}
      <div className="bg-linear-to-r from-green-700 to-emerald-600 rounded-4xl p-8 text-white">
        <div className="flex items-center gap-3 mb-3">
          <Target />
          <h2 className="text-2xl font-black">Target & Rekomendasi AI</h2>
        </div>
        <p className="text-green-100 text-sm leading-relaxed max-w-lg">
          Generate rekomendasi makanan dan workout personal. Jika API key OpenRouter tersedia, rekomendasi dibuat oleh AI — jika tidak, sistem menggunakan logika lokal berbasis data profil Anda.
        </p>
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
          <div className="bg-white/15 rounded-2xl p-4">
            <p className="opacity-75 text-xs mb-1">Goal</p>
            <b className="capitalize">{profile?.goal?.replace(/_/g, ' ') || '–'}</b>
          </div>
          <div className="bg-white/15 rounded-2xl p-4">
            <p className="opacity-75 text-xs mb-1">BMR</p>
            <b>{profile?.bmr || 0} kkal</b>
          </div>
          <div className="bg-white/15 rounded-2xl p-4">
            <p className="opacity-75 text-xs mb-1">Target Kalori</p>
            <b>{profile?.dailyCalorieTarget || 0} kkal</b>
          </div>
        </div>
      </div>

      {/* status banner */}
      {msg && (
        <div className={`border rounded-2xl p-4 font-medium text-sm ${msgClass}`}>{msg}</div>
      )}

      {/* action buttons */}
      <div className="flex gap-3 flex-wrap">
        <button
          onClick={generateAiPlan}
          disabled={!canGenerate}
          className="bg-green-700 hover:bg-green-800 disabled:bg-slate-400 text-white rounded-xl px-5 py-3 font-bold flex gap-2 items-center transition"
        >
          <Sparkles size={18} />
          {loading
            ? 'Membuat Rekomendasi...'
            : result?.alreadyGenerated || result?.summary
              ? 'Sudah Ter-generate'
              : 'Generate Rekomendasi'}
        </button>

        {(result?.summary) && (
          <button
            onClick={resetPlan}
            disabled={resetting}
            className="border border-slate-300 dark:border-slate-600 text-(--text-muted) hover:bg-(--bg-subtle) rounded-xl px-5 py-3 font-bold flex gap-2 items-center transition"
          >
            <RotateCcw size={16} />
            {resetting ? 'Mereset...' : 'Reset & Generate Ulang'}
          </button>
        )}
      </div>

      {/* results */}
      {result?.summary && (
        <div className="space-y-5">
          <div className="bg-(--bg-card) rounded-3xl border border-(--border-subtle) p-6">
            <div className="flex items-center gap-3 mb-3">
              <h3 className="font-bold text-xl text-(--text-main)">Ringkasan AI</h3>
              <ModeBadge mode={result.mode} />
            </div>
            <p className="text-sm text-(--text-muted) whitespace-pre-line leading-relaxed">{result.summary}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <Card icon={<Utensils />} title="Rekomendasi Makanan"  text={result.foodPlan}    />
            <Card icon={<Dumbbell />} title="Rekomendasi Workout"  text={result.workoutPlan} />
          </div>
        </div>
      )}
    </div>
  );
}
