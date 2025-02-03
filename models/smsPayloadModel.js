import mongoose from "mongoose";

const smsPayloadSchema = new mongoose.Schema({

  type: {
    type: String,
    required: true,
    enums: ["firebase", "twilio"],
  },
  payload: {
    type: Object,
    required: true,
  },

  default: {
    type: Boolean,
    default: false,
  },


}, { timestamps: true });

const SmsPayload = mongoose.model("SmsPayload", smsPayloadSchema);
export default SmsPayload;