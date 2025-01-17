import { Router } from "express";
import { getTheRestProducts } from "../controllers/ProductsController.js";

const router = Router();
router.get("/paginate", getTheRestProducts);

export default router;
