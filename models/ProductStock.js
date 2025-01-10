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
});

export default StockSchema;
