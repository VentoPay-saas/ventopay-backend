import express from 'express';
import {
  createBrand,
  getBrand,
  updateBrand,
  deleteBrand,
  getAllBrands
} from '../controllers/BrandController.js';
import upload from '../middleware/UploadFile.js';

const router = express.Router();
router.post('/createBrand', upload.single('image'), createBrand);
router.get('/brand', getAllBrands);
router.get('/brand/:_id', getBrand);
router.put('/brand/:_id', upload.single('image'), updateBrand);
router.delete('/brand/:_id', deleteBrand);

export default router;
