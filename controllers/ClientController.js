import cloudinary from "../config/Cloudinary.js";
import Client from "../models/ClientModel.js";
import { User } from "../models/userModel.js";
import { HttpStatusCode } from "../utils/StatusCodes.js";

export const createClient = async (req, res) => {
  const {
    firstname,
    lastname,
    email,
    phone,
    birthday,
    gender,
    password,
    passwordConfirm,
  } = req.body;

  try {
    const result = req.file
      ? await cloudinary.uploader.upload(req.file.path)
      : null;

    const newClient = new User({
      firstname,
      lastname,
      email,
      phone,
      birthday,
      gender,
      password,
    });

    await newClient.save();
    res.status(HttpStatusCode.CREATED).json(newClient);
  } catch (error) {
    console.error("Error creating client:", error);
    res
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .json({ message: "Error creating client", error: error.message });
  }
};
