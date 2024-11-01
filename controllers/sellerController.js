import sellers from "../dummyData/Sellers.js";

const sellerLoginController = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const seller = sellers.find(
    (seller) => seller.login === email && seller.password === password
  );
  console.log(seller);

  if (seller) {
    return res
      .status(200)
      .json({ message: "Seller login successful", sellerId: seller.id });
  } else {
    return res.status(400).json({ message: "Invalid email or password" });
  }
};

export default sellerLoginController;
