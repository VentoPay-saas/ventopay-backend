import { Router } from "express";
import { getPayments, toggleActivePayment } from "../controllers/PaymentController.js";

const router = Router();

router.get('/payments', getPayments);
router.post('/payments/:id/active/status', toggleActivePayment);

export default router;