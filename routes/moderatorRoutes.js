import express from "express";
import moderatorLoginController from "../controllers/moderatorController.js";

const moderatorRouter = express.Router();

moderatorRouter.post("/login", moderatorLoginController);

export default moderatorRouter;
