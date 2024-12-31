import Currencies from "../models/CurrenciesModel.js";
import { HttpStatusCode } from "../utils/StatusCodes.js";

export const createCurrencies = async (req, res) => {
  const { title, active, position, symbol, rate } = req.body;
  try {
    const checkIfCurrencyExists = await Currencies.findOne({ title: title });

    if (checkIfCurrencyExists) {
      return res
        .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
        .json({ status: false, message: "Currency already exists" });
    } else {
      const createNew = await new Currencies({
        title: title,
        active: active,
        position: position,
        symbol: symbol,
        rate: rate,
      });
      const saveOrder = await createNew.save();
      res.status(HttpStatusCode.CREATED).json({
        message: "Currency Created successfully",
        status: true,
        Currencies: saveOrder,
      });
    }
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: error,
      status: false,
      error: error.message,
    });
  }
};

export const getAllCurrencies = async (req, res) => {
  try {
    const getCurrencies = await Currencies.find();
    res.status(HttpStatusCode.OK).json({
      message: "Data Retrieved successfully",
      status: true,
      data: getCurrencies,
    });
  } catch (error) {
    res
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .json({ message: error, status: false, error: error.message });
  }
};

export const getCurrencyById = async (req, res) => {
  try {
    const getById = await Currencies.findById(req.params.id);
    if (getById) {
      res.status(HttpStatusCode.OK).json({
        message: "Data retrieved successfully",
        status: true,
        data: getById,
      });
    } else {
      res.status(HttpStatusCode.NOT_FOUND).json({
        message: "Data Not Found",
        status: false,
      });
    }
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: error,
      status: false,
      error: error.message,
    });
  }
};

export const deleteCurrencies = async (req, res) => {
  try {
    const getItem = await Currencies.findById(req.params.id);
    console.log(getItem);

    if (getItem) {
      await Currencies.findByIdAndDelete(req.params.id);
      res.status(HttpStatusCode.OK).json({
        message: "Delete Success",
      });
    } else {
      res.status(HttpStatusCode.NOT_FOUND).json({
        message: "Data Not Found",
        status: false,
      });
    }
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: error,
      status: false,
      error: error.message,
    });
  }
};



export const updateCurrencies = async (req, res) => {
  try {
    const getCurrencies = await Currencies.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!getCurrencies) {
      return res.status(HttpStatusCode.NOT_FOUND).json({ message: "Currency not found" });
    }
    res.status(HttpStatusCode.OK).json(getCurrencies);

  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: error,
      status: false
    });

  }
}
