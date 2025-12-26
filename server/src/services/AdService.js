import Ad from '../models/Ad.js';
import Photo from '../models/Photo.js';
import Brand from '../models/Brand.js';
import Model from '../models/Model.js';
import Color from '../models/Color.js';
import Generation from '../models/Generation.js';
import { Op } from 'sequelize';

class AdService {
    /**
     * @summary Создает новое объявление и связанные с ним фотографии.
     * @param {Object} adData - Данные объявления (brandId, modelId, userId, price, etc.)
     * @param {Array<Object>} files - Массив загруженных файлов (фото)
     * @returns {Promise<Ad>} Созданное объявление
     */
    async createAd(adData, files) {
        if (!adData.title || !adData.brandId || !adData.userId) {
            throw new Error('Недостаточно данных для создания объявления');
        }

        const ad = await Ad.create({
            ...adData,
            registered: adData.registered === 'true',
            options: JSON.stringify(adData.options),
            status: 'pending' // Всегда 'pending' при создании
        });

        if (files && files.length) {
            const photos = files.map((file, index) => ({
                adId: ad.id,
                url: file.path,
                position: index
            }));
            await Photo.bulkCreate(photos);
        }

        return ad;
    }

    /**
     * @summary Получает список одобренных объявлений с опциональной фильтрацией.
     * @param {Object} filters - Объекты для фильтрации (brandId, priceFrom, etc.)
     * @returns {Promise<Array<Ad>>} Список объявлений
     */
    async getApprovedAds(filters = {}) {
        const {
            brandId, modelId, generationId, colorId, state,
            priceFrom, priceTo,
            yearFrom, yearTo,
            mileageFrom, mileageTo,
            search, sort
        } = filters;

        let where = { status: 'approved' }; // [cite: 83]

        if (brandId) where.brandId = brandId;
        if (modelId) where.modelId = modelId;
        if (generationId) where.generationId = generationId;
        if (colorId) where.colorId = colorId;
        if (state) where.state = state;

        if (priceFrom || priceTo) {
            where.price = {};
            if (priceFrom) where.price[Op.gte] = Number(priceFrom);
            if (priceTo) where.price[Op.lte] = Number(priceTo);
        }

        if (yearFrom || yearTo) {
            where.year = {};
            if (yearFrom) where.year[Op.gte] = Number(yearFrom);
            if (yearTo) where.year[Op.lte] = Number(yearTo);
        }

        if (mileageFrom || mileageTo) {
            where.mileage = {};
            if (mileageFrom) where.mileage[Op.gte] = Number(mileageFrom);
            if (mileageTo) where.mileage[Op.lte] = Number(mileageTo);
        }

        if (search) {
            where[Op.or] = [
                { title: { [Op.iLike]: `%${search}%` } },
                { description: { [Op.iLike]: `%${search}%` } }
            ];
        }

        let order = [['createdAt', 'DESC']];
        if (sort === 'price_asc') order = [['price', 'ASC']];
        if (sort === 'price_desc') order = [['price', 'DESC']];
        if (sort === 'year_desc') order = [['year', 'DESC']];
        if (sort === 'year_asc') order = [['year', 'ASC']];
        if (sort === 'mileage_asc') order = [['mileage', 'ASC']];

        return Ad.findAll({
            where,
            include: [
                { model: Photo, as: 'Photos' }, // [cite: 87]
                { model: Brand },
                { model: Model },
                { model: Color },
                { model: Generation }
            ],
            order
        });
    }

    async getPendingAds() {
        return await Ad.findAll({
            where: { status: 'pending' },
            include: [{ model: Brand }, { model: Model }, { model: Photo, as: 'Photos' }]
        });
    }

    async updateAdStatus(id, status) {
        return await Ad.update({ status }, { where: { id } });
    }
}

export default new AdService();