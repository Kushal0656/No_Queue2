import mongoose from 'mongoose';

const queueSchema = new mongoose.Schema({
  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tokenNumber: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['waiting', 'served', 'cancelled'],
    default: 'waiting'
  },
  estimatedWaitTime: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

export default mongoose.model('Queue', queueSchema);
