import Orders from "../models/Orders.js";
import { HttpStatusCode } from "../utils/StatusCodes.js";
export const createOrder = async (req, res) => {
  try {
    const order = await new Orders(req.body);
    const saveOrder = await order.save();
    res.status(HttpStatusCode.CREATED).json({
      message: "Order created successfully",
      order: saveOrder,
      status: false,
    });
  } catch (error) {
    res
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .json({ message: error.message, status: false });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const getOrders = await Orders.find();

    res.status(HttpStatusCode.OK).json({
      orders: getOrders,
      message: "Orders Get Successfully",
      status: true,
    });
  } catch (error) {
    res
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .json({ message: error, status: false });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const getOrder = await Orders.findById(req.params._id);
    res
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .json({
        message: "Order Get Successfully",
        order: getOrder,
        status: false,
      });
  } catch (error) {
    res.status(400).json({ message: error, status: false });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const getOrder = await Orders.findByIdAndDelete(req.params._id);

    if (!getOrder) {
      res.status(HttpStatusCode.NOT_FOUND).json({
        message: "Order Not Found",
        status: false,
      });
    }
    res.status(HttpStatusCode.OK).json({
      status: true,
      message: "Order Deleted Successfully",
    });
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: error,
      status: false,
    });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const getOrder = await Orders.findByIdAndUpdate(req.params._id, req.body, {
      new: true,
      runValidators: true
    });
    if (!getOrder) {
      return res.status(HttpStatusCode.NOT_FOUND).json({ message: "Order not found" });
    }
    res.status(HttpStatusCode.OK).json(getOrder);

  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: error,
      status: false
    });

  }
}
