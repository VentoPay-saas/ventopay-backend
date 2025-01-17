import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    active: {
      type: Boolean,
      default: true,
    },
    input: {
      type: Number,
    },
    tag: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
