import { Router } from "express";
import {
  addProductStocks,
  calculateProducts,
  changeProductStatus,
  create_Product_addons,
  deleteProductById,
  getPaginatedProducts_addons,
  getProductsStatistics,
  getProductStockById,
  toggleProduct_StockActiveStatus,
} from "../controllers/ProductsController.js";
import { addExtras } from "../controllers/ProductsController.js";

const router = Router();

router.post("/products", create_Product_addons);
router.post("/products/:addonId/stocks", addProductStocks);
router.get("/products/paginate", getPaginatedProducts_addons);
router.get("/products/:addonId", getProductStockById);
router.delete("/products/delete", deleteProductById);
router.post("/products/:addonId/active", toggleProduct_StockActiveStatus);
router.post("/products/:addonId/status/change", changeProductStatus);
router.post("/products/:id/extras", addExtras);
router.get("/order/products/calculate", calculateProducts);
router.get("/statistics/products", getProductsStatistics);
export default router;
