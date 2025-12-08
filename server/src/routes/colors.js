// routes/colors.js
import express from 'express';
import Color from '../models/Color.js';
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const colors = await Color.findAll();
        res.json(colors); // массив объектов [{id, name}, ...]
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
