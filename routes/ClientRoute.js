import express from "express";
import { createClient } from "../controllers/ClientController.js";
import upload from "../middleware/UploadFile.js";

const clientRouter = express.Router();

clientRouter.post('/users', upload.single('images'), createClient)

export default clientRouter;