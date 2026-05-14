import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';
export default function Header() {
  const navigate = useNavigate();
  return (
    <header className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
      <div className="text-2xl font-bold text-green-800 tracking-tight">FitSmart</div>
      <nav className="hidden md:flex space-x-8 font-medium text-gray-600">
        <a href="#fitur" className="hover:text-green-700 transition">Fitur</a>
        <a href="#cara-kerja" className="hover:text-green-700 transition">Cara Kerja</a>
        <a href="#tim" className="hover:text-green-700 transition">Tim</a>
        <a href="#kontak" className="hover:text-green-700 transition">Kontak</a>
      </nav>
      <div className="flex space-x-4">
      <button className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded-full font-medium transition" onClick={() => navigate('/onboarding')}>
        Mulai Sekarang
      </button>
      <button 
          onClick={() => navigate('/login')} 
          className="bg-green-100 hover:bg-green-200 text-green-800 px-3 md:px-6 py-2 rounded-full font-medium transition flex items-center justify-center h-9 md:h-auto md:min-h-10"
          aria-label="Masuk"
        >
          {/* Ikon User: Muncul di semua ukuran layar, tapi ada margin-right di desktop */}
          <User className="w-5 h-5 md:mr-2" />
          
          {/* Teks "Masuk": Disembunyikan di HP (hidden), dimunculkan di Desktop (md:block) */}
          <span className="hidden md:block whitespace-nowrap text-sm md:text-base">Masuk</span>
        </button>
      </div>
    </header>
  );
}