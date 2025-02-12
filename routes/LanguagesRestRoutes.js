import { Router } from "express";
import { getActiveLanguages } from "../controllers/LanguagesController.js";
import { getTranslationForSelectedLanguage } from "../controllers/TranslationController.js";

const router = Router();

router.get("/languages/active", getActiveLanguages);
router.get("/translations/paginate", getTranslationForSelectedLanguage);

export default router;
