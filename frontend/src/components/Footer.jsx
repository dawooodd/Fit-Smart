import React from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="kontak" className="bg-[#0A4E2B] text-white pt-20 pb-10 px-6 md:px-8 scroll-mt-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-2">
            <Link to="/" className="inline-block text-3xl font-bold mb-6 hover:text-green-200 transition-colors">FitSmart</Link>
            <p className="text-green-100 text-sm max-w-sm leading-relaxed mb-6">
              Aplikasi kesehatan nomor satu yang membantu merancang rutinitas nutrisi dan kebugaran yang dipersonalisasi khusus untukmu.
            </p>
            <div className="flex gap-4">
              <a
                href="mailto:muchammadnasich896@gmail.com"
                aria-label="Kirim email"
                className="w-10 h-10 bg-green-800 rounded-full flex items-center justify-center hover:bg-green-600 hover:-translate-y-1 transition-all duration-300"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-lg">Eksplor</h4>
            <ul className="space-y-3 text-green-100 text-sm">
              <li><a href="#" className="hover:text-white hover:pl-1 transition-all">Beranda</a></li>
              <li><a href="#fitur" className="hover:text-white hover:pl-1 transition-all">Fitur</a></li>
              <li><a href="#cara-kerja" className="hover:text-white hover:pl-1 transition-all">Cara Kerja</a></li>
              <li><Link to="/login" className="hover:text-white hover:pl-1 transition-all">Masuk</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-lg">Info Terbaru</h4>
            <div className="flex bg-green-800 p-1 rounded-full border border-green-700 focus-within:border-white transition">
              <input type="email" aria-label="Email Anda" placeholder="Email Anda" className="bg-transparent border-none outline-none px-4 py-2 w-full text-sm placeholder-green-300 text-white" />
              <button className="press bg-white text-green-900 px-6 py-2 rounded-full text-sm font-bold">Kirim</button>
            </div>
          </div>
        </div>

        <div className="border-t border-green-800 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-green-200">
          <p>© {new Date().getFullYear()} FitSmart - All rights reserved</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition">Syarat &amp; Ketentuan</a>
            <a href="#" className="hover:text-white transition">Kebijakan Privasi</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
