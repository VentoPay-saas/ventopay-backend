import mongoose from "mongoose";

const rolesSchema = new mongoose.Schema({
  guard_name: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },

  deleted_at: {
    type: Date,
    default: null,
  },


}, { timestamps: true });

const Roles = mongoose.model("Role", rolesSchema);
export default Roles;