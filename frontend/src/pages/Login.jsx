import React, { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, AlertCircle, Eye, EyeOff, Loader2, Mail, Lock, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AuthBackdrop, { BrandMark } from '../components/ui/AuthBackdrop';

const inputBase =
  'w-full pl-12 pr-4 py-4 rounded-xl border bg-gray-50 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 transition';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, isBootstrapping, sessionExpired } = useAuth();
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [shakeKey, setShakeKey] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const redirectTo = location.state?.from || '/dashboard';

  // Pengguna yang sudah login tidak perlu melihat form lagi.
  if (!isBootstrapping && isAuthenticated && !isLoading) {
    return <Navigate to={redirectTo} replace />;
  }

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    setError('');

    try {
      await login({ email: credentials.email.trim(), password: credentials.password });
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message || 'Login gagal. Periksa email dan password.');
      setShakeKey((k) => k + 1);
      setIsLoading(false);
    }
  };

  return (
    <AuthBackdrop>
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="bg-white/90 backdrop-blur-xl w-full max-w-md rounded-[2.5rem] p-8 sm:p-10 shadow-2xl shadow-green-900/10 border border-white animate-popIn">
          <div className="flex flex-col items-center mb-8 text-center">
            <BrandMark className="mb-4 animate-float" />
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Selamat Datang</h1>
            <p className="text-gray-500 text-sm">Masuk untuk melihat progres latihan dan nutrisi harianmu.</p>
          </div>

          {sessionExpired && (
            <div role="status" className="mb-5 flex items-start gap-2 text-amber-700 bg-amber-50 px-4 py-3 rounded-xl text-sm font-medium animate-fadeIn">
              <Info size={18} className="shrink-0 mt-0.5" />
              Sesimu telah berakhir. Silakan masuk kembali.
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5" noValidate={false}>
            <div className="animate-fadeUp [animation-delay:80ms]">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <div className="relative group">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-600 transition-colors" />
                <input
                  id="email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  required
                  value={credentials.email}
                  onChange={handleChange}
                  placeholder="contoh@email.com"
                  className={`${inputBase} border-gray-200 focus:border-green-500 focus:ring-green-500/20`}
                />
              </div>
            </div>

            <div className="animate-fadeUp [animation-delay:160ms]">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <div className="relative group">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-600 transition-colors" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  autoComplete="current-password"
                  required
                  value={credentials.password}
                  onChange={handleChange}
                  placeholder="Masukkan password"
                  className={`${inputBase} pr-12 border-gray-200 focus:border-green-500 focus:ring-green-500/20`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-gray-400 hover:text-green-700 hover:bg-green-50 transition"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div
                key={shakeKey}
                role="alert"
                className="flex items-start gap-2 text-rose-600 bg-rose-50 px-4 py-3 rounded-xl text-sm font-medium animate-shake"
              >
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="group press w-full bg-green-700 hover:bg-green-800 disabled:opacity-70 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 mt-2 shadow-lg shadow-green-700/25 animate-fadeUp [animation-delay:240ms]"
            >
              {isLoading ? (
                <><Loader2 size={18} className="animate-spin" /> Memproses...</>
              ) : (
                <>Masuk <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" /></>
              )}
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
    </AuthBackdrop>
  );
}
