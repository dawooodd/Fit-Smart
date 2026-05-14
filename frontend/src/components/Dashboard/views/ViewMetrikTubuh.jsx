import React from 'react';

export default function ViewMetrikTubuh() {
  const metrics = [
    { label: 'Berat Badan', val: '74.5 kg', diff: '-1.2 kg', status: 'turun' },
    { label: 'Lemak Tubuh', val: '18%', diff: '-0.5%', status: 'turun' },
    { label: 'Massa Otot', val: '58 kg', diff: '+0.3 kg', status: 'naik' },
    { label: 'BMI', val: '22.4', diff: 'Normal', status: 'netral' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
       <h2 className="text-2xl font-bold text-(--text-main)">Perkembangan Metrik Tubuh</h2>
       
       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map((metric, i) => (
             <div key={i} className="bg-(--bg-card) p-6 rounded-3xl shadow-sm border border-(--border-subtle) hover:shadow-md transition-shadow">
               <p className="text-(--text-muted) text-xs font-bold uppercase tracking-wider mb-3">{metric.label}</p>
               <h3 className="text-3xl font-black text-(--text-main) mb-2">{metric.val}</h3>
               
               <p className={`text-sm font-bold ${
                 metric.status === 'naik' ? 'text-blue-600' : 
                 metric.status === 'turun' ? 'text-green-600' : 'text-gray-500'
               }`}>
                 {metric.diff}
               </p>
             </div>
          ))}
       </div>
    </div>
  );
}