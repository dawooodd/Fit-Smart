import React, { useState } from 'react';
import { Camera, Loader2, Sparkles } from 'lucide-react';
import { api } from '../../../lib/api';

function normalizeDetectedFoods(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return [value];
}

export default function ViewPhotoAI() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (!file) return setMsg('Pilih foto makanan terlebih dahulu.');

    setLoading(true);
    setMsg('');
    setAnalysis(null);

    try {
      const fd = new FormData();
      fd.append('image', file);
      const res = await api.uploadPhoto(fd);
      const result = res.analysis || res;
      setAnalysis(result);
      setMsg(result.status === 'completed' ? 'Foto berhasil dianalisis oleh model AI.' : 'Foto tersimpan. Model AI belum tersedia atau analisis belum selesai.');
    } catch (err) {
      setMsg(err.message || 'Upload gagal. Coba lagi.');
    } finally {
      setLoading(false);
    }
  }

  const detectedFoods = normalizeDetectedFoods(analysis?.detectedFoods);
  const topPredictions = analysis?.aiResponse?.topPredictions || analysis?.aiResponse?.raw?.top_predictions || [];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-(--bg-card) rounded-4xl border border-(--border-subtle) p-8">
        <div className="flex gap-3 items-center mb-3 text-(--text-main)">
          <Camera />
          <h2 className="text-2xl font-black">Photo AI Food Detection</h2>
        </div>
        <p className="text-(--text-muted)">Upload foto makanan. Backend akan menjalankan model TensorFlow FitSmart jika file model sudah tersedia.</p>
      </div>

      {msg && <div className="bg-green-50 text-green-700 border border-green-100 rounded-2xl p-4 font-medium">{msg}</div>}

      <form onSubmit={submit} className="bg-(--bg-card) rounded-4xl border border-(--border-subtle) p-6 space-y-5">
        <label className="block rounded-4xl border-2 border-dashed border-(--border-subtle) bg-(--bg-subtle) p-8 text-center cursor-pointer">
          {preview ? <img src={preview} className="max-h-96 mx-auto rounded-3xl" /> : <span className="text-(--text-muted)">Klik untuk memilih foto makanan</span>}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              setFile(f || null);
              setPreview(f ? URL.createObjectURL(f) : '');
              setAnalysis(null);
              setMsg('');
            }}
          />
        </label>
        <button disabled={loading} className="bg-green-700 text-white rounded-xl px-5 py-3 font-bold disabled:opacity-60 inline-flex gap-2 items-center">
          {loading && <Loader2 size={18} className="animate-spin" />}
          {loading ? 'Menganalisis...' : 'Upload & Detect'}
        </button>

        {analysis && (
          <div className="rounded-2xl bg-(--bg-subtle) p-5 text-(--text-main) space-y-4">
            <div className="flex items-start gap-3">
              <Sparkles className="text-green-600 mt-1" />
              <div>
                <b className="block text-lg">
                  {analysis.aiResponse?.predictedClass || topPredictions[0]?.label || detectedFoods[0]?.label || 'Analisis tersimpan'}
                </b>
                <p className="text-sm text-(--text-muted)">Status: {analysis.status}</p>
              </div>
            </div>
            <p className="text-sm text-(--text-muted)">
              {analysis.estimatedCalories ?? '-'} kkal • P {analysis.estimatedProtein ?? '-'}g • C {analysis.estimatedCarbs ?? '-'}g • F {analysis.estimatedFat ?? '-'}g
            </p>
            {topPredictions.length > 0 && (
              <div className="space-y-2">
                {topPredictions.map((item) => (
                  <div key={item.label} className="flex justify-between text-sm border-t border-(--border-subtle) pt-2">
                    <span>{item.label}</span>
                    <span className="font-semibold">{Math.round(Number(item.confidence || 0) * 100)}%</span>
                  </div>
                ))}
              </div>
            )}
            {analysis.aiResponse?.message && <p className="text-sm text-amber-700">{analysis.aiResponse.message}</p>}
            {analysis.aiResponse?.error && <p className="text-sm text-red-700">{analysis.aiResponse.error}</p>}
          </div>
        )}
      </form>
    </div>
  );
}
