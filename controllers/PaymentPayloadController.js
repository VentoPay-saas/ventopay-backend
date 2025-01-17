import Payment_payload from "../models/PaymentPayloadModel.js";
import PayPal from "../models/PaypalModel.js";
import Stripe from "../models/StripeModel.js";
export const createPaymentPayload = async (req, res) => {
  try {
    const { payment_id, payload } = req.body;
    if (!payment_id || !payload) {
      return res.status(400).json({ message: 'Payment ID and payload are required.' });
    }

    let payment;
    switch (payload.type) {
      case 'Stripe':
        payment = new Stripe({
          payment_id: payment_id,
          stripe_pk: payload.stripe_pk,
          stripe_sk: payload.stripe_sk,
          currency: payload.currency,
        });
        break;

      case 'Paypal':
        payment = new PayPal({
          payment_id: payment_id,
          paypal_mode: payload.paypal_mode,
          paypal_sandbox_client_id: payload.paypal_sandbox_client_id,
          paypal_sandbox_client_secret: payload.paypal_sandbox_client_secret,
          paypal_sandbox_app_id: payload.paypal_sandbox_app_id,
          paypal_live_client_id: payload.paypal_live_client_id,
          paypal_live_client_secret: payload.paypal_live_client_secret,
          paypal_live_app_id: payload.paypal_live_app_id,
          paypal_payment_action: payload.paypal_payment_action,
          paypal_currency: payload.paypal_currency,
          paypal_locale: payload.paypal_locale,
          paypal_validate_ssl: payload.paypal_validate_ssl,
          currency: payload.currency
        });
        break;

      case 'other':
        payment = new Payment_payload({
          _id: payment_id,
          ...payload,
        });
        break;

      default:
        return res.status(400).json({ message: 'Invalid payment type.' });
    }

    await payment.save();

    res.status(201).json({
      message: 'Payment created successfully.',
      data: payment,
    });
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({
      message: 'Internal server error.',
      error: error.message,
    });
  }
}

export const getPaymentPayload = async (req, res) => {
  try {
    const paymentPayloads = await Payment_payload.find({}).populate("payment_id").lean();

    if (!paymentPayloads || paymentPayloads.length === 0) {
      return res.status(404).json({ message: 'No payment payloads found.' });
    }

    res.status(200).json({
      data: paymentPayloads,
    });
  } catch (error) {
    console.error('Error fetching payment payloads:', error);
    res.status(500).json({
      message: 'Internal server error.',
      error: error.message,
    });
  }
}

export const getPaymentPayloadById = async (req, res) => {
  try {
    const { payment_id } = req.params;

    const paymentPayload = await Payment_payload.findOne({ _id: payment_id });

    if (!paymentPayload) {
      return res.status(404).json({ message: 'Payment payload not found.' });
    }

    res.status(200).json({
      data: paymentPayload,
    });
  } catch (error) {
    console.error('Error fetching payment payload:', error);
    res.status(500).json({
      message: 'Internal server error.',
      error: error.message,
    });
  }
}

export const deletePayload = async (req, res) => {
  try {
    const payment_id = req.query.ids[0];
    console.log("🚀 ~ deletePayload ~ payment_id:", payment_id)

    const deletedPaymentPayload = await Payment_payload.findOneAndDelete({ _id: payment_id });

    if (!deletedPaymentPayload) {
      return res.status(404).json({ message: 'Payment payload not found.' });
    }

    res.status(200).json({
      message: `Payment payload with payment_id ${payment_id} deleted successfully.`,
      data: deletedPaymentPayload,
    });
  } catch (error) {
    console.error('Error deleting payment payload:', error);
    res.status(500).json({
      message: 'Internal server error.',
      error: error.message,
    });
  }
}