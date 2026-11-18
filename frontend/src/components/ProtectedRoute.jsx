import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isBootstrapping } = useAuth();
  const location = useLocation();

  if (isBootstrapping) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-[#FDFBF6] text-green-700 font-semibold animate-fadeIn">
        <Loader2 className="w-8 h-8 animate-spin" />
        Memuat sesi...
      </div>
    );
  }

  // Simpan halaman tujuan agar setelah login pengguna kembali ke sana.
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location.pathname }} />;

  return children;
}
