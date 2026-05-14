import React from 'react';
import { Flame, Footprints, Heart, Plus } from 'lucide-react';

export default function ViewRingkasan() {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <p className="text-sm text-(--text-muted) font-medium mb-1">Minggu, 10 Mei • Minggu ke-14 perjalananmu</p>
        <h1 className="text-3xl font-extrabold text-(--text-main) flex items-center gap-2">
          Selamat Pagi, Arrosyid! <span className="text-green-600">🌿</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Kalori */}
        <div className="bg-(--bg-card) p-5 rounded-2xl border border-(--border-subtle) shadow-sm flex flex-col justify-between h-36">
          <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center"><Flame size={20} /></div>
          <div>
            <h3 className="text-2xl font-bold text-(--text-main)">1.125</h3>
            <p className="text-xs font-semibold text-(--text-muted) uppercase tracking-wide mt-1">Kalori Hari Ini</p>
            <p className="text-xs text-green-600 mt-1 font-medium">↑ Sesuai target • Sisa 975</p>
          </div>
        </div>
        {/* Langkah */}
        <div className="bg-(--bg-card) p-5 rounded-2xl border border-(--border-subtle) shadow-sm flex flex-col justify-between h-36">
          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center"><Footprints size={20} /></div>
          <div>
            <h3 className="text-2xl font-bold text-(--text-main)">8.500</h3>
            <p className="text-xs font-semibold text-(--text-muted) uppercase tracking-wide mt-1">Langkah Hari Ini</p>
            <p className="text-xs text-blue-600 mt-1 font-medium">↑ Sesuai target • Sisa 1.500</p>
          </div>
        </div>
        {/* Detak Jantung */}
        <div className="bg-(--bg-card) p-5 rounded-2xl border border-(--border-subtle) shadow-sm flex flex-col justify-between h-36">
          <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 flex items-center justify-center"><Heart size={20} /></div>
          <div>
            <h3 className="text-2xl font-bold text-(--text-main)">72</h3>
            <p className="text-xs font-semibold text-(--text-muted) uppercase tracking-wide mt-1">Detak Jantung</p>
            <p className="text-xs text-red-600 mt-1 font-medium">↓ Normal</p>
          </div>
        </div>
        {/* Air */}
        <div className="bg-(--bg-card) p-5 rounded-2xl border border-(--border-subtle) shadow-sm flex flex-col justify-between h-36">
          <div className="w-10 h-10 rounded-full bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 flex items-center justify-center"><Plus size={20} /></div>
          <div>
            <h3 className="text-2xl font-bold text-(--text-main)">2.5</h3>
            <p className="text-xs font-semibold text-(--text-muted) uppercase tracking-wide mt-1">Liter Air</p>
            <p className="text-xs text-cyan-600 mt-1 font-medium">↑ Sesuai target • Sisa 7.5</p>
          </div>
        </div>
      </div>
    </div>
  );
}