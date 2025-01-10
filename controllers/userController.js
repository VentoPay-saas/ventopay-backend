import { User } from "../models/userModel.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = "sdjhfksld340975394lkvkfo94";

export const loginController = async (req, res) => {
  const { email, password } = req.body;
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


export const getUserWithQuery = async (req, res) => {
  const { lang = "en", search = "", roles = "user", "empty-shop": emptyShop = "0" } = req.query;

  try {
    const query = {
      role: roles.toLowerCase(), // Match user roles
    };

    // if (search) {
    //   query.name = { $regex: search, $options: "i" }; // Case-insensitive search
    // }

    // if (emptyShop === "1") {
    //   query.shop = null; // Users with no shop
    // }

    console.log("query:", query);
    const users = await User.find(query);
    res.status(200).json({
      data: users,
      message: `${users.length} user(s) found`,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "An internal server error occurred" });
  }
}

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({
      message: 'User retrieved successfully',
      data: user,
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}


export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const updatedUser = await User.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      message: 'User updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}
