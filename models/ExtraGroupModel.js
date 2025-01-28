import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
  },
  valid: {
    type: Boolean,
    default: true
  },

  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shops",
    default: null
  },
  active: {
    type: Boolean,
    default: true
  },
}, {
  timestamps: true
});

const ExtraGroup = mongoose.model('ExtraGroup', groupSchema);

export default ExtraGroup