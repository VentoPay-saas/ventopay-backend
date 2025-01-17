import { Router } from "express";
import { createPaymentPayload, deletePayload, getPaymentPayload, getPaymentPayloadById } from "../controllers/PaymentPayloadController.js";

const router = Router();

router.post('/payment-payloads', createPaymentPayload);
router.get('/payment-payloads', getPaymentPayload);
router.get('/payment-payloads/:payment_id', getPaymentPayloadById);
router.delete('/payment-payloads/delete', deletePayload);

export default router;