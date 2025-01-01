import express from "express";
import { createClient } from "../controllers/ClientController.js";

const clientRouter = express.Router();

clientRouter.post('/api/v1/', createClient)

export default clientRouter;