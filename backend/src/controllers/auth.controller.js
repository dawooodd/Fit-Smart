const authService = require("../services/auth.service");
const { registerSchema, loginSchema } = require("../validations/auth.validation");

exports.register = async (req, res) => {
  try {
    const data = registerSchema.parse(req.body);
    const user = await authService.register(data);

    res.status(201).json({
      message: "Register success",
      user,
    });
  } catch (err) {
    if (err.message === 'Email already exists') {
      return res.status(409).json({ error: 'Email sudah terdaftar. Silakan masuk.' });
    }
    // Pesan validasi Zod aman diteruskan (zod v4 memakai `issues`).
    if (err.name === 'ZodError') {
      return res.status(400).json({ error: err.issues?.[0]?.message || 'Data tidak valid.' });
    }
    console.error('[auth.register]', err.message);
    return res.status(500).json({ error: 'Pendaftaran gagal. Silakan coba lagi.' });
  }
};

exports.login = async (req, res) => {
  try {
    const data = loginSchema.parse(req.body);
    const result = await authService.login(data);

    res.json({
      message: "Login success",
      ...result,
    });
  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ error: 'Email atau password tidak valid.' });
    }
    if (err.message === 'JWT_SECRET is not configured') {
      console.error('[auth.login] JWT_SECRET belum diset di environment.');
      return res.status(500).json({ error: 'Server belum dikonfigurasi dengan benar.' });
    }
    // Pesan generik agar tidak membocorkan apakah email terdaftar.
    return res.status(401).json({ error: 'Email atau password salah.' });
  }
};

exports.me = async (req, res) => {
  return res.status(200).json({
    message: "User profile fetched successfully",
    user: req.user,
  });
};
