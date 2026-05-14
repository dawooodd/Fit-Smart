import React, { useState } from 'react';
import Sidebar from '../components/Dashboard/Sidebar';
import TopHeader from '../components/Dashboard/TopHeader';

// Import Views
import ViewRingkasan from '../components/Dashboard/views/ViewRingkasan';
import ViewRencanaMakan from '../components/Dashboard/views/ViewRencanaMakan';
import ViewLatihan from '../components/Dashboard/views/ViewLatihan';
import ViewPelacakTidur from '../components/Dashboard/views/ViewPelacakTidur';
import ViewMetrikTubuh from '../components/Dashboard/views/ViewMetrikTubuh';
import ViewPlaceholder from '../components/Dashboard/views/ViewPlaceholder';

export default function Dashboard() {
  const [activeMenu, setActiveMenu] = useState('Ringkasan');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const renderContent = () => {
    switch(activeMenu) {
      case 'Ringkasan': return <ViewRingkasan />;
      case 'Rencana Makan': return <ViewRencanaMakan />;
      case 'Latihan': return <ViewLatihan />;
      case 'Pelacak Tidur': return <ViewPelacakTidur />;
      case 'Metrik Tubuh': return <ViewMetrikTubuh />;
      case 'Laporan Lab': return <ViewPlaceholder title="Laporan Lab" />;
      case 'Target': return <ViewPlaceholder title="Target Pribadi" />;
      default: return <ViewRingkasan />;
    }
  };

  return (
    <div className="flex h-screen bg-(--bg-main) font-sans text-(--text-main) overflow-hidden transition-colors duration-300">
      
      {/* Overlay Gelap untuk Mobile saat Sidebar Terbuka */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden animate-fadeIn"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Menerima state untuk kontrol buka-tutup */}
      <Sidebar 
        activeMenu={activeMenu} 
        setActiveMenu={(menu) => {
          setActiveMenu(menu);
          setIsSidebarOpen(false); // Tutup otomatis sidebar saat menu diklik (di HP)
        }} 
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative z-10 w-full">
        
        {/* Header - Menerima fungsi untuk toggle sidebar */}
        <TopHeader 
          activeMenu={activeMenu} 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        />

        {/* Scrollable Area */}
        {/* Ubah padding agar pas di HP (p-4) dan di Desktop (md:p-8) */}
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