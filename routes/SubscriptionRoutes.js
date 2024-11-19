import express from "express";
import {
  createSub,
  deleteSub,
  getSub,
  getSubById,
  updateSub,
} from "../controllers/Subscription-controller";

const router = express.Router();

router.post("/sub", createSub);
router.get("/sub", getSub);
router.get("/sub/:id", getSubById);
router.delete("/sub/:id", deleteSub);
router.put("/sub/:id", updateSub);

export default router;
