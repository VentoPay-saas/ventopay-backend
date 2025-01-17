import { Router } from "express";
import { restPaymentGet } from "../controllers/PaymentRestController.js";

const router = Router();

router.get('/payments', restPaymentGet);

export default router;