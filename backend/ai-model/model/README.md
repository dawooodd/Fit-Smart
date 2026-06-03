# FitSmart AI Model

File model sudah dipasang untuk backend inference:

- `fitsmart_model.keras` dari `fitsmart_model.zip`
- `class_mapping.json` berisi 24 label kelas dari notebook `FitSmart_AI_Model_(5).ipynb`

Endpoint backend yang memakai model ini:

```text
POST /api/photos
Content-Type: multipart/form-data
Authorization: Bearer <token>
field image=<file gambar>
```

Backend akan menjalankan `backend/ai-model/inference.py` lewat subprocess Python, lalu menyimpan hasil prediksi ke tabel `foodPhotoAnalysis`.
