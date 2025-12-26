import Router from 'express';
import { getPendingAds, updateAdStatus } from '../controllers/adController.js';
import authenticateToken from '../middleware/authMiddleware.js';
import { checkRole } from '../middleware/checkRole.js';

const router = new Router();

router.get('/moderation', authenticateToken, checkRole('admin'), getPendingAds);
router.put('/moderation/:id', authenticateToken, checkRole('admin'), updateAdStatus);

export default router;