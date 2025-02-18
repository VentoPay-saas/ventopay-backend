import mongoose from "mongoose";
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true

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
  delivery_type: {
    type: String,
    enum: ["dine_in", "pickup", "delivery"],
    default: "dine_in",
  }
});
const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

export default Order;