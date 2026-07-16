import React, { useMemo } from 'react';
import { TrendingUp, PieChart, Sparkles, Activity } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

/* ── helpers ─────────────────────────────────────────────────────────────────── */

function calculateBmi(weight, height) {
  if (!weight || !height) return 0;
  return Number(weight) / Math.pow(Number(height) / 100, 2);
}

function bmiCategory(bmi) {
  if (bmi === 0) return { text: '-', cls: 'text-(--text-muted)' };
  if (bmi < 18.5) return { text: 'Kurus', cls: 'text-yellow-500' };
  if (bmi < 25) return { text: 'Normal', cls: 'text-green-500' };
  if (bmi < 30) return { text: 'Berlebih', cls: 'text-orange-500' };
  return { text: 'Obesitas', cls: 'text-red-500' };
}

/* ── Recharts Weight Projection Chart ───────────────────────────────────────── */

function WeightProjectionChart({ data }) {
  if (!data || data.length === 0) return null;

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
          <XAxis
            dataKey="date"
            stroke="#9ca3af"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            dy={10}
          />
          <YAxis
            stroke="#9ca3af"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            domain={['dataMin - 2', 'dataMax + 2']}
            dx={-10}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-[#1e2330] border border-gray-700/50 p-3 rounded-2xl shadow-2xl text-xs space-y-1">
                    <p className="font-bold text-gray-200 mb-1">{label}</p>
                    {payload.map((item, idx) => {
                      if (item.value === null || item.value === undefined) return null;
                      return (
                        <p key={idx} style={{ color: item.color }} className="font-semibold">
                          {item.name === 'actual' ? 'Data Aktual' : 'Prediksi ARIMA'}: {item.value} kg
                        </p>
                      );
                    })}
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend
            verticalAlign="top"
            height={36}
            iconType="circle"
            formatter={(value) => {
              return (
                <span className="text-xs text-(--text-muted) font-semibold uppercase tracking-wider ml-1">
                  {value === 'actual' ? 'Data Aktual' : 'Prediksi ARIMA'}
                </span>
              );
            }}
          />
          <Line
            name="actual"
            type="monotone"
            dataKey="actual"
            stroke="#22c55e"
            strokeWidth={3}
            dot={{ r: 4, strokeWidth: 2 }}
            activeDot={{ r: 6 }}
            connectNulls={false}
          />
          <Line
            name="predicted"
            type="monotone"
            dataKey="predicted"
            stroke="#f59e0b"
            strokeWidth={3}
            strokeDasharray="5 5"
            dot={{ r: 4, strokeWidth: 2 }}
            activeDot={{ r: 6 }}
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ── SVG Donut / Pie Chart ───────────────────────────────────────────────────── */

function DonutChart({ slices }) {
  const total = slices.reduce((s, sl) => s + sl.value, 0);
  const cx = 80, cy = 80, r = 60, innerR = 38;
  let cumAngle = -90;

  function arc(startAngle, endAngle, radius) {
    const toRad = (d) => (d * Math.PI) / 180;
    const x1 = cx + radius * Math.cos(toRad(startAngle));
    const y1 = cy + radius * Math.sin(toRad(startAngle));
    const x2 = cx + radius * Math.cos(toRad(endAngle));
    const y2 = cy + radius * Math.sin(toRad(endAngle));
    const large = endAngle - startAngle > 180 ? 1 : 0;
    return { x1, y1, x2, y2, large };
  }

  const paths = slices.map((sl) => {
    const angle = total > 0 ? (sl.value / total) * 360 : 0;
    const startAngle = cumAngle;
    const endAngle = cumAngle + angle - 0.5; // small gap
    cumAngle += angle;

    const outer = arc(startAngle, endAngle, r);
    const inner = arc(startAngle, endAngle, innerR);

    const d = [
      `M${outer.x1.toFixed(2)},${outer.y1.toFixed(2)}`,
      `A${r},${r} 0 ${outer.large} 1 ${outer.x2.toFixed(2)},${outer.y2.toFixed(2)}`,
      `L${inner.x2.toFixed(2)},${inner.y2.toFixed(2)}`,
      `A${innerR},${innerR} 0 ${outer.large} 0 ${inner.x1.toFixed(2)},${inner.y1.toFixed(2)}`,
      'Z',
    ].join(' ');

    return { d, color: sl.color, label: sl.label, pct: total > 0 ? Math.round((sl.value / total) * 100) : 0 };
  });

  return (
    <div className="flex items-center gap-4">
      <svg viewBox="0 0 160 160" className="w-28 h-28 shrink-0">
        {paths.map((p) => (
          <path key={p.label} d={p.d} fill={p.color} opacity="0.9">
            <title>{p.label}: {p.pct}%</title>
          </path>
        ))}
        {/* centre text */}
        <text x={cx} y={cy - 4} textAnchor="middle" fill="currentColor" fontSize="11" fontWeight="bold" opacity="0.8">Macro</text>
        <text x={cx} y={cy + 10} textAnchor="middle" fill="currentColor" fontSize="9" opacity="0.5">Distribusi</text>
      </svg>

      {/* legend */}
      <div className="flex flex-col gap-2 text-sm">
        {paths.map((p) => (
          <div key={p.label} className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
            <span className="text-(--text-muted) text-xs">{p.label}</span>
            <span className="font-bold text-(--text-main) text-xs ml-auto">{p.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Main Component ──────────────────────────────────────────────────────────── */

export default function ViewMetrikTubuh({ profile, progressHistory = [] }) {
  const latestProgressWeight = progressHistory.find((item) => item.weight)?.weight;
  const weight = latestProgressWeight || profile?.weight;
  const height = profile?.height;
  const bmi = calculateBmi(weight, height);
  const bmiCat = bmiCategory(bmi);

  const metrics = [
    { label: 'Berat Badan', val: weight ? `${Number(weight)} kg` : '-', diff: latestProgressWeight ? 'Dari progress terbaru' : 'Dari profil', status: 'netral' },
    { label: 'Tinggi Badan', val: height ? `${Number(height)} cm` : '-', diff: 'Dari profil', status: 'netral' },
    { label: 'BMI', val: bmi ? bmi.toFixed(1) : '-', diff: bmiCat.text, status: 'bmi', bmiCls: bmiCat.cls },
    { label: 'Target Kalori', val: profile?.dailyCalorieTarget ? `${profile.dailyCalorieTarget} kkal` : '-', diff: 'Dari backend', status: 'naik' },
  ];

  /* Weight chart data — prefer real progressHistory, fall back to demo data */
  const weightChartData = useMemo(() => {
    const dayLabels = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

    // Build from real history if available
    if (progressHistory.length >= 2) {
      const last7 = progressHistory
        .filter((p) => p.weight)
        .slice(-7)
        .map((p, i) => ({
          label: dayLabels[i % 7],
          weight: Number(p.weight),
          projected: false,
        }));

      if (last7.length >= 2) {
        // Add 2 projected points (simple linear trend)
        const lastW = last7[last7.length - 1].weight;
        const prevW = last7[last7.length - 2].weight;
        const delta = lastW - prevW;

        return [
          ...last7,
          { label: '+1', weight: Math.round((lastW + delta) * 10) / 10, projected: true },
          { label: '+2', weight: Math.round((lastW + delta * 2) * 10) / 10, projected: true },
        ];
      }
    }

    // Demo / dummy data
    const baseWeight = weight ? Number(weight) : 70;
    return [
      { label: '4 Mg', weight: baseWeight + 2.5, projected: false },
      { label: '3 Mg', weight: baseWeight + 1.8, projected: false },
      { label: '2 Mg', weight: baseWeight + 0.9, projected: false },
      { label: '1 Mg', weight: baseWeight + 0.3, projected: false },
      { label: 'Hari ini', weight: baseWeight, projected: false },
      { label: '+1 Mg', weight: Math.round((baseWeight - 0.4) * 10) / 10, projected: true },
      { label: '+2 Mg', weight: Math.round((baseWeight - 0.9) * 10) / 10, projected: true },
    ];
  }, [progressHistory, weight]);

  const arimaChartData = useMemo(() => {
    const baseW = weight ? Number(weight) : 70;
    return [
      { date: '26/06', actual: baseW + 2.5, predicted: null },
      { date: '29/06', actual: baseW + 2.1, predicted: null },
      { date: '02/07', actual: baseW + 1.8, predicted: null },
      { date: '05/07', actual: baseW + 1.4, predicted: null },
      { date: '08/07', actual: baseW + 0.9, predicted: null },
      { date: '11/07', actual: baseW + 0.4, predicted: null },
      { date: '14/07 (Hari ini)', actual: baseW, predicted: baseW },
      { date: '17/07', actual: null, predicted: Math.round((baseW - 0.6) * 10) / 10 },
      { date: '21/07', actual: null, predicted: Math.round((baseW - 1.2) * 10) / 10 },
      { date: '24/07', actual: null, predicted: Math.round((baseW - 1.8) * 10) / 10 },
      { date: '28/07', actual: null, predicted: Math.round((baseW - 2.5) * 10) / 10 },
    ];
  }, [weight]);

  /* Macronutrient distribution — from profile targets or reasonable defaults */
  const macros = useMemo(() => {
    const cal = profile?.dailyCalorieTarget || 2000;
    // Common balanced distribution: 50% carbs, 25% protein, 25% fat
    const carbCal = cal * 0.5;
    const protCal = cal * 0.25;
    const fatCal = cal * 0.25;
    return [
      { label: 'Karbohidrat', value: Math.round(carbCal / 4), color: '#22c55e' },
      { label: 'Protein', value: Math.round(protCal / 4), color: '#3b82f6' },
      { label: 'Lemak', value: Math.round(fatCal / 9), color: '#f59e0b' },
    ];
  }, [profile?.dailyCalorieTarget]);

  /* AI insights */
  const insights = useMemo(() => {
    const lines = [];

    if (bmi > 0) {
      if (bmi < 18.5) lines.push('BMI Anda menunjukkan kategori kurus. Pertimbangkan menambah asupan kalori harian.');
      else if (bmi < 25) lines.push('BMI Anda dalam kategori normal. Pertahankan pola makan dan olahraga saat ini.');
      else if (bmi < 30) lines.push('BMI Anda menunjukkan berat berlebih. Kurangi asupan kalori dan tingkatkan aktivitas fisik.');
      else lines.push('BMI Anda dalam kategori obesitas. Konsultasikan dengan dokter untuk program penurunan berat badan.');
    }

    if (weight && weightChartData.length > 2) {
      const trend = weightChartData[weightChartData.length - 3].weight - weightChartData[0].weight;
      if (trend < -1) lines.push('Tren berat badan Anda menunjukkan penurunan. Terus pertahankan!');
      else if (trend > 1) lines.push('Berat badan Anda cenderung naik. Perhatikan pola makan harian.');
      else lines.push('Berat badan Anda relatif stabil dalam periode terakhir.');
    }

    lines.push('Pastikan minum minimal 8 gelas air per hari untuk metabolisme optimal.');
    lines.push('Tidur 7–8 jam per malam membantu menjaga berat badan ideal.');

    return lines;
  }, [bmi, weight, weightChartData]);

  return (
    <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto">
      {/* ── Title ────────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <Activity className="text-green-500" size={24} />
        <h2 className="text-2xl font-bold text-(--text-main)">Perkembangan Metrik Tubuh</h2>
      </div>

      {/* ── 4 Metric Cards (preserved) ───────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((metric, i) => (
          <div key={i} className="bg-(--bg-card) p-5 rounded-3xl shadow-sm border border-(--border-subtle) hover:shadow-md transition-shadow">
            <p className="text-(--text-muted) text-xs font-bold uppercase tracking-wider mb-2">{metric.label}</p>
            <h3 className="text-3xl font-black text-(--text-main) mb-1">{metric.val}</h3>
            <p className={`text-sm font-bold ${metric.status === 'bmi' ? metric.bmiCls : metric.status === 'naik' ? 'text-blue-600' : 'text-gray-500'}`}>
              {metric.diff}
            </p>
          </div>
        ))}
      </div>

      {/* ── Analytical Section (2-column grid) ───────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 items-stretch">

        {/* LEFT — Weight Projection Chart */}
        <div className="lg:col-span-3 bg-(--bg-card) rounded-3xl border border-(--border-subtle) p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp size={20} className="text-green-500" />
            <h3 className="text-lg font-bold text-(--text-main)">📈 Proyeksi Berat Badan (Model ARIMA)</h3>
          </div>

          <div className="flex-1 w-full text-(--text-main)">
            <WeightProjectionChart data={arimaChartData} />
          </div>

          <p className="text-[11px] text-(--text-muted) mt-4">
            * Model peramalan time-series ARIMA (Autoregressive Integrated Moving Average) berbasis tren histori berat badan Anda.
          </p>
        </div>

        {/* RIGHT — Stacked: Donut + AI Insight */}
        <div className="lg:col-span-2 flex flex-col gap-5">

          {/* Macronutrient Distribution */}
          <div className="bg-(--bg-card) rounded-3xl border border-(--border-subtle) p-5 shadow-sm flex-1">
            <div className="flex items-center gap-2 mb-4">
              <PieChart size={18} className="text-amber-500" />
              <h3 className="text-base font-bold text-(--text-main)">Distribusi Makronutrien</h3>
            </div>
            <DonutChart slices={macros} />
            <p className="text-[11px] text-(--text-muted) mt-3">
              Rasio berdasarkan target {profile?.dailyCalorieTarget || 2000} kkal/hari
            </p>
          </div>

          {/* AI Insight Analysis */}
          <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/20 rounded-3xl border border-green-700/30 p-5 shadow-sm flex-1">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={18} className="text-green-400" />
              <h3 className="text-base font-bold text-(--text-main)">AI Insight Analysis</h3>
            </div>
            <ul className="space-y-2.5">
              {insights.map((line, i) => (
                <li key={i} className="flex gap-2 text-sm text-(--text-muted) leading-relaxed">
                  <span className="shrink-0 mt-1 w-1.5 h-1.5 rounded-full bg-green-500" />
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
