const express = require("express");
const router = express.Router();

const profileController = require("../controllers/profile.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");

router.get("/", authMiddleware, profileController.getProfile);
router.post("/", authMiddleware, profileController.createOrUpdateProfile);
router.put("/", authMiddleware, profileController.createOrUpdateProfile);

module.exports = router;