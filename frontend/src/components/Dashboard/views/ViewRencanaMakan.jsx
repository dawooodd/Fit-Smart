import React from 'react';
import { Plus } from 'lucide-react';

export default function ViewRencanaMakan() {
  const mealPlan = [
    { time: 'Sarapan', menu: 'Oatmeal & Pisang', cal: 320, color: 'bg-amber-100 text-amber-700' },
    { time: 'Makan Siang', menu: 'Dada Ayam Bakar & Nasi Merah', cal: 550, color: 'bg-green-100 text-green-700' },
    { time: 'Snack', menu: 'Almond & Yogurt', cal: 200, color: 'bg-blue-100 text-blue-700' },
    { time: 'Makan Malam', menu: 'Salad Salmon', cal: 400, color: 'bg-rose-100 text-rose-700' }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Rencana Makan Hari Ini</h2>
          <p className="text-gray-500 font-medium mt-1">Target Kalori: 2.100 Kkal</p>
        </div>
        <button className="bg-green-700 hover:bg-green-800 transition text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm">
          <Plus size={18}/> Tambah Makanan
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex font-bold text-gray-500 text-xs uppercase tracking-wider">
          <div className="w-1/4">Waktu</div>
          <div className="w-1/2">Menu Makanan</div>
          <div className="w-1/4 text-right">Kalori</div>
        </div>
        
        {/* Table Body */}
        {mealPlan.map((item, idx) => (
          <div key={idx} className="p-4 border-b border-gray-50 flex items-center hover:bg-gray-50 transition cursor-default">
            <div className="w-1/4">
              <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${item.color}`}>{item.time}</span>
            </div>
            <div className="w-1/2 font-bold text-gray-800">{item.menu}</div>
            <div className="w-1/4 text-right font-bold text-gray-900">{item.cal} Kkal</div>
          </div>
        ))}
      </div>
    </div>
  );
}