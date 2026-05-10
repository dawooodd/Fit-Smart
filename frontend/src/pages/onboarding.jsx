import React, { useState } from 'react';
// PERBAIKAN 1: Menambahkan AlertCircle pada import
import { ArrowLeft, ArrowRight, Check, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Onboarding() {
  const navigate = useNavigate();
  // State untuk melacak langkah saat ini (1 sampai 4)
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const [error, setError] = useState('');
  // State untuk menyimpan semua input dari pengguna
  const [formData, setFormData] = useState({
    namaPanggilan: '',
    usia: '',
    jenisKelamin: '', // 'Pria' atau 'Wanita'
    tinggi: '',
    berat: '',
    aktivitas: '',
    tujuan: ''
  });

  // Fungsi untuk menangani perubahan input teks/number
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  // Fungsi untuk validasi langkah
  const validateStep = () => {
    setError(''); // Reset error
    
    if (currentStep === 1) {
      if (!formData.namaPanggilan.trim()) {
        setError('Nama panggilan wajib diisi.');
        return false;
      }
      if (!formData.usia || formData.usia <= 0) {
        setError('Usia harus berupa angka yang valid.');
        return false;
      }
      if (!formData.jenisKelamin) {
        setError('Pilih jenis kelamin Anda.');
        return false;
      }
    }
    
    if (currentStep === 2) {
      if (!formData.tinggi || formData.tinggi <= 0) {
        setError('Tinggi badan wajib diisi dengan benar.');
        return false;
      }
      if (!formData.berat || formData.berat <= 0) {
        setError('Berat badan wajib diisi dengan benar.');
        return false;
      }
    }

    if (currentStep === 3) {
      if (!formData.aktivitas) {
        setError('Mohon pilih tingkat rutinitas mingguan Anda.');
        return false;
      }
    }

    if (currentStep === 4) {
      if (!formData.tujuan) {
        setError('Mohon pilih tujuan kalori Anda.');
        return false;
      }
    }

    return true; // Jika semua lolos, return true
  };

  const nextStep = () => {
    // Hanya lanjut jika validasi mengembalikan true
    if (validateStep()) {
      if (currentStep < totalSteps) setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setError(''); // Bersihkan error saat kembali ke langkah sebelumnya
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = () => {
    // Validasi langkah terakhir sebelum submit
    if (validateStep()) {
      console.log("Data Onboarding Valid & Selesai:", formData);
      navigate('/dashboard'); 
    }
  };

  // --- KOMPONEN UNTUK MASING-MASING LANGKAH ---

  const renderStep1 = () => (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Halo, kenalan dulu yuk.</h2>
        <p className="text-gray-600">Beberapa info dasar untuk personalisasi rekomendasi.</p>
      </div>

      <div className="space-y-4 pt-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nama panggilan</label>
          <input 
            type="text" 
            name="namaPanggilan"
            value={formData.namaPanggilan}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Usia (tahun)</label>
            <input 
              type="number" 
              name="usia"
              value={formData.usia}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jenis kelamin</label>
            <div className="flex gap-2">
              <button 
                onClick={() => setFormData(prev => ({ ...prev, jenisKelamin: 'Pria' }))}
                className={`flex-1 py-3 rounded-xl border font-medium transition ${formData.jenisKelamin === 'Pria' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
              >
                Pria
              </button>
              <button 
                onClick={() => setFormData(prev => ({ ...prev, jenisKelamin: 'Wanita' }))}
                className={`flex-1 py-3 rounded-xl border font-medium transition ${formData.jenisKelamin === 'Wanita' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
              >
                Wanita
              </button>
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
        <p className="text-gray-600">Dipakai untuk menghitung BMI dan kebutuhan kalori harian.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tinggi (cm)</label>
          <input 
            type="number" 
            name="tinggi"
            value={formData.tinggi}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Berat (kg)</label>
          <input 
            type="number" 
            name="berat"
            value={formData.berat}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition"
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => {
    const options = [
      'Sangat jarang bergerak',
      'Ringan (1-3x/minggu)',
      'Sedang (3-5x/minggu)',
      'Aktif (6-7x/minggu)',
      'Sangat aktif / atlet'
    ];

    return (
      <div className="space-y-6 animate-fadeIn">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Seberapa aktif kamu?</h2>
          <p className="text-gray-600">Pilih yang paling mendekati rutinitas mingguanmu.</p>
        </div>

        <div className="space-y-3 pt-4">
          {options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => setFormData(prev => ({ ...prev, aktivitas: option }))}
              className={`w-full flex items-center justify-between px-5 py-4 rounded-xl border transition ${formData.aktivitas === option ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:bg-gray-50'}`}
            >
              <span className={`font-medium ${formData.aktivitas === option ? 'text-green-800' : 'text-gray-700'}`}>{option}</span>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.aktivitas === option ? 'border-green-500' : 'border-gray-300 bg-gray-100'}`}>
                {formData.aktivitas === option && <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderStep4 = () => {
    const options = [
      'Turunkan berat badan',
      'Pertahankan berat badan',
      'Naikkan massa otot'
    ];

    return (
      <div className="space-y-6 animate-fadeIn">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Apa tujuanmu?</h2>
          <p className="text-gray-600">Plan dan target kalori akan disesuaikan.</p>
        </div>

        <div className="space-y-3 pt-4">
          {options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => setFormData(prev => ({ ...prev, tujuan: option }))}
              className={`w-full flex items-center justify-between px-5 py-4 rounded-xl border transition ${formData.tujuan === option ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:bg-gray-50'}`}
            >
              <span className={`font-medium ${formData.tujuan === option ? 'text-green-800' : 'text-gray-700'}`}>{option}</span>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.tujuan === option ? 'border-green-500' : 'border-gray-300 bg-gray-100'}`}>
                {formData.tujuan === option && <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  // --- RENDER UTAMA ---
  // PERBAIKAN 2: Membersihkan duplikasi return div yang berlapis-lapis
  return (
    <div className="min-h-screen bg-linear-to-br from-[#FFFDF0] to-[#FDEEB7] flex flex-col font-sans">
      
      {/* Header & Progress */}
      <div className="max-w-4xl w-full mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <div className="font-bold text-gray-800 text-lg">Fitsmart</div>
          <div className="text-sm text-gray-600 font-medium">Langkah {currentStep} dari {totalSteps}</div>
        </div>
        
        {/* Progress Bar Container */}
        <div className="w-full h-1.5 bg-gray-200/50 rounded-full overflow-hidden">
          <div 
            className="h-full bg-linear-to-r from-green-400 to-amber-400 transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Main Card */}
      <div className="flex-1 flex justify-center items-start pt-4 px-4 pb-12">
        <div className="bg-white w-full max-w-xl rounded-4xl p-8 md:p-12 shadow-xl shadow-amber-900/5 relative min-h-112.5 flex flex-col justify-between">
          
          {/* Render Konten Berdasarkan Step */}
          <div>
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}
          </div>

          <div className="mt-8">
            {/* Tempat menampilkan pesan Error */}
            {error && (
              <div className="flex items-center gap-2 text-rose-500 bg-rose-50 px-4 py-3 rounded-xl mb-4 text-sm font-medium animate-fadeIn">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            {/* Navigasi Footer */}
            <div className="flex justify-between items-center border-t border-gray-100 pt-6">
              <button 
                onClick={prevStep}
                className={`flex items-center gap-2 font-medium transition ${currentStep === 1 ? 'opacity-0 pointer-events-none' : 'text-gray-600 hover:text-gray-900'}`}
              >
                <ArrowLeft className="w-5 h-5" /> Kembali
              </button>

              {currentStep < totalSteps ? (
                <button 
                  onClick={nextStep}
                  className="bg-[#10D970] hover:bg-[#0eb85f] text-gray-900 px-6 py-3 rounded-full font-semibold flex items-center gap-2 transition shadow-lg shadow-green-500/20"
                >
                  Lanjut <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <button 
                  onClick={handleSubmit}
                  className="bg-[#10D970] hover:bg-[#0eb85f] text-gray-900 px-6 py-3 rounded-full font-semibold flex items-center gap-2 transition shadow-lg shadow-green-500/20"
                >
                  Selesai <Check className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}