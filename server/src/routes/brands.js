import express from 'express';
import BrandController from '../controllers/brandController.js';
import authenticateToken from '../middleware/authMiddleware.js';
import { checkRole } from '../middleware/checkRole.js';

const router = express.Router();

router.get('/', BrandController.getBrands);
router.post('/', authenticateToken, checkRole('admin'), BrandController.createBrand);
router.delete('/:id', authenticateToken, checkRole('admin'), BrandController.deleteBrand);

router.get('/:id/models', BrandController.getModels);
router.post('/models', authenticateToken, checkRole('admin'), BrandController.createModel);
router.delete('/models/:id', authenticateToken, checkRole('admin'), BrandController.deleteModel);

router.get('/models/:id/generations', BrandController.getGenerations);
router.post('/generations', authenticateToken, checkRole('admin'), BrandController.createGeneration);
router.delete('/generations/:id', authenticateToken, checkRole('admin'), BrandController.deleteGeneration);

export default router;