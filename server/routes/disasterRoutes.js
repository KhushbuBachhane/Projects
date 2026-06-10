import { Router } from 'express';
import {
  getDisasters,
  getDisasterById,
  createDisaster,
  updateDisaster,
  deleteDisaster,
  verifyDisaster,
  updateSeverity,
} from '../controllers/disasterController.js';
import { protect, adminOnly } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = Router();

router.get('/', getDisasters);
router.get('/:id', getDisasterById);
router.post('/', protect, upload.single('image'), createDisaster);
router.put('/:id', protect, upload.single('image'), updateDisaster);
router.delete('/:id', protect, deleteDisaster);
router.patch('/:id/verify', protect, adminOnly, verifyDisaster);
router.patch('/:id/severity', protect, adminOnly, updateSeverity);

export default router;
