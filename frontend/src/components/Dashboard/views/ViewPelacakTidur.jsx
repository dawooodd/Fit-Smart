import { useEffect, useState } from 'react';
import { Moon, TrendingUp, Clock, Loader2, AlertCircle } from 'lucide-react';
import { api } from '../../../lib/api';

// ── SVG line-chart helper ─────────────────────────────────────────────────────

const W = 500;
const H = 120;
const PAD = { top: 16, right: 16, bottom: 32, left: 36 };

function toPoints(data, maxVal) {
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top  - PAD.bottom;
  return data.map((d, i) => {
    const x = PAD.left + (i / (data.length - 1)) * chartW;
    const y = PAD.top  + chartH - (maxVal > 0 ? (d.sleepHours / maxVal) * chartH : 0);
    return { x, y, ...d };
  });
}

function SleepLineChart({ data }) {
  if (!data || data.length === 0) return null;

  const maxVal = Math.max(...data.map((d) => d.sleepHours), 9); // at least 9h ceiling
  const points = toPoints(data, maxVal);
  const pathD  = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const areaD  = `${pathD} L${points[points.length-1].x},${(H - PAD.bottom).toFixed(1)} L${PAD.left},${(H - PAD.bottom).toFixed(1)} Z`;

  // reference line at 8 hours
  const ref8y = PAD.top + (H - PAD.top - PAD.bottom) - (8 / maxVal) * (H - PAD.top - PAD.bottom);

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[280px]" aria-label="Grafik pola tidur 7 hari">
        <defs>
          <linearGradient id="sleepGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#818cf8" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#818cf8" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* grid lines */}
        {[0, 3, 6, 9].map((h) => {
          const gy = PAD.top + (H - PAD.top - PAD.bottom) - (h / maxVal) * (H - PAD.top - PAD.bottom);
          return (
            <g key={h}>
              <line x1={PAD.left} y1={gy} x2={W - PAD.right} y2={gy} stroke="#3730a3" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.4" />
              <text x={PAD.left - 4} y={gy + 4} fill="#a5b4fc" fontSize="9" textAnchor="end">{h}j</text>
            </g>
          );
        })}

        {/* 8h recommended reference */}
        <line x1={PAD.left} y1={ref8y} x2={W - PAD.right} y2={ref8y} stroke="#34d399" strokeWidth="1" strokeDasharray="6 3" opacity="0.7" />
        <text x={W - PAD.right + 2} y={ref8y + 4} fill="#34d399" fontSize="8">8j</text>

        {/* area fill */}
        <path d={areaD} fill="url(#sleepGrad)" />

        {/* line */}
        <path d={pathD} fill="none" stroke="#818cf8" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />

        {/* dots + labels */}
        {points.map((p) => (
          <g key={p.date}>
            <circle cx={p.x} cy={p.y} r="4" fill={p.sleepHours >= 7 ? '#818cf8' : p.sleepHours >= 5 ? '#fbbf24' : '#f87171'} stroke="#1e1b4b" strokeWidth="1.5" />
            {/* day label */}
            <text x={p.x} y={H - PAD.bottom + 14} fill="#a5b4fc" fontSize="10" textAnchor="middle">{p.label}</text>
            {/* value on hover via title */}
            <title>{p.label}: {p.sleepHours}j</title>
          </g>
        ))}
      </svg>
    </div>
  );
}

// ── stat card ─────────────────────────────────────────────────────────────────

function StatCard({ label, value, sub, colour }) {
  return (
    <div className="bg-indigo-950/40 border border-indigo-700/40 rounded-2xl p-3 flex flex-col gap-0.5">
      <p className="text-indigo-300 text-[11px] font-semibold uppercase tracking-wider">{label}</p>
      <p className={`text-2xl font-black ${colour}`}>{value}</p>
      {sub && <p className="text-indigo-300 text-[11px]">{sub}</p>}
    </div>
  );
}

// ── quality badge ─────────────────────────────────────────────────────────────

function qualityBadge(hours) {
  if (hours === 0)    return { text: 'Tidak ada data', cls: 'bg-indigo-800/50 text-indigo-300' };
  if (hours >= 7)     return { text: 'Baik',   cls: 'bg-green-900/50  text-green-300'  };
  if (hours >= 5)     return { text: 'Cukup',  cls: 'bg-yellow-900/50 text-yellow-300' };
  return               { text: 'Kurang',  cls: 'bg-red-900/50    text-red-300'    };
}

// ── main component ────────────────────────────────────────────────────────────

export default function ViewPelacakTidur({ progress }) {
  const [weeklyData, setWeeklyData] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState('');

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        setLoading(true);
        const res = await api.getSleepWeekly();
        if (active) setWeeklyData(res.data || []);
      } catch (err) {
        if (active) setError(err.message || 'Gagal memuat data tidur.');
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, []);

  // today from prop (live) or weekly array last item
  const todayMinutes = progress?.sleepDuration ?? weeklyData[weeklyData.length - 1]?.sleepDuration ?? 0;
  const todayHours   = Math.round((todayMinutes / 60) * 10) / 10;
  const todayH       = Math.floor(todayMinutes / 60);
  const todayM       = todayMinutes % 60;

  const avgHours = weeklyData.length
    ? Math.round((weeklyData.reduce((s, d) => s + d.sleepHours, 0) / weeklyData.filter(d => d.sleepHours > 0).length || 0) * 10) / 10
    : 0;

  const bestDay = weeklyData.reduce((best, d) => d.sleepHours > (best?.sleepHours ?? 0) ? d : best, null);
  const quality = qualityBadge(todayHours);

  return (
    <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto">
      {/* page title */}
      <div className="flex items-center gap-3 text-(--text-main)">
        <Moon className="text-indigo-400" />
        <h2 className="text-2xl font-bold">Pelacak Pola Tidur</h2>
      </div>

      {/* main card */}
      <div className="bg-indigo-900 rounded-4xl p-5 md:p-6 text-white shadow-xl shadow-indigo-900/20 space-y-4">

        {/* today summary */}
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Clock size={14} className="text-indigo-300" />
              <p className="text-indigo-300 font-bold uppercase tracking-widest text-xs">Durasi Tidur Hari Ini</p>
            </div>
            <p className="text-4xl font-black tracking-tight">
              {todayH}<span className="text-2xl text-indigo-300 font-bold mr-1">j</span>
              {todayM}<span className="text-2xl text-indigo-300 font-bold">m</span>
            </p>
            <span className={`inline-block mt-2 text-xs font-bold px-3 py-1 rounded-full ${quality.cls}`}>
              {quality.text}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full md:w-auto md:grid-cols-2">
            <StatCard label="Rata-rata 7 hari" value={`${avgHours}j`}
              sub="rekomendasi ≥ 7j"
              colour={avgHours >= 7 ? 'text-green-300' : avgHours >= 5 ? 'text-yellow-300' : 'text-red-300'} />
            <StatCard label="Tidur Terlama"
              value={bestDay ? `${bestDay.sleepHours}j` : '–'}
              sub={bestDay?.label || ''}
              colour="text-indigo-200" />
          </div>
        </div>

        {/* chart */}
        <div className="bg-indigo-950/40 border border-indigo-700/40 rounded-3xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} className="text-indigo-300" />
            <p className="text-indigo-200 text-sm font-semibold">Grafik 7 Hari Terakhir</p>
            <span className="ml-auto flex items-center gap-1 text-[10px] text-emerald-400">
              <span className="inline-block w-5 border-t border-dashed border-emerald-400" />
              Rekomendasi (8j)
            </span>
          </div>

          {loading && (
            <div className="flex items-center justify-center h-40 gap-2 text-indigo-300">
              <Loader2 size={20} className="animate-spin" />
              <span className="text-sm">Memuat data...</span>
            </div>
          )}

          {!loading && error && (
            <div className="flex items-center gap-2 text-red-300 text-sm p-4 bg-red-900/20 rounded-2xl">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          {!loading && !error && <SleepLineChart data={weeklyData} />}
        </div>

        {/* legend */}
        <div className="flex gap-4 text-xs text-indigo-300 flex-wrap">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-indigo-400 inline-block" /> ≥ 7j (Baik)</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-yellow-400 inline-block" /> 5–7j (Cukup)</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-400 inline-block"  /> &lt; 5j (Kurang)</span>
        </div>
      </div>

      {/* tips */}
      <div className="bg-(--bg-card) border border-(--border-subtle) rounded-3xl p-6">
        <h3 className="font-bold text-(--text-main) mb-3 flex items-center gap-2">
          <Moon size={16} className="text-indigo-400" /> Tips Tidur Sehat
        </h3>
        <ul className="text-sm text-(--text-muted) space-y-1 list-disc list-inside">
          <li>Tidur dan bangun di jam yang sama setiap hari.</li>
          <li>Hindari kafein 6 jam sebelum tidur.</li>
          <li>Kurangi paparan layar 30 menit sebelum tidur.</li>
          <li>Pastikan kamar gelap, sejuk, dan tenang.</li>
        </ul>
      </div>
    </div>
  );
}
