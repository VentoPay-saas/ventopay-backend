import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
  firstname: { type: String, required: true, trim: true },
  lastname: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  phone: { type: String, required: true },
  birthday: { type: Date, required: true },
  gender: { type: String, required: true, enum: ["male", "female"] },
  password: { type: String, required: true, minlength: 6 },
  images: { type: [String], default: [] },
});

export default mongoose.model("Client", clientSchema);
