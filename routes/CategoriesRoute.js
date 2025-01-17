import { Router } from "express";
import { createCategory, deleteCategories, getCategoryById, getPaginateCategory, getPaginatedCategoriesWithFilters, toggleCategoryActive, updateCategory, updateCategoryStatus } from "../controllers/CategoriesController.js";

const router = Router();

router.post("/categories", createCategory);
router.post("/categories/:id/status", updateCategoryStatus);
router.post("/categories/:id/active", toggleCategoryActive);
router.delete("/categories/delete", deleteCategories);
router.get("/categories/select-paginate", getPaginatedCategoriesWithFilters);
router.get("/categories", getPaginateCategory);
router.get("/categories/:id", getCategoryById);
router.put("/categories/:id", updateCategory);

export default router;

