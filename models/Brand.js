import mongoose from "mongoose";

const Schema = mongoose.Schema;

const brandSchema = new Schema(
  {
    userId: {
      type: Schema.ObjectId,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("brand", brandSchema);
