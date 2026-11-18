import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Leaf } from 'lucide-react';

/** Latar belakang animasi bersama untuk halaman Login & Onboarding. */
export default function AuthBackdrop({ children, showBack = true }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-br from-[#FFFDF0] via-[#F4F8E6] to-[#FDEEB7] font-sans">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-28 -left-24 w-96 h-96 rounded-full bg-green-300/35 blur-3xl animate-blob" />
        <div className="absolute bottom-0 -right-24 w-md h-112 rounded-full bg-amber-300/35 blur-3xl animate-blob [animation-delay:-6s]" />
        <div className="absolute top-1/2 left-1/3 w-72 h-72 rounded-full bg-emerald-200/30 blur-3xl animate-blob [animation-delay:-10s]" />
      </div>

      {showBack && (
        <Link
          to="/"
          className="absolute top-6 left-6 z-20 flex items-center gap-2 text-gray-500 hover:text-green-700 font-medium text-sm transition-colors group"
        >
          <ArrowLeft size={16} className="transition-transform duration-300 group-hover:-translate-x-1" />
          Kembali ke Beranda
        </Link>
      )}

      <div className="relative z-10">{children}</div>
    </div>
  );
}

export function BrandMark({ className = '' }) {
  return (
    <Link
      to="/"
      aria-label="FitSmart"
      className={`inline-flex bg-green-100 p-3 rounded-2xl hover:bg-green-200 hover:rotate-6 transition-all duration-300 ${className}`}
    >
      <Leaf className="text-green-700" size={30} />
    </Link>
  );
}
