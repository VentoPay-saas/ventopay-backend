import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    description: {
      type: String
    },
    title: {
      type: String
    },
    parent_id: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null },
    active: { type: Boolean, default: true },
    status: { type: String, enum: ["pending", "published", "unpublished"], default: "published" },
    shop_id: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", default: null },

    keywords: { type: String, required: true },
    images: [
      {
        uid: { type: String, required: true },
        name: { type: String, required: true },
        status: { type: String, required: true },
        url: { type: String, required: true },
        created: { type: Boolean, required: true },
      },
    ],
    active: { type: Boolean, default: true },
    type: { type: String, required: true },
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);

export default Category;
