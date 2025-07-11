import express from "express";
import Candidate from "../models/Candidate.js";
import { sendRegistrationSuccess, sendGroupJoin } from "../services/gupshup.js";

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const c = await Candidate.create(req.body);
    await sendRegistrationSuccess(c);
    await sendGroupJoin(c);
    res.json({ message: "Registration successful! WhatsApp messages sent." });
  } catch (err) {
    res.status(500).json({ error: "Registration saved, but WhatsApp failed." });
  }
});

export default router;