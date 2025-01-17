import Payment from "../models/PaymentModel.js";

export const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find({}).lean();

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

export const toggleActivePayment = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: 'Payment ID is required.',
      });
    }

    const payment = await Payment.findById(id);

    if (!payment) {
      return res.status(404).json({
        message: 'Payment not found.',
      });
    }

    payment.active = !payment.active;

    await payment.save();

    return res.status(200).json({
      message: 'Payment active status updated successfully.',
      data: {
        id: payment._id,
        active: payment.active,
      },
    });
  } catch (error) {
    console.error('Error toggling payment active status:', error);
    return res.status(500).json({
      message: 'Internal server error.',
      error: error.message,
    });
  }
}