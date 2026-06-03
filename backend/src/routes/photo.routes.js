const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

const photoController = require('../controllers/photo.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, path.join(process.cwd(), 'uploads')),
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`),
});

const upload = multer({ storage });

router.get('/', authMiddleware, photoController.getFoodPhotoAnalyses);
router.get('/:id', authMiddleware, photoController.getFoodPhotoAnalysisById);
router.post('/', authMiddleware, upload.single('image'), photoController.createFoodPhotoAnalysis);
router.put('/:id', authMiddleware, photoController.updateFoodPhotoAnalysis);
router.delete('/:id', authMiddleware, photoController.deleteFoodPhotoAnalysis);

module.exports = router;
