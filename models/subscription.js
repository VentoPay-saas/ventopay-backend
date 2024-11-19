import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      lowerCase: true,
    },
    limit: {
      type: Number,
      required: true,
    },
    option_type: {
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  { timestamps: true }
);

export const Subscription = mongoose.model("Subscription", subscriptionSchema);
