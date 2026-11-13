import express from 'express';
import {
  analyzeJobMatch,
  getJobAnalyses,
  getJobAnalysisById,
  deleteJobAnalysis,
} from '../controllers/jobController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/analyze', protect, analyzeJobMatch);
router.get('/', protect, getJobAnalyses);
router.get('/:id', protect, getJobAnalysisById);
router.delete('/:id', protect, deleteJobAnalysis);

export default router;

