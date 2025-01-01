import cloudinary from "../config/Cloudinary.js";
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
    passwordConfirm,
  } = req.body;
  try {
    const result = await cloudinary.uploader.upload(req.file.path);

    const newClient = new Client({
      firstname,
      lastname,
      email,
      phone,
      birthday,
      gender,
      password,
      passwordConfirm,
      images: result.secure_url,
    });

    await newClient.save();
    res.status(HttpStatusCode.CREATED).json(newClient);
  } catch (error) {
    res
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};
