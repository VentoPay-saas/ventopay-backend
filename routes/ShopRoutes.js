import { Router } from "express";
import {
  createShop,
  getAllShops,
  getAllShopsSearch,
  getShopById,
  getShops,
  getShopWorkingDates,
  getTheShopClosedDates,
  shopCloseDateUpdate,
  shopWorkingDaysUpdate,
  updateShop,
  VerifyShop,
} from "../controllers/ShopController.js";

const router = Router();

router.post("/shops", createShop);
router.get("/shops", getAllShops);
router.get("/shops/search", getAllShopsSearch);
router.put("/shops/:shopId", updateShop);
router.put("/shop-closed-dates/:shopId", shopCloseDateUpdate);
router.put("/shop-working-days/:shopId", shopWorkingDaysUpdate);
router.get("/shop-closed-dates/:shopId", getTheShopClosedDates);
router.get("/shop-working-days/:shopId", getShopWorkingDates);
router.get("/shops/paginate", getShops);
router.post("/shops/:id/verify", VerifyShop);
router.get("/shops/:id", getShopById);

export default router;
