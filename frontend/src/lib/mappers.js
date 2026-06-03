export const activityMap = {
  'Sangat jarang bergerak': 'sedentary',
  'Ringan (1-3x/minggu)': 'light',
  'Sedang (3-5x/minggu)': 'moderate',
  'Aktif (6-7x/minggu)': 'active',
  'Sangat aktif / atlet': 'very_active',
};

export const goalMap = {
  'Turunkan berat badan': 'lose_weight',
  'Pertahankan berat badan': 'maintain_weight',
  'Naikkan massa otot': 'gain_weight',
};

export function toBackendProfile(formData) {
  return {
    diseaseHistory: formData.riwayatPenyakit?.trim() || undefined,
    weight: Number(formData.berat),
    height: Number(formData.tinggi),
    age: Number(formData.usia),
    gender: formData.jenisKelamin === 'Pria' ? 'male' : 'female',
    activityLevel: activityMap[formData.aktivitas],
    goal: goalMap[formData.tujuan],
  };
}

export function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'FS';
}

export function formatNumber(value, fallback = '-') {
  if (value === null || value === undefined || value === '') return fallback;
  return Number(value).toLocaleString('id-ID');
}
