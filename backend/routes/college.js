import express from "express";
import College from "../models/College.js";
const router = express.Router();

// List colleges (for suggestions, with optional query)
router.get("/", async (req, res) => {
  const { q } = req.query;
  let filter = {};
  if (q) filter.name = { $regex: q, $options: "i" };
  const colleges = await College.find(filter).sort({ name: 1 });
  res.json(colleges);
});

// Add a college
router.post("/", async (req, res) => {
  try {
    const c = await College.create({ name: req.body.name });
    res.json(c);
  } catch (err) {
    res.status(400).json({ error: "College already exists or is invalid" });
  }
});

// Delete a college
router.delete("/:id", async (req, res) => {
  await College.findByIdAndDelete(req.params.id);
  res.json({ message: "College deleted" });
});

export default router;