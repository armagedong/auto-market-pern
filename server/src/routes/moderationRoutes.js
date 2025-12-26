
import { Router } from 'express';
import { getPendingAds, decideAd } from '../controllers/moderationController.js';
import { moderatorAuth } from '../middleware/moderatorAuth.js';

const router = Router();

router.get('/pending', moderatorAuth, getPendingAds);
router.post('/decide',  moderatorAuth, decideAd);

export default router;