const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { loginLimiter, registerLimiter } = require('../middlewares/rateLimiters');

router.post('/register', registerLimiter, authController.register);
router.post('/login', loginLimiter, authController.login);
// /me dipanggil setiap aplikasi dibuka, jadi tidak boleh ikut limiter ketat.
router.get('/me', authMiddleware, authController.me);

module.exports = router;
