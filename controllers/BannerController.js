import Banners from "../models/Banners.js";
import { HttpStatusCode } from "../utils/StatusCodes.js";

export const createBanner = async (req, res) => {
  try {
    const { shops, images, url, clickable, title, description, button_text } =
      req.body;
    const banner = new Banners({
      shops,
      images,
      url,
      clickable,
      title,
      description,
      button_text,
    });
    await banner.save();

    res.status(HttpStatusCode.CREATED).json({
      message: "Banner created successfully",
      data: banner,
    });
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

export const getPaginatedBanners = async (req, res) => {
  try {
    const { lang = "en", page = 1, perPage = 10, status } = req.query;

    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(perPage, 10);

    const query = {};

    if (status) {
      query.status = status;
    }

    const banners = await Banners.find(query)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);
    const totalBanners = await Banners.countDocuments(query);
    res.status(HttpStatusCode.OK).json({
      message: "Banners fetched successfully",
      data: banners,
      meta: {
        currentPage: pageNumber,
        perPage: pageSize,
        totalItems: totalBanners,
        totalPages: Math.ceil(totalBanners / pageSize),
      },
    });
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

export const toggleBannerActive = async (req, res) => {
  try {
    const bannerId = req.params.id;

    const banner = await Banners.findById(bannerId);

    if (!banner) {
      return res.status(HttpStatusCode.NOT_FOUND).json({
        message: "Banner not found",
      });
    }
    banner.active = !banner.active;
    await banner.save();
    res.status(HttpStatusCode.OK).json({
      message: "Banner active status updated successfully",
      data: banner,
    });
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

export const deleteBanner = async (req, res) => {
  try {
    const bannerId = req.query.ids[0];

    const banner = await Banners.findByIdAndDelete(bannerId);

    if (!banner) {
      return res.status(HttpStatusCode.NOT_FOUND).json({
        message: "Banner not found",
      });
    }
    res.status(HttpStatusCode.OK).json({
      message: "Banner deleted successfully",
      data: banner,
    });
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};


export const getBannerById = async (req, res) => {
  try {
    const bannerId = req.params.id;
    const banner = await Banners.findById(bannerId);
    if (!banner) {
      return res.status(HttpStatusCode.NOT_FOUND).json({
        message: "Banner not found",
      });
    }
    res.status(HttpStatusCode.OK).json({
      message: "Banner fetched successfully",
      data: banner,
    });
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};
