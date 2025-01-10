import { Router } from "express";
import {
  activeLanguage,
  createLanguage,
  deleteLanguage,
  getByIdLanguage,
  getLanguages,
  updateLanguage,
} from "../controllers/LanguagesController.js";

const router = Router();

router.post("/languages", createLanguage);
router.get("/languages", getLanguages);
router.put("/languages/:id", updateLanguage);
router.delete("/languages/delete", deleteLanguage);
router.get("/languages/:id", getByIdLanguage);

export default router;
