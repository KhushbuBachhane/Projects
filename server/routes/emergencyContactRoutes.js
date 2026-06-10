import { Router } from 'express';
import {
  getEmergencyContacts,
  createEmergencyContact,
  updateEmergencyContact,
  deleteEmergencyContact,
} from '../controllers/emergencyContactController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();

router.get('/', getEmergencyContacts);
router.post('/', protect, adminOnly, createEmergencyContact);
router.put('/:id', protect, adminOnly, updateEmergencyContact);
router.delete('/:id', protect, adminOnly, deleteEmergencyContact);

export default router;
