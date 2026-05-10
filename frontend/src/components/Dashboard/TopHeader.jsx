import React, { useState } from 'react';
import { Search, Bell, X, Clock } from 'lucide-react';
import { menuItems, analyticsItems, unreadNotifs, notificationsList } from '../../data/dashboardData';

export default function TopHeader({ activeMenu }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const activeIcon = [...menuItems, ...analyticsItems].find(i => i.id === activeMenu)?.icon;

  return (
    <header className="h-20 bg-white/80 backdrop-blur-sm border-b border-gray-200 flex items-center justify-between px-8 z-30 shrink-0">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-green-100 text-green-700 flex items-center justify-center">
          {activeIcon}
        </div>
        <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">{activeMenu}</h2>
      </div>

      <div className="flex items-center gap-6">
        {/* Search */}
        <div className="flex items-center relative">
          <div className={`overflow-hidden transition-all duration-300 flex items-center ${isSearchOpen ? 'w-48 opacity-100 mr-2' : 'w-0 opacity-0'}`}>
            <input 
              type="text" 
              placeholder="Cari fitur/data..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-1.5 text-sm bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500/50"
              autoFocus={isSearchOpen}
            />
          </div>
          <button 
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className={`p-2 rounded-full transition-colors ${isSearchOpen ? 'bg-green-100 text-green-700' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'}`}
          >
            {isSearchOpen ? <X size={20} /> : <Search size={20} />}
          </button>
        </div>

        <div className="relative">
          <button 
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className={`p-2 rounded-full transition-colors relative ${isNotifOpen ? 'bg-green-100 text-green-700' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'}`}
          >
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
              {unreadNotifs}
            </span>
          </button>

          {isNotifOpen && (
            <div className="absolute top-full right-0 mt-3 w-80 bg-white border border-gray-100 shadow-2xl rounded-2xl overflow-hidden z-50 animate-fadeIn">
              <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                <h4 className="font-bold text-gray-900 text-sm">Notifikasi</h4>
                <span className="text-xs text-green-600 font-medium cursor-pointer hover:underline">Tandai semua dibaca</span>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notificationsList.map((notif) => (
                  <div key={notif.id} className="px-4 py-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer">
                    <div className="flex justify-between items-start mb-1">
                      <h5 className="font-semibold text-gray-800 text-sm">{notif.title}</h5>
                      {!notif.read && <div className="w-2 h-2 rounded-full bg-rose-500 mt-1 shrink-0"></div>}
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-2 mb-2">{notif.desc}</p>
                    <span className="text-[10px] text-gray-400 flex items-center gap-1"><Clock size={10}/>{notif.time}</span>
                  </div>
                ))}
              </div>
              <div className="px-4 py-3 bg-gray-50 text-center cursor-pointer">
                <span className="text-sm font-bold text-green-700">Lihat Semua</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 pl-6 border-l border-gray-200 cursor-pointer hover:opacity-80">
          <div className="w-9 h-9 bg-green-800 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md">AA</div>
          <span className="font-medium text-sm text-gray-700 hidden md:block">Arrosyid</span>
        </div>
      </div>
    </header>
  );
}