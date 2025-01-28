import Units from "../models/Units.js";
import { HttpStatusCode } from "../utils/StatusCodes.js";

export const createUnit = async (req, res) => {
  try {
    const { title, position, active } = req.query;
    const unit = new Units({
      title: title,
      position: position,
      active: active,
    });
    await unit.save();
    res.status(HttpStatusCode.CREATED).json({
      data: unit
    });
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

export const getUnits = async (req, res) => {
  try {
    const { page = 1, perPage = 10 } = req.query; // Default page = 1 and perPage = 10

    // Convert query params to integers
    const pageNumber = parseInt(page);
    const pageSize = parseInt(perPage);

    // Fetch data with pagination
    const units = await Units.find()
      .skip((pageNumber - 1) * pageSize) // Skip documents for the previous pages
      .limit(pageSize); // Limit the number of documents per page

    // Get the total number of documents
    const totalUnits = await Units.countDocuments();

    res.status(HttpStatusCode.OK).json({
      message: "OK",
      data: units,
      meta: {
        currentPage: pageNumber,
        perPage: pageSize,
        totalItems: totalUnits,
        totalPages: Math.ceil(totalUnits / pageSize),
      },
    });
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

export const deleteUnit = async (req, res) => {
  const id = req.query.ids[0];
  try {
    const getUnit = await Units.findById(id);
    if (!getUnit) {
      res.status(HttpStatusCode.NOT_FOUND).json({
        message: "Unit details not found",
      });
    }
    await Units.findByIdAndDelete(id);
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
      data: getUnit,
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
      req.query,
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
    res.status(HttpStatusCode.OK).json({
      data: getUnitById,
      status: true
    });
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};


export const toggleUnitActive = async (req, res) => {
  try {
    const unit = await Units.findById(req.params.id);
    if (!unit) {
      return res.status(HttpStatusCode.NOT_FOUND).json({
        message: "Unit not found",
      });
    }
    unit.active = !unit.active;
    await unit.save();

    res.status(HttpStatusCode.OK).json({
      message: "Unit active status toggled successfully",
      data: unit,
    });
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};
