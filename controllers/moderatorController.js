import moderators from "../dummyData/Moderators.js";

const moderatorLoginController = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const moderator = moderators.find(
    (moderator) => moderator.login === email && moderator.password === password
  );
  console.log(moderator);

  if (moderator) {
    return res
      .status(200)
      .json({
        message: "Moderator login successful",
        moderatorId: moderator.id,
      });
  } else {
    return res.status(400).json({ message: "Invalid email or password" });
  }
};

export default moderatorLoginController;
