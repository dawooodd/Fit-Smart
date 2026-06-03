import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { toBackendProfile } from '../lib/mappers';
import { useAuth } from '../context/AuthContext';

export default function Onboarding() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    namaPanggilan: '',
    email: '',
    password: '',
    usia: '',
    jenisKelamin: '',
    tinggi: '',
    berat: '',
    aktivitas: '',
    tujuan: '',
    riwayatPenyakit: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const validateStep = () => {
    setError('');

    if (currentStep === 1) {
      if (!formData.namaPanggilan.trim()) return setError('Nama panggilan wajib diisi.'), false;
      if (!formData.email.trim()) return setError('Email wajib diisi.'), false;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return setError('Format email belum valid.'), false;
      if (!formData.password || formData.password.length < 6) return setError('Password minimal 6 karakter.'), false;
      if (!formData.usia || Number(formData.usia) <= 0) return setError('Usia harus berupa angka yang valid.'), false;
      if (!formData.jenisKelamin) return setError('Pilih jenis kelamin Anda.'), false;
    }

    if (currentStep === 2) {
      if (!formData.tinggi || Number(formData.tinggi) <= 0) return setError('Tinggi badan wajib diisi dengan benar.'), false;
      if (!formData.berat || Number(formData.berat) <= 0) return setError('Berat badan wajib diisi dengan benar.'), false;
    }

    if (currentStep === 3 && !formData.aktivitas) return setError('Mohon pilih tingkat rutinitas mingguan Anda.'), false;
    if (currentStep === 4 && !formData.tujuan) return setError('Mohon pilih tujuan kalori Anda.'), false;

    return true;
  };

  const nextStep = () => {
    if (validateStep() && currentStep < totalSteps) setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setError('');
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    setIsLoading(true);
    setError('');

    try {
      await api.register({
        name: formData.namaPanggilan.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      await login({
        email: formData.email.trim(),
        password: formData.password,
      });

      await api.saveProfile(toBackendProfile(formData));
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registrasi gagal. Coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Halo, kenalan dulu yuk.</h2>
        <p className="text-gray-600">Data ini akan dibuat sebagai akun dan profil FitSmart.</p>
      </div>

      <div className="space-y-4 pt-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nama panggilan</label>
          <input type="text" name="namaPanggilan" value={formData.namaPanggilan} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Usia (tahun)</label>
            <input type="number" name="usia" value={formData.usia} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jenis kelamin</label>
            <div className="flex gap-2">
              {['Pria', 'Wanita'].map((item) => (
                <button key={item} type="button" onClick={() => setFormData((prev) => ({ ...prev, jenisKelamin: item }))} className={`flex-1 py-3 rounded-xl border font-medium transition ${formData.jenisKelamin === item ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Ukur tubuhmu.</h2>
        <p className="text-gray-600">Dipakai backend untuk menghitung BMR dan target kalori harian.</p>
      </div>
      <div className="grid grid-cols-2 gap-4 pt-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tinggi (cm)</label>
          <input type="number" name="tinggi" value={formData.tinggi} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Berat (kg)</label>
          <input type="number" name="berat" value={formData.berat} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Riwayat penyakit / catatan kesehatan (opsional)</label>
        <textarea name="riwayatPenyakit" value={formData.riwayatPenyakit} onChange={handleInputChange} rows="3" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition" />
      </div>
    </div>
  );

  const renderOptions = (title, desc, field, options) => (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-600">{desc}</p>
      </div>
      <div className="space-y-3 pt-4">
        {options.map((option) => (
          <button key={option} type="button" onClick={() => setFormData((prev) => ({ ...prev, [field]: option }))} className={`w-full flex items-center justify-between px-5 py-4 rounded-xl border transition ${formData[field] === option ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:bg-gray-50'}`}>
            <span className={`font-medium ${formData[field] === option ? 'text-green-800' : 'text-gray-700'}`}>{option}</span>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData[field] === option ? 'border-green-500' : 'border-gray-300 bg-gray-100'}`}>
              {formData[field] === option && <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>}
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-[#FFFDF0] to-[#FDEEB7] flex flex-col font-sans">
      <div className="max-w-4xl w-full mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <div className="font-bold text-gray-800 text-lg">Fitsmart</div>
          <div className="text-sm text-gray-600 font-medium">Langkah {currentStep} dari {totalSteps}</div>
        </div>
        <div className="w-full h-1.5 bg-gray-200/50 rounded-full overflow-hidden">
          <div className="h-full bg-linear-to-r from-green-400 to-amber-400 transition-all duration-500 ease-out" style={{ width: `${(currentStep / totalSteps) * 100}%` }}></div>
        </div>
      </div>

      <div className="flex-1 flex justify-center items-start pt-4 px-4 pb-12">
        <div className="bg-white w-full max-w-xl rounded-4xl p-8 md:p-12 shadow-xl shadow-amber-900/5 relative min-h-112.5 flex flex-col justify-between">
          <div>
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderOptions('Seberapa aktif kamu?', 'Pilih yang paling mendekati rutinitas mingguanmu.', 'aktivitas', ['Sangat jarang bergerak', 'Ringan (1-3x/minggu)', 'Sedang (3-5x/minggu)', 'Aktif (6-7x/minggu)', 'Sangat aktif / atlet'])}
            {currentStep === 4 && renderOptions('Apa tujuanmu?', 'Plan dan target kalori akan disesuaikan.', 'tujuan', ['Turunkan berat badan', 'Pertahankan berat badan', 'Naikkan massa otot'])}
          </div>

          <div className="mt-8">
            {error && (
              <div className="flex items-center gap-2 text-rose-500 bg-rose-50 px-4 py-3 rounded-xl mb-4 text-sm font-medium animate-fadeIn">
                <AlertCircle size={18} />
                {error}
              </div>
            )}
            <div className="flex justify-between items-center border-t border-gray-100 pt-6">
              <button type="button" onClick={prevStep} className={`flex items-center gap-2 font-medium transition ${currentStep === 1 ? 'opacity-0 pointer-events-none' : 'text-gray-600 hover:text-gray-900'}`}>
                <ArrowLeft className="w-5 h-5" /> Kembali
              </button>

              {currentStep < totalSteps ? (
                <button type="button" onClick={nextStep} className="bg-[#10D970] hover:bg-[#0eb85f] text-gray-900 px-6 py-3 rounded-full font-semibold flex items-center gap-2 transition shadow-lg shadow-green-500/20">
                  Lanjut <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <button type="button" onClick={handleSubmit} disabled={isLoading} className="bg-[#10D970] hover:bg-[#0eb85f] disabled:opacity-60 text-gray-900 px-6 py-3 rounded-full font-semibold flex items-center gap-2 transition shadow-lg shadow-green-500/20">
                  {isLoading ? 'Menyimpan...' : 'Selesai'} <Check className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
