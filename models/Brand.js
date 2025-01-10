import mongoose from "mongoose";
const BrandSchema = new mongoose.Schema({
  title: { type: String, required: true },
  active: { type: Boolean, default: true },
  images: [
    {
      uid: { type: String, required: true },
      name: { type: String, required: true },
      status: { type: String, required: true },
      url: { type: String, required: true },
      created: { type: Boolean, default: false },
    },
  ],
  status: {
    type: String,
    enum: ["published", "unpublished", "pending"],
    default: "published"
  }
});

const Brand = mongoose.model("Brand", BrandSchema);

export default Brand;
