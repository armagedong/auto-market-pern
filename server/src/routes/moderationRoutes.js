// server/routes/moderationRoutes.js

import { Router } from 'express';
import { getPendingAds, decideAd } from '../controllers/moderationController.js';
import { moderatorAuth } from '../middleware/moderatorAuth.js';
//import { protect } from '../middleware/authMiddleware.js'; // Ваш middleware для проверки JWT

const router = Router();

// Защита: только авторизованные пользователи с ролью 'moderator'
router.get('/pending', moderatorAuth, getPendingAds);
router.post('/decide',  moderatorAuth, decideAd);

export default router;