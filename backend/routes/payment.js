import express from "express";
import { createOrder, verifyPayment } from "../services/razorpay.js";
import Candidate from "../models/Candidate.js";
import { sendRegistrationSuccess, sendGroupJoin } from "../services/gupshup.js";
const router = express.Router();

router.post("/order", async (req, res) => {
  try {
    const { name } = req.body;
    const order = await createOrder(49, "rcptid_" + name + "_" + Date.now());
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: "Failed to create Razorpay order" });
  }
});

router.post("/verify", async (req, res) => {
  const { payment, registration } = req.body;
  const isValid = verifyPayment(
    payment.razorpay_order_id,
    payment.razorpay_payment_id,
    payment.razorpay_signature
  );
  if (!isValid) return res.status(400).json({ error: "Invalid payment signature" });

  try {
    const c = await Candidate.create(registration);
    await sendRegistrationSuccess(c);
    await sendGroupJoin(c);
    res.json({ message: "Registration successful! WhatsApp messages sent." });
  } catch (err) {
    res.status(500).json({ error: "Registration saved, but WhatsApp failed." });
  }
});

export default router;