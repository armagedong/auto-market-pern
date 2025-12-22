import BrandService from '../services/brandService.js';

class BrandController {
    // --- БРЕНДЫ ---
    async getBrands(req, res) {
        try {
            const brands = await BrandService.getAllBrands();
            res.json(brands);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    async createBrand(req, res) {
        try {
            const { name } = req.body;
            if (!name) return res.status(400).json({ message: "Название обязательно" });

            const brand = await BrandService.createBrand(name);
            res.json(brand);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    async deleteBrand(req, res) {
        try {
            await BrandService.deleteBrand(req.params.id);
            res.json({ message: "Бренд удален" });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    // --- МОДЕЛИ ---
    async getModels(req, res) {
        try {
            const models = await BrandService.getModels(req.params.id);
            res.json(models);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    async createModel(req, res) {
        try {
            const { name, brandId } = req.body;
            if (!name || !brandId) return res.status(400).json({ message: "Неполные данные" });

            const model = await BrandService.createModel(name, brandId);
            res.json(model);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    async deleteModel(req, res) {
        try {
            await BrandService.deleteModel(req.params.id);
            res.json({ message: "Модель удалена" });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    // --- ПОКОЛЕНИЯ ---
    async getGenerations(req, res) {
        try {
            const generations = await BrandService.getGenerations(req.params.id);
            res.json(generations);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    async createGeneration(req, res) {
        try {
            // Ожидаем: { name: "I (E53)", modelId: 5, yearStart: 1999, yearEnd: 2006 }
            const { name, modelId, yearStart, yearEnd } = req.body;
            if (!name || !modelId) return res.status(400).json({ message: "Неполные данные" });

            const generation = await BrandService.createGeneration({ name, modelId, yearStart, yearEnd });
            res.json(generation);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    async deleteGeneration(req, res) {
        try {
            await BrandService.deleteGeneration(req.params.id);
            res.json({ message: "Поколение удалено" });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }
}

export default new BrandController();