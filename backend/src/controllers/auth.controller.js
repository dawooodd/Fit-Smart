const authService = require("../services/auth.service");
const { registerSchema, loginSchema } = require("../validations/auth.validation");

exports.register = async (req, res) => {
  try {
    const data = registerSchema.parse(req.body);
    const user = await authService.register(data);

    res.json({
      message: "Register success",
      user,
    });
  } catch (err) {
    // Duplicate email — safe to surface, but with a controlled message
    if (err.message === 'Email already exists') {
      return res.status(409).json({ error: 'Email already in use.' });
    }
    // Zod validation errors are user-facing and safe to forward
    if (err.name === 'ZodError') {
      return res.status(400).json({ error: err.errors?.[0]?.message || 'Invalid input.' });
    }
    // Catch-all: never leak internal details
    return res.status(500).json({ error: 'Registration failed. Please try again.' });
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
    // Zod validation errors — safe to forward (format input hints, not internals)
    if (err.name === 'ZodError') {
      return res.status(400).json({ error: 'Invalid input.' });
    }
    // Auth failures ('Invalid credentials') and any other error — always generic
    return res.status(401).json({ error: 'Invalid credentials.' });
  }
};

exports.me = async (req, res) => {
  return res.status(200).json({
    message: "User profile fetched successfully",
    user: req.user,
  });
};