import { Router } from "express";
import {
  createBanner,
  deleteBanner,
  getBannerById,
  getPaginatedBanners,
  toggleBannerActive,
} from "../controllers/BannerController.js";

const router = Router();

router.post("/banners", createBanner);
router.get("/banners/paginate", getPaginatedBanners);
router.post("/banners/active/:id", toggleBannerActive);
router.delete("/banners/delete", deleteBanner);
router.get("/banners/:id", getBannerById);

export default router;
