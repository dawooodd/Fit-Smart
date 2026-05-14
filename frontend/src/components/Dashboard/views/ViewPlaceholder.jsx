import React from 'react';
import { Activity } from 'lucide-react';

export default function ViewPlaceholder({ title }) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[60vh] animate-fadeIn text-center">
       <div className="w-24 h-24 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-full flex items-center justify-center mb-6">
          <Activity size={48} />
       </div>
       <h2 className="text-2xl font-bold text-(--text-main) mb-2">Halaman {title}</h2>
       <p className="text-(--text-muted) max-w-md">Modul untuk {title} sedang dalam tahap pengembangan dan akan segera tersedia di pembaruan FitSmart berikutnya.</p>
    </div>
  );
}