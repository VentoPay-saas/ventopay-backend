import Payment from "../models/PaymentModel.js";

export const restPaymentGet = async (req, res) => {
  try {
    const { perPage = 20, page = 1 } = req.query;
    const limit = parseInt(perPage);
    const skip = (parseInt(page) - 1) * limit;

    const payments = await Payment.find({})
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      message: 'Payments fetched successfully.',
      data: payments,
    });
  } catch (error) {
    console.error('Error fetching payments:', error);
    return res.status(500).json({
      message: 'Internal server error.',
      error: error.message,
    });
  }
}