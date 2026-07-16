import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Heart, ArrowRight, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(credentials);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login gagal. Periksa email dan password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#FFFDF0] to-[#FDEEB7] flex items-center justify-center font-sans p-6 relative">
      {/* Back to home */}
      <Link
        to="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-gray-500 hover:text-green-700 font-medium text-sm transition-colors z-10"
      >
        <ArrowLeft size={16} />
        Kembali ke Beranda
      </Link>

      <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl shadow-amber-900/10">
        <div className="flex flex-col items-center mb-10 text-center">
          <Link to="/" className="bg-green-100 p-3 rounded-2xl mb-4 hover:bg-green-200 transition-colors">
            <Heart className="fill-green-600 text-green-600" size={32} />
          </Link>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Selamat Datang</h1>
          <p className="text-gray-500 text-sm">Masuk untuk melihat progres latihan dan nutrisi harianmu.</p>
        </div>

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

          {error && (
            <div className="flex items-center gap-2 text-rose-500 bg-rose-50 px-4 py-3 rounded-xl text-sm font-medium">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-700 hover:bg-green-800 disabled:opacity-60 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition mt-4 shadow-lg shadow-green-700/20"
          >
            {isLoading ? 'Memproses...' : 'Masuk'} <ArrowRight size={18} />
          </button>
        </form>

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
