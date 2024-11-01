import express from "express";
import managerLoginController from "../controllers/managerController.js";

const managerRouter = express.Router();

managerRouter.post("/login", managerLoginController);

export default managerRouter;
