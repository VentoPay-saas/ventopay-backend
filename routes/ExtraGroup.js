import { Router } from "express";
import { createExtraGroup, deleteExtraGroup, getExtraGroup, getExtraGroupById, updateExtraGroup } from "../controllers/ExtraGroupController.js";

const router = Router();

router.post("/extra/groups", createExtraGroup);
router.get("/extra/groups", getExtraGroup);
router.delete("/extra/groups/delete", deleteExtraGroup);
router.get("/extra/groups/:id", getExtraGroupById);
router.put("/extra/groups/:id", updateExtraGroup);

export default router