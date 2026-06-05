# Fit-Smart

Fit-Smart adalah aplikasi kesehatan dan kebugaran penuh-perangkat (full-stack) yang menawarkan:

- Sistem profil pengguna untuk mengelola data tubuh dan tujuan.
- Rekomendasi makanan dan latihan personal berdasar input dan progress pengguna.
- Analisis foto makanan menggunakan model AI berbasis TensorFlow.
- Ringkasan harian dan rencana kesehatan AI melalui OpenRouter.
- Database PostgreSQL dengan Prisma untuk manajemen data.
- Frontend React + Vite modern.
- Dashboard data science Streamlit untuk EDA, feature engineering, dan forecasting.

## Ringkasan Komponen

- `backend/` — API server Express + Prisma + PostgreSQL + AI photo inference.
- `frontend/` — UI React + Vite untuk pengguna interaktif.
- `streamlit/` — Dashboard Data Science untuk analisis nutrisi dan forecasting.
- `data/` — Dataset `nutrition.csv` dan notebook pendukung.
- `docker/` — folder Docker placeholder untuk dokumentasi container.
- `docs/` — dokumentasi tambahan.

## Struktur Folder Utama

- `backend/`
  - `src/` — kode server (routes, controllers, services, middleware).
  - `prisma/` — schema Prisma, seed, migrasi.
  - `ai-model/` — model TensorFlow, inference script Python, dan class mapping.
  - `package.json` — dependensi backend dan perintah npm.
- `frontend/`
  - `src/` — kode React aplikasi.
  - `public/` — aset statis frontend.
  - `package.json` — dependensi frontend dan perintah build/dev.
- `streamlit/`
  - `app.py` — aplikasi Streamlit utama.
  - `data_loader.py` — module data loading dan ETL.
  - `forecasting.py` — module time-series forecasting.
- `data/`
  - `nutrition.csv` — dataset nutrisi.
  - notebooks dan dataset pendukung untuk analisis.

## Prasyarat

- Node.js 20.x / 22.x / 24.x+
- npm
- PostgreSQL (atau database kompatibel PostgreSQL)
- Python 3.x untuk AI model dan Streamlit dashboard
- `pip` untuk menginstal requirement Python

## 1. Setup Backend

1. Masuk ke folder backend:

   ```bash
   cd backend
   npm install
   ```

2. Buat file environment `.env` di `backend/` dengan variabel berikut:

   ```env
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB?schema=public"
   JWT_SECRET="isi_secret_yang_panjang"
   PORT=3000

   # Untuk fitur ringkasan dan rencana AI
   OPENROUTER_API_KEY="<nilai_api_key_openrouter>"
   OPENROUTER_MODEL="deepseek/deepseek-chat-v3.1:free"

   # Untuk inference foto makanan
   FITSMART_MODEL_PATH=./ai-model/model/fitsmart_model.keras
   FITSMART_MAPPING_PATH=./ai-model/model/class_mapping.json
   FITSMART_INFERENCE_SCRIPT=./ai-model/inference.py
   PYTHON_BIN=python3
   FITSMART_ALLOW_DEMO_AI=true
   ```

   > `FITSMART_ALLOW_DEMO_AI=true` berguna saat model `.keras` belum tersedia.

3. Generate Prisma dan jalankan migrasi:

   ```bash
   npx prisma generate
   npx prisma migrate dev
   npm run prisma:seed
   ```

4. Jalankan server backend:

   ```bash
   npm run dev
   ```

5. Production / deployment:

   ```bash
   npm run start
   ```

### Backend Scripts Utama

- `npm run dev` — jalankan server dengan `nodemon`.
- `npm run start` — migrasi deploy dan jalankan server.
- `npm run prisma:generate` — generate Prisma client.
- `npm run prisma:migrate` — migrasi database development.
- `npm run prisma:seed` — seed data awal.
- `npm run deploy` — alias production deploy.
- `npm run ai:status` — cek status AI model dari service backend.

### Konfigurasi Prisma

Backend menggunakan Prisma v7 dengan adapter PostgreSQL di `backend/src/config/prisma.js`:

- `DATABASE_URL` harus menunjuk ke database PostgreSQL yang valid.
- `prisma/schema.prisma` menyimpan model data dan relasi.

## 2. Setup Frontend

1. Masuk ke folder frontend:

   ```bash
   cd frontend
   npm install
   ```

2. Jalankan aplikasi front-end:

   ```bash
   npm run dev
   ```

3. Build produksi:

   ```bash
   npm run build
   ```

4. Preview hasil build:

   ```bash
   npm run preview
   ```

> Frontend membangun antarmuka React modern dengan Vite, Tailwind, dan React Router.

## 3. Streamlit Data Science Dashboard

Folder `streamlit/` berisi dashboard analisis dan forecasting.

1. Masuk ke folder streamlit:

   ```bash
   cd streamlit
   python3 -m pip install streamlit pandas matplotlib seaborn statsmodels
   ```

2. Jalankan dashboard:

   ```bash
   streamlit run app.py
   ```

Dashboard ini digunakan untuk:

- Exploratory Data Analysis (EDA)
- Feature engineering nutrisi
- Time-series forecasting berat badan
- Visualisasi korelasi makronutrien

## 4. AI Model & Food Photo Analysis

Folder `backend/ai-model/` berisi inference TensorFlow untuk deteksi makanan.

- Model TensorFlow: `backend/ai-model/model/fitsmart_model.keras`
- Mapping kelas: `backend/ai-model/model/class_mapping.json`
- Script inferensi: `backend/ai-model/inference.py`
- Python requirements: `backend/ai-model/requirements.txt`

Instal dependency Python:

```bash
cd backend
python3 -m pip install -r ai-model/requirements.txt
```

Jika model asli tersedia, gunakan `FITSMART_ALLOW_DEMO_AI=false`.
Jika belum, `FITSMART_ALLOW_DEMO_AI=true` akan menjalankan mode demo.

### Endpoint AI Foto Makanan

- `GET /api/ai/model-status` — status kesiapan model AI.
- `POST /api/photos` — unggah foto makanan atau kirim `imageUrl`.
- `PUT /api/photos/:id` — update informasi foto.
- `DELETE /api/photos/:id` — hapus analisis foto.

### Endpoint AI Ringkasan & Rencana

- `GET /api/ai/daily-summary` — ringkasan kesehatan harian (OpenRouter).
- `GET /api/ai/plan-recommendation` — rekomendasi makanan dan workout AI.

> Kedua endpoint membutuhkan `OPENROUTER_API_KEY` dan model OpenRouter.

## 5. API Backend Utama

Path umum: `/api`

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Profile
- `GET /api/profile`
- `POST /api/profile`
- `PUT /api/profile`

### Progress
- `GET /api/progress`
- `GET /api/progress/today`
- `POST /api/progress`
- `PUT /api/progress`
- `DELETE /api/progress/:id`

### Food
- `GET /api/foods?q=&category=`
- `GET /api/foods/:id`
- `POST /api/foods`
- `PUT /api/foods/:id`
- `DELETE /api/foods/:id`

### Meal
- `GET /api/meals?date=&startDate=&endDate=`
- `GET /api/meals/:id`
- `POST /api/meals`
- `PUT /api/meals/:id`
- `POST /api/meals/:id/foods`
- `DELETE /api/meals/:id/foods/:mealFoodId`
- `DELETE /api/meals/:id`

### Workout
- `GET /api/workouts/exercises`
- `POST /api/workouts/exercises`
- `GET /api/workouts/sessions`
- `POST /api/workouts/sessions`
- `POST /api/workouts/sessions/:id/exercises`

### Recommendation
- `GET /api/recommendations/foods`
- `POST /api/recommendations/foods/generate`
- `GET /api/recommendations/workouts`
- `POST /api/recommendations/workouts/generate`

### Photo Analysis
- `GET /api/photos`
- `POST /api/photos`
- `PUT /api/photos/:id`
- `DELETE /api/photos/:id`

> Semua endpoint selain `register` dan `login` membutuhkan header `Authorization: Bearer <token>`.

## 6. Dataset `data/`

Folder `data/` menyediakan kumpulan nutrisi dan notebook eksplorasi.

- `nutrition.csv` — dataset nutrisi yang digunakan dalam analisis dan perhitungan kalori.
- `data/train/` — kumpulan gambar kelas makanan untuk pelatihan model.

## 7. Catatan Deployment & Troubleshooting

- `backend/package.json` sudah menambahkan `prisma generate` pada `postinstall`.
- `npm install` pada backend akan memicu pembuatan client Prisma.
- Jika sandbox atau environment deploy tidak dapat mengakses Prisma binary (`binaries.prisma.sh`), ini masalah jaringan.
- Pastikan `DATABASE_URL` valid sebelum `npm run prisma migrate dev`.
- Untuk AI OpenRouter, pastikan `OPENROUTER_API_KEY` tersedia di environment.

## 8. Docker

Folder `docker/` ada di repository, tetapi dokumentasi container saat ini masih placeholder.

## 9. Tips Penggunaan

- Jalankan backend dan frontend secara terpisah untuk pengembangan.
- Gunakan `FITSMART_ALLOW_DEMO_AI=true` untuk pengujian cepat tanpa model TensorFlow final.
- Simpan file model TensorFlow di `backend/ai-model/model/fitsmart_model.keras` jika tersedia.
- Gunakan `streamlit/` untuk melihat visualisasi dan forecasting data secara interaktif.

## Referensi Cepat

- Backend API: `backend/`
- Frontend React: `frontend/`
- Dashboard Streamlit: `streamlit/`
- Dataset nutrisi: `data/`
- AI Model: `backend/ai-model/`
- Prisma schema & migrasi: `backend/prisma/`

---

Dokumentasi ini dibuat untuk memberikan gambaran lengkap tentang seluruh arsitektur Fit-Smart dan cara menjalankannya secara lokal maupun untuk persiapan deployment.
