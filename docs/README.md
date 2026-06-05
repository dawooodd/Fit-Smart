# 🏋️‍♂️ LAPORAN TEKNIS DATA SCIENCE: PROYEK FITSMART
### **Optimalisasi Retensi dan Kedisiplinan Diet Pengguna melalui Pendekatan Data-Driven**

---

## 👤 Informasi Proyek
* **Disusun Oleh:** Muchammad Nasich
* **Tanggal:** Juni 2026
* **Tech Stack:** `Python`, `Pandas`, `Matplotlib`, `Seaborn`, `SciPy`, `Statsmodels (ARIMA)`, `Streamlit`, `TheFuzz`

---

## 📝 1. Executive Summary
Proyek ini bertujuan untuk mengintegrasikan kapabilitas **Data Science** ke dalam ekosistem aplikasi kebugaran **FitSmart**. Dengan memanfaatkan data historis nutrisi dan aktivitas pengguna, kami membangun sistem *end-to-end* yang mencakup pembersihan data, *Feature Engineering* berbasis keilmuan gizi, pemodelan *Time-Series Forecasting*, serta perancangan *Executive Dashboard* interaktif. 

Hasil eksperimen (**A/B Testing**) membuktikan bahwa intervensi *data-driven* ini secara signifikan meningkatkan kedisiplinan dan rata-rata penurunan berat badan pengguna sebesar **0.5 kg dalam kurun waktu 30 hari**.

---

## 🔍 2. Problem Discovery & Objective
Aplikasi pelacak (*tracker*) diet konvensional seringkali gagal mempertahankan penggunanya lebih dari 30 hari (*high churn rate*). Berdasarkan riset internal pengguna FitSmart, masalah utama terletak pada dua hal:
1. **Kurangnya Insight yang Dapat Ditindaklanjuti:** Pengguna memasukkan data makanan setiap hari, tetapi tidak mendapat arahan evaluasi (*"Apakah diet saya hari ini sudah benar?"*).
2. **Ketidakpastian Hasil (Demotivasi):** Pengguna sering menyerah di pertengahan jalan karena tidak memiliki bayangan yang realistis kapan target berat badan mereka akan tercapai.

🎯 **Objective Utama:** Membangun *Data Science Pipeline* yang mampu menjawab pertanyaan bisnis, memberikan rekomendasi *Superfood*, dan memprediksi keberhasilan target pengguna.

---

## ⚙️ 3. Data Pipeline & Exploratory Data Analysis (EDA)
Pengolahan data mentah dilakukan secara sistematis melalui modul Jupyter Notebook (`Dataset_FitSmart.ipynb` & `FitSmart_EDA.ipynb`):
* **Data Gathering & Cleaning:** Pembersihan nilai kosong (*missing values*) dan agregasi kalori untuk menu duplikat pada berkas `nutrition.csv`.
* **Smart Matching:** Menggunakan algoritma *Fuzzy String Matching* (`thefuzz`) untuk memetakan dataset teks dengan database aset gambar makanan.
* **Analisis Korelasi Nutrisi:** Menemukan fakta saintifik bahwa **Lemak (Fat)** memiliki korelasi *Pearson* tertinggi terhadap lonjakan total kalori dibandingkan dengan karbohidrat atau protein.

---

## 🧬 4. Advanced Feature Engineering
Untuk menjawab kebutuhan bisnis, data mentah direkayasa (*Feature Engineering*) menjadi metrik saintifik:
* **Kalkulasi Kebutuhan Energi (TDEE):** Mengkalkulasi *Basal Metabolic Rate* (BMR) menggunakan persamaan **Mifflin-St Jeor**, lalu dikalikan dengan *Activity Multiplier* untuk mendapatkan *Total Daily Energy Expenditure* (TDEE). Hal ini menjadi batas acuan (garis batas diet) bagi asupan kalori pengguna.
* **Nutrient Density Score:** Mengembangkan algoritma skoring mandiri (Skala 0-100) yang memberikan *reward* pada rasio protein per kalori yang tinggi, dan memberikan penalti (*penalty*) pada rasio lemak yang tinggi. Hasil skoring ini memunculkan daftar *Superfood* untuk direkomendasikan kepada pengguna.

---

## 🤖 5. Pemodelan Machine Learning & Probabilitas
* **Time-Series Forecasting (ARIMA):** Algoritma *Autoregressive Integrated Moving Average* (ARIMA) diimplementasikan untuk memprediksi lintasan berat badan pengguna 30 hari ke depan. Model dilatih dengan penanganan kesalahan (*Convergence Warning fallback*) dari order `(1,1,1)` menjadi `(0,1,1)`, serta penerapan interpolasi waktu (*time-interpolation*) untuk mengatasi data tracking yang berlubang (lupa ditimbang).
* **Inferential Statistics (Peluang Sukses):** Menggunakan Distribusi Normal Matematis (*Bell Curve*) dari standar deviasi penurunan harian untuk mengkalkulasi probabilitas (*P-Value* dari CDF) apakah target pengguna realistis atau perlu diubah.

---

## 📊 6. Visualisasi & Deployment (Streamlit)
Output dari pemodelan dan fitur AI diekspos melalui **Streamlit Community Cloud** (`app.py`):
* Menggunakan *backend* `Matplotlib` dan `Seaborn` untuk mereplikasi keakuratan visual ala Jupyter Notebook ke lingkungan produksi.
* Menyajikan **5 Pertanyaan Bisnis Utama** yang memandu pengguna layaknya membaca cerita (*Data Storytelling*), dari analisis risiko makanan hingga evaluasi kedisiplinan TDEE.
* Dashboard diintegrasikan ke web utama FitSmart menggunakan metode *Iframe Embedding* secara mulus.

---

## 🧪 7. Evaluasi Bisnis melalui A/B Testing
Sebelum fitur dirilis secara global, *A/B Testing* dilakukan selama 30 hari kepada 2.000 sampel pengguna:

| Grup | Kondisi Eksperimen | Rata-rata Penurunan BB |
| :--- | :--- | :--- |
| **Grup A (Control)** | Menggunakan fitur pelacak standar aplikasi | 1.2 kg |
| **Grup B (Treatment)** | Menggunakan FitSmart Executive Dashboard | **1.7 kg** |

📊 **Hasil Uji Statistik:** Melalui *Independent T-Test*, didapatkan nilai **P-Value < 0.05**.
💡 **Kesimpulan Bisnis:** Intervensi Dashboard AI memberikan perbedaan dampak yang signifikan secara statistik. Fitur ini tervalidasi meningkatkan motivasi dan akurasi diet pengguna, sehingga direkomendasikan untuk *Roll-out* 100%.

---

## 🚀 8. Kesimpulan & Future Works
*Tech Stack* Data Science telah diimplementasikan secara komprehensif dari hulu (pembersihan data) hingga hilir (deployment dan eksperimen bisnis).

**Rencana Pengembangan Kedepan (Future Works):**
1. 🧠 **Deep Learning Transition:** Transisi dari model ARIMA ke model *Deep Learning* (seperti algoritma LSTM) jika rekam jejak longitudinal data pengguna sudah mencapai lebih dari 6 bulan berturut-turut.
2. 📉 **Churn Prediction:** Pengembangan model *Machine Learning Classification* (`Random Forest`/`XGBoost`) untuk memprediksi probabilitas *Churn* pengguna, agar aplikasi dapat mengirimkan notifikasi sebelum pengguna kehilangan motivasi.

