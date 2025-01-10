import { Router } from "express";
import { createCategory, getPaginateCategory } from "../controllers/CategoriesController.js";

const router = Router();

router.post("/categories", createCategory);
router.get("/categories", getPaginateCategory);

export default router;

