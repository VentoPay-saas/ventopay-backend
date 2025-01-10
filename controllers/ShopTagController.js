import express from "express";
import { ShopTag } from "../models/ShopTagModel.js";

const router = express.Router();

export const createShopTag = async (req, res) => {
  const { images, title, status } = req.body;
  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }
  try {
    const newShopTag = new ShopTag({
      images: images || [],
      title: title,
      status: status
    });
    await newShopTag.save();
    res.status(201).json({
      message: "Shop-tag created successfully",
      data: newShopTag,
    });
  } catch (error) {
    console.error("Error creating shop:", error);
    res.status(500).json({ message: "An internal server error occurred" });
  }
};

export const constGetWithPaginate = async (req, res) => {
  try {
    const { lang, status, page = 1, perPage = 10 } = req.query;
    const query = {};

    if (status) query.status = status;

    const skip = (page - 1) * perPage;
    const shopTags = await ShopTag.find(query).skip(skip).limit(Number(perPage));
    const total = await ShopTag.countDocuments(query);

    res.status(200).json({
      data: shopTags,
      meta: {
        total,
        current_page: Number(page),
        per_page: Number(perPage),
        total_pages: Math.ceil(total / perPage),
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


export const deleteShopTag = async (req, res) => {
  try {
    const { ids } = req.query;
    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({ message: 'Invalid or missing IDs' });
    }

    const result = await ShopTag.deleteMany({ _id: { $in: ids } });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'No shop tags found to delete' });
    }

    res.status(200).json({ message: 'Shop tags deleted successfully', deletedCount: result.deletedCount });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

export const getShopTagById = async (req, res) => {

  try {
    const { id } = req.params;
    const shopTag = await ShopTag.findById(id);

    if (!shopTag) {
      return res.status(404).json({ message: 'Shop tag not found' });
    }

    res.status(200).json({
      data: shopTag,
      status: true
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }

}

export const updateShopTag = async (req, res) => {
  try {
    const { id } = req.params;
    const { images, title, status, lang } = req.body;

    const updatedShopTag = await ShopTag.findByIdAndUpdate(
      id,
      { images, title, status, lang },
      { new: true, runValidators: true }
    );

    if (!updatedShopTag) {
      return res.status(404).json({ message: 'Shop tag not found' });
    }

    res.status(200).json({ message: 'Shop tag updated successfully', shopTag: updatedShopTag });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

export default router;
