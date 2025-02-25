import mongoose from "mongoose";

export const cartScheam = new Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  quantity: Number,
});
