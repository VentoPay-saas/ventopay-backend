import cloudinary from "../config/Cloudinary.js";
import bcrypt from "bcrypt";
import Client from "../models/ClientModel.js";
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
    password_confirmation,
  } = req.body;

  try {
    if (password !== password_confirmation) {
      return res
        .status(HttpStatusCode.BAD_REQUEST)
        .json({ message: "Passwords do not match" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const result = req.file
      ? await cloudinary.uploader.upload(req.file.path)
      : null;

    const newClient = new Client({
      firstname,
      lastname,
      email,
      phone,
      birthday,
      gender,
      password: hashedPassword,
      images: result ? [result.secure_url] : [],
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
