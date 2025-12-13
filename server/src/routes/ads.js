import express from 'express';
import multer from 'multer';
import path from 'path';
import auth from '../middleware/authMiddleware.js';
// Импортируем наш Фасад
import AdService from '../services/AdService.js';
import Ad from '../models/Ad.js';
import User from '../models/User.js';
import Photo from '../models/Photo.js';
import Brand from '../models/Brand.js';
import Model from '../models/Model.js';
import Color from '../models/Color.js';

const router = express.Router();

// ... (логика multer storage, осталась прежней)
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });


/**
 * @summary Создание нового объявления.
 * @route POST /api/ads
 * @middleware auth - требует аутентификации.
 */
router.post('/', auth, upload.array('photos', 10), async (req, res) => {
    try {
        // Собираем все данные, включая ID пользователя из токена
        const adData = {
            ...req.body,
            userId: req.user.id,
        };

        // Передаем данные и файлы в сервисный слой (Фасад)
        const ad = await AdService.createAd(adData, req.files);

        res.json({ message: 'Объявление отправлено на модерацию', ad });
    } catch (err) {
        console.error(err);
        // Возвращаем 400, если ошибка связана с входными данными
        res.status(400).json({ error: err.message || 'Ошибка при создании объявления' });
    }
});

/**
 * @summary Получение списка объявлений (лента).
 * @route GET /api/ads
 * @query filters - поддерживает фильтрацию через query-параметры.
 */
router.get('/', async (req, res) => {
    try {
        // Получаем фильтры из query-параметров
        const filters = req.query;

        // Используем Фасад для получения данных с включенными связями
        const ads = await AdService.getApprovedAds(filters);
        res.json(ads);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const ad = await Ad.findByPk(req.params.id, {
            include: [
                // Обязательно включаем связанные модели для AdDetails.jsx
                { model: User, attributes: ['id', 'username', 'email'] },
                { model: Photo, as: 'Photos' }, // Используйте 'Photos', если так настроена ассоциация
                { model: Brand, as: 'Brand' },
                { model: Model, as: 'Model' },
                { model: Color, as: 'Color' }
            ]
        });

        if (!ad) {
            return res.status(404).json({ error: 'Объявление не найдено' });
        }

        res.json(ad);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка сервера при получении объявления' });
    }
});

export default router;