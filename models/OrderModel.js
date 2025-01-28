import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  currency_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Currency',
    required: true
  },
  rate: {
    type: Number,
    required: true,
    default: 1
  },
  shop_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    required: true
  },
  payment_type: {
    type: String,
    required: true,
    enum: ['cash', 'card', 'online']
  },
  products: [{
    stock_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Stock',
      required: true
    }
  }],
  total_price: {
    type: Number,
    default: 0
  },
  origin_price: {
    type: Number,
    default: 0
  },
  seller_fee: {
    type: Number,
    default: 0
  },
  service_fee: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'ready', 'on_a_way', 'delivered', 'canceled'],
    default: 'pending'
  },
  delivery_type: {
    type: String,
    default: 'dine_in'
  },
  phone: String,
  current: {
    type: Boolean,
    default: false
  },
  split: {
    type: Number,
    default: 1
  },
  paid_by_split: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Order = mongoose.model('Order', orderSchema);
export default Order;