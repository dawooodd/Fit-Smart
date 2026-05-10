// src/components/Hero.jsx
import React from 'react';
import { ArrowRight, CheckCircle2, Activity } from 'lucide-react';
import heroFitSmart from '../assets/hero-fitsmart.jpg'; 
import { useNavigate } from 'react-router-dom';

export default function Hero() {
  const navigate = useNavigate();
  return (
    <section className="max-w-7xl mx-auto px-8 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
      <div className="space-y-6">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-gray-900">
          Hidup sehat, <br/> dipersonalisasi untukmu.
        </h1>
        <p className="text-lg text-gray-600 max-w-md leading-relaxed">
          FitSmart mengkalkulasi mikro-detailmu berdasarkan usia, rutinitas, BMI, BMR, dan tujuanmu—bukan saran umum yang sama untuk semua orang.
        </p>
        
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <button className="bg-green-700 hover:bg-green-800 text-white px-8 py-3 rounded-full font-medium flex items-center gap-2 transition shadow-lg shadow-green-700/20" onClick={() => navigate('/onboarding')}>
            Daftar Sekarang <ArrowRight className="w-4 h-4" />
          </button>
          <button className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 px-8 py-3 rounded-full font-medium transition">
            Lihat Demo
          </button>
        </div>

        <div className="flex items-center gap-6 pt-4 text-sm font-medium text-gray-600">
          <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-600"/> Akurat 100%</span>
          <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-600"/> Terpercaya</span>
          <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-600"/> Terintegrasi</span>
        </div>
      </div>

      <div className="relative">
        <div className="aspect-4/3 rounded-3xl overflow-hidden shadow-2xl">
          <img 
            src={heroFitSmart} 
            alt="FitSmart App Preview" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-4">
          <div className="bg-green-100 p-3 rounded-xl">
            <Activity className="w-6 h-6 text-green-700" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Kalori Harian</p>
            <p className="text-xl font-bold text-gray-900">1.847 <span className="text-sm font-medium text-gray-500">Kkal</span></p>
          </div>
        </div>
      </div>
    </section>
  );
}