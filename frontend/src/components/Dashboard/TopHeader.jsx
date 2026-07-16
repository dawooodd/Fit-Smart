import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, X, Clock, Sun, Moon, Menu, LogOut, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { menuItems, analyticsItems, unreadNotifs, notificationsList } from '../../data/dashboardData';
import { useAuth } from '../../context/AuthContext';
import { getInitials } from '../../lib/mappers';

export default function TopHeader({ activeMenu, toggleSidebar, user }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const profileRef = useRef(null);
  const notifRef = useRef(null);

  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) return savedTheme === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeIcon = [...menuItems, ...analyticsItems].find(i => i.id === activeMenu)?.icon;

  return (
    // Padding kiri/kanan responsif (px-4 di HP, px-8 di Desktop)
    <header className="h-20 bg-(--bg-card)/80 backdrop-blur-sm border-b border-(--border-subtle) flex items-center justify-between px-4 md:px-8 z-30 shrink-0 transition-colors duration-300">
      
      <div className="flex items-center gap-2 md:gap-3">
        <button onClick={toggleSidebar} className="p-2 -ml-2 rounded-lg text-(--text-muted) md:hidden hover:bg-(--bg-hover) transition-colors">
          <Menu size={24} />
        </button>

        <div className="w-8 h-8 rounded-lg bg-(--icon-bg) text-(--icon-text) hidden sm:flex items-center justify-center transition-colors">
          {activeIcon}
        </div>
        <h2 className="text-lg md:text-xl font-extrabold text-(--text-main) tracking-tight transition-colors">{activeMenu}</h2>
      </div>

      <div className="flex items-center gap-2 md:gap-6">
        <button 
          onClick={() => setIsDark(!isDark)}
          className="p-2 rounded-full text-(--text-muted) hover:bg-(--bg-hover) transition-colors"
        >
          {isDark ? <Moon size={20} className="text-blue-400" /> : <Sun size={20} className="text-amber-500" />}
        </button>

        <div className="flex items-center relative md:flex">
          <div className={`overflow-hidden transition-all duration-300 flex items-center ${isSearchOpen ? 'w-48 opacity-100 mr-2' : 'w-0 opacity-0'}`}>
            <input 
              type="text" 
              placeholder="Cari fitur/data..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-1.5 text-sm bg-(--bg-hover) text-(--text-main) rounded-full focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-colors"
              autoFocus={isSearchOpen}
            />
          </div>
          <button 
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className={`p-2 rounded-full transition-colors ${isSearchOpen ? 'bg-green-700/20 text-green-700 dark:text-green-400' : 'text-(--text-muted) hover:text-(--text-main) hover:bg-(--bg-hover)'}`}
          >
            {isSearchOpen ? <X size={20} /> : <Search size={20} />}
          </button>
        </div>

        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => { setIsNotifOpen(!isNotifOpen); setIsProfileOpen(false); }}
            className={`p-2 rounded-full transition-colors relative ${isNotifOpen ? 'bg-green-700/20 text-green-700 dark:text-green-400' : 'text-(--text-muted) hover:bg-(--bg-hover)'}`}
          >
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-(--bg-card) transition-colors">
              {unreadNotifs}
            </span>
          </button>

          {isNotifOpen && (
            <div className="absolute top-full right-0 md:right-auto md:left-1/2 md:-translate-x-1/2 mt-3 w-72 md:w-80 bg-(--bg-card) border border-(--border-subtle) shadow-2xl rounded-2xl overflow-hidden z-50 animate-fadeIn">
              <div className="px-4 py-3 border-b border-(--border-subtle) bg-(--bg-subtle) flex justify-between items-center transition-colors">
                <h4 className="font-bold text-(--text-main) text-sm">Notifikasi</h4>
                <span className="text-xs text-green-600 dark:text-green-400 font-medium cursor-pointer hover:underline">Tandai semua</span>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notificationsList.map((notif) => (
                  <div key={notif.id} className="px-4 py-3 border-b border-(--border-subtle) hover:bg-(--bg-subtle) transition-colors cursor-pointer">
                    <div className="flex justify-between items-start mb-1">
                      <h5 className="font-semibold text-(--text-main) text-sm">{notif.title}</h5>
                      {!notif.read && <div className="w-2 h-2 rounded-full bg-rose-500 mt-1 shrink-0"></div>}
                    </div>
                    <p className="text-xs text-(--text-muted) line-clamp-2 mb-2">{notif.desc}</p>
                    <span className="text-[10px] text-(--text-muted) flex items-center gap-1"><Clock size={10}/>{notif.time}</span>
                  </div>
                ))}
              </div>
              <div className="px-4 py-3 bg-(--bg-subtle) text-center cursor-pointer transition-colors">
                <span className="text-sm font-bold text-green-700 dark:text-green-400">Lihat Semua</span>
              </div>
            </div>
          )}
        </div>

        {/* ── Profile dropdown ── */}
        <div className="relative pl-4 md:pl-6 border-l border-(--border-main)" ref={profileRef}>
          <button
            onClick={() => { setIsProfileOpen(!isProfileOpen); setIsNotifOpen(false); }}
            className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
          >
            <div className="w-9 h-9 bg-green-800 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md">
              {getInitials(user?.name)}
            </div>
            <span className="font-medium text-sm text-(--text-main) hidden lg:block">{user?.name || 'FitSmart'}</span>
            <ChevronDown
              size={16}
              className={`text-(--text-muted) hidden lg:block transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {isProfileOpen && (
            <div className="absolute top-full right-0 mt-3 w-64 bg-(--bg-card) border border-(--border-subtle) shadow-2xl rounded-2xl overflow-hidden z-50 animate-fadeIn">
              {/* user info */}
              <div className="px-4 py-4 border-b border-(--border-subtle) bg-(--bg-subtle)">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-800 text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0 shadow-md">
                    {getInitials(user?.name)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-(--text-main) truncate">{user?.name || 'FitSmart User'}</p>
                    <p className="text-xs text-(--text-muted) truncate">{user?.email || '–'}</p>
                  </div>
                </div>
              </div>

              {/* logout */}
              <button
                onClick={() => { setIsProfileOpen(false); logout(); navigate('/'); }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-(--text-muted) hover:bg-rose-500/10 hover:text-rose-500 transition-colors"
              >
                <LogOut size={16} />
                Keluar
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}