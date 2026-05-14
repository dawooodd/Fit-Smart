import React from 'react';
import { Clock, Flame, ChevronRight } from 'lucide-react';

export default function ViewLatihan() {
  const workoutPrograms = [
    { title: "Kardio Intensitas Tinggi", dur: "45 Menit", cal: "400 cal", img: "bg-rose-500" },
    { title: "Latihan Beban (Upper Body)", dur: "60 Menit", cal: "350 cal", img: "bg-blue-500" },
    { title: "Yoga & Peregangan", dur: "30 Menit", cal: "150 cal", img: "bg-emerald-500" },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-2xl font-bold text-(--text-main)] mb-6">Program Latihanmu</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {workoutPrograms.map((workout, idx) => (
          <div 
            key={idx} 
            className="bg-(--bg-card)] rounded-2xl border border-(--border-subtle)] shadow-sm overflow-hidden group cursor-pointer hover:shadow-md transition-shadow"
          >
            {/* Thumbnail Image Placeholder */}
            <div className={`h-40 ${workout.img} relative flex items-center justify-center`}>
               <div className="w-12 h-12 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <ChevronRight />
               </div>
            </div>
            
            {/* Workout Details */}
            <div className="p-5">
              <h3 className="font-bold text-(--text-main)] text-lg mb-2">{workout.title}</h3>
              <div className="flex gap-4 text-sm text-(--text-muted)] font-medium">
                <span className="flex items-center gap-1">
                  <Clock size={16} className="text-(--text-muted)]" /> {workout.dur}
                </span>
                <span className="flex items-center gap-1">
                  <Flame size={16} className="text-orange-400" /> {workout.cal}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}