import React from 'react';
import { LayoutDashboard, Apple, Dumbbell, Moon, Activity, Camera, Target } from 'lucide-react';

export const menuItems = [
  { id: 'Ringkasan', icon: <LayoutDashboard size={20} />, label: 'Ringkasan' },
  { id: 'Rencana Makan', icon: <Apple size={20} />, label: 'Rencana Makan' },
  { id: 'Latihan', icon: <Dumbbell size={20} />, label: 'Latihan' },
  { id: 'Pelacak Tidur', icon: <Moon size={20} />, label: 'Pelacak Tidur' },
];
export const analyticsItems = [
  { id: 'Metrik Tubuh', icon: <Activity size={20} />, label: 'Metrik Tubuh' },
  { id: 'Photo AI', icon: <Camera size={20} />, label: 'Photo AI' },
  { id: 'Target', icon: <Target size={20} />, label: 'Target & Rekomendasi' },
];
export const unreadNotifs = 3;
export const notificationsList = [
  { id: 1, title: 'Dashboard tersambung', desc: 'Data profil, progress, meal, workout, dan photo AI dibaca dari backend.', time: 'Baru saja', read: false },
  { id: 2, title: 'Jangan lupa progress', desc: 'Update berat, air, tidur, dan latihan di menu metrik/tidur.', time: 'Hari ini', read: false },
  { id: 3, title: 'Target kalori', desc: 'Target harian dihitung otomatis dari profil onboarding.', time: 'Hari ini', read: true },
];
