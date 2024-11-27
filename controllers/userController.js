import { User } from "../models/userModel.js";

const loginController = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = User.find(
    (user) => user.login === email && user.password === password
  );
  console.log(user);

  if (user) {
    return res
      .status(200)
      .json({ message: "Login successful", userId: user.id });
  } else {
    return res.status(400).json({ message: "Invalid email or password" });
  }
};

export default loginController;
