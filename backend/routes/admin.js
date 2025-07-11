import express from "express";
import Candidate from "../models/Candidate.js";

// Simple admin authentication
const requireAdmin = (req, res, next) => {
  const token = req.headers['x-admin-secret'];
  if (token !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
};

const router = express.Router();

// Registrations with filtering by college
router.get("/registrations", requireAdmin, async (req, res) => {
  const { college } = req.query;
  let filter = {};
  if (college) filter.college = college;
  const registrations = await Candidate.find(filter).sort({ registrationDate: -1 });
  res.json(registrations);
});

router.delete("/registrations/:id", requireAdmin, async (req, res) => {
  try {
    await Candidate.findByIdAndDelete(req.params.id);
    res.json({ message: "Registration deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete registration" });
  }
});

// CSV Export
router.get("/registrations/export/csv", requireAdmin, async (req, res) => {
  try {
    const registrations = await Candidate.find().sort({ registrationDate: -1 });
    const header = "name,gender,college,course,year,dob,registrationDate,whatsapp\n";
    const rows = registrations.map(r =>
      [r.name, r.gender, r.college, r.course, r.year, r.dob, r.registrationDate, r.whatsapp].map(f => `"${f}"`).join(",")
    );
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="registrations.csv"');
    res.send(header + rows.join("\n"));
  } catch (err) {
    res.status(500).json({ error: "Failed to export CSV" });
  }
});

// Stats endpoint
router.get("/stats", requireAdmin, async (req, res) => {
  const total = await Candidate.countDocuments();
  const perCollege = await Candidate.aggregate([
    { $group: { _id: "$college", count: { $sum: 1 } } }
  ]);
  res.json({ total, perCollege });
});

export default router;