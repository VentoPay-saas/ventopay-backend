import mongoose from "mongoose";

const TranslationSchema = new mongoose.Schema({
  group: { type: String, required: true },
  key: { type: String, required: true },
  value: [
    {
      locale: { type: String, required: true },
      value: { type: String, required: true }
    }
  ], status: { type: Number, default: 1 }, // Assuming 1 = Active, 0 = Inactive
  deletedAt: { type: Date, default: null }, // Soft delete field
});



const Translation = mongoose.model("Translation", TranslationSchema);

export default Translation;