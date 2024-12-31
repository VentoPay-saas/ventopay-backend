import mongoose from "mongoose";

const LanguagesSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

})