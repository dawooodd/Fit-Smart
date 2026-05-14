// src/components/dashboard/Sidebar.jsx
import React from 'react';
import { Heart, X } from 'lucide-react';
import { menuItems, analyticsItems } from '../../data/dashboardData';

export default function Sidebar({ activeMenu, setActiveMenu, isOpen, setIsOpen }) {
  return (
    <aside 
      // PERBAIKAN: Menggunakan bg-(--bg-card) murni sebagai background solid
      className={`fixed md:relative top-0 left-0 h-full w-64 bg-(--bg-card) border-r border-(--border-subtle) flex flex-col z-50 shrink-0 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
    >
      {/* Bagian Logo & Tombol Close */}
      <div className="h-20 flex items-center justify-between px-8 border-b border-(--border-subtle) shrink-0 transition-colors">
        <div className="flex items-center gap-2 text-2xl font-bold text-(--icon-text) tracking-tight">
          <Heart className="fill-(--icon-text) text-(--icon-text)" size={28} /> FitSmart
        </div>
        {/* Tombol Tutup (X) - Hanya muncul di Mobile */}
        <button 
          className="md:hidden text-(--text-muted) hover:text-rose-500 transition-colors p-1"
          onClick={() => setIsOpen(false)}
        >
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8 custom-scrollbar">
        
        {/* Menu Utama */}
        <div>
          <h3 className="px-4 text-xs font-bold text-(--text-muted) uppercase tracking-wider mb-3">Menu Utama</h3>
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button 
                  onClick={() => setActiveMenu(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    activeMenu === item.id 
                      ? 'bg-green-700 text-white shadow-md shadow-green-700/20' 
                      : 'text-(--text-muted) hover:bg-(--border-subtle) hover:text-(--text-main)'
                  }`}
                >
                  {item.icon} <span className="font-medium text-sm">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Menu Analitik */}
        <div>
          <h3 className="px-4 text-xs font-bold text-(--text-muted) uppercase tracking-wider mb-3">Analitik</h3>
          <ul className="space-y-1">
            {analyticsItems.map((item) => (
              <li key={item.id}>
                <button 
                  onClick={() => setActiveMenu(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    activeMenu === item.id 
                      ? 'bg-green-700 text-white shadow-md shadow-green-700/20' 
                      : 'text-(--text-muted) hover:bg-(--border-subtle) hover:text-(--text-main)'
                  }`}
                >
                  {item.icon} <span className="font-medium text-sm">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Kartu Kesehatan Jantung */}
        <div className="mx-2 mt-4 bg-linear-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/10 p-5 rounded-2xl border border-green-100 dark:border-green-900/30 text-center shadow-sm transition-colors">
          <div className="bg-(--bg-card) w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm text-rose-500 transition-colors">
            <Heart className="fill-rose-500" size={24} />
          </div>
          <h4 className="text-sm font-semibold text-(--text-main) mb-1">Kesehatan Jantung</h4>
          <p className="text-xs text-green-700 dark:text-green-400 font-bold bg-green-200/50 dark:bg-green-900/50 inline-block px-3 py-1 rounded-full">Sangat Baik</p>
        </div>
        
      </div>
    </aside>
  );
}