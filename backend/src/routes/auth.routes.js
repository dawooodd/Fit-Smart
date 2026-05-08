const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");
const profileController = require("../controllers/profile.controller");


router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/me", authMiddleware, authController.me);
router.get("/", authMiddleware, profileController.getProfile);
router.post("/", authMiddleware, profileController.createOrUpdateProfile);
router.put("/", authMiddleware, profileController.createOrUpdateProfile);

module.exports = router;