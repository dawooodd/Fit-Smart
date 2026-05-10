import React, { useState } from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import TopHeader from '../components/dashboard/TopHeader';

// Import Views
import ViewRingkasan from '../components/dashboard/views/ViewRingkasan';
import ViewRencanaMakan from '../components/dashboard/views/ViewRencanaMakan';
import ViewLatihan from '../components/dashboard/views/ViewLatihan';
import ViewPelacakTidur from '../components/dashboard/views/ViewPelacakTidur';
import ViewMetrikTubuh from '../components/dashboard/views/ViewMetrikTubuh';
import ViewPlaceholder from '../components/dashboard/views/ViewPlaceholder';

export default function Dashboard() {
  const [activeMenu, setActiveMenu] = useState('Ringkasan');

  // Router internal untuk merender view berdasarkan activeMenu
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
    <div className="flex h-screen bg-[#FDFBF6] font-sans text-gray-800 overflow-hidden">
      
      <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />

      <main className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
        
        <TopHeader activeMenu={activeMenu} />

        <div className="flex-1 overflow-y-auto p-8 relative">
          <div className="max-w-6xl mx-auto">
            {renderContent()}
          </div>
          <div className="h-12"></div>
        </div>

      </main>
    </div>
  );
}