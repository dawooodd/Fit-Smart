# AI Model Fix Notes

Perbaikan yang ditambahkan:

- Folder AI sekarang ada di `backend/ai-model`, sesuai path yang dipakai backend saat deploy.
- Ditambahkan `backend/ai-model/inference.py` untuk inference TensorFlow `.keras`.
- Ditambahkan `backend/ai-model/requirements.txt` untuk dependency Python.
- Ditambahkan `backend/ai-model/model/class_mapping.json` dengan mapping awal makanan.
- Ditambahkan endpoint `GET /api/ai/model-status` untuk cek kesiapan AI model.
- Ditambahkan script `npm run ai:status` di backend.
- Ditambahkan mode demo `FITSMART_ALLOW_DEMO_AI=true` agar deploy tetap bisa dites walau file `fitsmart_model.keras` belum tersedia.

Catatan penting:

- File model asli `fitsmart_model.keras` tidak ada di ZIP awal, jadi tidak bisa saya buat ulang dari kode saja.
- Untuk produksi, upload model asli ke `backend/ai-model/model/fitsmart_model.keras`.
- Mode demo hanya fallback berdasarkan nama file, bukan model TensorFlow asli.
