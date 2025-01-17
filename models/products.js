import mongoose, { mongo } from "mongoose";
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
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null
    },
    brand_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      default: null
    },
    kitchen: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Kitchen",
      default: null
    },
    reviews: [],
    slug: {
      type: String
    },
    sku: {
      type: String,
    },
    properties: [],
    kcal: {
      type: String,
    },
    protein: {
      type: String,
    },
    carbs: {
      type: String,
    },
    fats: {
      type: String,
    },

    addon: {
      type: Boolean,
      default: false,
    },
    stocks: {
      type: [StockSchema],
      default: [],
    },
    images: [],
    status: {
      type: String,
      enum: ["pending", "published", "unpublished"],
      default: "pending"
    },
    vegetarian: {
      type: Boolean,
      default: false
    },
    extras: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ExtraGroup',
        default: null
      }
    ]
  },

  {
    timestamps: true,
  },

);

const Addons = mongoose.model("addon", addonSchema);

export default Addons;
