import express from "express";
import {
  createUnit,
  deleteUnit,
  getUnitById,
  getUnits,
  toggleUnitActive,
  updateUnit,
} from "../controllers/unitController.js";
const router = express.Router();

router.get("/units/paginate", getUnits);
router.get("/units/:_id", getUnitById);
router.post("/units", createUnit);
router.delete("/unit/:_id", deleteUnit);
router.put("/units/:_id", updateUnit);
router.post("/units/active/:id", toggleUnitActive);

export default router;
