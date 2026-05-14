import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CallToAction() {
  const navigate = useNavigate();
  return (
    <section className="py-20 px-8 max-w-7xl mx-auto">
      <div className="bg-linear-to-r from-green-800 to-amber-600 rounded-[3rem] p-12 md:p-20 text-center text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
        
        <div className="relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Mulai langkah kecil, hari ini.</h2>
          <p className="text-green-50 mb-10 max-w-2xl mx-auto opacity-90">
            Buat profil kamu, ketahui kalori harian idealmu, dan dapatkan rekomendasi pertama secara gratis.
          </p>
          <button className="bg-white text-green-900 hover:bg-gray-100 px-8 py-4 rounded-full font-bold transition flex items-center gap-2 mx-auto" onClick={() => navigate('/onboarding')}>
            Mulai Sekarang <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}