import mongoose, { mongo } from "mongoose";
const Schema = mongoose.Schema;

const valueSchema = new Schema({
  addons: { type: String },
  sku: { type: String },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  tax: { type: Number, default: 0 },
  total_price: { type: Number }
});

const productSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  min_qty: { type: Number, required: true },
  max_qty: { type: Number, required: true },
  tax: { type: Number, required: true },
  interval_unit: { type: Number, required: true },
  active: { type: Boolean, default: true },
  vegetarian: { type: Boolean, default: false },
  nutrition_on: { type: Boolean, default: false },
  kcal: { type: Number },
  carbs: { type: Number },
  protein: { type: Number },
  fats: { type: Number },
  shop: { type: Schema.Types.ObjectId, ref: 'Shop', required: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  kitchen: { type: Schema.Types.ObjectId, ref: 'Kitchen' },
  brand: { type: Schema.Types.ObjectId, ref: 'Brand', required: true },
  unit: { type: String, required: true },
  sku: { type: String },
  price: { type: Number },
  quantity: { type: Number },
  addons: { type: String },
  values: [valueSchema],
  images: [{ type: String }]
});

const Product = mongoose.model('Product', productSchema);
export default Product;