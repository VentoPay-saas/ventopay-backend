import mongoose from "mongoose";

const currenciesSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  symbol: {
    type: String,
    required: true
  },
  rate: {
    type: Number
  },
  position: {
    type: String
  },
  active: {
    type: String
  }
}, {
  timestamps: true
})

const Currencies = mongoose.model('currencies', currenciesSchema);
export default Currencies;