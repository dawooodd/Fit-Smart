# FitSmart AI Model

Folder ini dipakai backend untuk analisis foto makanan.

## Produksi
Letakkan model TensorFlow terlatih di:

```txt
backend/ai-model/model/fitsmart_model.keras
```

File mapping kelas sudah tersedia di:

```txt
backend/ai-model/model/class_mapping.json
```

Install dependency Python:

```bash
cd backend
python3 -m pip install -r ai-model/requirements.txt
```

## Demo deploy tanpa model asli
Untuk memastikan aplikasi tetap bisa dicoba saat model `.keras` belum tersedia, set:

```env
FITSMART_ALLOW_DEMO_AI=true
```

Mode demo hanya menebak dari nama file dan bukan hasil model TensorFlow asli.
