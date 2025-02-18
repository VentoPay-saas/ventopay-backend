import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  payment_sys_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
  payment_trx_id: { type: String },
  note: { type: String },
  order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  status: { type: String, enum: ['paid', 'pending', 'failed'], default: 'pending' },
  perform_time: { type: Date, default: Date.now },
});

export default mongoose.model('Transaction', transactionSchema);
