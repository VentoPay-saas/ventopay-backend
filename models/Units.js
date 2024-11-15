import mongoose from "mongoose";
const Schema = mongoose.Schema;

const UnitSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("unit", UnitSchema);
