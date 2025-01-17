import mongoose from "mongoose";
const baseOptions = {
  discriminatorKey: 'paymentType',
  collection: 'Payment-payloads',
};

const BasePaymentSchema = new mongoose.Schema(
  {
    payment_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      required: true,
      unique: true,
    },
    logo: {
      type: String,
    },
    currency: {
      type: String,
    },
  },
  baseOptions
);

const Payment_payload = mongoose.model('Payment-payload', BasePaymentSchema);

export default Payment_payload