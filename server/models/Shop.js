import mongoose from "mongoose";

const shopSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  shopName: {
    type: String,
    required: true
  },
  shopId: {
    type: String,
    required: true,
    unique: true
  },
  address: {
    line: { type: String },
    area: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String }
  },
  rating: {
    type: Number,
    default: 0
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  maxQueue: {
    type: Number,
    default: 20
  }
}, { timestamps: true });

export default mongoose.model("Shop", shopSchema);