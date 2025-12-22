import express from 'express';
import BrandController from '../controllers/brandController.js';
import authenticateToken from '../middleware/authMiddleware.js';
import { checkRole } from '../middleware/checkRole.js';

const router = express.Router();

// --- БРЕНДЫ ---
router.get('/', BrandController.getBrands);
router.post('/', authenticateToken, checkRole('admin'), BrandController.createBrand);
router.delete('/:id', authenticateToken, checkRole('admin'), BrandController.deleteBrand);

// --- МОДЕЛИ ---
// Получить модели конкретного бренда (GET /api/brands/5/models)
router.get('/:id/models', BrandController.getModels);
// Создать модель (POST /api/brands/models)
router.post('/models', authenticateToken, checkRole('admin'), BrandController.createModel);
// Удалить модель (DELETE /api/brands/models/10)
router.delete('/models/:id', authenticateToken, checkRole('admin'), BrandController.deleteModel);

// --- ПОКОЛЕНИЯ ---
// Получить поколения конкретной модели (GET /api/brands/models/10/generations)
router.get('/models/:id/generations', BrandController.getGenerations);
// Создать поколение
router.post('/generations', authenticateToken, checkRole('admin'), BrandController.createGeneration);
// Удалить поколение
router.delete('/generations/:id', authenticateToken, checkRole('admin'), BrandController.deleteGeneration);

export default router;