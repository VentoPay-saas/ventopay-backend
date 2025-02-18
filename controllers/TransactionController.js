import TransactionService from "./service/TransactionService.js";

class TransactionController {
  static async createOrderTransaction(req, res) {
    try {
      const { orderId } = req.params;
      const { payment_sys_id } = req.body;

      if (!payment_sys_id) {
        return res.status(400).json({ message: 'Payment system ID is required' });
      }

      const transaction = await TransactionService.createOrderTransaction(orderId, payment_sys_id);

      res.status(201).json({
        message: 'Transaction created successfully',
        transaction,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

export default TransactionController;
