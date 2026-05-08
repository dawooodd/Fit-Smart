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
    res.status(400).json({ error: err.message });
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
    res.status(400).json({ error: err.message });
  }
};

exports.me = async (req, res) => {
  return res.status(200).json({
    message: "User profile fetched successfully",
    user: req.user,
  });
};