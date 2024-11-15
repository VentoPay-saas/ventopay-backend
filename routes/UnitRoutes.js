import express from "express";
import {
  createUnit,
  deleteUnit,
  getUnitById,
  getUnits,
  updateUnit,
} from "../controllers/unitController.js";
const router = express.Router();

router.get("/unit", getUnits);
router.get("/unit/:_id", getUnitById);
router.post("/createUnit", createUnit);
router.delete("/unit/:_id", deleteUnit);
router.put("/unit/:_id", updateUnit);

export default router;
