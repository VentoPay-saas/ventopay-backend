import express from 'express';
import TransactionController from '../controllers/TransactionController.js';
const router = express.Router();

router.post('/order/:orderId/transactions', TransactionController.createOrderTransaction);

export default router;
