import express from "express";
import {
  createGallery,
  getAllGalleries,
  getGalleryById,
  updateGallery,
  deleteGallery,
  getGalleriesWithPagination,
} from "../controllers/GalleriesController.js";
import upload from "../middleware/UploadFile.js";

const router = express.Router();

// Create a new gallery entry
router.post("/galleries", upload.single("image"), createGallery);

// Get all gallery entries
router.get("/galleries", getAllGalleries);

// Get a specific gallery entry by ID
router.get("/galleries/:id", getGalleryById);

// Update a gallery entry
router.put("/galleries/:id", upload.single("image"), updateGallery);

// Delete a gallery entry
router.delete("/galleries/:id", deleteGallery);

router.get("/galleries/storage/files", getGalleriesWithPagination);


export default router;
