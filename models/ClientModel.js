import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  birthday: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  password_confirmation: {
    type: String,
  },
  images: {
    type: Array,
  },
});

const Client = mongoose.model("Client", clientSchema);
export default Client;