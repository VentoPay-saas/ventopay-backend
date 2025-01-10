import express from 'express';
import { createBrand, getPaginateBrands, deleteBrand, getBrandById, updateBrand } from '../controllers/BrandController.js';

const router = express.Router();
router.post('/brands', createBrand);
router.get('/brands/paginate', getPaginateBrands);
router.delete('/brands/delete', deleteBrand);
router.get('/brands/:id', getBrandById);
router.put('/brands/:id', updateBrand);

export default router;
