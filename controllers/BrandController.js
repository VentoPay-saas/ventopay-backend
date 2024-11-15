import cloudinary from "../config/Cloudinary.js";
import Brand from "../models/Brand.js";
import { HttpStatusCode } from "../utils/StatusCodes.js";

export const createBrand = async (req, res) => {
  console.log("req:", req.body)
  try {
    const { title, active } = req.body;
    const result = await cloudinary.uploader.upload(req.file.path);

    const newBrand = new Brand({
      title,
      image: result.secure_url,
      active: active || true,
    });
    await newBrand.save();
    res.status(HttpStatusCode.CREATED).json(newBrand);
  } catch (error) {
    res
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

export const getAllBrands = async (req, res) => {
  try {
    const getBrands = await Brand.find({});
    console.log(getBrands)
    res.status(HttpStatusCode.OK).json(getBrands);
  } catch (error) {
    res
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

export const getBrand = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params._id);
    if (!brand)
      return res
        .status(HttpStatusCode.NOT_FOUND)
        .json({ message: "Brand not found" });
    res.json(brand);
  } catch (error) {
    res
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

export const updateBrand = async (req, res) => {
  try {
    const { title, active } = req.body;
    const brand = await Brand.findById(req.params._id);
    if (!brand)
      return res
        .status(HttpStatusCode.NOT_FOUND)
        .json({ message: "Brand not found" });

    if (title) brand.title = title;
    if (typeof active !== "undefined") brand.active = active;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      brand.image = result.secure_url;
    }

    await brand.save();
    res.json(brand);
  } catch (error) {
    res
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

export const deleteBrand = async (req, res) => {
  try {
    const brand = await Brand.findByIdAndDelete(req.params._id);
    if (!brand)
      return res
        .status(HttpStatusCode.NOT_FOUND)
        .json({ message: "Brand not found" });
    res.json({ message: "Brand deleted successfully" });
  } catch (error) {
    res
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};
