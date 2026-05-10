import React from 'react';
import { Heart } from 'lucide-react';
import { menuItems, analyticsItems } from '../../data/dashboardData';

export default function Sidebar({ activeMenu, setActiveMenu }) {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-full z-20 shrink-0">
      <div className="h-20 flex items-center px-8 border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-2 text-2xl font-bold text-green-800 tracking-tight">
          <Heart className="fill-green-600 text-green-600" size={28} /> FitSmart
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8 custom-scrollbar">
        <div>
          <h3 className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Menu Utama</h3>
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button 
                  onClick={() => setActiveMenu(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeMenu === item.id ? 'bg-green-700 text-white shadow-md shadow-green-700/20' : 'text-gray-500 hover:bg-green-50 hover:text-green-800'}`}
                >
                  {item.icon} <span className="font-medium text-sm">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Analitik</h3>
          <ul className="space-y-1">
            {analyticsItems.map((item) => (
              <li key={item.id}>
                <button 
                  onClick={() => setActiveMenu(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeMenu === item.id ? 'bg-green-700 text-white shadow-md shadow-green-700/20' : 'text-gray-500 hover:bg-green-50 hover:text-green-800'}`}
                >
                  {item.icon} <span className="font-medium text-sm">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="mx-2 mt-4 bg-linear-to-br from-green-50 to-emerald-100 p-5 rounded-2xl border border-green-100 text-center shadow-sm">
          <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm text-rose-500">
            <Heart className="fill-rose-500" size={24} />
          </div>
          <h4 className="text-sm font-semibold text-gray-800 mb-1">Kesehatan Jantung</h4>
          <p className="text-xs text-green-700 font-bold bg-green-200/50 inline-block px-3 py-1 rounded-full">Sangat Baik</p>
        </div>
      </div>
    </aside>
  );
}