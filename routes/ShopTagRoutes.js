import { Router } from "express";
import {
  constGetWithPaginate,
  createShopTag,
  deleteShopTag,
  getShopTagById,
  updateShopTag,
} from "../controllers/ShopTagController.js";

const router = Router();

router.post("/shop-tags", createShopTag);
router.get("/shop-tags", constGetWithPaginate);
router.delete("/shop-tags/delete", deleteShopTag);
router.get("/shop-tags/:id", getShopTagById);
router.put("/shop-tags/:id", updateShopTag);

export default router;
