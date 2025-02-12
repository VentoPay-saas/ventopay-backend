import { Router } from "express";
import { createTranslation, getTranslation, getTranslationForSelectedLanguage } from "../controllers/TranslationController.js";
const router = Router();


router.post("/translations", createTranslation);
router.get("/translations/paginate", getTranslation);
export default router;