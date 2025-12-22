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
            status: 'pending' // Если вы ввели модерацию, проверьте, что в БД есть статус 'approved'
        };

        // Фильтр по марке
        if (brandId && brandId !== "") {
            whereConditions.brandId = Number(brandId);
        }

        // Фильтр по цене
        if (priceMin || priceMax) {
            whereConditions.price = {};
            if (priceMin) whereConditions.price[Op.gte] = Number(priceMin);
            if (priceMax) whereConditions.price[Op.lte] = Number(priceMax);
        }

        // Поиск по тексту
        if (search) {
            whereConditions.title = { [Op.iLike]: `%${search}%` }; // iLike для поиска без учета регистра (PostgreSQL)
        }

        // Логика сортировки
        let order = [['createdAt', 'DESC']];
        if (sort === 'price_asc') order = [['price', 'ASC']];
        if (sort === 'price_desc') order = [['price', 'DESC']];

        const ads = await Ad.findAll({
            where: whereConditions,
            include: [
                { model: Brand, attributes: ['name'] },
                { model: Model, attributes: ['name'] }
            ],
            order: order
        });

        res.json(ads);
    } catch (error) {
        console.error("ОШИБКА НА СЕРВЕРЕ:", error); // Посмотрите в терминал сервера!
        res.status(500).json({ error: error.message });
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
export const getAllAds = async (req, res) => {
    try {
        const userId = req.user?.id; // Если пользователь авторизован, берем его ID

        const ads = await Ad.findAll({
            include: [
                { model: Brand },
                { model: Model },
                { model: Photo, as: 'Photos' },
                // Добавляем проверку избранного через Left Join
                {
                    model: Favorite,
                    where: userId ? { userId } : { id: null }, // Ищем только лайки этого юзера
                    required: false, // Чтобы не скрывать объявления без лайков
                }
            ]
        });

        // Превращаем результат в удобный формат: добавляем поле isFavorite (true/false)
        const formattedAds = ads.map(ad => {
            const adJson = ad.toJSON();
            return {
                ...adJson,
                isFavorite: !!adJson.Favorites && adJson.Favorites.length > 0
            };
        });

        res.json(formattedAds);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};