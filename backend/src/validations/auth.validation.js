const { z } = require("zod");

const email = z
  .string()
  .trim()
  .toLowerCase()
  .email("Format email tidak valid.")
  .max(100);

exports.registerSchema = z.object({
  name: z.string().trim().min(3, "Nama minimal 3 karakter.").max(100),
  email,
  // bcrypt hanya memproses 72 byte pertama, jadi batasi panjang maksimum.
  password: z
    .string()
    .min(8, "Password minimal 8 karakter.")
    .max(72, "Password maksimal 72 karakter.")
    .regex(/[A-Za-z]/, "Password harus mengandung huruf.")
    .regex(/[0-9]/, "Password harus mengandung angka."),
});

// Login tidak memaksa aturan panjang baru supaya akun lama (min 6) tetap bisa masuk.
exports.loginSchema = z.object({
  email,
  password: z.string().min(1).max(72),
});
