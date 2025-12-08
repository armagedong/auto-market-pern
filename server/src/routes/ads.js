import express from 'express';
import multer from 'multer';
import path from 'path';
import Ad from '../models/Ad.js';
import Photo from '../models/Photo.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage });

router.post('/', auth, upload.array('photos', 10), async (req, res) => {
    try {
        const {
            title, brandId, modelId, year, price, mileage, fuel,
            gearbox, colorId, vin, state, ptsNumber, ptsOwners,
            registered, description, address, contact, options
        } = req.body;

        const ad = await Ad.create({
            userId: req.user.id,
            title, brandId, modelId, year, price, mileage, fuel,
            gearbox, colorId, vin, state, ptsNumber, ptsOwners,
            registered: registered === 'true', description, address, contact,
            options: JSON.stringify(options), // если передаем массив доп. опций
            status: 'pending'
        });

        if (req.files.length) {
            const photos = req.files.map((file, index) => ({
                adId: ad.id,
                url: file.path,
                position: index
            }));
            await Photo.bulkCreate(photos);
        }

        res.json({ message: 'Объявление отправлено на модерацию', ad });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const ads = await Ad.findAll({ include: Photo });
        res.json(ads);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
