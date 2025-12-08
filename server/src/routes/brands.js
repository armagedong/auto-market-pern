import express from 'express';
import Brand from '../models/Brand.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const brands = await Brand.findAll();
        res.json(brands); // массив объектов {id, name}
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
