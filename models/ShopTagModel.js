import mongoose from "mongoose";

const shopTagSchema = new mongoose.Schema({
  images: [String],
  title: {
    type: String,
    required: true
  },
  status: { type: String, default: 'draft' },
}, { timestamps: true });

export const ShopTag = mongoose.model("Shop-Tag", shopTagSchema);
