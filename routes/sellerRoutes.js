import express from "express";
import sellerLoginController from "../controllers/sellerController.js";

const sellerRouter = express.Router();

sellerRouter.post("/login", sellerLoginController);

export default sellerRouter;
