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


export const getOrder = async (req, res) => {
  try {
    const { page = 1, perPage = 5, status } = req.query;
    const limit = parseInt(perPage);
    const skip = (parseInt(page) - 1) * limit;

    const query = status ? { status } : {};

    const orders = await Order.find(query)
      .populate("Shop")
      .populate("Currency")
      .populate("User")
      .populate("details")
      .populate("transaction")
      .limit(limit)
      .skip(skip)
      .sort({ created_at: -1 });

    const totalOrders = await Order.countDocuments(query);

    const statistics = {
      progress_orders_count: await Order.countDocuments({ status: "progress" }),
      cancel_orders_count: await Order.countDocuments({ status: "cancelled" }),
      new_orders_count: await Order.countDocuments({ status: "new" }),
      accepted_orders_count: await Order.countDocuments({ status: "accepted" }),
      cooking_orders_count: await Order.countDocuments({ status: "cooking" }),
      ready_orders_count: await Order.countDocuments({ status: "ready" }),
      on_a_way_orders_count: await Order.countDocuments({ status: "on_a_way" }),
      orders_count: totalOrders,
      total_price: orders.reduce((sum, order) => sum + order.total_price, 0),
      today_count: await Order.countDocuments({
        created_at: { $gte: new Date().setHours(0, 0, 0, 0) }
      }),
      total: orders.length
    };

    res.json({
      statistic: statistics,
      orders,
      meta: {
        current_page: parseInt(page),
        per_page: limit,
        last_page: Math.ceil(totalOrders / limit),
        total: totalOrders
      }
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}
