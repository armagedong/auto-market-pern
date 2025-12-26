import Brand from '../models/Brand.js';
import Model from '../models/Model.js';
import Generation from "../models/Generation.js";

class BrandService {
    async getAllBrands() {
        return await Brand.findAll({ order: [['name', 'ASC']] });
    }

    async createBrand(name) {
        return await Brand.create({ name });
    }

    async deleteBrand(id) {
        return await Brand.destroy({ where: { id } });
    }

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

    async getGenerations(modelId) {
        return await Generation.findAll({
            where: { modelId },
            order: [['yearFrom', 'ASC']]
        });
    }

    async createGeneration(data) {
        return Generation.create(data);
    }

    async deleteGeneration(id) {
        return await Generation.destroy({ where: { id } });
    }
}

export default new BrandService();