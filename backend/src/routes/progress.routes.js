const express = require("express");
const router = express.Router();

const progressController = require("../controllers/progress.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");

router.get("/", authMiddleware, progressController.getProgress);
router.get("/today", authMiddleware, progressController.getTodayProgress);
router.get("/sleep-weekly", authMiddleware, progressController.getSleepWeekly);
router.post("/sync-wearable", authMiddleware, progressController.syncWearable);
router.post("/", authMiddleware, progressController.createOrUpdateProgress);
router.put("/", authMiddleware, progressController.createOrUpdateProgress);
router.delete("/:id", authMiddleware, progressController.deleteProgress);

module.exports = router;