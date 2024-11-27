import express, { Router } from "express";
import {
  loginController,
  registerController,
} from "../controllers/userController.js";

const router = Router();

// router.route('/login').post(loginController);
// router.route('/register').post(loginController);

router.post("/login", loginController);
router.post("/register", registerController);

export default router;
