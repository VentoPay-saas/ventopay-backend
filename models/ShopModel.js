import mongoose from "mongoose";

const shopSchema = new mongoose.Schema({
  logo_img: {
    uid: String,
    name: String,
    status: String,
    url: String,
    created: Boolean,
  },
  background_img: {
    uid: String,
    name: String,
    status: String,
    url: String,
    created: Boolean,
  },
  status_note: String,
  status: {
    type: String,
    enum: ["approved", "rejected", "new"],
    default: "new",
  },
  open: Boolean,
  phone: String,
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Shop-Tag' }],
  order_payment: String,
  min_amount: Number,
  tax: Number,
  percentage: Number,
  wifi_name: String,
  wifi_password: String,
  title: { type: String, required: true },
  description: String,
  images: [String],
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  location: {
    latitude: Number,
    longitude: Number,
  },
  closed_dates: [{ type: String }],
  // working_days: [{ type: String }]
  working_days: [
    {
      day: { type: String, required: true },
      from: { type: String, required: true },
      to: { type: String, required: true },
      disabled: { type: Boolean, required: true }
    }
  ],
  verify: {
    type: Boolean,
    default: false
  }


});

const Shop = mongoose.model('Shop', shopSchema);
export default Shop