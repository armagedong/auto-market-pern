import express from 'express';
import multer from 'multer';
import path from 'path';
import auth from '../middleware/authMiddleware.js';
// Импортируем наш Фасад
import AdService from '../services/AdService.js';

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

export default router;