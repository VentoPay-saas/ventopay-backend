import mongoose from "mongoose";
import Payment_payload from "./PaymentPayloadModel.js";
const StripeSchema = new mongoose.Schema({
  stripe_pk: {
    type: String,
    required: true,
  },
  stripe_sk: {
    type: String,
    required: true,
  },
});

const Stripe = Payment_payload.discriminator("Stripe", StripeSchema);
export default Stripe;
