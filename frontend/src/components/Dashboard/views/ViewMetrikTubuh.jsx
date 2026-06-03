import React from 'react';

function calculateBmi(weight, height) {
  if (!weight || !height) return '-';
  const bmi = Number(weight) / Math.pow(Number(height) / 100, 2);
  return bmi.toFixed(1);
}

export default function ViewMetrikTubuh({ profile, progressHistory = [] }) {
  const latestProgressWeight = progressHistory.find((item) => item.weight)?.weight;
  const weight = latestProgressWeight || profile?.weight;
  const metrics = [
    { label: 'Berat Badan', val: weight ? `${Number(weight)} kg` : '-', diff: latestProgressWeight ? 'Dari progress terbaru' : 'Dari profil', status: 'netral' },
    { label: 'Tinggi Badan', val: profile?.height ? `${Number(profile.height)} cm` : '-', diff: 'Dari profil', status: 'netral' },
    { label: 'BMI', val: calculateBmi(weight, profile?.height), diff: 'Kalkulasi frontend', status: 'netral' },
    { label: 'Target Kalori', val: profile?.dailyCalorieTarget ? `${profile.dailyCalorieTarget} kkal` : '-', diff: 'Dari backend', status: 'naik' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-2xl font-bold text-(--text-main)">Perkembangan Metrik Tubuh</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((metric, i) => (
          <div key={i} className="bg-(--bg-card) p-6 rounded-3xl shadow-sm border border-(--border-subtle) hover:shadow-md transition-shadow">
            <p className="text-(--text-muted) text-xs font-bold uppercase tracking-wider mb-3">{metric.label}</p>
            <h3 className="text-3xl font-black text-(--text-main) mb-2">{metric.val}</h3>
            <p className={`text-sm font-bold ${metric.status === 'naik' ? 'text-blue-600' : 'text-gray-500'}`}>{metric.diff}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
