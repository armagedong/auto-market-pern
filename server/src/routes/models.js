// routes/models.js
import express from 'express';
import Model  from '../models/Model.js'; // твоя модель Sequelize

const router = express.Router();

// GET /api/models?brand_id=1
router.get('/', async (req, res) => {
    try {
        const { brand_id } = req.query;
        if (!brand_id) return res.status(400).json({ message: 'brand_id не указан' });

        const models = await Model.findAll({ where: { brandId: brand_id } });
        res.json(models);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

export default router;
