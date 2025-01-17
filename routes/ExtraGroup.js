import { Router } from "express";
import { createExtraGroup, getExtraGroup } from "../controllers/ExtraGroupController.js";

const router = Router();

router.post("/extra/groups", createExtraGroup);
router.get("/extra/groups", getExtraGroup);

export default router