import Units from "../models/Units.js";
import { HttpStatusCode } from "../utils/StatusCodes.js";

export const createUnit = async (req, res) => {
  try {
    const { title, position, active } = req.body;
    const unit = new Units({
      title: title,
      position: position,
      active: active,
    });
    await unit.save();
    res.status(HttpStatusCode.CREATED).json(unit);
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

export const getUnits = async (req, res) => {
  try {
    const getUnits = await Units.find();
    res.status(HttpStatusCode.OK).json({
      message: "OK",
      units: getUnits,
    });
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

export const deleteUnit = async (req, res) => {
  try {
    const getUnit = await Units.findById(req.params._id);
    if (!getUnit) {
      res.status(HttpStatusCode.NOT_FOUND).json({
        message: "Unit details not found",
      });
    }
    await Units.findByIdAndDelete(req.params._id);
    res
      .status(HttpStatusCode.OK)
      .json({ message: "Unit Deleted Successfully" });
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

export const getUnitById = async (req, res) => {
  try {
    const getUnit = await Units.findById(req.params._id);
    if (!getUnit) {
      res.status(HttpStatusCode.NOT_FOUND).json({
        message: "Unit not found",
      });
    }

    res.status(HttpStatusCode.OK).json({
      message: "Unit Get Successfully",
      unit: getUnit,
    });
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

export const updateUnit = async (req, res) => {
  try {
    const getUnitById = await Units.findByIdAndUpdate(
      req.params._id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!getUnitById) {
      return res
        .status(HttpStatusCode.NOT_FOUND)
        .json({ message: "Unit not found" });
    }
    res.status(HttpStatusCode.OK).json(getUnitById);
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};
