import { Router } from 'express';
import { showProfile, updateUserProfile } from '../controllers/userController.js';
import { authenticateToken } from '../middleware/AuthenticateToken.js';


const router = Router();
router.get('/profile/show', authenticateToken, showProfile);
router.put('/profile/update', authenticateToken, updateUserProfile);

export default router;
