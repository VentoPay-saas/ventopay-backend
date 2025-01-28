import Order from "../models/OrderModel.js";
export const createOrder = async (req, res) => {
  try {
    const {
      user_id,
      currency_id,
      rate,
      shop_id,
      payment_type,
      products
    } = req.body;

    if (!user_id || !currency_id || !shop_id || !products || !Array.isArray(products)) {
      return res.status(400).json({
        message: "Missing required fields or invalid products array"
      });
    }

    const order = new Order({
      user_id,
      currency_id,
      rate,
      shop_id,
      payment_type,
      products,
      status: 'pending'
    });

    const savedOrder = await order.save();
    res.status(201).json({
      message: "Order created successfully",
      data: savedOrder
    });

  } catch (error) {
    console.error("Error in createOrder:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};
