import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createOrder = async (amount, receipt) => {
  return razorpay.orders.create({
    amount: amount * 100, // in paise
    currency: "INR",
    receipt,
    payment_capture: 1,
  });
};

export const verifyPayment = (order_id, payment_id, signature) => {
  const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
  hmac.update(order_id + "|" + payment_id);
  const digest = hmac.digest("hex");
  return digest === signature;
};