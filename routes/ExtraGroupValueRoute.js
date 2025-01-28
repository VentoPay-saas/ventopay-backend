import { Router } from "express";
import { create, findAll, remove, update } from "../controllers/ExtraGroupValueController.js";

const router = Router();

router.post("/extra/values", create);
router.get("/extra/values", findAll);
router.put("/extra/values/:id", update);
router.delete("/extra/values/delete", remove);

export default router;