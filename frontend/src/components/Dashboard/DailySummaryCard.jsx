import { useEffect, useState, useCallback } from 'react';
import { Sparkles, RefreshCw, Cpu, Server, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { api } from '../../lib/api';

// ── Skeleton loader ───────────────────────────────────────────────────────────

function SkeletonLine({ w = 'w-full' }) {
  return <div className={`h-3 rounded-full bg-white/20 animate-pulse ${w}`} />;
}

function SummarySkeleton() {
  return (
    <div className="space-y-2.5 mt-4">
      <SkeletonLine />
      <SkeletonLine w="w-5/6" />
      <SkeletonLine w="w-4/6" />
      <SkeletonLine />
      <SkeletonLine w="w-3/4" />
    </div>
  );
}

// ── Mode badge ────────────────────────────────────────────────────────────────

function ModeBadge({ mode, cached }) {
  if (!mode) return null;
  const configs = {
    ai:       { icon: Cpu,           label: 'OpenRouter AI',     cls: 'bg-purple-500/20 text-purple-200 border-purple-400/30' },
    local:    { icon: Server,        label: 'Analisis Lokal',    cls: 'bg-blue-500/20   text-blue-200   border-blue-400/30'   },
    fallback: { icon: AlertCircle,   label: 'Mode Fallback',     cls: 'bg-amber-500/20  text-amber-200  border-amber-400/30'  },
  };
  const cfg = configs[mode] || configs.local;
  const Icon = cfg.icon;
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border ${cfg.cls}`}>
        <Icon size={11} /> {cfg.label}
      </span>
      {cached && (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border bg-green-500/20 text-green-200 border-green-400/30">
          <CheckCircle size={11} /> Cache hari ini
        </span>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function DailySummaryCard() {
  const [summary,   setSummary]   = useState('');
  const [mode,      setMode]      = useState(null);
  const [cached,    setCached]    = useState(false);
  const [status,    setStatus]    = useState('idle'); // idle | loading | done | error
  const [errorMsg,  setErrorMsg]  = useState('');

  const load = useCallback(async (forceReset = false) => {
    try {
      setStatus('loading');
      setErrorMsg('');

      // If resetting, delete today's cache first
      if (forceReset) {
        await api.resetDailySummary().catch(() => {}); // silent fail on reset
      }

      const res = await api.getDailyAiSummary();
      setSummary(res.summary || '');
      setMode(res.mode || 'local');
      setCached(res.cached || false);
      setStatus('done');
    } catch (err) {
      setErrorMsg(err.message || 'Gagal memuat ringkasan.');
      // Graceful fallback — show encouraging default text, don't show error state to user
      setSummary('Selamat datang kembali! 🌿 Tetap semangat menjalani hari ini. Ingat: konsistensi kecil setiap hari adalah kunci menuju tujuan kesehatanmu. Minum air cukup, gerak aktif, dan istirahat berkualitas!');
      setMode('fallback');
      setStatus('done');
    }
  }, []);

  // Auto-load on mount
  useEffect(() => {
    load();
  }, [load]);

  const isLoading = status === 'loading';

  return (
    <div className="relative overflow-hidden rounded-4xl bg-gradient-to-br from-green-800 via-emerald-700 to-teal-700 p-6 md:p-8 shadow-2xl shadow-green-900/30">
      {/* decorative blobs */}
      <div className="pointer-events-none absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/5 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-8 -left-8 w-40 h-40 rounded-full bg-emerald-400/10 blur-2xl" />

      {/* header row */}
      <div className="relative flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
        <div className="flex items-center gap-3">
          {/* animated icon */}
          <div className={`w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center shrink-0 ${isLoading ? 'animate-pulse' : ''}`}>
            {isLoading
              ? <Loader2 size={24} className="text-white animate-spin" />
              : <Sparkles size={24} className="text-yellow-300" />
            }
          </div>
          <div>
            <h2 className="text-xl font-black text-white leading-tight">Daily AI Insight</h2>
            <p className="text-green-200 text-xs mt-0.5">Ringkasan kesehatan personal hari ini</p>
          </div>
        </div>

        {/* badges + refresh */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          {!isLoading && <ModeBadge mode={mode} cached={cached} />}
          <button
            onClick={() => load(true)}
            disabled={isLoading}
            title="Generate ulang ringkasan"
            className="p-2 rounded-xl bg-white/15 hover:bg-white/25 disabled:opacity-40 transition text-white"
            aria-label="Refresh ringkasan"
          >
            <RefreshCw size={15} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* content */}
      <div className="relative">
        {isLoading && <SummarySkeleton />}

        {!isLoading && summary && (
          <div className="bg-white/10 rounded-3xl p-5 border border-white/10 backdrop-blur-sm">
            <p className="text-white text-sm leading-relaxed whitespace-pre-line">
              {summary}
            </p>
          </div>
        )}

        {!isLoading && !summary && (
          <div className="bg-white/10 rounded-3xl p-5 border border-white/10 text-green-100 text-sm">
            Klik tombol refresh untuk generate ringkasan AI hari ini.
          </div>
        )}
      </div>

      {/* dev error hint (small, non-intrusive) */}
      {errorMsg && status === 'done' && mode === 'fallback' && (
        <p className="relative mt-3 text-[11px] text-green-300/60 flex items-center gap-1">
          <AlertCircle size={11} /> Menggunakan fallback lokal
        </p>
      )}
    </div>
  );
}
