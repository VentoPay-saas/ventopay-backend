import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ExtraGroupValueSchema = new Schema({
  extra_group_id: {
    type: Schema.Types.ObjectId,
    ref: "ExtraGroup",
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  group: { type: mongoose.Schema.Types.ObjectId, ref: "ExtraGroup" }
});

const ExtraGroupValue = mongoose.model("ExtraGroupValue", ExtraGroupValueSchema);
export default ExtraGroupValue;