import mongoose from "mongoose";

const GallerySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Gallery", GallerySchema);
