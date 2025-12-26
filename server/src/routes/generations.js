// routes/generations.js

import express from 'express';
import Generation from '../models/Generation.js';

const router = express.Router();

/**
 * @summary Получает список поколений для конкретной модели.
 * @route GET /api/generations?model_id=101
 */
router.get('/', async (req, res) => {
    try {
        const { model_id } = req.query;
        if (!model_id) return res.status(400).json({ message: 'model_id не указан' });

        const generations = await Generation.findAll({
            where: { modelId: model_id },
            attributes: ['id', 'name', 'yearFrom', 'yearTo'],
            order: [['yearFrom', 'DESC']]
        });
        res.json(generations);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Ошибка сервера при получении поколений' });
    }
});

export default router;