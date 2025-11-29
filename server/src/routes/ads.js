const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Ad = require('../models/Ad');
const Photo = require('../models/Photo');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage });

router.get('/', async (req, res) => {
    const ads = await Ad.findAll({ where: { status: 'approved' }, include: Photo });
    res.json(ads);
});

router.post('/', auth, upload.array('photos', 10), async (req, res) => {
    try {
        const { title, brand, model, year, price, mileage, fuel, gearbox, color, description, vin } = req.body;

        const ad = await Ad.create({
            user_id: req.user.id,
            title, brand, model, year, price, mileage, fuel, gearbox, color, description, vin, status: 'pending'
        });

        if (req.files) {
            const photoData = req.files.map((file, index) => ({
                ad_id: ad.id,
                url: file.path,
                position: index
            }));
            await Photo.bulkCreate(photoData);
        }

        res.json({ message: 'Объявление создано и отравлено на модерацию', ad });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
