
import { Router } from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import Favorite from '../models/Favorite.js';
import Ad from '../models/Ad.js';
import Brand from '../models/Brand.js';
import Model from '../models/Model.js';
import Photo from '../models/Photo.js';


const router = Router();

router.post('/:adId', authMiddleware, async (req, res) => {
    const userId = req.user.id;
    const { adId } = req.params;

    try {
        const [favorite, created] = await Favorite.findOrCreate({
            where: { userId, adId },
            defaults: { userId, adId }
        });

        if (created) {
            return res.json({ message: 'Объявление добавлено в избранное', status: 'added' });
        } else {
            await Favorite.destroy({ where: { userId, adId } });
            return res.json({ message: 'Объявление удалено из избранного', status: 'removed' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка сервера при обновлении избранного' });
    }
});


router.get('/', authMiddleware, async (req, res) => {
    const userId = req.user.id;

    try {
        const favorites = await Favorite.findAll({
            where: { userId },
            attributes: ['adId', 'createdAt'], // Получаем ID объявлений
            include: [
                {
                    model: Ad,
                    required: true,
                    include: [
                        { model: Brand, as: 'Brand' },
                        { model: Model, as: 'Model' },
                        { model: Photo, as: 'Photos' }
                    ],
                },
            ],
            order: [['createdAt', 'DESC']],
        });

        const ads = favorites.map(fav => fav.Ad);
        res.json(ads);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка сервера при получении избранного' });
    }
});

export default router;