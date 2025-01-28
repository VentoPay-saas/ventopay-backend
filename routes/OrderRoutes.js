import express from "express";
import {
  createOrder,
  // deleteOrder,
  // getAllOrders,
  // getOrderById,
  // updateOrder,
} from "../controllers/OrderController.js";

const router = express.Router();

router.post("/orders", createOrder);
// router.get("/orders/:_id", getOrderById);
// router.delete("/orders/:_id", deleteOrder);
// router.put("/orders/:_id", updateOrder);

export default router;
