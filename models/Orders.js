import mongoose from "mongoose";
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  userId: {
    type: Schema.ObjectId,
    required: true,
  },
  currency_id: {
    type: Number,
    required: true,
  },
  rate: {
    type: Number,
    required: true,
  },
  shop_id: {
    type: Number,
    required: true,
  },
  paymentType: {
    type: String,
    required: true,
  },
  products: {
    type: Array,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },

  status: {
    type: String,
    enum: [
      "new",
      "accepted",
      "cooking",
      "ready",
      "on_a_way",
      "delivered",
      "cancelled",
    ],
    default: "new",
  },
});
export default mongoose.model("Order", orderSchema);
