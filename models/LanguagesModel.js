import mongoose from "mongoose";

const languageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  locale: { type: String, required: true },
  images: { type: [String], default: [] },
  active: { type: Number, default: 0 },
  backward: { type: Boolean, default: false },
  default: { type: Boolean, default: false }
});

export const Language = mongoose.model('Language', languageSchema);
