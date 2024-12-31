import { Subscription } from "../models/subscription.js";
import { HttpStatusCode } from "../utils/StatusCodes.js";

export const createSub = async (req, res) => {
  const { title, limit, option_type } = req.body;
  if (!title || !limit || !option_type) {
    return res.status(HttpStatusCode.BAD_REQUEST).json({
      message: "Missing required fields: title, limit, or option_type",
      status: false,
    });
  }

  try {
    const saveData = new Subscription({
      title,
      limit,
      option_type,
    });
    await saveData.save();

    res.status(HttpStatusCode.CREATED).json({
      message: "Created Successfully",
      status: true,
      data: saveData,
    });
  } catch (error) {
    console.error("Error creating subscription:", error);
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: "An error occurred while creating the subscription",
      status: false,
    });
  }
};

export const getSub = async (req, res) => {
  try {
    const getData = await Subscription.find();
    if (!getData) {
      res.status(HttpStatusCode.NOT_FOUND).json({
        message: "Subscription is not found",
        status: false,
      });
    }
    res.status(HttpStatusCode.OK).json({
      message: "Fetched Successfully",
      status: true,
      data: getData,
    });
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: error,
      status: false,
    });
  }
};

export const getSubById = async (req, res) => {
  try {
    const getData = await Subscription.find(req.params.id);
    if (!getData) {
      res.status(HttpStatusCode.NOT_FOUND).json({
        message: "Subscription is not found",
        status: false,
      });
    }
    res.status(HttpStatusCode.OK).json({
      message: "Fetched Successfully",
      status: true,
      data: getData,
    });
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: error,
      status: false,
    });
  }
};

export const deleteSub = async (req, res) => {
  try {
    const getData = await Subscription.findOneAndDelete(req.params.id);
    if (!getData) {
      res.status(HttpStatusCode.NOT_FOUND).json({
        message: "Subscription is not found",
        status: false,
      });
    }
    res.status(HttpStatusCode.OK).json({
      message: "Deleted Successfully",
      status: true,
    });
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: error,
      status: false,
    });
  }
};

export const updateSub = async (req, res) => {
  try {
    const getSubById = await Subscription.findByIdAndUpdate(
      req.params._id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!getSubById) {
      return res
        .status(HttpStatusCode.NOT_FOUND)
        .json({ message: "Sub not found" });
    }
    res.status(HttpStatusCode.OK).json(getSubById);
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};
