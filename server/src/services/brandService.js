import Brand from '../models/Brand.js';
import Model from '../models/Model.js';
import Generation from "../models/Generation.js";

class BrandService {
    // --- БРЕНДЫ ---
    async getAllBrands() {
        return await Brand.findAll({ order: [['name', 'ASC']] });
    }

    async createBrand(name) {
        return await Brand.create({ name });
    }

    async deleteBrand(id) {
        // Благодаря ON DELETE CASCADE в SQL, удаление бренда удалит и модели
        return await Brand.destroy({ where: { id } });
    }

    // --- МОДЕЛИ ---
    async getModels(brandId) {
        return await Model.findAll({
            where: { brandId },
            order: [['name', 'ASC']]
        });
    }

    async createModel(name, brandId) {
        return await Model.create({ name, brandId });
    }

    async deleteModel(id) {
        return await Model.destroy({ where: { id } });
    }

    // --- ПОКОЛЕНИЯ ---
    async getGenerations(modelId) {
        return await Generation.findAll({
            where: { modelId },
            order: [['yearFrom', 'ASC']] // Сортируем по году
        });
    }

    async createGeneration(data) {
        // data = { name, modelId, yearStart, yearEnd }
        return Generation.create(data);
    }

    async deleteGeneration(id) {
        return await Generation.destroy({ where: { id } });
    }
}

export default new BrandService();