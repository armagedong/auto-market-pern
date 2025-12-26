// server/controllers/moderationController.js

import Ad from '../models/Ad.js';
import User from '../models/User.js'; // Предполагаем, что связь с User настроена

/**
 * Получает все объявления со статусом 'pending'.
 */
export const getPendingAds = async (req, res) => {
    try {
        const pendingAds = await Ad.findAll({
            where: { status: 'pending' },
            // Включаем информацию об авторе (username)
            include: [{
                model: User,
                as: 'author', // Убедитесь, что as: 'author' используется в Ad.js
                attributes: ['id', 'username', 'email']
            }],
            order: [['createdAt', 'ASC']]
        });
        res.json(pendingAds);
    } catch (error) {
        console.error('Ошибка при получении очереди модерации:', error);
        res.status(500).json({ error: 'Не удалось загрузить объявления на модерации.' });
    }
};

/**
 * Принимает решение по объявлению (одобрить или отклонить).
 */
export const decideAd = async (req, res) => {
    const { adId, newStatus } = req.body;

    if (!['approved', 'rejected'].includes(newStatus)) {
        return res.status(400).json({ error: 'Некорректный статус решения.' });
    }

    try {
        const [updatedCount] = await Ad.update(
            { status: newStatus },
            {
                where: { id: adId, status: 'pending' }
            }
        );

        if (updatedCount === 0) {
            return res.status(404).json({ error: 'Объявление не найдено или уже обработано.' });
        }

        if (newStatus === 'rejected') {

            console.log(`Объявление ID ${adId} отклонено. Пользователю отправлено уведомление.`);
        }

        res.json({ message: `Объявление ${adId} успешно ${newStatus === 'approved' ? 'одобрено' : 'отклонено'}.` });

    } catch (error) {
        console.error('Ошибка при принятии решения модератором:', error);
        res.status(500).json({ error: 'Ошибка сервера при обновлении статуса.' });
    }
};