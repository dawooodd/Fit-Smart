import React from 'react';
import { 
  LayoutDashboard, Apple, Dumbbell, Moon, 
  Activity, FileText, Target 
} from 'lucide-react';

export const menuItems = [
  { id: 'Ringkasan', icon: <LayoutDashboard size={20} />, label: 'Ringkasan' },
  { id: 'Rencana Makan', icon: <Apple size={20} />, label: 'Rencana Makan' },
  { id: 'Latihan', icon: <Dumbbell size={20} />, label: 'Latihan' },
  { id: 'Pelacak Tidur', icon: <Moon size={20} />, label: 'Pelacak Tidur' },
];

export const analyticsItems = [
  { id: 'Metrik Tubuh', icon: <Activity size={20} />, label: 'Metrik Tubuh' },
  { id: 'Laporan Lab', icon: <FileText size={20} />, label: 'Laporan Lab' },
  { id: 'Target', icon: <Target size={20} />, label: 'Target' },
];

export const unreadNotifs = 3;

export const notificationsList = [
  { id: 1, title: "Target Langkah Tercapai!", desc: "Hebat! Kamu telah mencapai 8.000 langkah hari ini.", time: "10 menit yang lalu", read: false },
  { id: 2, title: "Waktu Minum Air", desc: "Jangan lupa penuhi target 2.5L air kamu hari ini.", time: "1 jam yang lalu", read: false },
  { id: 3, title: "Laporan Lab Tersedia", desc: "Hasil lab darah kamu yang diunggah minggu lalu sudah dianalisis.", time: "2 jam yang lalu", read: false },
];