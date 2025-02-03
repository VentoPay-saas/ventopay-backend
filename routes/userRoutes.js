import express, { Router } from "express";
import {
  deleteUser,
  getPaginateUsers,
  getUserById,
  getUserStatistics,
  getUserWithQuery,
  loginController,
  registerController,
  updateUser,
} from "../controllers/userController.js";

const router = Router();

// router.route('/login').post(loginController);
// router.route('/register').post(loginController);
router.post("/auth/login", loginController);
router.post("/auth/register", registerController);
router.get("/users/paginate", getPaginateUsers);
router.get("/users/search", getUserWithQuery);
router.get("/users/:id", getUserById);
router.put("/users/:id", updateUser);
router.delete("/users/delete", deleteUser);
router.get("/statistics/users", getUserStatistics);

export default router;
