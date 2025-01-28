import { Router } from "express";
import { getActiveLanguages } from "../controllers/LanguagesController.js";

const router = Router();

router.get("/languages/active", getActiveLanguages);

export default router;
