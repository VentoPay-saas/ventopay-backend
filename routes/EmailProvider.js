import { Router } from "express";
import { create, get, getById, update } from "../controllers/EmailProvider.js";

const router = Router();

router.post("/email-settings", create);
router.get("/email-settings", get);
router.get("/email-settings/:id", getById);
router.put("/email-settings/:id", update);

export default router;