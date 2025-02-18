import User from '../../models/userModel.js';
import Transaction from '../../models/TransactionModel.js';
import Payment from '../../models/PaymentModel.js';
import Order from '../../models/Orders.js';

class TransactionService {
  static async createOrderTransaction(orderId, paymentSysId) {
    console.log("🚀 ~ TransactionService ~ createOrderTransaction ~ paymentSysId:", paymentSysId);
    console.log("🚀 ~ TransactionService ~ createOrderTransaction ~ orderId:", orderId);

    // Find the order
    const order = await Order.findById(orderId);
    if (!order) throw new Error('Order not found');

    // Find the payment system
    const payment = await Payment.findById(paymentSysId);
    if (!payment) throw new Error('Payment system not found');

    // Find the user associated with the order
    const user = await User.findById(order.user_id);
    if (!user) throw new Error('User not found');

    const price = order.totalPrice; // Assuming your order has a total price field

    // Handle payment based on payment system type
    if (payment.tag === 'wallet') {
      // If payment is by wallet, check if the user has enough funds
      if (user.wallet.price < price) {
        throw new Error('Insufficient wallet funds');
      }

      // Deduct price from wallet
      user.wallet.price -= price;
      await user.save();
    } else if (payment.tag === 'cash') {
      // If payment is by cash, no wallet balance is required
      console.log('Processing cash payment for order', orderId);
    } else {
      throw new Error('Unsupported payment type');
    }

    // Create the transaction record
    const transaction = new Transaction({
      price,
      user_id: user._id,
      payment_sys_id: payment._id,
      order_id: order._id,
      status: 'accepted',  // You can adjust the status depending on your logic
      note: `Payment for order #${orderId}`,
      origin_price: order.originPrice, // Assuming the order contains an originPrice field
      seller_fee: order.totalPrice, // Assuming the seller fee is the same as the total price
      rate: 1, // Assuming this is a fixed value, or it can be dynamically set
      tax: order.tax, // Assuming tax is part of the order
      phone: user.phone,
      current: false, // Assuming you set it as `false` initially
      split: 1, // Assuming this is part of your payment logic
      paid_by_split: true, // Assuming this flag indicates payment split is enabled
    });

    await transaction.save();

    // Update the order status to 'paid'
    order.status = 'paid';
    await order.save();

    // Return the transaction in the specified format
    return {
      id: transaction._id,
      user_id: user._id,
      total_price: transaction.price,
      origin_price: transaction.origin_price,
      seller_fee: transaction.seller_fee,
      rate: transaction.rate,
      tax: transaction.tax,
      status: transaction.status,
      phone: transaction.phone,
      current: transaction.current,
      split: transaction.split,
      paid_by_split: transaction.paid_by_split,
      created_at: transaction.createdAt.toISOString(),
      updated_at: transaction.updatedAt.toISOString(),
      user: {
        id: user._id,
        uuid: user.uuid,
        firstname: user.firstname,
        lastname: user.lastname,
        empty_p: user.empty_p, // Assuming this is part of the user model
        email: user.email,
        isWork: user.isWork, // Assuming this is part of the user model
        phone: user.phone,
        gender: user.gender,
        active: user.active,
        my_referral: user.my_referral, // Assuming this is part of the user model
        role: user.role,
        email_verified_at: user.email_verified_at ? user.email_verified_at.toISOString() : null,
        phone_verified_at: user.phone_verified_at ? user.phone_verified_at.toISOString() : null,
        registered_at: user.registered_at ? user.registered_at.toISOString() : null,
        created_at: user.createdAt.toISOString(),
        updated_at: user.updatedAt.toISOString(),
      },
    };
  }
}


export default TransactionService;
