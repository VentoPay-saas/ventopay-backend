import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    title: {
      type: Object,
      lowerCase: true,
    },
    limit: {
      type: Number,
      required: true,
    },
    option_type: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Subscription = mongoose.model("Subscription", subscriptionSchema);
