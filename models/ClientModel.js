import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
  firstname: { type: String, required: true, trim: true },
  lastname: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  phone: { type: String },
  birthday: { type: Date },
  gender: { type: String, enum: ["male", "female"] },
  password: { type: String, minlength: 6 },
  images: { type: [String], default: [] },
});

export default mongoose.model("Client", clientSchema);
