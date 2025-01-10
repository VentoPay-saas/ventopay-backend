import mongoose from "mongoose";
import StockSchema from "./ProductStock.js";

const addonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },

    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
    tax: {
      type: Number,
      default: 0,
      min: 0,
    },
    min_qty: {
      type: Number,
      default: 1,
      min: 0,
    },
    max_qty: {
      type: Number,
      default: 0,
      min: 0,
    },
    active: {
      type: Boolean,
      default: true,
    },
    interval: {
      type: Number,
      default: 0,
    },
    shop_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
    unit_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "unit",
      required: true,
    },
    addon: {
      type: Boolean,
      default: false,
    },
    stocks: {
      type: [StockSchema],
      default: [],
    },
    images: {
      type: [String],
    },
    status: {
      type: String,
      enum: ["pending", "published", "unpublished"],
      default: "pending"
    }
  },
  {
    timestamps: true,
  }
);

const Addons = mongoose.model("addon", addonSchema);

export default Addons;
