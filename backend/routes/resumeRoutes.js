import express from 'express';
import {
  uploadResume,
  analyzeResume,
  getResumes,
  getResumeById,
  deleteResume,
} from '../controllers/resumeController.js';
import { protect } from '../middleware/auth.js';
import { uploadResumeMiddleware } from '../middleware/upload.js';

const router = express.Router();

router.post('/upload', protect, uploadResumeMiddleware, uploadResume);
router.post('/analyze', protect, analyzeResume);
router.get('/', protect, getResumes);
router.get('/:id', protect, getResumeById);
router.delete('/:id', protect, deleteResume);

export default router;

