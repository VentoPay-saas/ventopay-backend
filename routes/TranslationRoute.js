import { Router } from "express";
import { createTranslation, getTranslation, getTranslationForSelectedLanguage, updateTranslation } from "../controllers/TranslationController.js";
const router = Router();


router.post("/translations", createTranslation);
router.get("/translations/paginate", getTranslation);
router.put("/translations/:key", updateTranslation);
export default router;