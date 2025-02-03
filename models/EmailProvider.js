import mongoose from "mongoose";

const emailProviderSchema = new mongoose.Schema({
  active: {
    type: Boolean,
    default: true
  },
  from_site: {
    type: String,
    default: "Ventopay.app"
  },
  from_to: {
    type: String,
    required: true
  },
  host: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  port: {
    type: Number,
    required: true
  },
  smtp_auth: {
    type: Boolean,
    default: true,
    required: true
  },
  smtp_debug: {
    type: Boolean,
    required: true,
    default: false
  },
  ssl: {
    ssl: {
      allow_self_signed: {
        type: Boolean,
        default: true
      },
      verify_peer: {
        type: Boolean,
        default: false
      },
      verify_peer_name: {
        type: Boolean,
        default: false
      }
    }
  }
}, {
  timestamps: true
});

const EmailProvider = mongoose.model("EmailProvider", emailProviderSchema);
export default EmailProvider;