const rateLimit = require('express-rate-limit');

// Login: batasi percobaan GAGAL saja (login sukses tidak dihitung), agar
// pengguna sah tidak terkunci tetapi brute-force tetap tertahan.
exports.loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Terlalu banyak percobaan masuk. Coba lagi dalam 15 menit.' },
});

// Register: cegah pembuatan akun massal dari satu IP.
exports.registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Terlalu banyak pendaftaran dari jaringan ini. Coba lagi nanti.' },
});
