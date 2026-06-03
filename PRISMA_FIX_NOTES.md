# Fix Prisma Client Error

Jika muncul error:

```txt
Error: Cannot find module '.prisma/client/default'
```

artinya Prisma Client belum di-generate di folder backend setelah install dependency.

Jalankan dari folder `backend`:

```bash
npm install
npx prisma generate
npm run dev
```

Untuk setup database pertama kali, pastikan `.env` berisi `DATABASE_URL`, lalu jalankan salah satu:

```bash
npx prisma migrate dev
```

atau:

```bash
npx prisma db push
```

Package backend sekarang sudah ditambahkan script:

```json
"generate": "prisma generate",
"postinstall": "prisma generate"
```

Sehingga setelah `npm install`, Prisma Client akan otomatis dibuat.
