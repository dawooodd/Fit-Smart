import { useState } from 'react';
import { Camera, Loader2, Sparkles, X, CheckCircle, AlertCircle, Flame, Beef, Wheat, Droplets, Lock } from 'lucide-react';
import { api } from '../../../lib/api';
import { useAuth } from '../../../context/AuthContext';

// ── helpers ──────────────────────────────────────────────────────────────────

function normalizeDetectedFoods(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return [value];
}

/** Format label "nasi_goreng" → "Nasi Goreng" */
function formatLabel(label = '') {
  return label
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Confidence number 0–1 → colour class */
function confidenceColour(conf) {
  const pct = conf * 100;
  if (pct >= 75) return 'text-green-600';
  if (pct >= 50) return 'text-yellow-600';
  return 'text-red-500';
}

// ── sub-components ────────────────────────────────────────────────────────────

function NutrientBadge({ icon: Icon, label, value, unit, colour }) {
  return (
    <div className="flex flex-col items-center gap-1 bg-white/60 dark:bg-white/10 rounded-2xl px-4 py-3 min-w-[72px]">
      <Icon size={20} className={colour} />
      <span className="text-lg font-black text-(--text-main)">{value ?? '–'}</span>
      <span className="text-[11px] text-(--text-muted) font-medium">{unit}</span>
      <span className="text-[10px] text-(--text-muted)">{label}</span>
    </div>
  );
}

function ConfidenceBar({ label, confidence }) {
  const pct = Math.round(confidence * 100);
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="font-medium text-(--text-main)">{formatLabel(label)}</span>
        <span className={`font-bold ${confidenceColour(confidence)}`}>{pct}%</span>
      </div>
      <div className="h-2 rounded-full bg-(--border-subtle) overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${pct >= 75 ? 'bg-green-500' : pct >= 50 ? 'bg-yellow-400' : 'bg-red-400'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ── Modal ─────────────────────────────────────────────────────────────────────

function ResultModal({ analysis, onClose }) {
  if (!analysis) return null;

  const topPredictions =
    analysis.aiResponse?.topPredictions ||
    analysis.aiResponse?.raw?.top_predictions ||
    [];

  const best = topPredictions[0] || {};
  const bestLabel = best.label || analysis.aiResponse?.predictedClass || 'Unknown';
  const bestConf  = typeof best.confidence === 'number' ? best.confidence : 0;
  const nutrition = best.nutrition || {};

  const isCompleted = analysis.status === 'completed';

  return (
    /* backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      {/* card */}
      <div
        className="relative w-full max-w-lg md:max-w-xl bg-(--bg-card) rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* close btn */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-(--bg-subtle) hover:bg-(--border-subtle) transition"
          aria-label="Tutup"
        >
          <X size={18} className="text-(--text-muted)" />
        </button>

        {/* scrollable content — hidden scrollbar */}
        <div
          className="overflow-y-auto p-6 space-y-5"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* header */}
          <div className="flex items-start gap-3 pr-10">
            {isCompleted
              ? <CheckCircle className="text-green-500 mt-0.5 shrink-0" size={22} />
              : <AlertCircle className="text-amber-500 mt-0.5 shrink-0" size={22} />
            }
            <div>
              <h3 className="text-xl font-black text-(--text-main)">
                {isCompleted ? formatLabel(bestLabel) : 'Analisis Tersimpan'}
              </h3>
              <p className="text-sm text-(--text-muted)">
                Status: <span className={`font-semibold ${isCompleted ? 'text-green-600' : 'text-amber-600'}`}>{analysis.status}</span>
              </p>
            </div>
          </div>

          {/* confidence score (top prediction) */}
          {isCompleted && bestConf > 0 && (
            <div className="bg-(--bg-subtle) rounded-2xl px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-(--text-muted) mb-2">Confidence Score</p>
              <ConfidenceBar label={bestLabel} confidence={bestConf} />
            </div>
          )}

          {/* macronutrients */}
          {isCompleted && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-(--text-muted) mb-3">Estimasi Nutrisi (per 100g)</p>
              <div className="flex gap-2 flex-wrap justify-center">
                <NutrientBadge
                  icon={Flame} label="Kalori"
                  value={Math.round(analysis.estimatedCalories ?? nutrition.calories ?? 0) || '–'}
                  unit="kkal" colour="text-orange-500"
                />
                <NutrientBadge
                  icon={Beef} label="Protein"
                  value={Number(analysis.estimatedProtein ?? nutrition.protein ?? 0).toFixed(1) || '–'}
                  unit="g" colour="text-blue-500"
                />
                <NutrientBadge
                  icon={Wheat} label="Karbo"
                  value={Number(analysis.estimatedCarbs ?? nutrition.carbs ?? 0).toFixed(1) || '–'}
                  unit="g" colour="text-yellow-500"
                />
                <NutrientBadge
                  icon={Droplets} label="Lemak"
                  value={Number(analysis.estimatedFat ?? nutrition.fat ?? 0).toFixed(1) || '–'}
                  unit="g" colour="text-pink-500"
                />
              </div>
            </div>
          )}

          {/* top-3 predictions */}
          {isCompleted && topPredictions.length > 1 && (
            <div className="bg-(--bg-subtle) rounded-2xl p-4 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-(--text-muted)">Top Prediksi Model</p>
              {topPredictions.slice(0, 3).map((item) => (
                <ConfidenceBar key={item.label} label={item.label} confidence={item.confidence} />
              ))}
            </div>
          )}

          {/* fallback messages */}
          {analysis.aiResponse?.message && (
            <p className="text-sm text-amber-700 bg-amber-50 rounded-xl p-3">{analysis.aiResponse.message}</p>
          )}
          {analysis.aiResponse?.error && (
            <p className="text-sm text-red-700 bg-red-50 rounded-xl p-3">{analysis.aiResponse.error}</p>
          )}
        </div>

        {/* sticky footer button */}
        <div className="shrink-0 px-6 pb-6 pt-2">
          <button
            onClick={onClose}
            className="w-full bg-green-700 hover:bg-green-800 text-white rounded-2xl py-3 font-bold transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

// ── main view ────────────────────────────────────────────────────────────────

export default function ViewPhotoAI() {
  const { isDemo } = useAuth();
  const [file,      setFile]      = useState(null);
  const [preview,   setPreview]   = useState('');
  const [analysis,  setAnalysis]  = useState(null);
  const [msg,       setMsg]       = useState('');
  const [msgType,   setMsgType]   = useState('success'); // 'success' | 'error'
  const [loading,   setLoading]   = useState(false);
  const [showModal, setShowModal] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (!file) {
      setMsg('Pilih foto makanan terlebih dahulu.');
      setMsgType('error');
      return;
    }

    setLoading(true);
    setMsg('');
    setAnalysis(null);
    setShowModal(false);

    try {
      const fd = new FormData();
      fd.append('image', file);
      const res = await api.uploadPhoto(fd);
      const result = res.analysis || res;
      setAnalysis(result);
      setShowModal(true);
      setMsg(
        result.status === 'completed'
          ? 'Foto berhasil dianalisis oleh model AI.'
          : 'Foto tersimpan. Model AI belum tersedia atau analisis belum selesai.',
      );
      setMsgType(result.status === 'completed' ? 'success' : 'warn');
    } catch (err) {
      setMsg(err.message || 'Upload gagal. Coba lagi.');
      setMsgType('error');
    } finally {
      setLoading(false);
    }
  }

  function handleFileChange(e) {
    const f = e.target.files?.[0];
    setFile(f || null);
    setPreview(f ? URL.createObjectURL(f) : '');
    setAnalysis(null);
    setMsg('');
    setShowModal(false);
  }

  const msgClass = {
    success: 'bg-green-50 text-green-700 border-green-100',
    warn:    'bg-amber-50  text-amber-700  border-amber-100',
    error:   'bg-red-50    text-red-700    border-red-100',
  }[msgType] ?? 'bg-green-50 text-green-700 border-green-100';

  return (
    <>
      {/* Modal */}
      {showModal && (
        <ResultModal
          analysis={analysis}
          onClose={() => setShowModal(false)}
        />
      )}

      <div className="space-y-6 animate-fadeIn">
        {/* page header */}
        <div className="bg-(--bg-card) rounded-4xl border border-(--border-subtle) p-8">
          <div className="flex gap-3 items-center mb-3 text-(--text-main)">
            <Camera />
            <h2 className="text-2xl font-black">Photo AI Food Detection</h2>
          </div>
          <p className="text-(--text-muted)">
            Upload foto makanan. Backend menjalankan model TensorFlow FitSmart untuk deteksi kelas dan estimasi nutrisi secara real-time.
          </p>
        </div>

        {/* demo restriction banner */}
        {isDemo && (
          <div className="flex items-start gap-3 border border-amber-200 bg-amber-50 dark:bg-amber-950/40 dark:border-amber-800 rounded-2xl p-4">
            <Lock size={20} className="text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-800 dark:text-amber-300 text-sm">Fitur Terbatas (Mode Demo)</p>
              <p className="text-amber-700 dark:text-amber-400 text-sm mt-1">
                Fitur Deteksi AI eksklusif untuk akun terdaftar. Silakan <a href="/onboarding" className="underline font-semibold hover:text-amber-900">Daftar</a> atau <a href="/login" className="underline font-semibold hover:text-amber-900">Login</a> untuk mencoba.
              </p>
            </div>
          </div>
        )}

        {/* status banner */}
        {msg && (
          <div className={`border rounded-2xl p-4 font-medium ${msgClass}`}>{msg}</div>
        )}

        {/* upload form */}
        <form onSubmit={submit} className="bg-(--bg-card) rounded-4xl border border-(--border-subtle) p-6 space-y-5">
          <label className={`block rounded-4xl border-2 border-dashed border-(--border-subtle) bg-(--bg-subtle) p-8 text-center transition-colors ${isDemo ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer hover:border-green-400'}`}>
            {preview
              ? <img src={preview} className="max-h-96 mx-auto rounded-3xl object-contain" alt="Preview" />
              : (
                <div className="space-y-2 text-(--text-muted)">
                  <Camera size={40} className="mx-auto opacity-40" />
                  <p className="font-medium">{isDemo ? 'Upload dinonaktifkan di Mode Demo' : 'Klik untuk memilih foto makanan'}</p>
                  <p className="text-xs">JPG, PNG, WEBP — max 10 MB</p>
                </div>
              )
            }
            <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} disabled={isDemo} />
          </label>

          <div className="flex gap-3 flex-wrap">
            <button
              type="submit"
              disabled={loading || isDemo}
              className={`bg-green-700 hover:bg-green-800 text-white rounded-xl px-6 py-3 font-bold disabled:opacity-60 inline-flex gap-2 items-center transition ${isDemo ? 'cursor-not-allowed' : ''}`}
              title={isDemo ? 'Fitur ini hanya tersedia untuk akun terdaftar' : ''}
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              {isDemo ? 'Upload Tidak Tersedia' : loading ? 'Menganalisis...' : 'Upload & Detect'}
            </button>

            {analysis && !showModal && (
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="border border-green-700 text-green-700 hover:bg-green-50 rounded-xl px-6 py-3 font-bold inline-flex gap-2 items-center transition"
              >
                <Sparkles size={18} />
                Lihat Hasil
              </button>
            )}
          </div>
        </form>

        {/* how-it-works info card */}
        <div className="bg-(--bg-card) rounded-4xl border border-(--border-subtle) p-6">
          <h3 className="font-bold text-(--text-main) mb-3 flex items-center gap-2">
            <Sparkles size={18} className="text-green-600" />
            Cara Kerja Model AI
          </h3>
          <ol className="space-y-2 text-sm text-(--text-muted) list-decimal list-inside">
            <li>Foto dikirim ke backend Node.js via multipart form.</li>
            <li>Backend menjalankan <code className="bg-(--bg-subtle) px-1 rounded">inference.py</code> sebagai subprocess Python.</li>
            <li>Model TensorFlow (<code className="bg-(--bg-subtle) px-1 rounded">fitsmart_model.keras</code>) mengklasifikasi 24 kelas makanan Indonesia.</li>
            <li>Confidence score & data nutrisi dikembalikan sebagai JSON dan ditampilkan di modal.</li>
          </ol>
        </div>
      </div>
    </>
  );
}
