import mongoose from "mongoose";
import bcrypt from "bcrypt";
const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String
    },
    lastname: {
      type: String
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },
    active: {
      type: Boolean,
      default: true,
    },

    isWork: {
      type: Boolean,
      default: false,
    },
    registered_at: {
      type: Date,
      default: Date.now(),
    },
    empty_p: {
      type: Boolean,
      default: true,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      default: "user",
      enums: ["user", "waiter", "admin", "super-admin", "seller"],
    },
    img: {
      type: Object,
      default:
        "https://www.shutterstock.com/shutterstock/photos/2526512481/display_1500/stock-vector-avatar-gender-neutral-silhouette-vector-illustration-profile-picture-no-image-for-social-media-2526512481.jpg",
    },
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
    },
    invitations: [],
    birthday: {
      type: Date,
    },
    gender: {
      type: String
    },
    phone: {
      type: String
    },
    address: {
      type: String
    },


    // worker_shop: {
    //   type: [mongoose.Schema.Types.ObjectId],
    //   ref: "WorkerShop",
    // },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export const User = mongoose.model("User", userSchema);
