# Integrasi Frontend dan Backend FitSmart

Perubahan utama:

- Menambahkan API client frontend di `frontend/src/lib/api.js`.
- Menambahkan mapping payload frontend ke schema backend di `frontend/src/lib/mappers.js`.
- Menambahkan auth context dan protected route.
- Menghubungkan halaman login ke endpoint `POST /api/auth/login`.
- Menghubungkan onboarding ke endpoint:
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `PUT /api/profile`
- Menghubungkan dashboard ke endpoint:
  - `GET /api/profile`
  - `GET /api/progress/today`
  - `GET /api/progress`
- Mengubah data ringkasan, rencana makan, latihan, tidur, dan metrik tubuh agar membaca data profile/progress dari backend.

Cara menjalankan:

1. Backend
   ```bash
   cd backend
   cp .env.example .env # jika tersedia, atau buat .env sendiri
   npm install
   npm run dev
   ```

2. Frontend
   ```bash
   cd frontend
   cp .env.example .env
   npm install
   npm run dev
   ```

Default frontend API base URL: `http://localhost:3000/api`.
