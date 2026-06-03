import React, { useEffect, useMemo, useState } from 'react';
import Sidebar from '../components/Dashboard/Sidebar';
import TopHeader from '../components/Dashboard/TopHeader';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';

import ViewRingkasan from '../components/Dashboard/views/ViewRingkasan';
import ViewRencanaMakan from '../components/Dashboard/views/ViewRencanaMakan';
import ViewLatihan from '../components/Dashboard/views/ViewLatihan';
import ViewPelacakTidur from '../components/Dashboard/views/ViewPelacakTidur';
import ViewMetrikTubuh from '../components/Dashboard/views/ViewMetrikTubuh';
import ViewPlaceholder from '../components/Dashboard/views/ViewPlaceholder';
import ViewTarget from '../components/Dashboard/views/ViewTarget';
import ViewPhotoAI from '../components/Dashboard/views/ViewPhotoAI';

export default function Dashboard() {
  const { user } = useAuth();
  const [activeMenu, setActiveMenu] = useState('Ringkasan');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [todayProgress, setTodayProgress] = useState(null);
  const [progressHistory, setProgressHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadDashboardData() {
      try {
        const [profileResult, todayResult, progressResult] = await Promise.allSettled([
          api.getProfile(),
          api.getTodayProgress(),
          api.getProgress(),
        ]);

        if (!isMounted) return;

        if (profileResult.status === 'fulfilled') setProfile(profileResult.value.profile);
        if (todayResult.status === 'fulfilled') setTodayProgress(todayResult.value.progress);
        if (progressResult.status === 'fulfilled') setProgressHistory(progressResult.value.progress || []);

        const firstError = [profileResult, todayResult, progressResult].find((result) => result.status === 'rejected');
        if (firstError && profileResult.status === 'rejected') {
          setError('Profil belum ditemukan. Silakan lengkapi onboarding terlebih dahulu.');
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  const dashboardData = useMemo(() => ({
    user,
    profile,
    todayProgress,
    progressHistory,
    isLoading,
    error,
  }), [user, profile, todayProgress, progressHistory, isLoading, error]);

  const renderContent = () => {
    switch (activeMenu) {
      case 'Ringkasan': return <ViewRingkasan data={dashboardData} />;
      case 'Rencana Makan': return <ViewRencanaMakan profile={profile} progress={todayProgress} />;
      case 'Latihan': return <ViewLatihan progress={todayProgress} />;
      case 'Pelacak Tidur': return <ViewPelacakTidur progress={todayProgress} />;
      case 'Metrik Tubuh': return <ViewMetrikTubuh profile={profile} progressHistory={progressHistory} />;
      case 'Photo AI': return <ViewPhotoAI />;
      case 'Target': return <ViewTarget profile={profile} />;
      default: return <ViewRingkasan data={dashboardData} />;
    }
  };

  return (
    <div className="flex h-screen bg-(--bg-main) font-sans text-(--text-main) overflow-hidden transition-colors duration-300">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden animate-fadeIn"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <Sidebar
        activeMenu={activeMenu}
        setActiveMenu={(menu) => {
          setActiveMenu(menu);
          setIsSidebarOpen(false);
        }}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <main className="flex-1 flex flex-col h-full overflow-hidden relative z-10 w-full">
        <TopHeader
          activeMenu={activeMenu}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          user={user}
        />

        <div className="flex-1 overflow-y-auto p-4 md:p-8 relative bg-(--bg-main)">
          <div className="max-w-6xl mx-auto">
            {renderContent()}
          </div>
          <div className="h-12"></div>
        </div>
      </main>
    </div>
  );
}
