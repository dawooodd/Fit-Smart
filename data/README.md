# 🍱 Fit-Smart Food Dataset

Dataset pendukung proyek **Fit-Smart**, sebuah sistem rekomendasi kesehatan berbasis AI yang memanfaatkan **gambar makanan + informasi nutrisi** untuk membantu pengguna memperoleh rekomendasi pola makan dan aktivitas fisik yang lebih personal.

Proyek ini hadir karena kebutuhan akan rekomendasi kesehatan yang tidak bersifat umum, melainkan disesuaikan dengan kondisi unik tiap individu menggunakan pendekatan **Machine Learning** dan **Computer Vision**.

Dataset ini menggabungkan:

- Dataset gambar makanan Indonesia
- Informasi nutrisi (kalori, protein, lemak, karbohidrat)
- Pencocokan otomatis antara label makanan dan data nutrisi
- Exploratory Data Analysis (EDA)

---

## 📌 Tujuan Dataset

Dataset ini dibuat untuk mendukung pengembangan:

✅ Food Image Classification  
✅ Estimasi informasi nutrisi makanan  
✅ Nutrition Recommendation System  
✅ Personalized Health Recommendation  
✅ Computer Vision untuk makanan Indonesia  
✅ Sistem rekomendasi kesehatan berbasis AI  

---

## 📂 Struktur Dataset

Struktur folder:

```text
FitSmart/
│
├── images/
│   ├── nasi_goreng/
│   │      img1.jpg
│   │      img2.jpg
│   │      ...
│   │
│   ├── bakso/
│   ├── sate_ayam/
│   ├── rendang/
│   ├── gado_gado/
│   └── ...
│
├── nutrition.csv
│
├── output/
│      dataset_final.csv
│
├── Dataset_FitSmart.ipynb
│
└── README.md
```

### Penjelasan Folder

| Folder/File | Deskripsi |
|---|---|
| `images/` | Kumpulan gambar makanan Indonesia berdasarkan kelas |
| `nutrition.csv` | Dataset informasi nutrisi makanan |
| `output/` | Hasil akhir penggabungan dataset |
| `Dataset_FitSmart.ipynb` | Notebook preprocessing, matching, dan EDA |
| `README.md` | Dokumentasi penggunaan |

---

## 🍽 Kelas Makanan

Dataset menggunakan beberapa makanan khas Indonesia.

Contoh:

- Nasi Goreng
- Bakso
- Rendang
- Soto
- Sate Ayam
- Mie Ayam
- Pecel
- Rawon
- Ayam Goreng
- Gado-gado
- Nasi Padang
- Gudeg

dan berbagai makanan Indonesia lainnya.

---

## 📊 Format Nutrisi

File:

```text
nutrition.csv
```

Contoh isi:

| makanan | kalori | protein | lemak | karbohidrat |
|---|---:|---:|---:|---:|
| nasi goreng | 320 | 8 | 12 | 45 |
| bakso | 250 | 14 | 10 | 20 |
| sate ayam | 280 | 18 | 15 | 12 |

Keterangan:

- **kalori** → kcal
- **protein** → gram
- **lemak** → gram
- **karbohidrat** → gram

---

## ⚙ Instalasi

Install library terlebih dahulu:

```bash
pip install pandas
pip install matplotlib
pip install seaborn
pip install pillow
pip install thefuzz[speedup]
pip install gdown
```

atau:

```bash
pip install pandas matplotlib seaborn pillow thefuzz[speedup] gdown
```

---

## 🚀 Cara Menjalankan

Clone repository:

```bash
git clone https://github.com/username/FitSmart.git
```

Masuk ke folder:

```bash
cd FitSmart
```

Jalankan notebook:

```bash
jupyter notebook
```

Buka:

```text
Dataset_FitSmart.ipynb
```

Notebook akan menjalankan:

1. Download dataset
2. Ekstraksi file
3. Membaca gambar makanan
4. Mencocokkan label makanan
5. Integrasi dengan data nutrisi
6. Exploratory Data Analysis
7. Menyimpan dataset akhir

---


## 📈 Output

File hasil:

```text
output/dataset_final.csv
```

Contoh:

| image | label | kalori | protein | lemak | karbohidrat |
|---|---|---:|---:|---:|---:|
| img1.jpg | bakso | 250 | 14 | 10 | 20 |
| img2.jpg | nasi_goreng | 320 | 8 | 12 | 45 |

---


