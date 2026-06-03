const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const TOKEN_KEY = 'fitsmart_token';
const USER_KEY = 'fitsmart_user';

export function getToken() { return localStorage.getItem(TOKEN_KEY); }
export function getStoredUser() { try { return JSON.parse(localStorage.getItem(USER_KEY) || 'null'); } catch { localStorage.removeItem(USER_KEY); return null; } }
export function saveSession({ token, user }) { if (token) localStorage.setItem(TOKEN_KEY, token); if (user) localStorage.setItem(USER_KEY, JSON.stringify(user)); }
export function clearSession() { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(USER_KEY); }

async function request(path, options = {}) {
  const token = getToken();
  const isFormData = options.body instanceof FormData;
  const headers = { ...(options.headers || {}) };
  if (!isFormData) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers, body: isFormData ? options.body : options.body });
  const text = await response.text();
  let payload = text;
  try { payload = text ? JSON.parse(text) : {}; } catch { payload = text; }
  if (!response.ok) throw new Error(payload?.message || payload?.error || 'Terjadi kesalahan pada server.');
  return payload;
}
const json = (method, data) => ({ method, body: JSON.stringify(data) });

export const api = {
  request,
  register: (data) => request('/auth/register', json('POST', data)),
  login: (data) => request('/auth/login', json('POST', data)),
  me: () => request('/auth/me'),
  getProfile: () => request('/profile'),
  getDailyAiSummary() {
  return request('/ai/daily-summary');
},
getAiPlanRecommendation() {
  return request('/ai/plan-recommendation');
},
  saveProfile: (data) => request('/profile', json('PUT', data)),
  getProgress: () => request('/progress'),
  getTodayProgress: () => request('/progress/today'),
  saveProgress: (data) => request('/progress', json('PUT', data)),
  deleteProgress: (id) => request(`/progress/${id}`, { method: 'DELETE' }),
  getFoods: () => request('/foods'),
  createFood: (data) => request('/foods', json('POST', data)),
  deleteFood: (id) => request(`/foods/${id}`, { method: 'DELETE' }),
  getMeals: () => request('/meals'),
  createMeal: (data) => request('/meals', json('POST', data)),
  deleteMeal: (id) => request(`/meals/${id}`, { method: 'DELETE' }),
  getExercises: () => request('/workouts/exercises'),
  createExercise: (data) => request('/workouts/exercises', json('POST', data)),
  getWorkoutSessions: () => request('/workouts/sessions'),
  createWorkoutSession: (data) => request('/workouts/sessions', json('POST', data)),
  getFoodRecommendations: () => request('/recommendations/foods'),
  generateFoodRecommendation: (date) => request('/recommendations/foods/generate', json('POST', { date })),
  getWorkoutRecommendations: () => request('/recommendations/workouts'),
  generateWorkoutRecommendation: (date) => request('/recommendations/workouts/generate', json('POST', { date })),
  uploadPhoto: (formData) => request('/photos', { method: 'POST', body: formData }),
};
