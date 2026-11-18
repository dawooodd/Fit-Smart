import React from 'react';
import { ArrowRight, CheckCircle2, Activity, Flame, Sparkles } from 'lucide-react';
import heroFitSmart from '../assets/hero-fitsmart.jpg';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CountUp from './ui/CountUp';

const badges = ['Personal', 'Berbasis sains', 'Terintegrasi AI'];

export default function Hero() {
  const navigate = useNavigate();
  const { loginAsDemo } = useAuth();

  const handleDemoClick = () => {
    loginAsDemo();
    navigate('/dashboard');
  };

  return (
    <section className="relative overflow-hidden">
      {/* Dekorasi latar bergerak */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-0">
        <div className="absolute -top-24 -left-20 w-96 h-96 rounded-full bg-green-300/30 blur-3xl animate-blob" />
        <div className="absolute top-1/3 -right-24 w-md h-112 rounded-full bg-amber-200/40 blur-3xl animate-blob [animation-delay:-5s]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-8 py-14 md:py-24 grid md:grid-cols-2 gap-14 items-center">
        <div className="space-y-6">
          <span className="animate-fadeUp inline-flex items-center gap-2 bg-green-100 text-green-800 text-sm font-semibold px-4 py-1.5 rounded-full">
            <Sparkles className="w-4 h-4" /> Pendamping kesehatan berbasis AI
          </span>

          <h1 className="animate-fadeUp [animation-delay:100ms] text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-gray-900">
            Hidup sehat, <br />
            <span className="bg-linear-to-r from-green-700 via-emerald-500 to-amber-500 bg-size-[200%_auto] bg-clip-text text-transparent animate-gradientShift">
              dipersonalisasi untukmu.
            </span>
          </h1>

          <p className="animate-fadeUp [animation-delay:200ms] text-lg text-gray-600 max-w-md leading-relaxed">
            FitSmart mengkalkulasi mikro-detailmu berdasarkan usia, rutinitas, BMI, BMR, dan tujuanmu—bukan saran umum yang sama untuk semua orang.
          </p>

          <div className="animate-fadeUp [animation-delay:300ms] flex flex-wrap items-center gap-4 pt-2">
            <button
              className="group press bg-green-700 hover:bg-green-800 text-white px-8 py-3 rounded-full font-medium flex items-center gap-2 shadow-lg shadow-green-700/25"
              onClick={() => navigate('/onboarding')}
            >
              Daftar Sekarang
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
            <button
              className="press bg-white border border-gray-200 hover:border-green-300 hover:bg-green-50 text-gray-800 px-8 py-3 rounded-full font-medium"
              onClick={handleDemoClick}
            >
              Lihat Demo
            </button>
          </div>

          <div className="animate-fadeUp [animation-delay:400ms] flex flex-wrap items-center gap-x-6 gap-y-2 pt-4 text-sm font-medium text-gray-600">
            {badges.map((badge) => (
              <span key={badge} className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" /> {badge}
              </span>
            ))}
          </div>
        </div>

        <div className="relative animate-popIn [animation-delay:200ms]">
          <div className="group aspect-4/3 rounded-3xl overflow-hidden shadow-2xl shadow-green-900/20 ring-1 ring-black/5">
            <img
              src={heroFitSmart}
              alt="Tampilan aplikasi FitSmart"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>

          <div className="absolute -bottom-6 -left-4 md:-left-6 animate-float bg-white p-4 rounded-2xl shadow-xl flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-xl animate-pulseRing">
              <Activity className="w-6 h-6 text-green-700" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Kalori Harian</p>
              <p className="text-xl font-bold text-gray-900">
                <CountUp end={1847} /> <span className="text-sm font-medium text-gray-500">Kkal</span>
              </p>
            </div>
          </div>

          <div className="absolute -top-5 -right-3 md:-right-5 animate-floatSlow [animation-delay:-3s] bg-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3">
            <div className="bg-amber-100 p-2.5 rounded-xl">
              <Flame className="w-5 h-5 text-amber-600" />
            </div>
            <p className="text-sm font-bold text-gray-900">Target tercapai 92%</p>
          </div>
        </div>
      </div>
    </section>
  );
}
