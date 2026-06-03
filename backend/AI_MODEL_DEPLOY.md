# FitSmart AI Model Deploy Notes

AI model asli sudah dipasang di:

```txt
backend/ai-model/model/fitsmart_model.keras
backend/ai-model/model/class_mapping.json
backend/ai-model/inference.py
backend/ai-model/requirements.txt
```

## Wajib di server deploy

Selain `npm install`, server juga harus install dependency Python:

```bash
cd backend
python3 -m pip install -r ai-model/requirements.txt
npm install
npm run start
```

Environment minimal:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB?schema=public"
JWT_SECRET="isi_secret_yang_panjang"
PORT=3000
FITSMART_MODEL_PATH=./ai-model/model/fitsmart_model.keras
FITSMART_MAPPING_PATH=./ai-model/model/class_mapping.json
FITSMART_INFERENCE_SCRIPT=./ai-model/inference.py
PYTHON_BIN=python3
FITSMART_ALLOW_DEMO_AI=false
```

## Cek status model

Setelah login, panggil:

```http
GET /api/ai/model-status
Authorization: Bearer <token>
```

Jika benar, hasilnya harus menunjukkan `ready: true`, `mode: tensorflow`, dan `hasModel: true`.

## Test inference manual

```bash
cd backend
python3 ai-model/inference.py \
  --model ai-model/model/fitsmart_model.keras \
  --mapping ai-model/model/class_mapping.json \
  --image path/ke/gambar-makanan.jpg \
  --top-k 3
```
