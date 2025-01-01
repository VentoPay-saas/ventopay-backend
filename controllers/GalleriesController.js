import cloudinary from "../config/Cloudinary.js";
import Galleries from "../models/Galleries.js";

// CREATE
export const createGallery = async (req, res) => {
  try {
    const { type } = req.body;

    if (!type) {
      return res.status(400).json({ error: "Type is required" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "File is required" });
    }

    const uploadedFile = req.file.path;

    // Save details to the database
    const gallery = await Galleries.create({
      type,
      image: uploadedFile,
    });

    res.status(201).json({
      message: "Gallery entry created successfully",
      gallery,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// READ ALL
export const getAllGalleries = async (req, res) => {
  try {
    const galleries = await Galleries.find();
    res.status(200).json(galleries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// READ BY ID
export const getGalleryById = async (req, res) => {
  try {
    const { id } = req.params;
    const gallery = await Galleries.findById(id);

    if (!gallery) {
      return res.status(404).json({ error: "Gallery not found" });
    }

    res.status(200).json(gallery);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE
export const updateGallery = async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.body;

    const gallery = await Galleries.findById(id);

    if (!gallery) {
      return res.status(404).json({ error: "Gallery not found" });
    }

    // Update image if a new file is provided
    if (req.file) {
      // Delete the old image from Cloudinary
      const publicId = gallery.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(publicId);

      // Update with the new image
      gallery.image = req.file.path;
    }

    if (type) {
      gallery.type = type;
    }

    await gallery.save();

    res.status(200).json({
      message: "Gallery entry updated successfully",
      gallery,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE
export const deleteGallery = async (req, res) => {
  try {
    const { id } = req.params;

    const gallery = await Galleries.findById(id);

    if (!gallery) {
      return res.status(404).json({ error: "Gallery not found" });
    }

    // Delete the image from Cloudinary
    const publicId = gallery.image.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(publicId);

    // Delete the gallery entry
    await gallery.remove();

    res.status(200).json({
      message: "Gallery entry deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




export const getGalleriesWithPagination = async (req, res) => {
  try {
    // Extract query parameters
    const { lang, type, perPage = 10, page = 1 } = req.query;

    // Parse `perPage` and `page` as numbers
    const limit = parseInt(perPage, 10) || 10;
    const skip = (parseInt(page, 10) - 1) * limit;

    // Build query based on `type` and other parameters
    const query = {};
    if (type) query.type = type; // Match the type (e.g., 'brands')

    // Fetch total count (for pagination metadata)
    const total = await Galleries.countDocuments(query);

    // Fetch data with pagination
    const galleries = await Galleries.find(query)
      .skip(skip)
      .limit(limit);

    // Response
    res.status(200).json({
      success: true,
      data: galleries,
      meta: {
        total, // Total number of items matching the query
        perPage: limit,
        currentPage: parseInt(page, 10),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
