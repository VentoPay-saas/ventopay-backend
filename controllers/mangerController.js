import managers from "../dummyData/Managers.js";

const managerLoginController = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const manager = managers.find(
    (manager) => manager.login === email && manager.password === password
  );
  console.log(manager);

  if (manager) {
    return res
      .status(200)
      .json({ message: "Manager login successful", managerId: manager.id });
  } else {
    return res.status(400).json({ message: "Invalid email or password" });
  }
};

export default managerLoginController;
