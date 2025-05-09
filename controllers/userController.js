import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { getDateRange } from "../utils/GetTimeFn.js";

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


export const getPaginateUsers = async (req, res) => {
  try {
    const { perPage = 20, page = 1, role } = req.query;

    const limit = parseInt(perPage, 10);
    const currentPage = parseInt(page, 10);
    const skip = (currentPage - 1) * limit;

    const users = await User.find({
      role: role || { $exists: true },
    })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await User.countDocuments();
    const lastPage = Math.ceil(total / limit);

    const basePath = `${req.protocol}://${req.get('host')}${req.originalUrl.split('?')[0]}`;
    const queryParams = new URLSearchParams(req.query);
    queryParams.set('page', currentPage - 1);
    const prevUrl = currentPage > 1 ? `${basePath}?${queryParams.toString()}` : null;
    queryParams.set('page', currentPage + 1);
    const nextUrl = currentPage < lastPage ? `${basePath}?${queryParams.toString()}` : null;

    const meta = {
      current_page: currentPage,
      from: skip + 1,
      last_page: lastPage,
      links: [
        {
          url: prevUrl,
          label: '&laquo; Previous',
          active: false,
        },
        ...Array.from({ length: lastPage }, (_, i) => ({
          url: `${basePath}?${new URLSearchParams({ ...req.query, page: i + 1 }).toString()}`,
          label: (i + 1).toString(),
          active: currentPage === i + 1,
        })),
        {
          url: nextUrl,
          label: 'Next &raquo;',
          active: false,
        },
      ],
      path: basePath,
      per_page: perPage.toString(),
      to: Math.min(skip + limit, total),
      total,
    };

    res.status(200).json({
      message: 'Users fetched successfully.',
      data: users,
      meta,
    });
  } catch (error) {
    console.error('Error fetching paginated users:', error);
    res.status(500).json({
      message: 'Internal server error.',
      error: error.message,
    });
  }
}



export const showProfile = async (req, res) => {
  try {
    const { userId } = jwt.verify(req.token, JWT_SECRET);

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User profile retrieved successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error retrieving user profile:", error);
    res.status(500).json({ message: "An error occurred while fetching user profile" });
  }
};


export const updateUserProfile = async (req, res) => {
  try {
    const { userId } = jwt.verify(req.token, JWT_SECRET);
    const updates = req.body;

    const updated = {
      ...updates,
      img: updates.images[0]
    }

    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updated, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json({
      message: "User profile updated successfully.",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
}


export const deleteUser = async (req, res) => {
  try {
    const { userId } = jwt.verify(req.token, JWT_SECRET);

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully", data: user });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Server error" });
  }
};


export const getUserStatistics = async (req, res) => {
  try {
    const { time, perPage, page } = req.query;
    const { startDate, endDate } = getDateRange(time);
    const limit = perPage ? parseInt(perPage) : 5;
    const skip = page ? (parseInt(page) - 1) * limit : 0;

    const totalCount = await User.countDocuments({
      createdAt: { $gte: startDate, $lte: endDate }
    });
    const users = await User.find({
      createdAt: { $gte: startDate, $lte: endDate }
    })
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });

    const totalPages = Math.ceil(totalCount / limit);
    const currentPage = parseInt(page) || 1;

    res.json({
      data: {
        current_page: currentPage,
        data: users.map(user => ({
          firstname: user.firstname,
          lastname: user.lastname,
          id: user._id,
          email: user.email,
          img: user.img,
          registeredAt: user.createdAt,
          count: 1,
          phone: user.phone,
          totalPrice: user?.totalPrice,
        })),
        first_page_url: `${req.protocol}://${req.get("host")}${req.originalUrl.split("?")[0]}?page=1`,
        from: skip + 1,
        next_page_url: currentPage < totalPages ? `${req.protocol}://${req.get("host")}${req.originalUrl.split("?")[0]}?page=${currentPage + 1}` : null,
        path: `${req.protocol}://${req.get("host")}${req.originalUrl.split("?")[0]}`,
        per_page: perPage,
        prev_page_url: currentPage > 1 ? `${req.protocol}://${req.get("host")}${req.originalUrl.split("?")[0]}?page=${currentPage - 1}` : null,
        to: skip + users.length
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }

}
