import mongoose from "mongoose";

const StockSchema = new mongoose.Schema({
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  sku: {
    type: String,
    required: true,
    trim: true,
  },
  addon: {
    type: Boolean,
    default: false
  },
  addons: [],
  countable_id: {
    type: Number
  },
  total_price: {
    type: Number
  },
  tax: {
    type: Number
  },
  bonus: {
    type: String,
    default: null
  },
  extras: [],



});

export default StockSchema;
