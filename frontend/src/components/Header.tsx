import React from 'react';
import { useNavigate } from 'react-router-dom';
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
      <button className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded-full font-medium transition" onClick={() => navigate('/onboarding')}>
        Mulai Sekarang
      </button>
    </header>
  );
}