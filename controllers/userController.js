import { User } from "../models/userModel.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = "sdjhfksld340975394lkvkfo94";

export const loginController = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password)
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (user && (await user.isPasswordCorrect(password))) {
      const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" });

      return res.status(200).json({
        message: "Login successful",
        token,
        userId: user._id,
        data: user
      });
    } else {
      return res.status(400).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred" });
  }
};

export const registerController = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const newUser = new User({ email, password });
    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: "1h" });

    return res.status(201).json({
      message: "User registered successfully",
      token,
      userId: newUser._id
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred" });
  }
};
