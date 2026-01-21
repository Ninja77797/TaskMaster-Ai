import express from 'express';
import {
  generateSubtasks,
  suggestPriority,
  estimateTime,
  autoTag,
  parseNaturalLanguage,
  chatAssistant,
  analyzeTask,
} from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Proteger todas las rutas
router.use(protect);

router.post('/subtasks', generateSubtasks);
router.post('/priority', suggestPriority);
router.post('/estimate-time', estimateTime);
router.post('/tags', autoTag);
router.post('/parse', parseNaturalLanguage);
router.post('/chat', chatAssistant);
router.post('/analyze', analyzeTask);

export default router;
