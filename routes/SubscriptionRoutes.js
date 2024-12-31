import express from "express";
import {
  createSub,
  deleteSub,
  getSub,
  getSubById,
  updateSub,
} from "../controllers/Subscription-controller.js";

const router = express.Router();

router.post("/subscription-option", createSub);
router.get("/subscription-option", getSub);
router.get("/subscriptions", getSub);
router.get("/subscription-option/:id", getSubById);
router.delete("/subscription-option/:id", deleteSub);
router.put("/subscription-option/:id", updateSub);

export default router;
