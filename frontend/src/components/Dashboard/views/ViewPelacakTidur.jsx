import React from 'react';

export default function ViewPelacakTidur() {
  const sleepChartData = [40, 70, 30, 90, 80, 20, 60, 100];

  return (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-2xl font-bold text-gray-900">Analisis Tidur Terakhir</h2>
      
      <div className="bg-indigo-900 rounded-4xl p-8 md:p-10 text-white flex flex-col md:flex-row items-center gap-10 shadow-xl shadow-indigo-900/10">
        <div className="flex-1">
           <h3 className="text-indigo-300 font-bold mb-2 uppercase tracking-widest text-xs">Durasi Tidur</h3>
           <p className="text-5xl font-black mb-4 tracking-tight">7<span className="text-2xl text-indigo-300 font-bold mr-2">j</span>24<span className="text-2xl text-indigo-300 font-bold">m</span></p>
           <p className="text-indigo-100 text-sm leading-relaxed max-w-md">Kualitas tidurmu sangat baik semalam. Fase REM dan Deep Sleep berada pada rentang optimal untuk pemulihan otot.</p>
        </div>
        
        <div className="w-full md:w-1/2 bg-indigo-950/40 rounded-3xl h-56 border border-indigo-700/50 flex items-end p-6 gap-3">
           {sleepChartData.map((height, i) => (
             <div 
                key={i} 
                className="flex-1 bg-indigo-400 hover:bg-indigo-300 transition-colors rounded-t-sm relative group cursor-crosshair" 
                style={{ height: `${height}%` }}
              >
                {/* Tooltip pada saat di hover */}
                <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-indigo-900 text-xs font-bold px-2 py-1 rounded shadow-lg transition-opacity pointer-events-none">
                  {height}%
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}