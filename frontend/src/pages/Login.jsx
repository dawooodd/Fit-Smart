import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Heart, ArrowRight } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    // Tambahkan logika autentikasi (API call) di sini
    console.log("Login dicoba dengan:", credentials);
    
    // Asumsi login berhasil, arahkan langsung ke dashboard
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#FFFDF0] to-[#FDEEB7] flex items-center justify-center font-sans p-6">
      
      <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl shadow-amber-900/10">
        
        {/* Header/Logo */}
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="bg-green-100 p-3 rounded-2xl mb-4">
            <Heart className="fill-green-600 text-green-600" size={32} />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Selamat Datang</h1>
          <p className="text-gray-500 text-sm">Masuk untuk melihat progres latihan dan nutrisi harianmu.</p>
        </div>

        {/* Form Login */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
            <input 
              type="email" 
              name="email"
              required
              value={credentials.email}
              onChange={handleChange}
              placeholder="contoh@email.com"
              className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition bg-gray-50 hover:bg-white"
            />
          </div>

          <div>
            <label className="flex text-sm font-semibold text-gray-700 mb-2 justify-between">
              <span>Password</span>
              <a href="#" className="text-green-600 hover:text-green-700 font-medium text-xs">Lupa password?</a>
            </label>
            <input 
              type="password" 
              name="password"
              required
              value={credentials.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition bg-gray-50 hover:bg-white"
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-green-700 hover:bg-green-800 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition mt-4 shadow-lg shadow-green-700/20"
          >
            Masuk <ArrowRight size={18} />
          </button>
        </form>

        {/* Link ke Onboarding (Register) */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 font-medium">
            Belum punya akun?{' '}
            <Link to="/onboarding" className="text-green-600 hover:text-green-800 font-bold transition">
              Daftar sekarang
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}