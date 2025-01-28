import express from "express";
import { createOrUpdateSetting, getAllSettings } from "../controllers/SettingsController.js";
const router = express.Router();

router.get("/settings", getAllSettings);
router.post("/settings", createOrUpdateSetting);

export default router;
