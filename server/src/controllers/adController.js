import { Op } from 'sequelize';
import Ad from '../models/Ad.js';
import Brand from '../models/Brand.js';
import Model from '../models/Model.js';
import Favorite from "../models/Favorite.js";
import Photo from "../models/Photo.js";
import User from "../models/User.js";
import Generation from "../models/Generation.js";
import Color from "../models/Color.js";

export const getAds = async (req, res) => {
    try {
        const { brandId, priceMin, priceMax, sort, search } = req.query;

        let whereConditions = {
            status: 'approved' // Показываем только проверенные
        };

        if (brandId) whereConditions.brandId = Number(brandId);
        if (priceMin || priceMax) {
            whereConditions.price = {};
            if (priceMin) whereConditions.price[Op.gte] = Number(priceMin);
            if (priceMax) whereConditions.price[Op.lte] = Number(priceMax);
        }
        if (search) {
            whereConditions.title = { [Op.iLike]: `%${search}%` };
        }

        let order = [['createdAt', 'DESC']];
        if (sort === 'price_asc') order = [['price', 'ASC']];
        if (sort === 'price_desc') order = [['price', 'DESC']];

        const ads = await Ad.findAll({
            where: whereConditions,
            include: [
                { model: Brand, attributes: ['name'] },
                { model: Model, attributes: ['name'] },
                { model: Photo, as: 'Photos' }
            ],
            order: order
        });
        res.json(ads);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const getPendingAds = async (req, res) => {
    try {
        const ads = await Ad.findAll({
            where: { status: 'pending' },
            include: [
                { model: Brand },
                { model: Model },
                { model: Photo, as: 'Photos' },
                { model: User, attributes: ['username'] }
            ],
            order: [['createdAt', 'ASC']]
        });
        res.json(ads);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};
export const getAdById = async (req, res) => {
    try {
        const ad = await Ad.findByPk(req.params.id, {
            include: [
                { model: Brand },
                { model: Model },
                { model: Generation },
                { model: Color },
                { model: Photo, as: 'Photos' },
                { model: User, attributes: ['username', 'phone'] } // <--- ВАЖНО
            ]
        });

        if (!ad) return res.status(404).json({ error: "Не найдено" });
        res.json(ad);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
export const updateAdStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const ad = await Ad.update({ status }, { where: { id } });

        if (ad[0] === 0) {
            return res.status(404).json({ message: "Объявление не найдено" });
        }

        res.json({ message: "Статус успешно обновлен" });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};