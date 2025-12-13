import { Router } from 'express';
import Color from '../models/Color.js';

const router = Router();

/**
 * @summary Получает список всех доступных цветов.
 * @route GET /api/colors
 */
router.get('/', async (req, res) => {
    try {
        const colors = await Color.findAll({
            attributes: ['id', 'name'],
            order: [['name', 'ASC']]
        });
        res.json(colors);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка сервера при получении цветов' });
    }
});

export default router;