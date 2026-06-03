# Deploy Fix Notes

Perbaikan yang dilakukan:

1. `backend/src/routes/ai-summary.routes.js`
   - Menghapus `new PrismaClient()` langsung.
   - Menggunakan shared Prisma client dari `src/config/prisma.js`, karena Prisma v7 di project ini memakai PostgreSQL adapter.

2. `backend/package.json`
   - Menambahkan `engines.node` yang sesuai dengan Prisma 7: `^20.19 || ^22.12 || >=24.0`.
   - Mengubah `start` agar menjalankan `prisma migrate deploy` sebelum server start.
   - Menambahkan `start:local`, `deploy`, dan `prisma:deploy`.

3. Validasi lokal:
   - Semua file JS backend lolos `node --check`.
   - Frontend berhasil `npm run build`.

Catatan:
- Di sandbox ini `npx prisma generate` gagal karena DNS/network ke `binaries.prisma.sh` tidak tersedia (`EAI_AGAIN`). Ini masalah environment sandbox, bukan error kode.
- Saat deploy di Render/Railway/VPS dengan akses internet dan env `DATABASE_URL`, `npm install` akan menjalankan `postinstall: prisma generate`.

Environment variables backend yang wajib:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DB?schema=public"
JWT_SECRET="secret-kuat"
PORT=3000
OPENROUTER_API_KEY="opsional-jika-pakai-ai-summary"
OPENROUTER_MODEL="deepseek/deepseek-chat-v3.1:free"
```
