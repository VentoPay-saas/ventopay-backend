import express from "express";
import {
  createCurrencies,
  deleteCurrencies,
  getAllCurrencies,
  getCurrencyById,
  updateCurrencies,
} from "../controllers/CurrenciesController.js";

const router = express.Router();

router.post("/currencies", createCurrencies);
router.get("/currencies/", getAllCurrencies);
router.get("/currencies/:id", getCurrencyById);
router.delete("/currencies/:id", deleteCurrencies);
router.put("/currencies/:id", updateCurrencies);
export default router;
