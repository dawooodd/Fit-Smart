import React from 'react';
import { 
  CheckCircle2, 
  ArrowRight, 
  Leaf, 
  Dumbbell, 
  BrainCircuit, 
  TrendingUp, 
  Activity, 
  Smartphone,
  Mail
} from 'lucide-react';


const featuresData = [
  { id: 1, title: 'Pola personal', desc: 'Sistem menyesuaikan nutrisi dan program latihan dengan kondisi tubuh dan tujuanmu.', icon: <Leaf className="w-6 h-6 text-green-600" /> },
  { id: 2, title: 'Program Latihan', desc: 'Rekomendasi video & panduan latihan yang dapat dilakukan di rumah atau di gym.', icon: <Dumbbell className="w-6 h-6 text-green-600" /> },
  { id: 3, title: 'Model AI', desc: 'Fitur deteksi makanan menggunakan kamera AI untuk menghitung kalori secara akurat.', icon: <BrainCircuit className="w-6 h-6 text-green-600" /> },
  { id: 4, title: 'Pantau Progres', desc: 'Visualisasi grafik berat badan, massa otot, dan performa yang interaktif.', icon: <TrendingUp className="w-6 h-6 text-green-600" /> },
  { id: 5, title: 'Latih Tubuh Otomatis', desc: 'Kalkulator otomatis untuk kalori, makronutrisi, serta pengingat minum air & olahraga.', icon: <Activity className="w-6 h-6 text-green-600" /> },
  { id: 6, title: 'Mudah digunakan', desc: 'Antarmuka aplikasi yang simpel, modern, dan intuitif untuk semua kalangan.', icon: <Smartphone className="w-6 h-6 text-green-600" /> },
];


const stepsData = [
  { id: '01', title: 'Isi profilmu', desc: 'Usia, tinggi, berat badan, tingkat aktivitas, dan target yang ingin dicapai.' },
  { id: '02', title: 'Sistem menghitung', desc: 'FitSmart AI akan menganalisis data BMR dan kalori harian idealmu.' },
  { id: '03', title: 'Terima rekomendasi', desc: 'Rencana makan dan jadwal latihan siap untuk kamu jalankan setiap hari.' },
];

const teamData = [
  { id: 1, name: 'Donny Robiantono', role: 'Full-Stack Developer' },
  { id: 2, name: 'Muhammad Nasich', role: 'Data Scientist' },
  { id: 3, name: 'Muhammad Rafif Hadziq', role: 'AI Engineer' },
  { id: 4, name: 'Arrosyid Al Ayubi', role: 'Full-Stack Developer' },
  { id: 5, name: 'M. Geralldo Agatha S.', role: 'Data Scientist' },
  { id: 6, name: 'Revita Nur Fatimah B.', role: 'AI Engineer' },
];

export { featuresData, stepsData, teamData };