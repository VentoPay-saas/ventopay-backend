import mongoose from "mongoose";
import Payment_payload from "./PaymentPayloadModel.js"; // Base model for payment

const PayPalSchema = new mongoose.Schema({
  paypal_mode: {
    type: String,
    required: true,
    enum: ['sandbox', 'live'],
  },
  paypal_sandbox_client_id: {
    type: String,
    required: function () { return this.paypal_mode === 'sandbox'; },
  },
  paypal_sandbox_client_secret: {
    type: String,
    required: function () { return this.paypal_mode === 'sandbox'; },
  },
  paypal_sandbox_app_id: {
    type: String,
    required: function () { return this.paypal_mode === 'sandbox'; },
  },
  paypal_live_client_id: {
    type: String,
    required: function () { return this.paypal_mode === 'live'; },
  },
  paypal_live_client_secret: {
    type: String,
    required: function () { return this.paypal_mode === 'live'; },
  },
  paypal_live_app_id: {
    type: String,
    required: function () { return this.paypal_mode === 'live'; },
  },
  paypal_payment_action: {
    type: String,
    required: true,
  },
  paypal_currency: {
    type: String,
    required: true,
  },
  paypal_locale: {
    type: String,
    required: true,
  },
  paypal_validate_ssl: {
    type: Number,
    required: true,
  },
});

const PayPal = Payment_payload.discriminator("PayPal", PayPalSchema);

export default PayPal;
