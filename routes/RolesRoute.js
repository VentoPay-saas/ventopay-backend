import { Router } from "express";
import { getRoles } from "../controllers/RolesController.js";

const router = Router();

router.get("/roles", getRoles);

export default router;
