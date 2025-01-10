import mongoose from "mongoose";

const BannerSchema = new mongoose.Schema({
  shops: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shops",
      required: true,
    },
  ],
  images: [
    {
      type: String,
      required: true,
    },
  ],
  url: {
    type: String,
    required: true,
  },
  clickable: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  button_text: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "published",
    enum: ["published", "rejected", "new"],

  },
  active: {
    type: Boolean,
    default: true
  }
});

const Banners = mongoose.model("Banners", BannerSchema);

export default Banners;
