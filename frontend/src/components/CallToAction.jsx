import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Reveal from './ui/Reveal';

export default function CallToAction() {
  const navigate = useNavigate();
  return (
    <section className="py-20 px-6 md:px-8 max-w-7xl mx-auto">
      <Reveal>
        <div className="bg-linear-to-r from-green-800 via-emerald-700 to-amber-600 bg-size-[200%_200%] animate-gradientShift rounded-[3rem] p-10 md:p-20 text-center text-white shadow-2xl relative overflow-hidden">
          <div aria-hidden className="absolute top-0 right-0 w-72 h-72 bg-white opacity-10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 animate-blob" />
          <div aria-hidden className="absolute bottom-0 left-0 w-72 h-72 bg-white opacity-10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2 animate-blob [animation-delay:-7s]" />

          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Mulai langkah kecil, hari ini.</h2>
            <p className="text-green-50 mb-10 max-w-2xl mx-auto opacity-90">
              Buat profil kamu, ketahui kalori harian idealmu, dan dapatkan rekomendasi pertama secara gratis.
            </p>
            <button
              className="group press bg-white text-green-900 hover:bg-gray-100 px-8 py-4 rounded-full font-bold flex items-center gap-2 mx-auto shadow-xl shadow-black/10"
              onClick={() => navigate('/onboarding')}
            >
              Mulai Sekarang
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
